/// <reference types="cypress" />

const STAFF_STARTS_PATH = '/admin/staff';

describe('Edit Staff Activity specs', () => {
	it('should render the ui', () => {
		cy.authenticate(STAFF_STARTS_PATH);
		cy.dataCy('activity-title').contains('Personnel');
	});

	it('should show staff edit form', () => {
		cy.get('button[title="Edit"]').first().click();
		cy.dataCy('activity-title').contains('Update Personnel');
	});

	it('should fail to edit the staff member', () => {
		cy.byId('firstName').clear().blur();
		cy.dataCy('submit-form').click();
		cy.dataCy('dialog-info').should('not.exist');
	});

	it('should successfully save staff changes', () => {
		cy.byId('firstName').clear().type('John');
		cy.byId('phone').clear().type('+237698000099');
		cy.dataCy('submit-form').click();
		cy.dataCy('dialog-info').contains('has been updated successfully!');
		cy.dataCy('approve-dialog').click();
	});

	it('should redirect after staff update', () => {
		cy.dataCy('activity-title').contains('Personnel');
	});

	it('should cancel the cancellation of the staff update', () => {
		cy.get('button[title="Edit"]').first().click();
		cy.dataCy('cancel-form').click();
		cy.dataCy('dialog-info').contains('lost');
		cy.dataCy('close-dialog').click();
		cy.dataCy('dialog-info').should('not.be.visible');
	});

	it('should cancel the staff update', () => {
		cy.dataCy('cancel-form').click();
		cy.dataCy('approve-dialog').click();
		cy.dataCy('dialog-info').should('not.exist');
		cy.dataCy('activity-title').contains('Personnel');
	});
});
