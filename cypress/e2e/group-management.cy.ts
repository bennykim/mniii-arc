/// <reference types="cypress" />

import { KEY_GROUPS } from "../../src/shared/config/constants";

Cypress.Commands.add("initAndClearGroupsDB", () => {
  cy.window().then((win) => {
    return new Cypress.Promise((resolve, reject) => {
      const request = win.indexedDB.open("GROUPS_DB", 1);

      request.onerror = () => reject(new Error("Failed to open database"));

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction([KEY_GROUPS], "readwrite");
        const objectStore = transaction.objectStore(KEY_GROUPS);
        const clearRequest = objectStore.clear();

        clearRequest.onerror = () =>
          reject(new Error(`Failed to clear ${KEY_GROUPS} store`));
        clearRequest.onsuccess = () => {
          db.close();
          resolve(true);
        };
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        db.createObjectStore(KEY_GROUPS, { keyPath: "id" });
      };
    });
  });
});

describe("Group Management", () => {
  beforeEach(() => {
    cy.initAndClearGroupsDB();
    cy.visit("/");
  });

  it("creates a new group", () => {
    const newGroupName = "New Test Group";
    cy.get('input[placeholder="New group title"]').type(newGroupName);
    cy.get('[data-cy="add-group-button"]').click();
    cy.contains(newGroupName).should("be.visible");
  });

  it("edits an existing group", () => {
    const initialGroupName = "Group to Edit";
    const editedGroupName = "Edited Group Name";

    cy.get('input[placeholder="New group title"]').type(initialGroupName);
    cy.get('[data-cy="add-group-button"]').click();
    cy.wait(1000);

    cy.contains(initialGroupName)
      .parent()
      .parent()
      .within(() => {
        cy.get('[data-cy="edit-group-button"]').click();
      });
    cy.wait(250);

    cy.get('[data-cy="edit-group-input"]').clear().type(editedGroupName);
    cy.get('[data-cy="save-group-button"]').click();
    cy.wait(1000);
    cy.contains(editedGroupName).should("be.visible");
  });

  it("deletes a group", () => {
    const groupName = "Group to Delete";

    cy.get('input[placeholder="New group title"]').type(groupName);
    cy.get('[data-cy="add-group-button"]').click();
    cy.wait(1000);

    cy.contains(groupName)
      .parent()
      .parent()
      .within(() => {
        cy.get('[data-cy="del-group-button"]').click();
      });
    cy.wait(1000);
    cy.contains(groupName).should("not.exist");
  });

  it("creates and manages items within a group", () => {
    const groupName = "Item Test Group";
    const itemName = "New Test Item";
    const editedItemName = "Updated Item Name";

    // Create a group
    cy.get('input[placeholder="New group title"]').type(groupName);
    cy.get('[data-cy="add-group-button"]').click();
    cy.wait(1000);

    // Select the group
    cy.get('[data-cy="select-group-button"]').click();
    cy.wait(1000);

    // Create an item
    cy.get('input[placeholder="New item title"]').type(itemName);
    cy.get('[data-cy="add-item-button"]').click();
    cy.wait(1000);
    cy.contains(itemName).should("be.visible");

    // Edit the item
    cy.contains(itemName)
      .parent()
      .parent()
      .within(() => {
        cy.get('[data-cy="edit-item-button"]').click();
      });
    cy.wait(250);

    cy.get('[data-cy="edit-item-input"]').clear().type(editedItemName);
    cy.get('[data-cy="save-item-button"]').click();
    cy.wait(1000);
    cy.contains(editedItemName).should("be.visible");

    // Delete the item
    cy.contains(editedItemName)
      .parent()
      .parent()
      .within(() => {
        cy.get('[data-cy="del-item-button"]').click();
      });
    cy.wait(1000);
    cy.contains(editedItemName).should("not.exist");
  });

  it("sorts groups and items", () => {
    const groups = ["Group A", "Group B", "Group C"];
    const items = ["Item 1", "Item 2", "Item 3"];

    // Create multiple groups
    groups.forEach((groupName) => {
      cy.get('input[placeholder="New group title"]').type(groupName);
      cy.get('[data-cy="add-group-button"]').click();
      cy.wait(1000);
    });

    // Sort groups
    cy.get('[data-cy="sort-trigger"]').click();
    cy.get('[data-cy="select-desc"]').click();
    cy.get('[data-cy="groups-accordion"]')
      .find('[data-cy="group-item"]')
      .then(($items) => {
        expect($items.eq(0)).to.contain("Group C");
        expect($items.eq(1)).to.contain("Group B");
        expect($items.eq(2)).to.contain("Group A");
      });

    cy.contains("Group B")
      .parent()
      .within(() => {
        cy.get('[data-cy="select-group-button"]').click();
      });
    cy.wait(1000);

    items.forEach((itemName) => {
      cy.get('input[placeholder="New item title"]').type(itemName);
      cy.get('[data-cy="add-item-button"]').click();
      cy.wait(1000);
    });

    // Sort items
    cy.get('[data-cy="sort-trigger"]').click();
    cy.get('[data-cy="select-asc"]').click();
    cy.get('[data-cy="items-accordion"]')
      .find('[data-cy="item-item"]')
      .then(($items) => {
        expect($items.eq(0)).to.contain("Item 1");
        expect($items.eq(1)).to.contain("Item 2");
        expect($items.eq(2)).to.contain("Item 3");
      });
  });
});
