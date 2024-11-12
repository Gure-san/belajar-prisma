import { NextRequest, NextResponse } from "next/server";

export function middlewareBasicAuth(
  request: NextRequest,
  response: NextResponse
) {
  const header = request.headers;
  console.log("log from middleware basic auth!");

  return response;
}
