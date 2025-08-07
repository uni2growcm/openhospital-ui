/// <reference types="cypress" />

describe("Patient Details / Radiology", () => {
  before(() => {
    cy.authenticate("/patients/details/2");
  });

  it("Should render the ui", () => {
    cy.dataCy("patient-details");
  });

  it("Should have a menu item for Radiology", () => {
    cy.dataCy("patient-details-main-menu").contains("Radiology").click();
  });

  it("Should contain studies", () => {
    cy.dataCy("studies").contains("Latest study");
  });

  it("Should navigate to study series", () => {
    cy.dataCy("view-study-001").click();
  });

  it("Should preview series instance", () => {
    cy.dataCy("expand-row-1").click();
    cy.dataCy("preview-instance-002").click();
    cy.wait(2000);
    cy.get('[aria-label="close"]').click();
  });

  it("Should fail to display studies", () => {
    cy.visit("/patients/details/1/radiology");
    cy.dataCy("info-box").contains("Something went wrong");
  });
});
