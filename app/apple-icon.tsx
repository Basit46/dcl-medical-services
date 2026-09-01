import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const display = await readFile(
    join(process.cwd(), "assets", "frank-ruhl-libre-500.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          background: "#1F3D33",
          color: "#FAFBF7",
          fontFamily: "FrankRuhl",
        }}
      >
        <div style={{ fontSize: 68, letterSpacing: "-0.01em", lineHeight: 1 }}>DCL</div>
        <div style={{ width: 54, height: 4, background: "#D9A441" }} />
      </div>
    ),
    { ...size, fonts: [{ name: "FrankRuhl", data: display, style: "normal", weight: 500 }] },
  );
}
