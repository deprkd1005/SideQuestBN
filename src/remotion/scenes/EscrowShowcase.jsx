import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { PhoneFrame, BruneiPattern } from "../components/PhoneMockup";
import { AppInterface } from "../components/AppInterface";
import {
  FloatingParticles,
  GridBackground,
  SoftGradientOrb,
} from "../components/Effects";

const traditionalItems = [
  { icon: "🚫", text: "Direct Transfer Scams" },
  { icon: "🚫", text: "Ghosting" },
  { icon: "🚫", text: "Zero verification" },
];

const sideQuestItems = [
  { icon: "🛡️", text: "Secure Payment Holding" },
  { icon: "👤", text: "Verified profiles" },
  { icon: "🤝", text: "Escrow release" },
];

const checkpoints = [
  {
    icon: "🛡️",
    title: "Secure Escrow System",
    description: "Funds held safely in escrow until work is completed",
    accentColor: "#2563EB",
    triggerFrame: 120,
  },
  {
    icon: "👤",
    title: "Verified Users",
    description: "Every profile authenticated to ensure a trusted marketplace",
    accentColor: "#06B6D4",
    triggerFrame: 260,
  },
  {
    icon: "🔒",
    title: "Protected Payments",
    description: "Eliminating unpaid work and transaction risks",
    accentColor: "#10B981",
    triggerFrame: 400,
  },
  {
    icon: "⭐",
    title: "Built on Trust",
    description: "Transparent ratings and reviews create complete accountability",
    accentColor: "#F59E0B",
    triggerFrame: 540,
  },
];

const voiceover =
  "With secure payment holding, verified identities, transparent reviews, and protected transactions, SideQuest.BN reduces scams, ghosting, and unpaid work — protecting both clients and freelancers.";

export const EscrowShowcase = ({ duration = 1050 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = duration / 1050;
  const totalDuration = duration;

  const sceneOpacity = interpolate(
    frame,
    [0, 20, totalDuration - 30, totalDuration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const headerSlide = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 80, mass: 0.8 },
  });

  const cardsOpacity = interpolate(frame, [30 * scale, 60 * scale], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cardsSlide = spring({
    frame: Math.max(0, frame - 25 * scale),
    fps,
    config: { damping: 16, stiffness: 70, mass: 0.9 },
  });

  const paymentPhaseFrame = Math.max(0, frame * (1050 / duration) - 60);

  const phoneRotateY = Math.sin(frame * 0.007) * 4;
  const phoneRotateX = Math.cos(frame * 0.005) * 2;

  const captionOpacity = interpolate(frame, [15 * scale, 40 * scale], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#FAFBFE",
        opacity: sceneOpacity,
        overflow: "hidden",
      }}
    >
      <GridBackground opacity={0.025} color="37, 99, 235" />

      <SoftGradientOrb color="#2563EB" size={450} x={5} y={15} />
      <SoftGradientOrb color="#10B981" size={380} x={75} y={65} />

      <FloatingParticles count={12} color="rgba(37, 99, 235, 0.06)" />

      <BruneiPattern opacity={0.02} />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          padding: "50px 70px",
          gap: 50,
        }}
      >
        {/* LEFT: Content */}
        <div
          style={{
            flex: 1.2,
            display: "flex",
            flexDirection: "column",
            paddingTop: 20,
          }}
        >
          {/* Header */}
          <div
            style={{
              opacity: interpolate(headerSlide, [0, 1], [0, 1]),
              transform: `translateX(${interpolate(headerSlide, [0, 1], [-50, 0])}px)`,
              marginBottom: 28,
            }}
          >
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "#2563EB",
                marginBottom: 12,
                fontFamily:
                  "'SF Pro Display', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              }}
            >
              Security & Trust
            </div>
            <div
              style={{
                fontSize: 48,
                fontWeight: 950,
                color: "#1A1A2E",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                fontFamily:
                  "'SF Pro Display', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              }}
            >
              Escrow Protection.
            </div>
          </div>

          {/* Comparison cards */}
          <div
            style={{
              display: "flex",
              gap: 16,
              marginBottom: 28,
              opacity: cardsOpacity,
              transform: `translateY(${interpolate(cardsSlide, [0, 1], [30, 0])}px)`,
            }}
          >
            {/* Traditional Deal card */}
            <div
              style={{
                flex: 1,
                background: "#FEF2F2",
                borderRadius: 16,
                padding: "20px 22px",
                borderLeft: "4px solid #EF4444",
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.03)",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "#EF4444",
                  marginBottom: 14,
                  fontFamily:
                    "'SF Pro Display', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                }}
              >
                Traditional Deal
              </div>
              {traditionalItems.map((item, i) => {
                const itemOpacity = interpolate(
                  frame,
                  [(50 + i * 15) * scale, (65 + i * 15) * scale],
                  [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 10,
                      opacity: itemOpacity,
                      fontSize: 14,
                      fontWeight: 500,
                      color: "#991B1B",
                      fontFamily:
                        "'SF Pro Text', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                );
              })}
            </div>

            {/* SideQuest Secured card */}
            <div
              style={{
                flex: 1,
                background: "#F0FDF4",
                borderRadius: 16,
                padding: "20px 22px",
                borderLeft: "4px solid #10B981",
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.03)",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "#10B981",
                  marginBottom: 14,
                  fontFamily:
                    "'SF Pro Display', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                }}
              >
                SideQuest Secured
              </div>
              {sideQuestItems.map((item, i) => {
                const itemOpacity = interpolate(
                  frame,
                  [(60 + i * 15) * scale, (75 + i * 15) * scale],
                  [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 10,
                      opacity: itemOpacity,
                      fontSize: 14,
                      fontWeight: 500,
                      color: "#065F46",
                      fontFamily:
                        "'SF Pro Text', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Verification checkpoints */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {checkpoints.map((cp, i) => {
              const triggerFrame = cp.triggerFrame * scale;
              const cpSpring = spring({
                frame: Math.max(0, frame - triggerFrame),
                fps,
                config: { damping: 14, stiffness: 90, mass: 0.7 },
              });

              const cpOpacity = frame >= triggerFrame ? cpSpring : 0;
              const cpSlide = interpolate(cpSpring, [0, 1], [40, 0]);

              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    background: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    borderRadius: 14,
                    padding: "14px 20px",
                    borderLeft: `3px solid ${cp.accentColor}`,
                    boxShadow:
                      "0 2px 12px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.03)",
                    opacity: cpOpacity,
                    transform: `translateX(${cpSlide}px)`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 24,
                      width: 40,
                      height: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: `${cp.accentColor}10`,
                      borderRadius: 10,
                      flexShrink: 0,
                    }}
                  >
                    {cp.icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#1A1A2E",
                        marginBottom: 2,
                        fontFamily:
                          "'SF Pro Display', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                      }}
                    >
                      {cp.title}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 400,
                        color: "#6B7280",
                        fontFamily:
                          "'SF Pro Text', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                      }}
                    >
                      {cp.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Phone mockup */}
        <div
          style={{
            flex: 0.8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <PhoneFrame
            scale={0.82}
            rotateY={phoneRotateY}
            rotateX={phoneRotateX}
            translateZ={0}
            shadowColor="rgba(37, 99, 235, 0.12)"
          >
            <AppInterface phase="payment" subFrame={paymentPhaseFrame} />
          </PhoneFrame>
        </div>
      </div>

      {/* Voiceover caption */}
      <div
        style={{
          position: "absolute",
          bottom: 45,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: captionOpacity,
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            padding: "14px 36px",
            borderRadius: 100,
            fontSize: 15,
            fontWeight: 500,
            color: "#1A1A2E",
            maxWidth: 720,
            textAlign: "center",
            lineHeight: 1.5,
            boxShadow:
              "0 2px 20px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.04)",
            fontFamily:
              "'SF Pro Text', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          {voiceover}
        </div>
      </div>
    </AbsoluteFill>
  );
};
