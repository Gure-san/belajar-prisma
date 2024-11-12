import { RouteHas } from "next/dist/lib/load-custom-routes";
import { match } from "path-to-regexp";
import { NextResponse, NextRequest, MiddlewareConfig } from "next/server";

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

  /** Function operasi middleware */
  handler?: () => Promise<
    (request: NextRequest, response: NextResponse) => NextResponse | void
  >;
} & MiddlewareMatcher;

// Digunakan untuk mengatur eksekusi operasi middleware tertentu
// dan eksekusi function `middleware`.
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
    handler: async () => () => NextResponse.next(),
  },
];

// Mendaftarkan pola url dalam bentuk collection, menggunakan `config` object.
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
  const response = NextResponse.next();

  // Menjalankan operasi middleware yang sesuai
  const middleware = await getMatchedMiddleware(reqURL);

  if (middleware && middleware.handler) {
    const operation = await middleware.handler();

    if (!operation) {
      console.warn(
        `Handler module operation '${middleware.name}' is not found!`
      );

      return;
    }

    console.log(`Running '${middleware.name}' operation...`);

    const operationResponse = await operation(request, response);

    if (operationResponse) return operationResponse;
  }

  return response;
}
