declare namespace Cypress {
  interface Chainable {
    initAndClearGroupsDB(): Chainable<boolean>;
  }
}
