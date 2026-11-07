// /// <reference types="cypress" />

// describe('Maternity Activity specs', () => {
// 	it('should navigate to maternity module from nav bar', () => {
// 		cy.authenticate('/patients');
// 		cy.dataCy('nav-maternity').should('be.visible').click();
// 		cy.url().should('include', '/maternity');
// 		cy.dataCy('maternity-activity').should('be.visible');
// 	});

// 	it('should render the 3 maternity action cards with large button component', () => {
// 		cy.authenticate('/maternity');
// 		cy.dataCy('maternity-activity').should('be.visible');

// 		cy.dataCy('card-pregnancy-care')
// 			.should('be.visible')
// 			.within(() => {
// 				cy.get('.largeButton__inner__label').should(
// 					'contain.text',
// 					'Pregnancy care',
// 				);
// 			});

// 		cy.dataCy('card-hiv-followup')
// 			.should('be.visible')
// 			.within(() => {
// 				cy.get('.largeButton__inner__label').should(
// 					'contain.text',
// 					'HIV follow up',
// 				);
// 			});

// 		cy.dataCy('card-family-planning')
// 			.should('be.visible')
// 			.within(() => {
// 				cy.get('.largeButton__inner__label').should(
// 					'contain.text',
// 					'Family planning',
// 				);
// 			});
// 	});
// });
