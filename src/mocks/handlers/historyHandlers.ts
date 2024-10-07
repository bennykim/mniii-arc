import { http, HttpResponse } from "msw";

import { getHistoryData, getStatus, updateStatus } from "@/mocks/db/historyDB";
import { withStatus } from "@/mocks/withStatus";

export const historyHandlers = [
  http.get(
    "/api/history",
    withStatus(async ({ request }) => {
      try {
        const url = new URL(request.url);
        const cursor = url.searchParams.get("cursor");
        const limit = parseInt(url.searchParams.get("limit") || "30", 10);
        const direction = (url.searchParams.get("direction") || "next") as
          | "next"
          | "prev";

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
        const realtime = url.searchParams.get("realtime") as "on" | "off";
        const interval = parseInt(
          url.searchParams.get("interval") || "30000",
          10
        );

        if (realtime !== "on" && realtime !== "off") {
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
];
