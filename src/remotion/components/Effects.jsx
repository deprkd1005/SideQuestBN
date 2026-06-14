import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";

export const Shockwave = ({ startFrame, color = "#2563EB" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const voiceoverSrc = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"; // placeholder audio
  const relFrame = frame - startFrame;

  if (relFrame < 0 || relFrame > 40) return null;

  const scale = interpolate(relFrame, [0, 40], [0.2, 10], { extrapolateRight: "clamp" });
  const opacity = interpolate(relFrame, [0, 10, 40], [0, 0.8, 0], { extrapolateRight: "clamp" });

  return (
    <div style={{
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: `translate(-50%, -50%) scale(${scale})`,
      width: 100,
      height: 100,
      borderRadius: "50%",
      border: `1.5px solid ${color}60`,
      opacity,
      boxShadow: `0 0 15px ${color}40`,
      pointerEvents: "none",
      zIndex: 100,
    }} />
  );
};

export const FloatingParticles = ({ count = 30, color = "#2563EB" }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 1 }}>
      {Array.from({ length: count }).map((_, i) => {
        // Pseudo-random but deterministic placement
        const seedX = Math.sin(i * 123.456) * 1000;
        const seedY = Math.cos(i * 654.321) * 1000;
        const speed = 0.005 + (i % 5) * 0.003;

        const x = ((seedX + frame * Math.sin(i) * speed * 200) % 1920 + 1920) % 1920;
        const y = ((seedY - frame * speed * 150) % 1080 + 1080) % 1080;
        const s = ((i % 4) + 1) * 1.5;
        const op = 0.1 + 0.2 * Math.sin(frame * 0.05 + i);

        return (
          <div key={i} style={{
            position: "absolute",
            left: x,
            top: y,
            width: s,
            height: s,
            borderRadius: "50%",
            background: color,
            opacity: op,
            boxShadow: `0 0 6px ${color}30`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

export const GridBackground = ({ opacity = 0.06, color = "37, 99, 235" }) => {
  const frame = useCurrentFrame();
  const translateY = (frame * 0.4) % 40;
  return (
    <div style={{
      position: "absolute",
      inset: 0,
      opacity,
      zIndex: 0,
      pointerEvents: "none",
      overflow: "hidden"
    }}>
      <div style={{
        width: "200%",
        height: "200%",
        backgroundImage: `
          linear-gradient(rgba(${color}, 0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(${color}, 0.04) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
        transform: `translate(-25%, -25%) translateY(${translateY}px)`,
        maskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)"
      }} />
    </div>
  );
};

export const SoftGradientOrb = ({ color = "#2563EB", size = 400, x = "50%", y = "50%" }) => {
  return (
    <div style={{
      position: "absolute",
      left: x,
      top: y,
      width: size,
      height: size,
      transform: "translate(-50%, -50%)",
      background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
      filter: "blur(80px)",
      pointerEvents: "none",
      zIndex: 0,
    }} />
  );
};
export const Effects = () => (
  <>
    {/* Grid background */}
    <GridBackground opacity={0.06} />
    {/* Floating particles */}
    <FloatingParticles count={30} />
    {/* Soft gradient orb */}
    <SoftGradientOrb size={500} />
    {/* Optional shockwave could be added later */}
  </>
);
