import { http, HttpResponse } from "msw";

import { KEY_GROUPS } from "../constants";
import { db, initDB } from "./db";
import { Group, Item } from "./models";

initDB();

export const handlers = [
  http.post<never, Group>("/api/groups", async ({ request }) => {
    const newGroup = await request.json();
    await db.add(KEY_GROUPS, newGroup);
    return HttpResponse.json(newGroup, { status: 201 });
  }),

  http.get("/api/groups", async () => {
    const allGroups = await db.getAll(KEY_GROUPS);
    return HttpResponse.json(allGroups);
  }),

  http.get<{ id: string }>("/api/groups/:id", async ({ params }) => {
    const { id } = params;
    const group = await db.get(KEY_GROUPS, id);
    if (!group) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(group);
  }),

  http.put<{ id: string }, Group>(
    "/api/groups/:id",
    async ({ params, request }) => {
      const { id } = params;
      const updatedGroup = await request.json();
      const existingGroup = await db.get(KEY_GROUPS, id);
      if (!existingGroup) {
        return new HttpResponse(null, { status: 404 });
      }
      await db.put(KEY_GROUPS, updatedGroup);
      return HttpResponse.json(updatedGroup);
    }
  ),

  http.delete<{ id: string }>("/api/groups/:id", async ({ params }) => {
    const { id } = params;
    const deletedGroup = await db.get(KEY_GROUPS, id);
    if (!deletedGroup) {
      return new HttpResponse(null, { status: 404 });
    }
    await db.delete(KEY_GROUPS, id);
    return HttpResponse.json(deletedGroup);
  }),

  http.post<{ groupId: string }, Item>(
    "/api/groups/:groupId/items",
    async ({ params, request }) => {
      const { groupId } = params;
      const newItem = await request.json();
      const group = await db.get(KEY_GROUPS, groupId);
      if (!group) {
        return new HttpResponse(null, { status: 404 });
      }
      group.items.push(newItem);
      await db.put(KEY_GROUPS, group);
      return HttpResponse.json(newItem, { status: 201 });
    }
  ),

  http.get<{ groupId: string }>(
    "/api/groups/:groupId/items",
    async ({ params }) => {
      const { groupId } = params;
      const group = await db.get(KEY_GROUPS, groupId);
      if (!group) {
        return new HttpResponse(null, { status: 404 });
      }
      return HttpResponse.json(group.items);
    }
  ),

  http.get<{ groupId: string; itemId: string }>(
    "/api/groups/:groupId/items/:itemId",
    async ({ params }) => {
      const { groupId, itemId } = params;
      const group = await db.get(KEY_GROUPS, groupId);
      if (!group) {
        return new HttpResponse(null, { status: 404 });
      }
      const item = group.items.find((item) => item.id === itemId);
      if (!item) {
        return new HttpResponse(null, { status: 404 });
      }
      return HttpResponse.json(item);
    }
  ),

  http.put<{ groupId: string; itemId: string }, Item>(
    "/api/groups/:groupId/items/:itemId",
    async ({ params, request }) => {
      const { groupId, itemId } = params;
      const updatedItem = await request.json();
      const group = await db.get(KEY_GROUPS, groupId);
      if (!group) {
        return new HttpResponse(null, { status: 404 });
      }
      const itemIndex = group.items.findIndex((item) => item.id === itemId);
      if (itemIndex === -1) {
        return new HttpResponse(null, { status: 404 });
      }
      group.items[itemIndex] = updatedItem;
      await db.put(KEY_GROUPS, group);
      return HttpResponse.json(updatedItem);
    }
  ),

  http.delete<{ groupId: string; itemId: string }>(
    "/api/groups/:groupId/items/:itemId",
    async ({ params }) => {
      const { groupId, itemId } = params;
      const group = await db.get(KEY_GROUPS, groupId);
      if (!group) {
        return new HttpResponse(null, { status: 404 });
      }
      const itemIndex = group.items.findIndex((item) => item.id === itemId);
      if (itemIndex === -1) {
        return new HttpResponse(null, { status: 404 });
      }
      const deletedItem = group.items.splice(itemIndex, 1)[0];
      await db.put(KEY_GROUPS, group);
      return HttpResponse.json(deletedItem);
    }
  ),
];
