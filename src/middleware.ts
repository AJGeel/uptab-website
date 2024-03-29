import { NextRequest, NextResponse } from "next/server";

const allowedOrigins = [
  "chrome-extension://djfbncgipfgbmidgjacfcignnobfjdec",
  "moz-extension://4879cca2-726a-4087-ad6b-41dc66f2afd1",
];

const corsOptions = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Uptab-Api-Key",
};

export const middleware = (request: NextRequest) => {
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
  matcher: "/api/:path*",
};
