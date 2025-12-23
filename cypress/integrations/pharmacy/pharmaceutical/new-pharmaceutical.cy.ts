describe("New Pharmaceutical", () => {
  beforeEach(() => {
    cy.authenticate("/pharmacy/pharmaceutical/new");
  });

  it("Should render the UI", () => {
    cy.dataCy("new-pharmaceutical").should("exist");
  });

  it("Should navigate to pharmaceutical form", () => {
    cy.dataCy("pharmaceutical-form").should("exist");
  });

  it("Should display validation errors when required fields are missing", () => {
    cy.dataCy("submit-button").click();

    cy.contains("Pieces per Packet").should("exist");
    cy.contains("Critical level").should("exist");

    cy.dataCy("dialog-title").should("not.exist");
  });

  it("Should show a confirmation if the pharmaceutical creation succeeds", () => {
    cy.byId("prod_code").clear().type("PROD_04");
    cy.byId("type").clear().type("Labora");
    cy.byId("type-option-0").click();
    cy.byId("description").clear().type("New description");
    cy.byId("pcsperpck").clear().type("25");
    cy.byId("minqty").clear().type("75");

    cy.dataCy("submit-button").click();

    cy.dataCy("dialog-title").should(
      "contain",
      "Pharmaceutical added successfully"
    );

    cy.dataCy("approve-dialog").click();
  });
});
