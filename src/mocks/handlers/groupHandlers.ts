import { http, HttpResponse, PathParams } from "msw";
import { v4 as uuidv4 } from "uuid";

import { db } from "@/mocks/db/groupsDB";
import { withStatus } from "@/mocks/withStatus";
import { KEY_GROUPS } from "@/shared/config/constants";

import type { Group } from "@/entities/group/model/types";

function isGroupParams(params: PathParams): params is { id: string } {
  return "id" in params;
}

export const groupHandlers = [
  // Create Group
  http.post(
    "/api/groups",
    withStatus(async ({ request }) => {
      try {
        const newGroup = (await request.json()) as Omit<Group, "id">;
        const groupWithId: Group = {
          ...newGroup,
          id: uuidv4(),
          items: [],
          createdAt: new Date().toISOString(),
        };
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
];
