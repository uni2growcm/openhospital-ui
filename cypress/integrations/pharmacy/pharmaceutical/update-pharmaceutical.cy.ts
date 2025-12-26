describe("Update Pharmaceutical", () => {
  before(() => {
    cy.authenticate("/pharmacy/pharmaceutical");
    cy.dataCy("pharmaceutical").should("exist");
  });

  it("Should navigate to edit pharmaceutical form", () => {
    cy.dataCy("table-edit-action").eq(3).click();
    cy.dataCy("pharmaceutical-form").should("exist");
  });

  it("Should update editable form fields", () => {
    cy.byId("prodCode").should("be.disabled");
    cy.byId("type").click();
    cy.byId("type-option-0").click();
    cy.byId("description").should("be.visible").clear().type("fail");

    cy.byId("pcsperpck").clear().type("25");
    cy.byId("minqty").clear().type("75");

    cy.byName("ignoreSimilar").check({ force: true });
  });

  it("Should display an error info box if the medical update fails", () => {
    cy.dataCy("submit-button").click();

    cy.dataCy("info-box").should("exist").and("have.class", "error");
  });

  it("Should show a confirmation dialog if the medical update succeeds", () => {
    cy.byId("description").clear().type("New description");
    cy.dataCy("submit-button").click();
    cy.dataCy("info-box").should("not.exist");
    cy.dataCy("dialog-title").should(
      "contain",
      "Pharmaceutical updated successfully"
    );

    cy.contains("OK").click();
  });
});
