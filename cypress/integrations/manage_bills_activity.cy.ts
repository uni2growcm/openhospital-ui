/// <reference types="cypress" />

const ACCOUNTING_BILLS_PATH = '/accounting/bills';
const ACCOUNTING_PATH = '/accounting';

describe('ManageBillsActivity spec', () => {
	it('should render the ui and default to overview tab', () => {
		cy.authenticate(ACCOUNTING_BILLS_PATH);
		cy.dataCy('manage-bills-activity').should('be.visible');
		cy.dataCy('app-header').should('be.visible');
		cy.dataCy('activity-title').contains('Accounting');
		cy.dataCy('activity-subtitle').should(
			'contain',
			new Date().getFullYear().toString(),
		);
	});

	it('should display the three navigation tabs with Overview active by default', () => {
		cy.dataCy('accounting-tabs').should('be.visible');
		cy.dataCy('accounting-tab-overview')
			.should('be.visible')
			.and('have.attr', 'aria-selected', 'true')
			.contains('Overview');
		cy.dataCy('accounting-tab-bills')
			.should('be.visible')
			.and('have.attr', 'aria-selected', 'false')
			.contains('Bills');
		cy.dataCy('accounting-tab-payments')
			.should('be.visible')
			.and('have.attr', 'aria-selected', 'false')
			.contains('Payments');
	});

	it('should display overview header actions and placeholder content', () => {
		cy.dataCy('accounting-header-actions').should('be.visible');
		cy.dataCy('accounting-year-field').should('be.visible');
		cy.dataCy('accounting-new-bill-button')
			.should('be.visible')
			.contains('New bill');
		cy.dataCy('accounting-tab-placeholder').should('be.visible');
		cy.dataCy('placeholder-title').contains('Overview');
		cy.dataCy('placeholder-description').should('contain', 'under development');
	});

	it('should switch to Bills tab and display its actions, subtitle, and placeholder', () => {
		cy.dataCy('accounting-tab-bills').click();
		cy.dataCy('accounting-tab-bills').should(
			'have.attr',
			'aria-selected',
			'true',
		);
		cy.dataCy('accounting-tab-overview').should(
			'have.attr',
			'aria-selected',
			'false',
		);
		cy.dataCy('accounting-tab-payments').should(
			'have.attr',
			'aria-selected',
			'false',
		);

		cy.dataCy('activity-subtitle').contains(
			'Patient bills, payments and refunds',
		);

		cy.dataCy('accounting-year-field').should('not.exist');
		cy.dataCy('accounting-reports-button')
			.should('be.visible')
			.contains('Reports');
		cy.dataCy('accounting-archive-closed-button')
			.should('be.visible')
			.contains('Archive closed');
		cy.dataCy('accounting-export-sage-button')
			.should('be.visible')
			.contains('Export Sage');
		cy.dataCy('accounting-export-pdf-button')
			.should('be.visible')
			.contains('Export PDF');
		cy.dataCy('accounting-new-bill-button')
			.should('be.visible')
			.contains('New bill');

		cy.dataCy('bills-listing').should('be.visible');
	});

	it('should display the bills listing filters, status tabs and table', () => {
		cy.dataCy('accounting-tab-bills').click();

		cy.dataCy('bills-listing').should('be.visible');
		cy.dataCy('bills-filter-form').should('be.visible');
		cy.dataCy('bills-search-button').should('be.visible').contains('Search');

		cy.dataCy('bills-status-tab-ALL').should('be.visible').and('contain', '5');
		cy.dataCy('bills-status-tab-O').should('be.visible').and('contain', '4');
		cy.dataCy('bills-status-tab-C').should('be.visible').and('contain', '1');

		cy.contains('Antonio Carlos').should('be.visible');
		cy.contains('Cedimo Andrea').should('be.visible');
	});

	it('should filter the table rows when a status tab is clicked', () => {
		cy.dataCy('accounting-tab-bills').click();

		// Wait for the initial load to settle before interacting — the table ignores
		// status-tab/page clicks while a fetch is already in flight.
		cy.dataCy('bills-status-tab-ALL').should('contain', '5');

		cy.dataCy('bills-status-tab-C').click();
		cy.dataCy('bills-status-tab-C').should(
			'have.attr',
			'aria-selected',
			'true',
		);
		cy.get('tbody tr').should('have.length', 1);

		// Wait for that fetch to settle too before switching back.
		cy.dataCy('bills-status-tab-C').should('contain', '1');
		cy.dataCy('bills-status-tab-ALL').click();
		cy.get('tbody tr').should('have.length', 5);
	});

	it('should display row action buttons that do not navigate or trigger a request', () => {
		cy.dataCy('accounting-tab-bills').click();

		cy.dataCy('table-view-action').should('have.length.greaterThan', 0);
		cy.dataCy('table-edit-action').should('have.length.greaterThan', 0);
		cy.dataCy('table-print-action').should('have.length.greaterThan', 0);

		cy.dataCy('table-view-action').first().click();
		cy.url().should('include', ACCOUNTING_BILLS_PATH);
		cy.dataCy('bills-listing').should('be.visible');
	});

	it('should switch to Payments tab and display its actions, subtitle, and placeholder', () => {
		cy.dataCy('accounting-tab-payments').click();
		cy.dataCy('accounting-tab-payments').should(
			'have.attr',
			'aria-selected',
			'true',
		);
		cy.dataCy('accounting-tab-overview').should(
			'have.attr',
			'aria-selected',
			'false',
		);
		cy.dataCy('accounting-tab-bills').should(
			'have.attr',
			'aria-selected',
			'false',
		);

		cy.dataCy('activity-subtitle').contains('Every payment received');

		cy.dataCy('accounting-year-field').should('not.exist');
		cy.dataCy('accounting-reports-button').should('not.exist');
		cy.dataCy('accounting-new-bill-button').should('not.exist');
		cy.dataCy('accounting-export-csv-button')
			.should('be.visible')
			.contains('Export CSV');
		cy.dataCy('accounting-payments-by-user-button')
			.should('be.visible')
			.contains('Payments by user report');

		cy.dataCy('placeholder-title').contains('Payments');
	});

	it('should switch back to Overview tab when clicked', () => {
		cy.dataCy('accounting-tab-overview').click();
		cy.dataCy('accounting-tab-overview').should(
			'have.attr',
			'aria-selected',
			'true',
		);
		cy.dataCy('accounting-year-field').should('be.visible');
		cy.dataCy('accounting-new-bill-button').should('be.visible');
		cy.dataCy('placeholder-title').contains('Overview');
	});

	it('should navigate from accounting home to bills management via Manage Bills action', () => {
		cy.visit(ACCOUNTING_PATH);
		cy.dataCy('accounting-activity').should('be.visible');
		cy.dataCy('manageBills').click();
		cy.url().should('include', ACCOUNTING_BILLS_PATH);
		cy.dataCy('manage-bills-activity').should('be.visible');
	});
});
