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

  it("Should fill pharmaceutical form", () => {
    cy.byId("prodCode").focus().clear().type("PROD_04");
    cy.byId("type").focus().clear().type("Labora");
    cy.byId("type-option-0").click();
    cy.byId("description").focus().clear().type("fail");
    cy.byId("pcsperpck").focus().clear().type("25");
    cy.byId("minqty").focus().clear().type("75");
  });

  it("Should show validation error when required fields are missing", () => {
    cy.byId("description").clear().blur();
    cy.dataCy("submit-button").click();

    cy.contains("description is required").should("be.visible");
  });

  it("Should show a confirmation if the pharmaceutical creation succeeds", () => {
    cy.byId("prodCode").clear().type("PROD_04");
    cy.byId("type").click();
    cy.byId("type-option-0").click();
    cy.byId("description").clear().type("New description");
    cy.byId("pcsperpck").clear().type("25");
    cy.byId("minqty").clear().type("75");
    cy.dataCy("submit-button").click();
    cy.dataCy("info-box").should("not.exist");
    cy.dataCy("dialog-title").contains("Pharmaceutical added successfully");
    cy.dataCy("approve-dialog").click();
  });
});
