/// <reference types="cypress" />

describe("Theme Functionality", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should have dark theme by default", () => {
    cy.get("html").should("have.class", "dark");
  });

  it("should toggle theme when switch is clicked", () => {
    cy.get("html").should("have.class", "dark");
    cy.get('[data-cy="theme-switch"]').click();
    cy.get("html").should("have.class", "light");
  });

  it("should persist theme selection after page reload", () => {
    cy.get('[data-cy="theme-switch"]').click();
    cy.get("html").should("have.class", "light");
    cy.reload();
    cy.get("html").should("have.class", "light");
  });
});
