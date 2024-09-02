import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/posts", () => {
    return HttpResponse.text("Success", {
      status: 200,
    });
  }),
];
