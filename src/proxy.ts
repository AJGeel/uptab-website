import { NextRequest, NextResponse } from "next/server";

import { ADMIN_BASE, hasBasicPassword, isAdminKey } from "@/features/feedback/utils/admin-auth";

const allowedOrigins = [
  "chrome-extension://djfbncgipfgbmidgjacfcignnobfjdec",
  "moz-extension://4879cca2-726a-4087-ad6b-41dc66f2afd1",
];

const corsOptions = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Uptab-Api-Key",
};

/*
 * A wrong key falls through to the page, which 404s, so the URL doesn't
 * reveal that anything lives there. The right key still needs the password.
 */
const guardAdmin = (request: NextRequest) => {
  const [key] = request.nextUrl.pathname.slice(ADMIN_BASE.length + 1).split("/");

  if (!isAdminKey(key)) {
    return NextResponse.next();
  }

  if (!hasBasicPassword(request.headers.get("authorization"), process.env.FEEDBACK_ADMIN_PASSWORD)) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Complaints department"', "Cache-Control": "no-store" },
    });
  }

  const response = NextResponse.next();

  response.headers.set("Cache-Control", "private, no-store");

  return response;
};

export const proxy = (request: NextRequest) => {
  if (request.nextUrl.pathname.startsWith(`${ADMIN_BASE}/`)) {
    return guardAdmin(request);
  }

  // Check the origin from the request
  const origin = request.headers.get("origin") ?? "";
  const isAllowedOrigin = allowedOrigins.includes(origin);

  // Handle preflighted requests
  const isPreflight = request.method === "OPTIONS";

  if (isPreflight) {
    const headers = isAllowedOrigin
      ? { "Access-Control-Allow-Origin": origin, ...corsOptions }
      : corsOptions;

    return NextResponse.json({}, { headers });
  }

  // Handle simple requests
  const response = NextResponse.next();

  if (isAllowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
};

export const config = {
  // Next reads this statically, so the admin path can't come from ADMIN_BASE
  matcher: ["/api/:path*", "/the-complaints-department/:path*"],
};
