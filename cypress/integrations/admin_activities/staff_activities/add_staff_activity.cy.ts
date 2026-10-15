/// <reference types="cypress" />

const STAFF_START_PATH = '/admin/staff';

describe('Add Staff Activity specs', () => {
	it('should render the ui', () => {
		cy.authenticate(STAFF_START_PATH);
		cy.dataCy('activity-title').contains('Personnel');
	});

	it('should show staff creation form', () => {
		cy.dataCy('add-new-staff').click();
		cy.dataCy('activity-title').contains('Add Personnel');
	});

	it('should fail to create a new staff member', () => {
		cy.byId('firstName').type('FAIL');
		cy.byId('lastName').type('Doe');
		cy.byId('position').type('Junior');
		cy.byId('profession').type('Doctor');
		cy.byId('phone').type('698123234');
		cy.dataCy('submit-form').click();
		cy.dataCy('info-box').contains('Fail');
	});

	it('should successfully create a new staff member', () => {
		cy.byId('firstName').clear().type('Alice');
		cy.dataCy('submit-form').click();
		cy.dataCy('dialog-info').contains(
			'Personnel has been created successfully!',
		);
		cy.dataCy('approve-dialog').click();
	});

	it('should redirect after staff creation', () => {
		cy.dataCy('activity-title').contains('Personnel');
	});

	it('should cancel the cancellation of the staff creation', () => {
		cy.dataCy('add-new-staff').click();
		cy.dataCy('cancel-form').click();
		cy.dataCy('dialog-info').contains('lost');
		cy.dataCy('close-dialog').click();
		cy.dataCy('dialog-info').should('not.be.visible');
	});

	it('should cancel the staff creation', () => {
		cy.dataCy('cancel-form').click();
		cy.dataCy('approve-dialog').click();
		cy.dataCy('dialog-info').should('not.exist');
		cy.dataCy('activity-title').contains('Personnel');
	});
});
