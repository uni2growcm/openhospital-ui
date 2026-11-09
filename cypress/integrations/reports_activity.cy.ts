/// <reference types="cypress" />

const REPORTS_START_PATH = '/reports';

describe('Reports Activity specs', () => {
	it('should render the ui', () => {
		cy.authenticate(REPORTS_START_PATH);
		cy.dataCy('reports-list').contains('Reports');
		cy.dataCy('reports-tabs').should('exist');
	});

	it('should show the code and the description of statistic reports in their own column', () => {
		cy.dataCy('reports-table')
			.find('tbody tr')
			.contains('tr', 'OPD by diagnosis')
			.within(() => {
				cy.get('td').contains(/^HMIS 105$/);
				cy.get('td').contains(/^OPD by diagnosis$/);
			});
		cy.dataCy('reports-table')
			.find('tbody tr')
			.contains('tr', 'OPD attendance')
			.within(() => {
				cy.get('td').contains(/^HMIS 105$/);
			});
	});

	it('should list each report once, even when they share the same code', () => {
		cy.dataCy('reports-table')
			.find('tbody tr')
			.filter(':contains("HMIS 105")')
			.should('have.length', 2);
	});

	it('should filter the reports by category', () => {
		cy.dataCy('reports-tabs').contains('button', 'Lists').click();
		cy.dataCy('reports-table')
			.find('tbody tr')
			.should('have.length', 3)
			.and('not.contain', 'HMIS 105');
		cy.dataCy('reports-tabs').contains('button', 'All').click();
	});

	it('should search a report by its code', () => {
		cy.dataCy('reports-autocomplete').find('input').type('OH001');
		cy.dataCy('reports-table')
			.find('tbody tr')
			.should('have.length', 1)
			.and('contain', 'Registered patients');
		cy.dataCy('reports-autocomplete').find('input').clear();
	});

	it('should only show the preview button when printing a report', () => {
		cy.dataCy('print-report-hmis105_opd_by_diagnosis').click();
		cy.dataCy('report-month-year-dialog').should('exist');
		cy.dataCy('report-validate').should('exist');
		cy.dataCy('report-export-excel').should('not.exist');
	});

	it('should open the PDF preview', () => {
		cy.dataCy('report-validate').click();
		cy.dataCy('report-preview-dialog').should('exist');
		cy.dataCy('report-preview-frame').should('exist');
		cy.dataCy('report-preview-close').click();
		cy.dataCy('report-preview-dialog').should('not.exist');
	});

	it('should only show the Excel button when exporting a report to Excel', () => {
		cy.dataCy('export-excel-OH001_RegisteredPatients').click();
		cy.dataCy('report-date-range-dialog').should('exist');
		cy.dataCy('report-export-excel').should('exist');
		cy.dataCy('report-validate').should('not.exist');
	});

	it('should close the parameters dialog on cancel', () => {
		cy.dataCy('report-cancel').click();
		cy.dataCy('report-date-range-dialog').should('not.exist');
	});

	it('should not offer the Excel export for PDF only reports', () => {
		cy.dataCy('print-report-ExamsList').should('exist');
		cy.dataCy('export-excel-ExamsList').should('not.exist');
	});

	it('should ask no parameter for a report without parameter', () => {
		cy.dataCy('print-report-ExamsList').click();
		cy.dataCy('report-parameters-dialog').contains(
			'This report has no parameter.',
		);
		cy.dataCy('report-cancel').click();
	});
});
