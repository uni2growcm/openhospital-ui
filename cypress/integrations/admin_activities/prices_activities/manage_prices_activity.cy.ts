/// <reference types="cypress" />

import { permissionList } from '../../../../src/mocks/fixtures/permissionList';

const PRICE_BROWSER_PATH = '/admin/prices';

// Same as cy.authenticate(), plus forcing the i18next-browser-languagedetector
// localStorage key to English in the SAME onBeforeLoad (see accounting_payments_activity.cy.ts
// for why a separate cy.reload() after cy.authenticate() doesn't work reliably).
const visitEn = (path: string) => {
	cy.visit(path, {
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
};

describe('Price Browser Activity specs', () => {
	it('should render the ui', () => {
		visitEn(PRICE_BROWSER_PATH);
		cy.dataCy('activity-title').contains('Price Browser');
		cy.dataCy('price-browser').should('be.visible');
	});

	it('should display the category tabs for the default price list', () => {
		cy.contains('[role="tab"]', 'All').should(
			'have.attr',
			'aria-selected',
			'true',
		);
		cy.contains('[role="tab"]', 'Exams').should('be.visible');
		cy.contains('[role="tab"]', 'Operations').should('be.visible');
		cy.contains('[role="tab"]', 'Medicals').should('be.visible');
		cy.contains('[role="tab"]', 'Others').should('be.visible');
	});

	it('should save price changes for the selected list', () => {
		cy.get('.priceBrowser__priceInput').first().clear().type('42');
		cy.dataCy('save-prices').click();
		cy.dataCy('dialog-info').contains('Prices have been saved successfully!');
		cy.dataCy('approve-dialog').click();
		// Wait for the dialog's close animation to finish so it can't cover the
		// next test's first click (MUI Dialog fades out over ~225ms).
		cy.dataCy('dialog-info').should('not.exist');
	});

	it('should navigate to the price lists management page', () => {
		cy.dataCy('manage-lists').click();
		cy.dataCy('activity-title').contains('Price List');
		cy.dataCy('prices-table').should('be.visible');
	});

	it('should display the mocked price lists', () => {
		cy.dataCy('prices-table').find('table tbody tr').should('have.length', 2);
	});

	it('should duplicate a price list by factor', () => {
		cy.dataCy('duplicate-pricelist').first().click();
		// The duplicate dialog's buttons have no data-cy; Cancel is first, Ok is last
		// in DialogActions (see PricesTable.tsx).
		cy.get('.MuiDialog-container .MuiDialogActions-root button').last().click();
		cy.dataCy('dialog-info').contains(
			'The price list has been duplicated successfully!',
		);
		cy.dataCy('approve-dialog').click();
		cy.dataCy('dialog-info').should('not.exist');
	});

	it('should navigate to the add price list form from the browser', () => {
		visitEn(PRICE_BROWSER_PATH);
		cy.dataCy('manage-lists').click();
		cy.dataCy('add-new-pricelist').click();
		cy.dataCy('activity-title').contains('Add Price List');
	});
});
