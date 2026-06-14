import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { FloatingParticles, SoftGradientOrb } from "../components/Effects";

export const ActionCall = ({ duration = 300 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = duration / 300;
  const totalDuration = duration;

  const sceneOpacity = interpolate(
    frame,
    [0, 15, totalDuration - 30, totalDuration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Logo spring animation
  const logoSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 60, mass: 1 },
  });

  const logoScale = interpolate(logoSpring, [0, 1], [0.5, 1]);

  const logoBlur = interpolate(frame, [0, 25 * scale], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Tagline 1 (frame 60)
  const tag1Spring = spring({
    frame: Math.max(0, frame - 60 * scale),
    fps,
    config: { damping: 16, stiffness: 80, mass: 0.8 },
  });

  const tag1Opacity = interpolate(tag1Spring, [0, 1], [0, 1]);
  const tag1SlideY = interpolate(tag1Spring, [0, 1], [25, 0]);

  // Tagline 2 (frame 120)
  const tag2Spring = spring({
    frame: Math.max(0, frame - 120 * scale),
    fps,
    config: { damping: 16, stiffness: 80, mass: 0.8 },
  });

  const tag2Opacity = interpolate(tag2Spring, [0, 1], [0, 1]);
  const tag2SlideY = interpolate(tag2Spring, [0, 1], [20, 0]);

  // CTA button (frame 150)
  const ctaSpring = spring({
    frame: Math.max(0, frame - 150 * scale),
    fps,
    config: { damping: 12, stiffness: 70, mass: 0.9 },
  });

  const ctaOpacity = interpolate(ctaSpring, [0, 1], [0, 1]);
  const ctaScale = interpolate(ctaSpring, [0, 1], [0.8, 1]);

  // CTA subtle pulse
  const ctaPulse = frame >= 150 * scale ? 1 + Math.sin((frame - 150 * scale) * 0.06) * 0.03 : 1;

  // Bottom text
  const bottomSpring = spring({
    frame: Math.max(0, frame - 180 * scale),
    fps,
    config: { damping: 18, stiffness: 80, mass: 0.8 },
  });

  const bottomOpacity = interpolate(bottomSpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: "#FAFBFE",
        opacity: sceneOpacity,
        overflow: "hidden",
      }}
    >
      {/* Ambient orbs */}
      <SoftGradientOrb color="#2563EB" size={600} x={20} y={30} />
      <SoftGradientOrb color="#06B6D4" size={450} x={75} y={55} />
      <SoftGradientOrb color="#10B981" size={350} x={50} y={80} />

      <FloatingParticles count={20} color="rgba(37, 99, 235, 0.06)" />

      {/* Centered content */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Logo */}
        <div
          style={{
            transform: `scale(${logoScale})`,
            filter: `blur(${logoBlur}px)`,
            marginBottom: 30,
          }}
        >
          <span
            style={{
              fontSize: 130,
              fontWeight: 950,
              fontFamily:
                "'SF Pro Display', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              letterSpacing: "-0.03em",
              textShadow: "0 4px 30px rgba(37, 99, 235, 0.12)",
            }}
          >
            <span style={{ color: "#1A1A2E" }}>SideQuest</span>
            <span style={{ color: "#10B981" }}>.BN</span>
          </span>
        </div>

        {/* Tagline 1 */}
        <div
          style={{
            fontSize: 30,
            fontWeight: 700,
            color: "#6B7280",
            textAlign: "center",
            opacity: tag1Opacity,
            transform: `translateY(${tag1SlideY}px)`,
            marginBottom: 14,
            fontFamily:
              "'SF Pro Display', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            letterSpacing: "-0.01em",
          }}
        >
          Empowering Brunei’s Digital Community.
        </div>

        {/* Tagline 2 */}
        <div
          style={{
            fontSize: 24,
            fontWeight: 600,
            color: "#9CA3AF",
            textAlign: "center",
            opacity: tag2Opacity,
            transform: `translateY(${tag2SlideY}px)`,
            marginBottom: 50,
            fontFamily:
              "'SF Pro Display', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          The Future of Trusted Digital Opportunities.
        </div>

        {/* CTA Button */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `scale(${ctaScale * ctaPulse})`,
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #2563EB, #06B6D4)",
              color: "white",
              fontSize: 22,
              fontWeight: 800,
              padding: "20px 56px",
              borderRadius: 100,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              boxShadow:
                "0 8px 30px rgba(37, 99, 235, 0.25), 0 2px 8px rgba(37, 99, 235, 0.15)",
              fontFamily:
                "'SF Pro Display', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            }}
          >
            JOIN THE QUEST 🚀
          </div>
        </div>

        {/* Bottom supporting text */}
        <div
          style={{
            position: "absolute",
            bottom: 55,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: bottomOpacity,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "#9CA3AF",
              fontFamily:
                "'SF Pro Display', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            }}
          >
            Supporting Wawasan 2035
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
