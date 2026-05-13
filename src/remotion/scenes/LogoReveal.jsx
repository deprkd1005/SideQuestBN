import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { BruneiPattern } from "../components/PhoneMockup";

export const LogoReveal = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 5, 55, 60], [0, 1, 1, 0]);
  const s = spring({ frame, fps, config: { damping: 10, stiffness: 180 } });

  /* ── Impact Zoom ── */
  const scale = interpolate(s, [0, 1], [4, 1]);
  const blur = interpolate(s, [0, 0.5, 1], [20, 10, 0]);

  return (
    <AbsoluteFill style={{ opacity, background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <BruneiPattern opacity={0.1} />
      
      {/* Light Burst */}
      <div style={{
        position: "absolute",
        width: 1000,
        height: 1000,
        background: "radial-gradient(circle, rgba(0, 166, 130, 0.2) 0%, transparent 70%)",
        transform: `scale(${interpolate(frame, [0, 60], [0, 2])})`,
        opacity: interpolate(frame, [0, 10, 60], [0, 1, 0]),
      }} />

      <div style={{ 
        transform: `scale(${scale})`, 
        filter: `blur(${blur}px)`,
        textAlign: "center" 
      }}>
        <div style={{
          fontSize: 120,
          fontWeight: 950,
          fontFamily: "'Outfit', sans-serif",
          color: "#111827",
          letterSpacing: "-0.05em",
          textShadow: "0 20px 40px rgba(0,0,0,0.1)",
        }}>
          SideQuest<span style={{ color: "#00A682" }}>.BN</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
