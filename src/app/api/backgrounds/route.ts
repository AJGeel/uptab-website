import { NextRequest, NextResponse } from "next/server";

import { checkAuth } from "@/services/api/checkAuth";
import { getAllBackgrounds } from "@/services/background";

export const GET = async (request: NextRequest) => {
  const isAuthenticated = checkAuth(request);

  if (!isAuthenticated) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const backgrounds = await getAllBackgrounds();
    return NextResponse.json(backgrounds);
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 });
  }
};
