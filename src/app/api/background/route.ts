import { NextResponse } from "next/server";

import { findTheme, getBackgroundImage } from "@/services/background";

export const GET = async () => {
  try {
    // Todo: Add catch-all route for themes.
    const theme = findTheme("abstract");
    const backgroundImage = await getBackgroundImage(theme);

    return new NextResponse(backgroundImage, { status: 200, statusText: "OK" });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal server error", {
      status: 500,
    });
  }
};
