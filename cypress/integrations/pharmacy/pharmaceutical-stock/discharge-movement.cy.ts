describe("Discharge movement", () => {
  it("Should render the ui", () => {
    cy.authenticate("/pharmacy/pharmaceutical-stock");
    cy.dataCy("pharmaceutical-stock").should("exist");
  });

  it("Should navigate to discharge movement form", () => {
    cy.dataCy("discharge-button").click();
    cy.dataCy("discharge-movement").should("exist");
  });

  it("Should fill discharge movement form", () => {
    cy.byId("date").focus().type("031120251200").blur();
    cy.byId("medical").focus().type("Para");
    cy.byId("medical-option-0").click();
    cy.byId("refNo").focus().type("449").blur();
    cy.byId(`"lots.0.ward"`).focus().type("fem");
    cy.byId(`"lots.0.ward-option-0"`).click();
    cy.byId(`"lots.0.quantity"`).focus().clear().type("3").blur();
    cy.byId(`"lots.1.ward"`).focus().type("chi");
    cy.byId(`"lots.1.ward-option-0"`).click();
    cy.byId(`"lots.1.quantity"`).focus().clear().type("6").blur();
  });

  it("Should show a confirmation dialog if the movement discharging succeeds", () => {
    cy.dataCy("submit-button").click();
    cy.dataCy("info-box").should("not.exist");
  });
});
