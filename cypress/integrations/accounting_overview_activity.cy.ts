/// <reference types="cypress" />

export {};

const ACCOUNTING_BILLS_PATH = '/accounting/bills';

describe('Accounting Overview E2E spec', () => {
	beforeEach(() => {
		cy.authenticate(ACCOUNTING_BILLS_PATH);
	});

	it('should render the overview tab by default with header actions and subtitle', () => {
		cy.dataCy('accounting-tab-overview')
			.should('be.visible')
			.and('have.attr', 'aria-selected', 'true');

		cy.dataCy('accounting-header-actions').should('be.visible');
		cy.dataCy('accounting-year-field').should('be.visible');
		cy.dataCy('accounting-new-bill-button')
			.should('be.visible')
			.and('contain', 'New bill');

		cy.dataCy('activity-title').contains('Accounting');
		cy.dataCy('activity-subtitle').should(
			'contain',
			new Date().getFullYear().toString(),
		);
	});

	it('should display the 4 KPI cards with their respective labels and structure', () => {
		cy.dataCy('overview-kpi-grid').should('be.visible');

		cy.dataCy('kpi-card-cashed-in').should('be.visible');
		cy.dataCy('kpi-card-cashed-in').contains('CASHED IN');

		cy.dataCy('kpi-card-outstanding-debt').should('be.visible');
		cy.dataCy('kpi-card-outstanding-debt').contains('OUTSTANDING DEBT');

		cy.dataCy('kpi-card-bills-issued').should('be.visible');
		cy.dataCy('kpi-card-bills-issued').contains('BILLS ISSUED');

		cy.dataCy('kpi-card-refunded').should('be.visible');
		cy.dataCy('kpi-card-refunded').contains('REFUNDED');
	});

	it('should render the monthly payments and debts chart container and canvas', () => {
		cy.dataCy('overview-chart-card').should('be.visible');
		cy.dataCy('overview-chart-card').contains('Payments and debts by month');
		cy.dataCy('overview-stacked-bar-chart').should('be.visible');
	});

	it('should render the bottom widgets for top items and indebted patients', () => {
		cy.dataCy('overview-top-items-card').should('be.visible');
		cy.dataCy('overview-top-items-card').contains('Items by revenue');

		cy.dataCy('overview-indebted-patients-card').should('be.visible');
		cy.dataCy('overview-indebted-patients-card').contains(
			'Most indebted patients',
		);
	});

	it('should render the reports panel with 11 accounting reports and allow clicking for feedback', () => {
		cy.dataCy('overview-reports-card').should('be.visible');
		cy.dataCy('overview-reports-card').contains('Reports');

		cy.dataCy('report-item-patientStatement').should('be.visible');
		cy.dataCy('report-item-todayClosure').should('be.visible');
		cy.dataCy('report-item-badDebtsOnly').should('be.visible');
		cy.dataCy('report-item-allBills').should('be.visible');
		cy.dataCy('report-item-paymentsByUser').should('be.visible');
		cy.dataCy('report-item-paymentsAndRefundsByUser').should('be.visible');
		cy.dataCy('report-item-incomesByItemCategory').should('be.visible');
		cy.dataCy('report-item-refunds').should('be.visible');
		cy.dataCy('report-item-debtsByItemCategory').should('be.visible');
		cy.dataCy('report-item-billsByReductionPlan').should('be.visible');
		cy.dataCy('report-item-globalConsumptionByService').should('be.visible');

		cy.dataCy('report-item-patientStatement').click();
		cy.dataCy('report-feedback-banner')
			.should('be.visible')
			.and('contain', 'Patient statement');
	});
});
