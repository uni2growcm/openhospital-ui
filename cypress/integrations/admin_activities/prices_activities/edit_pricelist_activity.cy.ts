/// <reference types="cypress" />

import { permissionList } from '../../../../src/mocks/fixtures/permissionList';

const PRICE_LISTS_PATH = '/admin/prices/lists';

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

describe('Price List Edit Activity specs', () => {
	it('should render the ui', () => {
		visitEn(PRICE_LISTS_PATH);
		cy.dataCy('activity-title').contains('Price List');
	});

	it('should show the price list edit form', () => {
		cy.dataCy('table-edit-action').first().click();
		cy.dataCy('activity-title').contains('Update Price List');
	});

	it('should disable the code field while editing', () => {
		cy.byId('code').should('be.disabled');
	});

	it('should fail to edit the price list', () => {
		cy.byId('name').clear();
		cy.byId('name').blur();
		cy.dataCy('submit-form').click();
		cy.dataCy('dialog-info').should('not.exist');
	});

	it('should successfully save price list changes', () => {
		cy.byId('name').clear().type('Basic updated');
		// The mocked "Basic" list has no currency set — fill it in since the field is required.
		cy.byId('currency').clear().type('EUR');
		cy.dataCy('submit-form').click();
		cy.dataCy('dialog-info').contains('has been updated successfully!');
		cy.dataCy('approve-dialog').click();
		cy.dataCy('dialog-info').should('not.exist');
	});

	it('should redirect after price list update', () => {
		cy.dataCy('prices-table').should('be.visible');
	});

	it('should cancel the cancellation of the price list edit', () => {
		cy.dataCy('table-edit-action').first().click();
		cy.dataCy('cancel-form').click();
		cy.dataCy('dialog-info').contains('lost');
		cy.dataCy('close-dialog').click();
		cy.dataCy('dialog-info').should('not.exist');
	});

	it('should cancel the price list edit', () => {
		cy.dataCy('cancel-form').click();
		cy.dataCy('approve-dialog').click();
		cy.dataCy('dialog-info').should('not.exist');
		cy.dataCy('activity-title').contains('Price List');
	});
});
