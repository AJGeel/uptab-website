import { NextRequest } from "next/server";

export const checkAuth = (request: NextRequest) =>
  process.env.NODE_ENV === "development" ||
  request.nextUrl.searchParams.get("UPTAB_API_KEY") ===
    process.env.UPTAB_API_KEY;
