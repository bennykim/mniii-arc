import { delay, HttpResponseResolver } from "msw";

import { MOCK_DELAY } from "@/shared/config/constants";

export function withStatus(
  resolver: HttpResponseResolver,
  applyDelay: boolean = true
): HttpResponseResolver {
  return async (request) => {
    if (applyDelay) {
      await delay(MOCK_DELAY);
    }
    return resolver(request);
  };
}
