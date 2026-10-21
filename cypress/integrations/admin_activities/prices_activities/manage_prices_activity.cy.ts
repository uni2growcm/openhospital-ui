/// <reference types="cypress" />

const PRICE_BROWSER_PATH = '/admin/prices';

describe('Price Browser Activity specs', () => {
	it('should render the ui', () => {
		cy.authenticate(PRICE_BROWSER_PATH);
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
		cy.contains('[role="dialog"]', 'Duplicate Price List').within(() => {
			cy.contains('button', 'Ok').click();
		});
		cy.dataCy('dialog-info').contains(
			'The price list has been duplicated successfully!',
		);
		cy.dataCy('approve-dialog').click();
	});

	it('should navigate to the add price list form from the browser', () => {
		cy.visit(PRICE_BROWSER_PATH);
		cy.dataCy('manage-lists').click();
		cy.dataCy('add-new-pricelist').click();
		cy.dataCy('activity-title').contains('Add Price List');
	});
});
