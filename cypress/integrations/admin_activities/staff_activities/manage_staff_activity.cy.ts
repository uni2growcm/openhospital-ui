/// <reference types="cypress" />

const STAFFS_START_PATH = '/admin/staff';

describe('Staff Activity specs', () => {
	it('should render the ui', () => {
		cy.authenticate(STAFFS_START_PATH);
		cy.dataCy('activity-title').contains('Personnel');
	});

	it('should present the table with five rows', () => {
		cy.dataCy('staff-table')
			.find('table')
			.then(($table) => {
				const rows = $table.find('tbody tr');
				expect(rows.length).equal(10);
			});
	});

	it('should display the deletion dialog', () => {
		cy.get('button[title="Delete"]').first().click();
		cy.dataCy('dialog-info').should(
			'contain',
			'Are you sure to delete item with code',
		);
	});

	it('should cancel the staff deletion', () => {
		cy.dataCy('close-dialog').click();
		cy.dataCy('dialog-info').should('not.be.visible');
		cy.dataCy('staff-table')
			.find('table')
			.then(($table) => {
				const rows = $table.find('tbody tr');
				expect(rows.length).equal(10);
			});
	});

	it('should delete the staff member', () => {
		cy.get('button[title="Delete"]').first().click();
		cy.dataCy('approve-dialog').click();
		cy.dataCy('dialog-info').contains('has been deleted successfully!');
		cy.dataCy('approve-dialog').last().click();
		cy.dataCy('dialog-info').should('not.exist');
	});
});
