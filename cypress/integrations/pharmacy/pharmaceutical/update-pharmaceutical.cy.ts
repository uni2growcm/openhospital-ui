describe("Update Pharmaceutical", () => {
  before(() => {
    cy.authenticate("/pharmacy/pharmaceutical");
    cy.dataCy("pharmaceutical").should("exist");
  });

  it("Should navigate to edit pharmaceutical form", () => {
    cy.dataCy("table-edit-action").eq(3).click();
    cy.dataCy("pharmaceutical-form").should("exist");
  });

  it("Should update form fields", () => {
    cy.byId("prod_code").clear().type("PROD_04");
    cy.byId("type").clear().type("Labora");
    cy.byId("type-option-0").click();
    cy.byId("description").clear().type("fail");
    cy.byId("pcsperpck").clear().type("25");
    cy.byId("minqty").clear().type("75");
    cy.byName("ignoreSimilar").check().blur();
  });
  it("Should display validation errors if required fields are missing", () => {
    cy.byId("description").clear();
    cy.byId("pcsperpck").clear();

    cy.dataCy("submit-button").click();

    cy.contains("Pieces per Packet").should("exist");
    cy.dataCy("dialog-title").should("not.exist");
  });

  it("Should show a confirmation dialog if the medical update succeeds", () => {
    cy.byId("description").clear().type("New description");
    cy.byId("pcsperpck").clear().type("25");
    cy.byId("minqty").clear().type("75");

    cy.dataCy("submit-button").click();
    cy.dataCy("dialog-title").should(
      "contain",
      "Pharmaceutical updated successfully"
    );

    cy.dataCy("approve-dialog").click();
  });
});
