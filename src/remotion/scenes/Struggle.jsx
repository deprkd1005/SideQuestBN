import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { BruneiPattern } from "../components/PhoneMockup";
import { FloatingParticles, GridBackground, SoftGradientOrb } from "../components/Effects";

export const Struggle = ({ duration = 1050 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = duration / 1050;

  // === WORD ANIMATIONS (Left Side) ===
  // Word 1: "Scams." — appears frame 30, fades frame 250
  const word1Op = interpolate(frame, [30 * scale, 50 * scale, 230 * scale, 250 * scale], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const word1Y = interpolate(frame, [30 * scale, 50 * scale], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Word 2: "Ghosting." — appears frame 200, fades frame 450
  const word2Op = interpolate(frame, [200 * scale, 220 * scale, 430 * scale, 450 * scale], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const word2Y = interpolate(frame, [200 * scale, 220 * scale], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Word 3: "Unsecured Payments." — appears frame 400, fades frame 650
  const word3Op = interpolate(frame, [400 * scale, 420 * scale, 630 * scale, 650 * scale], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const word3Y = interpolate(frame, [400 * scale, 420 * scale], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Word 4: "Lost Opportunities." — appears frame 600, fades frame 850
  const word4Op = interpolate(frame, [600 * scale, 620 * scale, 830 * scale, 850 * scale], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const word4Y = interpolate(frame, [600 * scale, 620 * scale], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // === CARD SPRING ANIMATIONS (Right Side) ===
  const card1Spring = spring({ frame: frame - 60 * scale, fps, config: { damping: 14, stiffness: 80 } });
  const card2Spring = spring({ frame: frame - 280 * scale, fps, config: { damping: 14, stiffness: 80 } });
  const card3Spring = spring({ frame: frame - 500 * scale, fps, config: { damping: 14, stiffness: 80 } });

  // Floating bob animations for cards
  const card1Bob = Math.sin(frame * 0.025) * 8;
  const card2Bob = Math.cos(frame * 0.02) * 10;
  const card3Bob = Math.sin(frame * 0.03) * 7;

  // Card entrance Y offsets
  const card1Y = interpolate(card1Spring, [0, 1], [60, 0]) + card1Bob;
  const card2Y = interpolate(card2Spring, [0, 1], [60, 0]) + card2Bob;
  const card3Y = interpolate(card3Spring, [0, 1], [60, 0]) + card3Bob;

  // Card opacities
  const card1Op = interpolate(card1Spring, [0, 1], [0, 1]);
  const card2Op = interpolate(card2Spring, [0, 1], [0, 1]);
  const card3Op = interpolate(card3Spring, [0, 1], [0, 1]);

  // === VOICEOVER CAPTION ===
  const captionOp = interpolate(frame, [20 * scale, 50 * scale, duration - 100 * scale, duration - 50 * scale], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // === SCENE FADE OUT ===
  const sceneFade = interpolate(frame, [duration - 30, duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const wordStyle = {
    fontSize: 100,
    fontWeight: 950,
    color: "#EF4444",
    letterSpacing: "-0.04em",
    lineHeight: 1.1,
    textShadow: "0 0 20px rgba(239, 68, 68, 0.2)",
  };

  return (
    <AbsoluteFill
      style={{
        opacity: sceneFade,
        background: "#FAFBFE",
        overflow: "hidden",
        fontFamily: "'Inter', 'Outfit', sans-serif",
      }}
    >
      {/* Subtle red/orange radial gradient center glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(239, 68, 68, 0.06) 0%, rgba(249, 115, 22, 0.03) 30%, transparent 65%)",
          zIndex: 0,
        }}
      />

      {/* Very subtle grid */}
      <GridBackground opacity={0.04} color="239, 68, 68" />

      {/* Soft ambient orbs */}
      <SoftGradientOrb color="rgba(239, 68, 68, 0.06)" size={600} x="30%" y="40%" />
      <SoftGradientOrb color="rgba(249, 115, 22, 0.05)" size={500} x="70%" y="60%" />

      {/* Floating particles — very subtle */}
      <FloatingParticles count={15} color="rgba(239, 68, 68, 0.3)" />

      {/* Main Content */}
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          padding: "100px 120px 140px 120px",
          boxSizing: "border-box",
          zIndex: 10,
          position: "relative",
          alignItems: "center",
        }}
      >
        {/* LEFT SIDE: Sequential Warning Words */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 24,
            justifyContent: "center",
          }}
        >
          <div
            style={{
              ...wordStyle,
              opacity: word1Op,
              transform: `translateY(${word1Y}px)`,
            }}
          >
            Scams.
          </div>
          <div
            style={{
              ...wordStyle,
              opacity: word2Op,
              transform: `translateY(${word2Y}px)`,
            }}
          >
            Ghosting.
          </div>
          <div
            style={{
              ...wordStyle,
              opacity: word3Op,
              transform: `translateY(${word3Y}px)`,
              fontSize: 80,
            }}
          >
            Unsecured
            <br />
            Payments.
          </div>
          <div
            style={{
              ...wordStyle,
              opacity: word4Op,
              transform: `translateY(${word4Y}px)`,
              fontSize: 80,
            }}
          >
            Lost
            <br />
            Opportunities.
          </div>
        </div>

        {/* RIGHT SIDE: Warning Cards */}
        <div
          style={{
            flex: 1.2,
            display: "flex",
            flexDirection: "column",
            gap: 20,
            position: "relative",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          {/* Card 1: WhatsApp chat showing ghosting */}
          {frame > 60 && (
            <div
              style={{
                width: 480,
                padding: 24,
                background: "#FFFFFF",
                borderRadius: 20,
                borderLeft: "4px solid rgba(239, 68, 68, 0.5)",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)",
                transform: `translateY(${card1Y}px)`,
                opacity: card1Op,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 12,
                  fontSize: 12,
                  color: "#6B7280",
                  fontWeight: 600,
                }}
              >
                <span>💬 WhatsApp • Freelancer Chat</span>
                <span>3 days ago</span>
              </div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: "#1A1A2E",
                  lineHeight: 1.5,
                }}
              >
                "Here is the completed design. When will the payment be transferred?"
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#EF4444",
                  marginTop: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span>✓✓ Read • Seen</span>
                <span style={{ fontSize: 6, color: "#D1D5DB" }}>●</span>
                <span style={{ fontWeight: 500, color: "#9CA3AF" }}>No reply</span>
              </div>
            </div>
          )}

          {/* Card 2: Payment delay excuse */}
          {frame > 280 && (
            <div
              style={{
                width: 460,
                padding: 24,
                background: "#FFFFFF",
                borderRadius: 20,
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)",
                transform: `translateY(${card2Y}px) translateX(-30px)`,
                opacity: card2Op,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 12,
                  fontSize: 12,
                  color: "#6B7280",
                  fontWeight: 600,
                }}
              >
                <span>💬 Telegram • Client Request</span>
                <span>Yesterday</span>
              </div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: "#1A1A2E",
                  lineHeight: 1.5,
                }}
              >
                "Can you bake and deliver the cupcakes first? I'll transfer BND 180 next month, trust me."
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#EF4444",
                  marginTop: 10,
                }}
              >
                ⚠️ High risk of payment default
              </div>
            </div>
          )}

          {/* Card 3: Transaction unsecured warning */}
          {frame > 500 && (
            <div
              style={{
                width: 430,
                padding: 20,
                background: "#FEF2F2",
                borderRadius: 20,
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)",
                transform: `translateY(${card3Y}px) translateX(-70px)`,
                opacity: card3Op,
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div style={{ fontSize: 36 }}>❌</div>
              <div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: "#1A1A2E",
                  }}
                >
                  Transaction Unsecured
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#6B7280",
                    marginTop: 4,
                    lineHeight: 1.4,
                  }}
                >
                  Direct transfer with zero protection.
                  <br />
                  Scam warning flagged.
                </div>
              </div>
            </div>
          )}
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
          "In today’s digital world, many talented Bruneians still struggle to find trusted opportunities… while customers fear scams, fake sellers, and disappearing payments."
        </div>
      </div>
    </AbsoluteFill>
  );
};
