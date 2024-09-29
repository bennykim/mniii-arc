import { delay, HttpResponseResolver } from "msw";

export function withStatus(
  resolver: HttpResponseResolver,
  applyDelay: boolean = true
): HttpResponseResolver {
  return async (request) => {
    if (applyDelay) {
      await delay(1000);
    }
    return resolver(request);
  };
}
