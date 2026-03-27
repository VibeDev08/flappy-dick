import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Flappy Dick — the browser arcade game";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #0e1a2b 0%, #0a2a1a 100%)",
          fontFamily: "Impact, Arial Black, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Sky gradient backdrop */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, #4a8fa8 0%, #6cb8cc 40%, #3d7a5e 70%, #2d5e44 100%)",
            display: "flex",
          }}
        />

        {/* Decorative buildings silhouette */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "160px",
            background: "#1e3a2a",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            left: "40px",
            width: "80px",
            height: "120px",
            background: "#152b1e",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            left: "160px",
            width: "60px",
            height: "90px",
            background: "#152b1e",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            right: "80px",
            width: "90px",
            height: "140px",
            background: "#152b1e",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            right: "210px",
            width: "60px",
            height: "100px",
            background: "#152b1e",
            display: "flex",
          }}
        />

        {/* Content card */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          {/* Title */}
          <div
            style={{
              fontSize: "130px",
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "-2px",
              textTransform: "uppercase",
              lineHeight: 1,
              textShadow: "6px 6px 0 #e85d04, 10px 10px 0 rgba(0,0,0,0.4)",
              display: "flex",
            }}
          >
            FLAPPY DICK
          </div>

          {/* Divider */}
          <div
            style={{
              width: "500px",
              height: "5px",
              background: "#e85d04",
              borderRadius: "3px",
              display: "flex",
            }}
          />

          {/* Tagline */}
          <div
            style={{
              fontSize: "40px",
              color: "#ffffffcc",
              letterSpacing: "6px",
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            HOW FAR CAN YOU GO?
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
