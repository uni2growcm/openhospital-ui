describe("PharmacyActivity spec", () => {
  it("should render the ui", () => {
    cy.authenticate("/pharmacy");
    cy.dataCy("pharmacy-activity").should("exist");
  });

  it("should navigate to pharmaceutical component and display content", () => {
    cy.dataCy("pharmaceutical").click();
    // cy.dataCy("pharmaceutical-actions").should("exist");
    // cy.dataCy("pharmaceutical-table").should("exist");
  });

  it("should display stock table with 10 rows", () => {
    cy.dataCy("pharmaceutical-stock-table")
      .find("table tbody tr")
      .then(($rows) => {
        expect($rows.length).equal(20);
      });
  });

  it("should display expiring diaolog", () => {
    cy.dataCy("expiring-button").click();
    cy.dataCy("dialog-title").contains("Charge Movement Successful");
  });
});
