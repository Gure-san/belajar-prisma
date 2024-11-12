import { NextRequest, NextResponse } from "next/server";

export function middlewareBasicAuth(
  request: NextRequest,
  response: NextResponse
) {
  const reqHeader = request.headers;
  const credensial = reqHeader.get("Authorization");

  if (!credensial) {
    const resHeader = new Headers({
      "WWW-Authenticate": 'Basic realm="user_pages"',
    });

    return NextResponse.json(
      { error: "Tidak dikenali!" },
      {
        status: 401,
        statusText: "Unauthorized",
        headers: resHeader,
      }
    );
  }

  console.dir(credensial);
}
