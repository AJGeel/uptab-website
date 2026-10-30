import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";
import sharp from "sharp";

import { getCatalogue } from "@/features/backgrounds/api/get-catalogue";
import { findSignaturePhoto } from "@/features/home/signature-photo";

export const alt = "UpTab: open a tab, land somewhere lovely";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const LOGO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#25B1FF"/><stop offset="1" stop-color="#1088CA"/></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#g)"/><rect x="0.5" y="0.5" width="31" height="31" rx="7.5" fill="none" stroke="#fff" stroke-opacity="0.25"/><path d="M7.5 14.5L10.5 11.5L13.5 14.5M18.5 14.5L21.5 11.5L24.5 14.5" stroke-width="2.6" stroke="#fff" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.5 19.5Q16 23 19.5 19.5" stroke-width="2.2" stroke="#fff" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="8.5" cy="18.5" r="1.8" fill="#fff" fill-opacity="0.35"/><circle cx="23.5" cy="18.5" r="1.8" fill="#fff" fill-opacity="0.35"/></svg>`;

const readFont = (file: string) => readFile(path.join(process.cwd(), "src/assets/fonts", file));

const OgImage = async () => {
  const { images } = await getCatalogue();
  const photoPath = new URL(findSignaturePhoto(images).sources[0].url).pathname;
  // Satori can't read WebP, so the photo goes in as a JPEG
  const photo = await sharp(path.join(process.cwd(), "public", photoPath))
    .resize(size.width, size.height, { fit: "cover" })
    .jpeg({ quality: 82 })
    .toBuffer();
  const [extraBold, medium] = await Promise.all([readFont("Figtree-ExtraBold.ttf"), readFont("Figtree-Medium.ttf")]);

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", position: "relative", fontFamily: "Figtree" }}>
        { }
        <img src={`data:image/jpeg;base64,${photo.toString("base64")}`} width={size.width} height={size.height} alt="" style={{ position: "absolute", top: 0, left: 0 }} />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: size.width,
            height: size.height,
            backgroundImage: "linear-gradient(90deg, rgba(233,243,247,0.96) 0%, rgba(233,243,247,0.9) 45%, rgba(233,243,247,0) 85%)",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", width: 960 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            { }
            <img src={`data:image/svg+xml;base64,${Buffer.from(LOGO).toString("base64")}`} width={56} height={56} alt="" />
            <div style={{ fontSize: 40, fontWeight: 800, color: "#020E2C", letterSpacing: -1 }}>UpTab</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "flex", flexWrap: "wrap", fontSize: 80, fontWeight: 800, lineHeight: 1, letterSpacing: -3, color: "#020E2C" }}>
              Open a tab. Land somewhere&nbsp;<span style={{ color: "#138CD0" }}>lovely</span>
            </div>
            <div style={{ fontSize: 30, fontWeight: 500, color: "#16222F" }}>A new tab extension for Chrome and Firefox.</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Figtree", data: extraBold, weight: 800, style: "normal" },
        { name: "Figtree", data: medium, weight: 500, style: "normal" },
      ],
    }
  );
};

export default OgImage;
