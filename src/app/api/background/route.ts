import { NextRequest, NextResponse } from "next/server";

import { checkAuth } from "@/services/api/checkAuth";
import { findTheme, getBackgroundImage } from "@/services/background";

export const GET = async (request: NextRequest) => {
  const isAuthenticated = checkAuth(request);

  if (!isAuthenticated) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const urlParams = request.nextUrl.searchParams.get("theme") ?? undefined;
    const theme = findTheme(urlParams);
    const backgroundImage = await getBackgroundImage(theme);

    return new NextResponse(backgroundImage, {
      status: 200,
      statusText: "OK",
    });
  } catch (error) {
    return new NextResponse("Internal server error", {
      status: 500,
    });
  }
};
