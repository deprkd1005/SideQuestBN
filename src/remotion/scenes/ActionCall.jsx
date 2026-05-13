import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { PhoneFrame, BruneiPattern } from "../components/PhoneMockup";
import { FloatingParticles } from "../components/Effects";

export const ActionCall = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 10, 290, 300], [0, 1, 1, 0]);
  const s = spring({ frame, fps, config: { damping: 15, stiffness: 80 } });

  return (
    <AbsoluteFill style={{ opacity, background: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <BruneiPattern opacity={0.15} />
      <FloatingParticles count={50} color="#00A682" />

      {/* Hyper-Energy Background Glow */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(circle, rgba(0, 166, 130, ${interpolate(frame % 30, [0, 30], [0.1, 0])}) 0%, transparent 70%)`,
      }} />

      <div style={{ transform: `scale(${interpolate(s, [0, 1], [0.5, 1])})`, textAlign: "center", zIndex: 30, marginBottom: 50 }}>
        <h1 style={{ 
          fontSize: 110, 
          fontWeight: 950, 
          color: "#111827",
          lineHeight: 0.9,
          letterSpacing: "-0.05em",
          marginBottom: 40,
          textShadow: "0 20px 60px rgba(0,0,0,0.1)",
        }}>
          SideQuest<span style={{ color: "#00A682" }}>.BN</span>
        </h1>
        
        <div style={{
          padding: "28px 80px",
          borderRadius: 100,
          background: "#111827",
          color: "white",
          fontSize: 32,
          fontWeight: 900,
          boxShadow: "0 40px 80px rgba(0,0,0,0.4)",
          display: "inline-block",
          transform: `scale(${interpolate(frame % 40, [0, 20, 40], [1, 1.1, 1])})`,
        }}>
          JOIN THE MOVEMENT 🚀
        </div>
      </div>

      <div style={{ transform: `scale(${interpolate(s, [0, 1], [0.2, 1])}) rotateZ(${frame * 0.2}deg)` }}>
        <PhoneFrame scale={1.2} rotateX={0} rotateY={0}>
           <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #00A682, #6366F1)" }} />
        </PhoneFrame>
      </div>

      {/* Final Branding */}
      <div style={{ position: "absolute", bottom: 60, fontSize: 24, fontWeight: 900, color: "#9CA3AF", letterSpacing: "1em", opacity: 0.5 }}>
        WAWASAN 2035
      </div>
    </AbsoluteFill>
  );
};
