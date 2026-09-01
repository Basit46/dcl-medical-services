import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { clinic } from "@/lib/clinic";

export const alt = `${clinic.name} — ${clinic.tagline}. A family clinic in Ketu and Iju Ishaga, Lagos.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const asset = (file: string) => readFile(join(process.cwd(), "assets", file));

export default async function OpenGraphImage() {
  const [display, body, bodyBold] = await Promise.all([
    asset("frank-ruhl-libre-500.ttf"),
    asset("atkinson-hyperlegible-400.ttf"),
    asset("atkinson-hyperlegible-700.ttf"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#1F3D33",
          color: "#FAFBF7",
          fontFamily: "Atkinson",
          padding: "68px 76px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 56, height: 2, background: "#D9A441" }} />
          <div
            style={{
              fontSize: 22,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#D9A441",
            }}
          >
            {clinic.legalName}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              fontFamily: "FrankRuhl",
              fontSize: 92,
              lineHeight: 1.04,
              letterSpacing: "-0.02em",
            }}
          >
            {clinic.name}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              fontSize: 40,
              color: "#D9A441",
              letterSpacing: "0.03em",
            }}
          >
            <div style={{ width: 4, height: 46, background: "#D9A441" }} />
            {clinic.tagline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 32,
            borderTop: "1px solid rgba(255,255,255,0.22)",
            paddingTop: 30,
            fontSize: 26,
            color: "#CBD8CC",
          }}
        >
          <div style={{ display: "flex" }}>Ketu · Iju Ishaga, Lagos</div>
          <div style={{ display: "flex", fontFamily: "AtkinsonBold", color: "#FAFBF7" }}>
            {clinic.hmoCount} HMO plans accepted
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "FrankRuhl", data: display, style: "normal", weight: 500 },
        { name: "Atkinson", data: body, style: "normal", weight: 400 },
        { name: "AtkinsonBold", data: bodyBold, style: "normal", weight: 700 },
      ],
    },
  );
}
