import { servePhoto } from "@/features/backgrounds/api/serve-photo";

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) => servePhoto(request, (await params).path);
