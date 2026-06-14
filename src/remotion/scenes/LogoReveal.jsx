import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { BruneiPattern } from "../components/PhoneMockup";
import { GridBackground, FloatingParticles, SoftGradientOrb } from "../components/Effects";

export const LogoReveal = ({ duration = 750 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = duration / 750;

  // === SCENE FADE IN/OUT ===
  const fadeIn = interpolate(frame, [0, 15 * scale], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [duration - 15 * scale, duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sceneFade = fadeIn * fadeOut;

  // === LOGO SPRING ANIMATION ===
  const logoSpring = spring({
    frame: frame - 20 * scale,
    fps,
    config: { damping: 12, stiffness: 80 },
  });
  const logoScale = interpolate(logoSpring, [0, 1], [0.6, 1]);
  const logoBlur = interpolate(logoSpring, [0, 1], [15, 0]);

  // === GLASSMORPHISM CARD SPRING ===
  const cardSpring = spring({
    frame: frame - 10 * scale,
    fps,
    config: { damping: 14, stiffness: 60 },
  });
  const cardOp = interpolate(cardSpring, [0, 1], [0, 1]);
  const cardScale = interpolate(cardSpring, [0, 1], [0.9, 1]);

  // === TAGLINE SPRING ===
  const tagSpring = spring({
    frame: frame - 90 * scale,
    fps,
    config: { damping: 15, stiffness: 80 },
  });
  const tagOp = interpolate(tagSpring, [0, 1], [0, 1]);
  const tagY = interpolate(tagSpring, [0, 1], [25, 0]);

  // === LIGHT BURST ===
  const burstScale = interpolate(frame, [15 * scale, duration], [0.4, 2.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const burstOp = interpolate(frame, [15 * scale, 40 * scale, 500 * scale, 700 * scale], [0, 0.35, 0.25, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // === VOICEOVER CAPTION ===
  const captionOp = interpolate(frame, [30 * scale, 60 * scale, 680 * scale, 720 * scale], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        opacity: sceneFade,
        background: "#FAFBFE",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        fontFamily: "'Inter', 'Outfit', sans-serif",
      }}
    >
      {/* Very subtle Brunei pattern */}
      <BruneiPattern opacity={0.04} />

      {/* Very subtle grid */}
      <GridBackground opacity={0.03} color="37, 99, 235" />

      {/* Floating particles — soft blue */}
      <FloatingParticles count={20} color="rgba(37, 99, 235, 0.25)" />

      {/* Ambient gradient orbs */}
      <SoftGradientOrb color="rgba(37, 99, 235, 0.1)" size={600} x="30%" y="35%" />
      <SoftGradientOrb color="rgba(6, 182, 212, 0.08)" size={500} x="70%" y="55%" />
      <SoftGradientOrb color="rgba(16, 185, 129, 0.06)" size={400} x="50%" y="75%" />

      {/* Light Burst — soft blue radial */}
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${burstScale})`,
          background:
            "radial-gradient(circle, rgba(37, 99, 235, 0.12) 0%, rgba(6, 182, 212, 0.05) 40%, transparent 70%)",
          opacity: burstOp,
          filter: "blur(30px)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* === GLASSMORPHISM CARD === */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: cardOp,
          transform: `scale(${cardScale})`,
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.6)",
            backdropFilter: "blur(25px)",
            WebkitBackdropFilter: "blur(25px)",
            borderRadius: 32,
            padding: "80px 120px",
            boxShadow:
              "0 8px 32px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
            border: "1px solid rgba(0, 0, 0, 0.04)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Logo Text */}
          <div
            style={{
              transform: `scale(${logoScale})`,
              filter: `blur(${logoBlur}px)`,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 120,
                fontWeight: 950,
                color: "#1A1A2E",
                letterSpacing: "-0.04em",
                lineHeight: 1,
                textShadow: "0 0 30px rgba(37, 99, 235, 0.15)",
              }}
            >
              SideQuest
              <span
                style={{
                  color: "#10B981",
                }}
              >
                .BN
              </span>
            </div>
          </div>

          {/* Tagline */}
          <div
            style={{
              marginTop: 24,
              fontSize: 28,
              fontWeight: 600,
              color: "#6B7280",
              opacity: tagOp,
              transform: `translateY(${tagY}px)`,
              maxWidth: 700,
              lineHeight: 1.5,
              letterSpacing: "-0.01em",
              textAlign: "center",
            }}
          >
            A smarter and safer way for Bruneians to connect, work, and grow.
          </div>
        </div>
      </div>

      {/* BOTTOM: Voiceover Caption Bar */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          left: "50%",
          transform: "translateX(-50%)",
          width: 1100,
          textAlign: "center",
          zIndex: 20,
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 500,
            color: "#6B7280",
            lineHeight: 1.6,
            fontStyle: "italic",
            opacity: captionOp,
          }}
        >
          "Introducing SideQuest.BN — Brunei’s trusted digital ecosystem for opportunities, services, and secure transactions."
        </div>
      </div>
    </AbsoluteFill>
  );
};
