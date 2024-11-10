import { http, HttpResponse, PathParams } from 'msw';
import { v4 as uuidv4 } from 'uuid';

import type { Group } from '@/entities/group/model/types';
import type { Item } from '@/entities/item/model/types';
import { db } from '@/mocks/db/groupsDB';
import { withStatus } from '@/mocks/withStatus';
import { KEY_GROUPS } from '@/shared/config/constants';
import { getISODateString } from '@/shared/lib/utcDate';

function isGroupItemParams(
  params: PathParams,
): params is { groupId: string; itemId?: string } {
  return 'groupId' in params;
}

export const itemHandlers = [
  // Create Item in Group
  http.post(
    '/api/groups/:groupId/items',
    withStatus(async ({ params, request }) => {
      try {
        if (!isGroupItemParams(params)) {
          return HttpResponse.json(
            { error: 'Invalid group ID' },
            { status: 400 },
          );
        }
        const { groupId } = params;
        const newItem = (await request.json()) as Omit<
          Item,
          'id' | 'createdAt'
        >;
        const group = await db.get(KEY_GROUPS, groupId);
        if (!group) {
          return HttpResponse.json(
            { error: 'Group not found' },
            { status: 404 },
          );
        }
        const itemWithId: Item = {
          ...newItem,
          id: uuidv4(),
          createdAt: getISODateString(),
        };
        group.items.push(itemWithId);
        await db.put(KEY_GROUPS, group);
        return HttpResponse.json(itemWithId, { status: 200 });
      } catch (error) {
        console.error('Failed to create item:', error);
        return HttpResponse.json(
          { error: 'Failed to create item' },
          { status: 500 },
        );
      }
    }),
  ),

  // Get All Items in Group
  http.get(
    '/api/groups/:groupId/items',
    withStatus(async ({ params }) => {
      try {
        if (!isGroupItemParams(params)) {
          return HttpResponse.json(
            { error: 'Invalid group ID' },
            { status: 400 },
          );
        }
        const { groupId } = params;
        const group = await db.get(KEY_GROUPS, groupId);
        if (!group) {
          return HttpResponse.json(
            { error: 'Group not found' },
            { status: 404 },
          );
        }
        return HttpResponse.json(group.items, { status: 200 });
      } catch (error) {
        console.error('Failed to fetch items:', error);
        return HttpResponse.json(
          { error: 'Failed to fetch items' },
          { status: 500 },
        );
      }
    }),
  ),

  // Get Item by ID in Group
  http.get(
    '/api/groups/:groupId/items/:itemId',
    withStatus(async ({ params }) => {
      try {
        if (!isGroupItemParams(params) || !params.itemId) {
          return HttpResponse.json(
            { error: 'Invalid group or item ID' },
            { status: 400 },
          );
        }
        const { groupId, itemId } = params;
        const group = (await db.get(KEY_GROUPS, groupId)) as Group;
        if (!group) {
          return HttpResponse.json(
            { error: 'Group not found' },
            { status: 404 },
          );
        }
        const item = group.items.find((item) => item.id === itemId);
        if (!item) {
          return HttpResponse.json(
            { error: 'Item not found' },
            { status: 404 },
          );
        }
        return HttpResponse.json(item, { status: 200 });
      } catch (error) {
        console.error('Failed to fetch item:', error);
        return HttpResponse.json(
          { error: 'Failed to fetch item' },
          { status: 500 },
        );
      }
    }),
  ),

  // Update Item in Group
  http.put(
    '/api/groups/:groupId/items/:itemId',
    withStatus(async ({ params, request }) => {
      try {
        if (!isGroupItemParams(params) || !params.itemId) {
          return HttpResponse.json(
            { error: 'Invalid group or item ID' },
            { status: 400 },
          );
        }
        const { groupId, itemId } = params;
        const updatedItem = (await request.json()) as Item;
        const group = (await db.get(KEY_GROUPS, groupId)) as Group;
        if (!group) {
          return HttpResponse.json(
            { error: 'Group not found' },
            { status: 404 },
          );
        }
        const itemIndex = group.items.findIndex((item) => item.id === itemId);
        if (itemIndex === -1) {
          return HttpResponse.json(
            { error: 'Item not found' },
            { status: 404 },
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
        console.error('Failed to update item:', error);
        return HttpResponse.json(
          { error: 'Failed to update item' },
          { status: 500 },
        );
      }
    }),
  ),

  // Delete Item from Group
  http.delete(
    '/api/groups/:groupId/items/:itemId',
    withStatus(async ({ params }) => {
      try {
        if (!isGroupItemParams(params) || !params.itemId) {
          return HttpResponse.json(
            { error: 'Invalid group or item ID' },
            { status: 400 },
          );
        }
        const { groupId, itemId } = params;
        const group = (await db.get(KEY_GROUPS, groupId)) as Group;
        if (!group) {
          return HttpResponse.json(
            { error: 'Group not found' },
            { status: 404 },
          );
        }
        const itemIndex = group.items.findIndex((item) => item.id === itemId);
        if (itemIndex === -1) {
          return HttpResponse.json(
            { error: 'Item not found' },
            { status: 404 },
          );
        }
        const deletedItem = group.items.splice(itemIndex, 1)[0];
        await db.put(KEY_GROUPS, group);
        return HttpResponse.json(deletedItem, { status: 200 });
      } catch (error) {
        console.error('Failed to delete item:', error);
        return HttpResponse.json(
          { error: 'Failed to delete item' },
          { status: 500 },
        );
      }
    }),
  ),
];
