import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "たねAI - 会議のタネ、AIがまく";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #fafaf9 0%, #e7e5e4 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 120, marginBottom: 20 }}>🍏</div>
        <div
          style={{
            fontSize: 72,
            fontWeight: "bold",
            color: "#292524",
            marginBottom: 16,
          }}
        >
          たねAI
        </div>
        <div
          style={{
            fontSize: 36,
            color: "#10b981",
            marginBottom: 32,
          }}
        >
          会議のタネ、AIがまく
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#78716c",
          }}
        >
          準備8割、会議2割
        </div>
      </div>
    ),
    { ...size }
  );
}
