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

describe('Add Price List Activity specs', () => {
	it('should render the ui', () => {
		visitEn(PRICE_LISTS_PATH);
		cy.dataCy('activity-title').contains('Price List');
	});

	it('should show the price list creation form', () => {
		cy.dataCy('add-new-pricelist').click();
		cy.dataCy('activity-title').contains('Add Price List');
	});

	it('should fail to create a new price list', () => {
		cy.byId('code').type('fail');
		cy.byId('name').type('Test list');
		cy.byId('description').type('Test description');
		cy.byId('currency').type('EUR');
		cy.dataCy('submit-form').click();
		cy.dataCy('info-box').contains('Fail');
	});

	it('should successfully create a new price list', () => {
		cy.byId('code').clear().type('LIST003');
		cy.dataCy('submit-form').click();
		cy.dataCy('dialog-info').contains(
			'Price List has been created successfully!',
		);
		cy.dataCy('approve-dialog').click();
		cy.dataCy('dialog-info').should('not.exist');
	});

	it('should redirect after price list creation', () => {
		cy.dataCy('activity-title').contains('Price List');
	});

	it('should cancel the cancellation of the price list creation', () => {
		cy.dataCy('add-new-pricelist').click();
		cy.dataCy('cancel-form').click();
		cy.dataCy('dialog-info').contains('lost');
		cy.dataCy('close-dialog').click();
		cy.dataCy('dialog-info').should('not.exist');
	});

	it('should cancel the price list creation', () => {
		cy.dataCy('cancel-form').click();
		cy.dataCy('approve-dialog').click();
		cy.dataCy('dialog-info').should('not.exist');
		cy.dataCy('activity-title').contains('Price List');
	});
});
