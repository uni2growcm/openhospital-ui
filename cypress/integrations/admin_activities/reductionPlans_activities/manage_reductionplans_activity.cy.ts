/// <reference types="cypress" />

import { permissionList } from '../../../../src/mocks/fixtures/permissionList';

const REDUCTION_PLANS_PATH = '/admin/reduction-plans';

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

describe('Reduction Plans Activity specs', () => {
	it('should render the ui', () => {
		visitEn(REDUCTION_PLANS_PATH);
		cy.dataCy('activity-title').contains('Reduction Plans');
		cy.dataCy('reduction-plans-activity').should('be.visible');
	});

	it('should display the mocked reduction plans', () => {
		cy.dataCy('reduction-plans-table')
			.find('table tbody tr')
			.should('have.length', 2);
		cy.dataCy('reduction-plans-table')
			.find('table tbody tr')
			.eq(0)
			.within(() => {
				cy.contains('td', 'Standard Discount');
				cy.contains('td', '10%');
				cy.contains('td', '5%');
				cy.contains('td', '15%');
				cy.contains('td', '0%');
			});
		cy.dataCy('reduction-plans-table')
			.find('table tbody tr')
			.eq(1)
			.within(() => {
				cy.contains('td', 'VIP Plan');
			});
	});

	it('should navigate to the add reduction plan form', () => {
		cy.dataCy('add-new-reductionplan').click();
		cy.dataCy('activity-title').contains('Add new reduction plan');
	});

	it('should navigate to the edit reduction plan form', () => {
		visitEn(REDUCTION_PLANS_PATH);
		cy.dataCy('table-edit-action').first().click();
		cy.dataCy('activity-title').contains('Edit Reduction Plan');
	});

	it('should delete a reduction plan', () => {
		visitEn(REDUCTION_PLANS_PATH);
		cy.dataCy('reduction-plans-table')
			.find('table tbody tr')
			.should('have.length', 2);
		cy.dataCy('table-delete-action').first().click();
		// Table's own "are you sure?" dialog and the success dialog both use the
		// same approve-dialog data-cy — the outgoing one can briefly linger in the
		// DOM mid-exit-transition, so filter to the one actually on screen.
		cy.dataCy('approve-dialog').filter(':visible').click();
		cy.dataCy('dialog-info').contains('Reduction plan deleted successfully');
		cy.dataCy('approve-dialog').filter(':visible').click();
		cy.dataCy('dialog-info').should('not.exist');
	});
});
