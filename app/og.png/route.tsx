import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

const ogImage = { width: 1200, height: 630 };

/**
 * Social preview card, generated as a static /og.png at build time.
 * (A route handler rather than opengraph-image.tsx so the exported file keeps
 * its .png extension and GitHub Pages serves it as image/png.)
 */
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#f6f4ef",
          color: "#181816",
        }}
      >
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 4, color: "#66625a" }}>
          PORTFOLIO
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 88, lineHeight: 1.05, letterSpacing: -2 }}>{siteConfig.name}</div>
          <div style={{ fontSize: 34, marginTop: 24, color: "#3b3934" }}>{siteConfig.tagline}</div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "2px solid #181816",
            paddingTop: 24,
            fontSize: 24,
            color: "#66625a",
          }}
        >
          <span>{siteConfig.location}</span>
          <span style={{ color: "#a3401c" }}>Code · Design · Audio</span>
        </div>
      </div>
    ),
    { width: ogImage.width, height: ogImage.height },
  );
}
