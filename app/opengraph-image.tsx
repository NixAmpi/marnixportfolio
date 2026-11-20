import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const alt = `${profile.name} — Portfolio`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          color: "white",
          background:
            "radial-gradient(ellipse 80% 70% at 85% 0%, rgba(124,92,255,0.45), transparent 70%), linear-gradient(180deg, #05060f, #0b0c24)",
        }}
      >
        <div style={{ fontSize: 26, letterSpacing: 8, color: "#b3a1ff", textTransform: "uppercase" }}>Portfolio</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 84, fontWeight: 800, lineHeight: 1.05, marginTop: 20 }}>
          <span>{profile.nameLines[0]}</span>
          <span
            style={{
              backgroundImage: "linear-gradient(100deg, #9b82ff, #5b95ff, #22d3ee)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {profile.nameLines[1]}
          </span>
        </div>
        <div style={{ fontSize: 36, color: "#22d3ee", marginTop: 28 }}>{profile.role}</div>
        <div style={{ fontSize: 26, color: "#9aa3bf", marginTop: 12 }}>{profile.location}</div>
      </div>
    ),
    size,
  );
}
