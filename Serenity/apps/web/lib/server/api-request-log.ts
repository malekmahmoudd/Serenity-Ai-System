/** Server-only: set API_DEBUG=1 when running `next dev` to log each auth route hit */
export function logApiRequest(handlerName: string, req: Request) {
  if (process.env.API_DEBUG !== "1") return;
  const url = new URL(req.url);
  console.info(`[api] ${handlerName} ${req.method} ${url.pathname}`);
}
