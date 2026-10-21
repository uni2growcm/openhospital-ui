/// <reference types="cypress" />

import { permissionList } from '../../src/mocks/fixtures/permissionList';
import { formatAmount } from '../../src/components/accessories/accounting/payments/formatAmount';

/**
 * E2E coverage for the "Bill payment" feature (Comptabilité / Accounting > Payments tab).
 *
 * Relies on the Polly mock backend that already serves the app during `npm run cy:open` /
 * `cy:run` (see src/mocks/routes/bill.ts) — same convention as search_patient_activity.cy.ts
 * and manage_bills_activity.cy.ts: no cy.intercept/setupInterceptors needed.
 *
 * The mocked payments (src/mocks/fixtures/billPaymentsDTO.ts) are, relative to "now":
 *   - id 10, 4, 23 -> today      (user "admin",    amounts 50, 100, 850)
 *   - id 20        -> yesterday  (user "cashier2", amount 300)
 *   - id 21        -> 2 days ago (user "admin",    amount 5000)
 *   - id 22        -> 6 days ago (user "cashier2", amount 1500)
 *
 * The default filter range is "today - 6 days" -> "today", computed when the component
 * mounts. Since the fixture's "6 days ago" timestamp is computed slightly *before* the
 * component mounts (module load happens before React renders), it always falls a few
 * milliseconds short of the "fromDate" boundary and is excluded by the mock's
 * `paymentDate >= dateFrom` check. So the default view deterministically shows 5 payments
 * (every one above except id 22), not 6 — this is relied on below rather than special-cased.
 */

const PAYMENTS_SPEC_BILLS_PATH = '/accounting/bills';

const stripSpaces = (text: string) => text.replace(/[\s \xa0​]/g, '');

// SelectField.tsx gives BOTH the <InputLabel> and the <Select> the same
// `id={fieldName}` ("user" here), which is invalid HTML and makes `cy.byId('user')`
// (-> `[id=user]`) match 2 elements — the label ("Received by") and the actual select.
// Scope explicitly to the select itself to avoid ambiguous multi-element subjects.
const userSelect = () => cy.dataCy('payments-filter-bar').find('.MuiSelect-select');

const visitPaymentsTab = () => {
	// Same as cy.authenticate(), plus forcing the i18next-browser-languagedetector
	// localStorage key to English (the convention the rest of this project's specs
	// assume) in the SAME onBeforeLoad — setting it via a separate cy.reload() after
	// cy.authenticate() raced with the detector reading it on the first paint.
	cy.visit(PAYMENTS_SPEC_BILLS_PATH, {
		onBeforeLoad(w) {
			w.sessionStorage.setItem(
				'auth',
				`{"username":"John Doe","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJhZG1pbiIsImV4cCI6MTczOTE5MzU1MTAwMH0.D50o5x2gcVcASSwl7EOqmRUDGqIGfhisbXlkujQolrY"}`,
			);
			w.sessionStorage.setItem(
				'permission',
				JSON.stringify({ permission: permissionList, userName: 'admin' }),
			);
			w.localStorage.setItem('i18nextLng', 'en');
		},
	});
	cy.dataCy('accounting-tab-payments').click();
	cy.dataCy('payments-listing').should('be.visible');
};

describe('Accounting Payments spec', () => {
	beforeEach(() => {
		visitPaymentsTab();
	});

	it('should navigate to the Payments tab and render the filter bar, summary cards and table', () => {
		cy.dataCy('payments-filter-bar').should('be.visible');
		cy.dataCy('payments-summary-cards').should('be.visible');
		cy.dataCy('payments-listing-table').should('be.visible');

		// SelectField now receives `displayEmpty` for this field, so the value=""
		// ("All users") option correctly renders its label in the closed select.
		userSelect()
			.invoke('text')
			.then((text) => expect(stripSpaces(text)).to.equal(stripSpaces('All users')));
	});

	it('should show the aggregated totals for the default date range in the summary cards', () => {
		cy.dataCy('payments-summary-cards')
			.children()
			.eq(0)
			.should('contain.text', formatAmount(6300)); // total received across the 5 in-range payments

		cy.dataCy('payments-summary-cards')
			.children()
			.eq(1)
			.should('contain.text', '5') // payments count
			.and('contain.text', 'on 4 bills'); // distinct bills: #10, #3, #36, #14

		cy.dataCy('payments-summary-card-admin')
			.should('be.visible')
			.and('contain.text', formatAmount(6000));
		cy.dataCy('payments-summary-card-cashier2')
			.should('be.visible')
			.and('contain.text', formatAmount(300));
	});

	it('should list every in-range payment row with the correct grand total in "List" view', () => {
		cy.dataCy('payments-view-list').should('have.attr', 'aria-selected', 'true');

		cy.dataCy('payments-listing-table')
			.find('[data-cy=payments-table-row]')
			.should('have.length', 5);

		cy.dataCy('payments-listing-table').within(() => {
			cy.contains('td', '#10');
			cy.contains('td', '#3');
			cy.contains('td', '#36');
			cy.contains('td', '#14');
		});
		// formatAmount() (fr-FR) separates thousands with a narrow no-break space (U+202F).
		// cy.contains() normalises whitespace via innerText before matching, which collapses
		// that character and breaks the comparison — `contain.text` reads raw textContent
		// instead, so it's used for every amount assertion below.
		cy.dataCy('payments-listing-table')
			.find('tfoot [class*=amountCell]')
			.should('contain.text', formatAmount(6300)); // footer "Total" row

		// Pagination is shown in "List" view, even with a single page of results.
		cy.dataCy('payments-listing-table').find('.pagination').should('be.visible');
	});

	it('should switch to "By day" view and group payments with per-day subtotals', () => {
		cy.dataCy('payments-view-by-day').click();
		cy.dataCy('payments-view-by-day').should('have.attr', 'aria-selected', 'true');
		cy.dataCy('payments-view-list').should('have.attr', 'aria-selected', 'false');

		cy.dataCy('payments-listing-table')
			.find('tbody')
			.should('have.length', 3); // today, yesterday, 2-days-ago groups

		cy.dataCy('payments-listing-table')
			.find('tbody')
			.eq(0)
			.should('contain.text', formatAmount(1000)) // day subtotal: 50 + 100 + 850
			.find('[data-cy=payments-table-row]')
			.should('have.length', 3); // id 10, 4, 23

		cy.dataCy('payments-listing-table')
			.find('tbody')
			.eq(1)
			.should('contain.text', formatAmount(300))
			.find('[data-cy=payments-table-row]')
			.should('have.length', 1); // id 20

		cy.dataCy('payments-listing-table')
			.find('tbody')
			.eq(2)
			.should('contain.text', formatAmount(5000))
			.find('[data-cy=payments-table-row]')
			.should('have.length', 1); // id 21

		// footer "Total" row, same grand total as List view
		cy.dataCy('payments-listing-table')
			.find('tfoot [class*=amountCell]')
			.should('contain.text', formatAmount(6300));

		// "By day" has no pagination — it's not paginated server-side.
		cy.dataCy('payments-listing-table').find('.pagination').should('not.exist');
	});

	it('should filter the "List" rows by user while leaving the summary cards unaffected', () => {
		userSelect().click();
		cy.dataValue('admin').click();
		cy.dataCy('payments-search-button').click();

		cy.dataCy('payments-listing-table')
			.find('[data-cy=payments-table-row]')
			.should('have.length', 4); // id 10, 4, 21, 23 — every "admin" payment in range

		cy.dataCy('payments-listing-table')
			.find('[data-cy=payments-table-row]')
			.each(($row) => {
				cy.wrap($row).should('contain.text', 'admin');
			});

		// The summary cards (and the footer grand total) are driven by the unfiltered,
		// full date-range search, not the user-filtered pageable one — so they stay as-is.
		cy.dataCy('payments-summary-cards')
			.children()
			.eq(0)
			.should('contain.text', formatAmount(6300));
		cy.dataCy('payments-listing-table')
			.find('tfoot [class*=amountCell]')
			.should('contain.text', formatAmount(6300));
	});

	it('should reset the filters back to their defaults', () => {
		userSelect().click();
		cy.dataValue('cashier2').click();
		cy.dataCy('payments-search-button').click();

		cy.dataCy('payments-listing-table')
			.find('[data-cy=payments-table-row]')
			.should('have.length', 1); // only the "cashier2" payment (id 20)

		cy.dataCy('payments-reset-button').click();

		userSelect()
			.invoke('text')
			.then((text) => expect(stripSpaces(text)).to.equal(stripSpaces('All users')));
		cy.dataCy('payments-listing-table')
			.find('[data-cy=payments-table-row]')
			.should('have.length', 5);
	});
});
