import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middlewareBasicAuth(request: NextRequest) {
  const credensial = request.headers.get("Authorization");

  if (!credensial) {
    const nextHeader = new Headers({
      "WWW-Authenticate": "Basic",
    });

    const resBody = { error: "Tidak dikenali!" };

    return NextResponse.json(resBody, {
      status: 401,
      statusText: "Unauthorized",
      headers: nextHeader,
    });
  }

  return NextResponse.next();
}
