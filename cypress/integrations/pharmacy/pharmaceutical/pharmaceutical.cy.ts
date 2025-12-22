describe("PharmacyActivity spec", () => {
  it("should render the ui", () => {
    cy.authenticate("/pharmacy");
    cy.dataCy("pharmacy-activity").should("exist");
  });

  it("should navigate to pharmaceutical component and display content", () => {
    cy.dataCy("pharmaceutical").click();
  });

  it("should display stock table with 5 rows", () => {
    cy.dataCy("pharmaceutical-table")
      .find("table tbody tr")
      .then(($rows) => {
        expect($rows.length).equal(5);
      });
  });

  it("should display expiring diaolog and select expiring period", () => {
    cy.dataCy("pharmaceutical-actions").should("exist");
    cy.dataCy("button-actions").should("exist");
    cy.dataCy("expiring-button").click();
    cy.dataCy("dialog-title").contains("Expiring report");
    cy.dataCy("dialog-info").contains("Select a period");
    cy.dataCy("dialog-content").should("exist");
    cy.dataCy("periodSelected").click();
    cy.get('[role="listbox"] [role="option"]')
      .contains("Specific month")
      .click();
    cy.dataCy("monthSelected").click();
    cy.get('[role="listbox"] [role="option"]').contains("October").click();
    cy.dataCy("generate-expiring-button").click();
  });
});
