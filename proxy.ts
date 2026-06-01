import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  console.log(`${req.method} ${req.nextUrl.pathname}`);
  return NextResponse.next();
}

export const config = {
  // Log all requests except Next internals and static assets
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
