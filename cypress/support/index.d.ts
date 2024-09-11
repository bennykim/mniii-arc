/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    initAndClearGroupsDB(): Chainable<void>;
  }
}
