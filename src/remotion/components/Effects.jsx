import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";

export const Shockwave = ({ startFrame, color = "#00A682" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relFrame = frame - startFrame;
  
  if (relFrame < 0 || relFrame > 30) return null;

  const scale = interpolate(relFrame, [0, 30], [0, 8], { extrapolateRight: "clamp" });
  const opacity = interpolate(relFrame, [0, 10, 30], [0, 0.5, 0], { extrapolateRight: "clamp" });

  return (
    <div style={{
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: `translate(-50%, -50%) scale(${scale})`,
      width: 100,
      height: 100,
      borderRadius: "50%",
      border: `4px solid ${color}`,
      opacity,
      boxShadow: `0 0 40px ${color}`,
      pointerEvents: "none",
      zIndex: 100,
    }} />
  );
};

export const FloatingParticles = ({ count = 20, color = "#00A682" }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: count }).map((_, i) => {
        const x = Math.sin(frame * 0.02 + i * 1.5) * 400 + 960;
        const y = Math.cos(frame * 0.01 + i * 2) * 300 + 540;
        const s = Math.sin(frame * 0.05 + i) * 2 + 3;
        return (
          <div key={i} style={{
            position: "absolute",
            left: x,
            top: y,
            width: s,
            height: s,
            borderRadius: "50%",
            background: color,
            opacity: 0.3,
            boxShadow: `0 0 10px ${color}`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};
