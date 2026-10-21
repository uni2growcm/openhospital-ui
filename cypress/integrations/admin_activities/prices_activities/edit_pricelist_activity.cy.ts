/// <reference types="cypress" />

const PRICE_LISTS_PATH = '/admin/prices/lists';

describe('Price List Edit Activity specs', () => {
	it('should render the ui', () => {
		cy.authenticate(PRICE_LISTS_PATH);
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
		cy.dataCy('submit-form').click();
		cy.dataCy('dialog-info').contains('has been updated successfully!');
		cy.dataCy('approve-dialog').click();
	});

	it('should redirect after price list update', () => {
		cy.dataCy('activity-title').contains('Price List');
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
