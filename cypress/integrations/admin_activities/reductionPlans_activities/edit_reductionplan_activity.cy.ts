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

describe('Reduction Plan Edit Activity specs', () => {
	it('should render the ui', () => {
		visitEn(REDUCTION_PLANS_PATH);
		cy.dataCy('activity-title').contains('Reduction Plans');
	});

	it('should show the reduction plan edit form pre-filled', () => {
		cy.dataCy('table-edit-action').eq(1).click();
		cy.dataCy('activity-title').contains('Edit Reduction Plan');
		cy.byId('description').should('have.value', 'VIP Plan');
		cy.byId('medicalRate').should('have.value', '20');
	});

	it('should display the existing specific medical reduction', () => {
		cy.contains('[role="tab"]', 'Medicals (1)').should(
			'have.attr',
			'aria-selected',
			'true',
		);
		cy.contains('td', 'Paracétamol (12)');
		cy.contains('td', '30%');
	});

	it('should edit the existing specific reduction item inline', () => {
		cy.dataCy('edit-reduction-item').click();
		cy.dataCy('editing-rate-input').find('input').clear().type('45');
		cy.dataCy('save-reduction-item').click();
		cy.contains('td', '45%');
	});

	it('should remove the existing specific reduction item', () => {
		cy.dataCy('delete-reduction-item').click();
		cy.contains('[role="tab"]', 'Medicals (0)').should('be.visible');
		cy.contains(
			'No specific reductions defined (general rate applies).',
		).should('be.visible');
	});

	it('should fail to save when the description is cleared', () => {
		cy.byId('description').clear().blur();
		cy.dataCy('submit-form').click();
		cy.dataCy('dialog-info').should('not.exist');
	});

	it('should successfully save reduction plan changes', () => {
		cy.byId('description').clear().type('VIP Plan Updated');
		cy.dataCy('submit-form').click();
		cy.dataCy('dialog-info').contains('Reduction plan updated successfully');
		cy.dataCy('approve-dialog').click();
	});

	it('should redirect after reduction plan update', () => {
		cy.dataCy('activity-title').contains('Reduction Plans');
	});

	it('should cancel the cancellation of the reduction plan edit', () => {
		cy.dataCy('table-edit-action').first().click();
		cy.dataCy('cancel-form').click();
		cy.dataCy('dialog-info').contains('lost');
		cy.dataCy('close-dialog').click();
		cy.dataCy('dialog-info').should('not.exist');
	});

	it('should cancel the reduction plan edit', () => {
		cy.dataCy('cancel-form').click();
		cy.dataCy('approve-dialog').click();
		cy.dataCy('dialog-info').should('not.exist');
		cy.dataCy('activity-title').contains('Reduction Plans');
	});
});
