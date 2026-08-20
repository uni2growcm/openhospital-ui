describe("Medical Details Activity", () => {
  before(() => {
    cy.authenticate("/pharmacy/pharmaceutical");
    cy.dataCy("pharmaceutical").should("exist");

    cy.dataCy("table-view-action").should("have.length.greaterThan", 0);
    cy.dataCy("table-view-action").eq(0).click();
    cy.dataCy("medical-details").should("exist");
  });

  it("Should render the medical details page", () => {
    cy.dataCy("medical-details").should("exist");
  });

  it("Should display sidebar medical information", () => {
    cy.dataCy("medical-status").should("exist");
    cy.dataCy("medical-pcsperpck").should("exist");
    cy.dataCy("medical-minqty").should("exist");
    cy.dataCy("medical-code").should("exist");
  });

  it("Should render pharmacy and wards cards", () => {
    cy.dataCy("medical-item-card").should("have.length.at.least", 2);
  });

  it("Should navigate to update pharmaceutical page on edit click", () => {
    cy.dataCy("medical-edit-button").click();
    cy.dataCy("pharmaceutical-form").should("exist");
  });
});
