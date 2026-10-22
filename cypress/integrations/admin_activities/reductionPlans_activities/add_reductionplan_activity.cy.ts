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

describe('Add Reduction Plan Activity specs', () => {
	it('should render the ui', () => {
		visitEn(REDUCTION_PLANS_PATH);
		cy.dataCy('activity-title').contains('Reduction Plans');
	});

	it('should show the reduction plan creation form', () => {
		cy.dataCy('add-new-reductionplan').click();
		cy.dataCy('activity-title').contains('Add new reduction plan');
	});

	it('should fail to create a reduction plan without a description', () => {
		cy.byId('description').focus().blur();
		cy.dataCy('submit-form').click();
		cy.dataCy('dialog-info').should('not.exist');
	});

	it('should fail to create a reduction plan rejected by the backend', () => {
		cy.byId('description').clear().type('fail');
		cy.dataCy('submit-form').click();
		cy.dataCy('info-box').contains('Fail');
	});

	it('should add a specific medical reduction item to the plan', () => {
		cy.byId('selectMedical').click();
		cy.get('.MuiAutocomplete-popper li[data-option-index="0"]').click();
		cy.dataCy('reduction-rate-input').find('input').type('25');
		cy.dataCy('add-reduction-item').click();
		cy.contains('td', 'Paracétamol (12)');
		cy.contains('td', '25%');
	});

	it('should edit the specific reduction item inline', () => {
		cy.dataCy('edit-reduction-item').click();
		cy.dataCy('editing-rate-input').find('input').clear().type('40');
		cy.dataCy('save-reduction-item').click();
		cy.contains('td', '40%');
	});

	it('should remove the specific reduction item', () => {
		cy.dataCy('delete-reduction-item').click();
		cy.contains(
			'No specific reductions defined (general rate applies).',
		).should('be.visible');
	});

	it('should successfully create a new reduction plan', () => {
		cy.byId('description').clear().type('Family Plan');
		cy.dataCy('submit-form').click();
		cy.dataCy('dialog-info').contains('Reduction plan created successfully');
		cy.dataCy('approve-dialog').click();
	});

	it('should redirect after reduction plan creation', () => {
		cy.dataCy('activity-title').contains('Reduction Plans');
		cy.dataCy('reduction-plans-table').should('be.visible');
	});

	it('should cancel the cancellation of the reduction plan creation', () => {
		cy.dataCy('add-new-reductionplan').click();
		cy.dataCy('cancel-form').click();
		cy.dataCy('dialog-info').contains('lost');
		cy.dataCy('close-dialog').click();
		cy.dataCy('dialog-info').should('not.exist');
	});

	it('should cancel the reduction plan creation', () => {
		cy.dataCy('cancel-form').click();
		cy.dataCy('approve-dialog').click();
		cy.dataCy('dialog-info').should('not.exist');
		cy.dataCy('activity-title').contains('Reduction Plans');
	});
});
