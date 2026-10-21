/// <reference types="cypress" />

export {};

const ACCOUNTING_BILLS_PATH = '/accounting/bills';
const ACCOUNTING_PATH = '/accounting';

describe('ManageBillsActivity spec', () => {
	it('should render the ui and default to overview tab', () => {
		cy.authenticate(ACCOUNTING_BILLS_PATH);
		cy.dataCy('manage-bills-activity').should('be.visible');
		cy.dataCy('app-header').should('be.visible');
		cy.dataCy('activity-title').contains('Accounting');
		cy.dataCy('activity-subtitle').should(
			'contain',
			new Date().getFullYear().toString(),
		);
	});

	it('should display the three navigation tabs with Overview active by default', () => {
		cy.dataCy('accounting-tabs').should('be.visible');
		cy.dataCy('accounting-tab-overview')
			.should('be.visible')
			.and('have.attr', 'aria-selected', 'true')
			.contains('Overview');
		cy.dataCy('accounting-tab-bills')
			.should('be.visible')
			.and('have.attr', 'aria-selected', 'false')
			.contains('Bills');
		cy.dataCy('accounting-tab-payments')
			.should('be.visible')
			.and('have.attr', 'aria-selected', 'false')
			.contains('Payments');
	});

	it('should display overview header actions and full overview dashboard', () => {
		cy.dataCy('accounting-header-actions').should('be.visible');
		cy.dataCy('accounting-year-field').should('be.visible');
		cy.dataCy('accounting-new-bill-button')
			.should('be.visible')
			.contains('New bill');
		cy.dataCy('accounting-overview').should('be.visible');
		cy.dataCy('overview-kpi-grid').should('be.visible');
		cy.dataCy('kpi-card-cashed-in').should('be.visible');
		cy.dataCy('kpi-card-outstanding-debt').should('be.visible');
		cy.dataCy('kpi-card-bills-issued').should('be.visible');
		cy.dataCy('kpi-card-refunded').should('be.visible');
		cy.dataCy('overview-chart-card').should('be.visible');
		cy.dataCy('overview-top-items-card').should('be.visible');
		cy.dataCy('overview-indebted-patients-card').should('be.visible');
		cy.dataCy('overview-reports-card').should('be.visible');
	});

	it('should interact with the reports panel and display a feedback banner', () => {
		cy.dataCy('report-item-patientStatement').should('be.visible');
		cy.dataCy('report-item-todayClosure').should('be.visible').click();
		cy.dataCy('report-feedback-banner').should('be.visible');
	});

	it('should switch to Bills tab and display its actions, subtitle, and placeholder', () => {
		cy.dataCy('accounting-tab-bills').click();
		cy.dataCy('accounting-tab-bills').should(
			'have.attr',
			'aria-selected',
			'true',
		);
		cy.dataCy('accounting-tab-overview').should(
			'have.attr',
			'aria-selected',
			'false',
		);
		cy.dataCy('accounting-tab-payments').should(
			'have.attr',
			'aria-selected',
			'false',
		);

		cy.dataCy('activity-subtitle').contains(
			'Patient bills, payments and refunds',
		);

		cy.dataCy('accounting-year-field').should('not.exist');
		cy.dataCy('accounting-reports-button')
			.should('be.visible')
			.contains('Reports');
		cy.dataCy('accounting-archive-closed-button')
			.should('be.visible')
			.contains('Archive closed');
		cy.dataCy('accounting-export-sage-button')
			.should('be.visible')
			.contains('Export Sage');
		cy.dataCy('accounting-export-pdf-button')
			.should('be.visible')
			.contains('Export PDF');
		cy.dataCy('accounting-new-bill-button')
			.should('be.visible')
			.contains('New bill');

		cy.dataCy('placeholder-title').contains('Bills');
	});

	it('should switch to Payments tab and display its actions, subtitle, and placeholder', () => {
		cy.dataCy('accounting-tab-payments').click();
		cy.dataCy('accounting-tab-payments').should(
			'have.attr',
			'aria-selected',
			'true',
		);
		cy.dataCy('accounting-tab-overview').should(
			'have.attr',
			'aria-selected',
			'false',
		);
		cy.dataCy('accounting-tab-bills').should(
			'have.attr',
			'aria-selected',
			'false',
		);

		cy.dataCy('activity-subtitle').contains('Every payment received');

		cy.dataCy('accounting-year-field').should('not.exist');
		cy.dataCy('accounting-reports-button').should('not.exist');
		cy.dataCy('accounting-new-bill-button').should('not.exist');
		cy.dataCy('accounting-export-csv-button')
			.should('be.visible')
			.contains('Export CSV');
		cy.dataCy('accounting-payments-by-user-button')
			.should('be.visible')
			.contains('Payments by user report');

		cy.dataCy('placeholder-title').contains('Payments');
	});

	it('should switch back to Overview tab when clicked and restore dashboard', () => {
		cy.dataCy('accounting-tab-overview').click();
		cy.dataCy('accounting-tab-overview').should(
			'have.attr',
			'aria-selected',
			'true',
		);
		cy.dataCy('accounting-year-field').should('be.visible');
		cy.dataCy('accounting-new-bill-button').should('be.visible');
		cy.dataCy('accounting-overview').should('be.visible');
		cy.dataCy('overview-kpi-grid').should('be.visible');
	});

	it('should navigate from accounting home to bills management via Manage Bills action', () => {
		cy.visit(ACCOUNTING_PATH);
		cy.dataCy('accounting-activity').should('be.visible');
		cy.dataCy('manageBills').click();
		cy.url().should('include', ACCOUNTING_BILLS_PATH);
		cy.dataCy('manage-bills-activity').should('be.visible');
	});
});
