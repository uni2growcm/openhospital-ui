describe("Charge movement", () => {
  it("Should render the ui", () => {
    cy.authenticate("/pharmacy/pharmaceutical-stock");
    cy.dataCy("pharmaceutical-stock").should("exist");
  });

  it("Should navigate to chareg movement form", () => {
    cy.dataCy("charge-button").click();
    cy.dataCy("charge-movement").should("exist");
  });

  it("Should fill charge movement form", () => {
    cy.byId("date").focus().type("031120251200").blur();
    cy.byId("refNo").focus().type("0").blur();
    cy.byId("medical").focus().type("Para");
    cy.byId("medical-option-0").click();
    cy.byId("supplier").focus().type("East");
    cy.byId("supplier-option-0").click();
    cy.byId("quantity").focus().type("12").blur();
    cy.dataCy("new-lot-radio").click();
    cy.byId(`"lot.code"`).focus().clear().type("128").blur();
    cy.byId(`"lot.preparationDate"`).focus().type("030820251200").blur();
    cy.byId(`"lot.dueDate"`).focus().type("030820281200").blur();
    cy.dataCy("submit-button").click();
    cy.contains("Please enter the lot cost.").should("be.visible");
    cy.byId(`"lot.cost"`).focus().type("0").blur();
    cy.dataCy("submit-button").click();
    cy.contains("The lot cost must be greater than zero.").should("be.visible");
    cy.byId(`"lot.cost"`).focus().clear().type("-1").blur();
    cy.dataCy("submit-button").click();
    cy.contains("The lot cost must be greater than zero.").should("be.visible");
    cy.byId(`"lot.cost"`).focus().clear().type("64").blur();
  });

  it("Should display an error info box if the movement charging fails", () => {
    cy.dataCy("submit-button").should("be.visible").click();

    cy.dataCy("info-box").should("exist").and("have.class", "error");
  });

  it("Should show a confirmation dialog if the movement charging succeeds", () => {
    cy.byId("refNo").focus().clear().type("448").blur();
    cy.dataCy("submit-button").click();
    cy.dataCy("info-box").should("not.exist");
    cy.dataCy("dialog-title").contains("Charge Movement Successful");
    cy.dataCy("dialog-return-button").click();
  });
});
