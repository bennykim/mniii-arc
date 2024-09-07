import { http, HttpResponse, PathParams } from "msw";
import { v4 as uuidv4 } from "uuid";

import { db, initDB } from "@/mocks/db";
import { withStatus } from "@/mocks/withStatus";
import { KEY_GROUPS } from "@/shared/config/constants";

import type { Group } from "@/entities/group/model/types";
import type { Item } from "@/entities/item/model/types";

function isGroupParams(params: PathParams): params is { id: string } {
  return "id" in params;
}

function isGroupItemParams(
  params: PathParams
): params is { groupId: string; itemId?: string } {
  return "groupId" in params;
}

initDB();

// Handlers
export const handlers = [
  // Create Group
  http.post(
    "/api/groups",
    withStatus(async ({ request }) => {
      try {
        const newGroup = (await request.json()) as Omit<Group, "id">;
        const groupWithId: Group = { ...newGroup, id: uuidv4(), items: [] };
        await db.add(KEY_GROUPS, groupWithId);
        return HttpResponse.json(groupWithId, { status: 200 });
      } catch (error) {
        console.error("Failed to create group:", error);
        return HttpResponse.json(
          { error: "Failed to create group" },
          { status: 500 }
        );
      }
    })
  ),

  // Get All Groups
  http.get(
    "/api/groups",
    withStatus(async () => {
      try {
        const allGroups = await db.getAll(KEY_GROUPS);
        return HttpResponse.json(allGroups, { status: 200 });
      } catch (error) {
        console.error("Failed to fetch groups:", error);
        return HttpResponse.json(
          { error: "Failed to fetch groups" },
          { status: 500 }
        );
      }
    })
  ),

  // Get Group by ID
  http.get(
    "/api/groups/:id",
    withStatus(async ({ params }) => {
      try {
        if (!isGroupParams(params)) {
          return HttpResponse.json(
            { error: "Invalid group ID" },
            { status: 400 }
          );
        }
        const { id } = params;
        const group = await db.get(KEY_GROUPS, id);
        if (!group) {
          return HttpResponse.json(
            { error: "Group not found" },
            { status: 404 }
          );
        }
        return HttpResponse.json(group, { status: 200 });
      } catch (error) {
        console.error("Failed to fetch group:", error);
        return HttpResponse.json(
          { error: "Failed to fetch group" },
          { status: 500 }
        );
      }
    })
  ),

  // Update Group
  http.put(
    "/api/groups/:id",
    withStatus(async ({ params, request }) => {
      try {
        if (!isGroupParams(params)) {
          return HttpResponse.json(
            { error: "Invalid group ID" },
            { status: 400 }
          );
        }
        const { id } = params;
        const updatedGroup = (await request.json()) as Group;
        const existingGroup = await db.get(KEY_GROUPS, id);
        if (!existingGroup) {
          return HttpResponse.json(
            { error: "Group not found" },
            { status: 404 }
          );
        }
        await db.put(KEY_GROUPS, { ...existingGroup, ...updatedGroup, id });
        return HttpResponse.json(updatedGroup, { status: 200 });
      } catch (error) {
        console.error("Failed to update group:", error);
        return HttpResponse.json(
          { error: "Failed to update group" },
          { status: 500 }
        );
      }
    })
  ),

  // Delete Group
  http.delete(
    "/api/groups/:id",
    withStatus(async ({ params }) => {
      try {
        if (!isGroupParams(params)) {
          return HttpResponse.json(
            { error: "Invalid group ID" },
            { status: 400 }
          );
        }
        const { id } = params;
        const deletedGroup = await db.get(KEY_GROUPS, id);
        if (!deletedGroup) {
          return HttpResponse.json(
            { error: "Group not found" },
            { status: 404 }
          );
        }
        await db.delete(KEY_GROUPS, id);
        return HttpResponse.json(deletedGroup, { status: 200 });
      } catch (error) {
        console.error("Failed to delete group:", error);
        return HttpResponse.json(
          { error: "Failed to delete group" },
          { status: 500 }
        );
      }
    })
  ),

  // Create Item in Group
  http.post(
    "/api/groups/:groupId/items",
    withStatus(async ({ params, request }) => {
      try {
        if (!isGroupItemParams(params)) {
          return HttpResponse.json(
            { error: "Invalid group ID" },
            { status: 400 }
          );
        }
        const { groupId } = params;
        const newItem = (await request.json()) as Omit<Item, "id">;
        const group = await db.get(KEY_GROUPS, groupId);
        if (!group) {
          return HttpResponse.json(
            { error: "Group not found" },
            { status: 404 }
          );
        }
        const itemWithId: Item = { ...newItem, id: uuidv4() };
        group.items.push(itemWithId);
        await db.put(KEY_GROUPS, group);
        return HttpResponse.json(itemWithId, { status: 200 });
      } catch (error) {
        console.error("Failed to create item:", error);
        return HttpResponse.json(
          { error: "Failed to create item" },
          { status: 500 }
        );
      }
    })
  ),

  // Get All Items in Group
  http.get(
    "/api/groups/:groupId/items",
    withStatus(async ({ params }) => {
      try {
        if (!isGroupItemParams(params)) {
          return HttpResponse.json(
            { error: "Invalid group ID" },
            { status: 400 }
          );
        }
        const { groupId } = params;
        const group = await db.get(KEY_GROUPS, groupId);
        if (!group) {
          return HttpResponse.json(
            { error: "Group not found" },
            { status: 404 }
          );
        }
        return HttpResponse.json(group.items, { status: 200 });
      } catch (error) {
        console.error("Failed to fetch items:", error);
        return HttpResponse.json(
          { error: "Failed to fetch items" },
          { status: 500 }
        );
      }
    })
  ),

  // Get Item by ID in Group
  http.get(
    "/api/groups/:groupId/items/:itemId",
    withStatus(async ({ params }) => {
      try {
        if (!isGroupItemParams(params) || !params.itemId) {
          return HttpResponse.json(
            { error: "Invalid group or item ID" },
            { status: 400 }
          );
        }
        const { groupId, itemId } = params;
        const group = (await db.get(KEY_GROUPS, groupId)) as Group;
        if (!group) {
          return HttpResponse.json(
            { error: "Group not found" },
            { status: 404 }
          );
        }
        const item = group.items.find((item) => item.id === itemId);
        if (!item) {
          return HttpResponse.json(
            { error: "Item not found" },
            { status: 404 }
          );
        }
        return HttpResponse.json(item, { status: 200 });
      } catch (error) {
        console.error("Failed to fetch item:", error);
        return HttpResponse.json(
          { error: "Failed to fetch item" },
          { status: 500 }
        );
      }
    })
  ),

  // Update Item in Group
  http.put(
    "/api/groups/:groupId/items/:itemId",
    withStatus(async ({ params, request }) => {
      try {
        if (!isGroupItemParams(params) || !params.itemId) {
          return HttpResponse.json(
            { error: "Invalid group or item ID" },
            { status: 400 }
          );
        }
        const { groupId, itemId } = params;
        const updatedItem = (await request.json()) as Item;
        const group = (await db.get(KEY_GROUPS, groupId)) as Group;
        if (!group) {
          return HttpResponse.json(
            { error: "Group not found" },
            { status: 404 }
          );
        }
        const itemIndex = group.items.findIndex((item) => item.id === itemId);
        if (itemIndex === -1) {
          return HttpResponse.json(
            { error: "Item not found" },
            { status: 404 }
          );
        }
        group.items[itemIndex] = {
          ...group.items[itemIndex],
          ...updatedItem,
          id: itemId,
        };
        await db.put(KEY_GROUPS, group);
        return HttpResponse.json(group.items[itemIndex], { status: 200 });
      } catch (error) {
        console.error("Failed to update item:", error);
        return HttpResponse.json(
          { error: "Failed to update item" },
          { status: 500 }
        );
      }
    })
  ),

  // Delete Item from Group
  http.delete(
    "/api/groups/:groupId/items/:itemId",
    withStatus(async ({ params }) => {
      try {
        if (!isGroupItemParams(params) || !params.itemId) {
          return HttpResponse.json(
            { error: "Invalid group or item ID" },
            { status: 400 }
          );
        }
        const { groupId, itemId } = params;
        const group = (await db.get(KEY_GROUPS, groupId)) as Group;
        if (!group) {
          return HttpResponse.json(
            { error: "Group not found" },
            { status: 404 }
          );
        }
        const itemIndex = group.items.findIndex((item) => item.id === itemId);
        if (itemIndex === -1) {
          return HttpResponse.json(
            { error: "Item not found" },
            { status: 404 }
          );
        }
        const deletedItem = group.items.splice(itemIndex, 1)[0];
        await db.put(KEY_GROUPS, group);
        return HttpResponse.json(deletedItem, { status: 200 });
      } catch (error) {
        console.error("Failed to delete item:", error);
        return HttpResponse.json(
          { error: "Failed to delete item" },
          { status: 500 }
        );
      }
    })
  ),
];
