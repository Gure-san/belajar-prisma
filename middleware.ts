import { RouteHas } from "next/dist/lib/load-custom-routes";
import { match } from "path-to-regexp";
import { NextResponse as NextResponseAPI, MiddlewareConfig } from "next/server";
import type { NextRequest, NextResponse } from "next/server";

/** Didapatkan dari type `MiddlewareConfig` */
type MiddlewareMatcher = {
  locale?: false;
  has?: RouteHas[];
  missing?: RouteHas[];
  source: string;
};

type MiddlewareOperation = {
  /**
   * Nama operasi middleware.
   * Harus unik dan dapat digunakan untuk logging
   */
  name: string;

  /**
   * @todo opsi memberikan function biasa atau module
   * Function operasi middleware
   */
  handler?: () => Promise<
    (request: NextRequest) => NextResponse | Promise<NextResponse> | void
  >;
} & MiddlewareMatcher;

/**
 * Mendaftarkan pola url dalam bentuk collection
 * Digunakan untuk mengatur eksekusi operasi middleware tertentu
 * dan eksekusi function `middleware`.
 *
 * @todo multiple handler in one middlewareOperation (sub handler)
 */
const MIDDLEWARE_COLLECTION: MiddlewareOperation[] = [
  {
    name: "Page Authentication",
    source: "/",
    handler: async () =>
      import("@/middleware/basic-auth").then((mod) => mod.middlewareBasicAuth),
  },

  {
    name: "API Authentication",
    source: "/api",
  },
];

export const config = {
  regions: undefined,
  unstable_allowDynamic: undefined,
  matcher: MIDDLEWARE_COLLECTION.map(({ name, handler, ...matcher }) => ({
    ...matcher,
  })),
} satisfies MiddlewareConfig;

// Mencocokkan pola url request dengan middleware yang terdaftar.
async function getMatchedMiddleware(pathname: string) {
  if (!pathname) return;

  const middleware = MIDDLEWARE_COLLECTION.find((m) => {
    const matcher = match(m.source);
    const sourcePathname = matcher(pathname);

    if (!sourcePathname) return false;
    return m;
  });

  if (!middleware) return;

  return middleware;
}

export async function middleware(request: NextRequest) {
  const reqURL = request.nextUrl.pathname;
  const response = NextResponseAPI.next();

  // Menjalankan operasi middleware yang sesuai
  const middleware = await getMatchedMiddleware(reqURL);

  if (middleware && middleware.handler) {
    const operation = await middleware.handler();

    if (!operation) {
      console.error(
        `Handler module operation '${middleware.name}' is not found!`
      );

      return;
    }

    const operationResponse = await operation(request);

    if (operationResponse) return operationResponse;
  }

  return response;
}
