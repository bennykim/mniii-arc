import { http, HttpResponse } from "msw";

import {
  createSSEStream,
  getHistoryData,
  getStatus,
  updateStatus,
} from "@/mocks/db/historyDB";
import { withStatus } from "@/mocks/withStatus";
import {
  DEFAULT_INTERVAL,
  DEFAULT_LIMIT,
  DIRECTION_NEXT,
  PARAM_CURSOR,
  PARAM_DIRECTION,
  PARAM_INTERVAL,
  PARAM_LIMIT,
  PARAM_REALTIME,
  STATUS_OFF,
  STATUS_ON,
} from "@/shared/config/constants";

import type { Direction } from "@/entities/timeline/api/base";

export const historyHandlers = [
  http.get(
    "/api/history",
    withStatus(async ({ request }) => {
      try {
        const url = new URL(request.url);
        const cursor = url.searchParams.get(PARAM_CURSOR);
        const limit = parseInt(
          url.searchParams.get(PARAM_LIMIT) || DEFAULT_LIMIT.toString(),
          10
        );
        const direction = (url.searchParams.get(PARAM_DIRECTION) ||
          DIRECTION_NEXT) as Direction;

        const { data, nextCursor, prevCursor } = await getHistoryData(
          cursor,
          limit,
          direction
        );
        return HttpResponse.json(
          { data, nextCursor, prevCursor },
          { status: 200 }
        );
      } catch (error) {
        console.error("Failed to fetch history:", error);
        return HttpResponse.json(
          { error: "Failed to fetch history" },
          { status: 500 }
        );
      }
    })
  ),

  http.put(
    "/api/status",
    withStatus(async ({ request }) => {
      try {
        const url = new URL(request.url);
        const realtime = url.searchParams.get(PARAM_REALTIME) as
          | typeof STATUS_ON
          | typeof STATUS_OFF;
        const interval = parseInt(
          url.searchParams.get(PARAM_INTERVAL) || DEFAULT_INTERVAL.toString(),
          10
        );

        if (realtime !== STATUS_ON && realtime !== STATUS_OFF) {
          return HttpResponse.json(
            { error: "Invalid realtime value" },
            { status: 400 }
          );
        }

        await updateStatus(realtime, interval);
        return HttpResponse.json({ success: true }, { status: 200 });
      } catch (error) {
        console.error("Failed to update status:", error);
        return HttpResponse.json(
          { error: "Failed to update status" },
          { status: 500 }
        );
      }
    }, false)
  ),

  http.get(
    "/api/status",
    withStatus(async () => {
      try {
        const status = await getStatus();
        return HttpResponse.json(status, { status: 200 });
      } catch (error) {
        console.error("Failed to fetch status:", error);
        return HttpResponse.json(
          { error: "Failed to fetch status" },
          { status: 500 }
        );
      }
    }, false)
  ),

  http.get("/api/sse", async () => {
    const stream = createSSEStream();

    return new HttpResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }),
];
