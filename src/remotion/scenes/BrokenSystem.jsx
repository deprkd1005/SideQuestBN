import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { FloatingParticles, GridBackground, SoftGradientOrb } from "../components/Effects";

const ScatteredCard = ({ frame, fps, children, x, y, rotation, appearFrame, style = {} }) => {
  const cardSpring = spring({
    frame: frame - appearFrame,
    fps,
    config: { damping: 16, stiffness: 60 },
  });

  const cardOp = interpolate(cardSpring, [0, 1], [0, 1]);
  const cardScale = interpolate(cardSpring, [0, 1], [0.7, 1]);

  // Gentle floating drift
  const driftX = Math.sin(frame * 0.012 + appearFrame) * 6;
  const driftY = Math.cos(frame * 0.01 + appearFrame * 0.7) * 8;
  const driftRot = Math.sin(frame * 0.008 + appearFrame * 1.3) * 1.5;

  if (frame < appearFrame) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `rotate(${rotation + driftRot}deg) scale(${cardScale}) translate(${driftX}px, ${driftY}px)`,
        opacity: cardOp,
        zIndex: 5,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const cardBase = {
  padding: "16px 20px",
  background: "#FFFFFF",
  borderRadius: 16,
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)",
  fontFamily: "'Inter', sans-serif",
};

const cardWarning = {
  ...cardBase,
  background: "#FEF2F2",
  border: "1px solid rgba(239, 68, 68, 0.1)",
};

export const BrokenSystem = ({ duration = 750 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = duration / 750;

  // === CENTER TEXT ANIMATIONS ===
  // "No Protection." — frame 60-300
  const text1Op = interpolate(frame, [60 * scale, 80 * scale, 280 * scale, 300 * scale], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const text1Scale = interpolate(frame, [60 * scale, 80 * scale], [0.95, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const text1Pulse = 1 + Math.sin(frame * 0.04) * 0.015;

  // "No Verification." — frame 250-500
  const text2Op = interpolate(frame, [250 * scale, 270 * scale, 480 * scale, 500 * scale], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const text2Scale = interpolate(frame, [250 * scale, 270 * scale], [0.95, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const text2Pulse = 1 + Math.sin(frame * 0.04 + 1) * 0.015;

  // "No Security." — frame 450-700
  const text3Op = interpolate(frame, [450 * scale, 470 * scale, 680 * scale, 700 * scale], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const text3Scale = interpolate(frame, [450 * scale, 470 * scale], [0.95, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const text3Pulse = 1 + Math.sin(frame * 0.04 + 2) * 0.015;

  // === VOICEOVER CAPTION ===
  const captionOp = interpolate(frame, [15 * scale, 40 * scale, duration - 70 * scale, duration - 30 * scale], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // === SCENE FADE IN/OUT ===
  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [duration - 30, duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sceneFade = fadeIn * fadeOut;

  const centerTextStyle = {
    fontSize: 90,
    fontWeight: 950,
    color: "#1A1A2E",
    letterSpacing: "-0.04em",
    lineHeight: 1.1,
    textAlign: "center",
    position: "absolute",
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
      {/* Subtle chaotic background wash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 30% 30%, rgba(239, 68, 68, 0.04) 0%, transparent 50%), radial-gradient(ellipse at 70% 70%, rgba(249, 115, 22, 0.03) 0%, transparent 50%)",
          zIndex: 0,
        }}
      />

      <GridBackground opacity={0.03} color="100, 100, 120" />

      {/* Ambient orbs for depth */}
      <SoftGradientOrb color="rgba(239, 68, 68, 0.05)" size={500} x="20%" y="30%" />
      <SoftGradientOrb color="rgba(249, 115, 22, 0.04)" size={450} x="80%" y="70%" />
      <SoftGradientOrb color="rgba(107, 114, 128, 0.04)" size={350} x="50%" y="50%" />

      <FloatingParticles count={12} color="rgba(107, 114, 128, 0.2)" />

      {/* === SCATTERED CARDS === */}

      {/* Card 1: Instagram DM mockup */}
      <ScatteredCard frame={frame} fps={fps} x={80} y={80} rotation={-3} appearFrame={Math.floor(30 * scale)}>
        <div style={{ ...cardBase, width: 300 }}>
          <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 600, marginBottom: 8 }}>
            📸 Instagram • Direct Message
          </div>
          <div style={{ fontSize: 14, fontWeight: 500, color: "#1A1A2E", lineHeight: 1.5 }}>
            "Sis, can you do my cake for free? I'll promote you on my story 🙏"
          </div>
          <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 8 }}>
            Seen 2h ago
          </div>
        </div>
      </ScatteredCard>

      {/* Card 2: WhatsApp message */}
      <ScatteredCard frame={frame} fps={fps} x={1400} y={120} rotation={4} appearFrame={Math.floor(80 * scale)}>
        <div style={{ ...cardBase, width: 320 }}>
          <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 600, marginBottom: 8 }}>
            💬 WhatsApp • Client
          </div>
          <div style={{ fontSize: 14, fontWeight: 500, color: "#1A1A2E", lineHeight: 1.5 }}>
            "I'll pay you later, trust me bro 👍"
          </div>
          <div style={{ fontSize: 12, color: "#EF4444", fontWeight: 600, marginTop: 8 }}>
            ⚠️ No payment received
          </div>
        </div>
      </ScatteredCard>

      {/* Card 3: Failed bank transfer receipt */}
      <ScatteredCard frame={frame} fps={fps} x={120} y={450} rotation={2} appearFrame={Math.floor(150 * scale)}>
        <div style={{ ...cardWarning, width: 280 }}>
          <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 600, marginBottom: 8 }}>
            🏦 Bank Transfer
          </div>
          <div style={{ fontSize: 14, fontWeight: 500, color: "#1A1A2E", marginBottom: 8 }}>
            BND 350.00 → Freelancer
          </div>
          <div
            style={{
              display: "inline-block",
              padding: "4px 12px",
              background: "#EF4444",
              color: "#FFFFFF",
              fontSize: 13,
              fontWeight: 900,
              borderRadius: 6,
              letterSpacing: "0.05em",
              transform: "rotate(-5deg)",
            }}
          >
            FAILED
          </div>
        </div>
      </ScatteredCard>

      {/* Card 4: Notification badge cluster */}
      <ScatteredCard frame={frame} fps={fps} x={1480} y={500} rotation={-2} appearFrame={Math.floor(200 * scale)}>
        <div style={{ ...cardBase, width: 220, textAlign: "center" }}>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 10 }}>
            {[12, 5, 99].map((n, i) => (
              <div
                key={i}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "#EF4444",
                  color: "#FFFFFF",
                  fontSize: 14,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(239, 68, 68, 0.25)",
                }}
              >
                {n}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 600 }}>
            Unread complaints
          </div>
        </div>
      </ScatteredCard>

      {/* Card 5: Payment Pending with spinner */}
      <ScatteredCard frame={frame} fps={fps} x={100} y={750} rotation={-4} appearFrame={Math.floor(260 * scale)}>
        <div style={{ ...cardBase, width: 260, display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "3px solid #E5E7EB",
              borderTopColor: "#F59E0B",
              transform: `rotate(${frame * 4}deg)`,
            }}
          />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A2E" }}>
              Payment Pending
            </div>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>
              Waiting for 14 days...
            </div>
          </div>
        </div>
      </ScatteredCard>

      {/* Card 6: Rating complaint */}
      <ScatteredCard frame={frame} fps={fps} x={1350} y={750} rotation={3} appearFrame={Math.floor(330 * scale)}>
        <div style={{ ...cardWarning, width: 300 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: 14, color: "#F59E0B" }}>★</span>
            <span style={{ fontSize: 14, color: "#D1D5DB" }}>★ ★ ★ ★</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#EF4444", marginLeft: 6 }}>
              1.0
            </span>
          </div>
          <div style={{ fontSize: 14, fontWeight: 500, color: "#1A1A2E", lineHeight: 1.4 }}>
            "Never showed up. Wasted my whole weekend waiting."
          </div>
          <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 6 }}>
            — Anonymous buyer
          </div>
        </div>
      </ScatteredCard>

      {/* Card 7: Scam alert */}
      <ScatteredCard frame={frame} fps={fps} x={700} y={60} rotation={1} appearFrame={Math.floor(100 * scale)}>
        <div style={{ ...cardWarning, width: 240 }}>
          <div style={{ fontSize: 28, textAlign: "center", marginBottom: 6 }}>🚨</div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#EF4444",
              textAlign: "center",
            }}
          >
            Scam Alert Reported
          </div>
          <div style={{ fontSize: 11, color: "#6B7280", textAlign: "center", marginTop: 4 }}>
            3 victims this week
          </div>
        </div>
      </ScatteredCard>

      {/* Card 8: Ghosted message */}
      <ScatteredCard frame={frame} fps={fps} x={750} y={800} rotation={-2} appearFrame={Math.floor(400 * scale)}>
        <div style={{ ...cardBase, width: 280 }}>
          <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 600, marginBottom: 8 }}>
            💬 WhatsApp • Group
          </div>
          <div style={{ fontSize: 14, fontWeight: 500, color: "#1A1A2E", lineHeight: 1.4 }}>
            "Anyone know this seller? She took deposit and blocked everyone 😤"
          </div>
          <div style={{ fontSize: 11, color: "#EF4444", fontWeight: 600, marginTop: 6 }}>
            6 people affected
          </div>
        </div>
      </ScatteredCard>

      {/* Card 9: No refund */}
      <ScatteredCard frame={frame} fps={fps} x={1100} y={400} rotation={-3} appearFrame={Math.floor(180 * scale)}>
        <div style={{ ...cardBase, width: 230 }}>
          <div style={{ fontSize: 24, textAlign: "center", marginBottom: 6 }}>💸</div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#1A1A2E",
              textAlign: "center",
            }}
          >
            No Refund Policy
          </div>
          <div style={{ fontSize: 11, color: "#6B7280", textAlign: "center", marginTop: 4 }}>
            Direct transfer — no protection
          </div>
        </div>
      </ScatteredCard>

      {/* === CENTER TEXT === */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 15,
          pointerEvents: "none",
        }}
      >
        {/* "No Protection." */}
        <div
          style={{
            ...centerTextStyle,
            opacity: text1Op,
            transform: `scale(${text1Scale * text1Pulse})`,
          }}
        >
          No Protection.
        </div>

        {/* "No Verification." */}
        <div
          style={{
            ...centerTextStyle,
            opacity: text2Op,
            transform: `scale(${text2Scale * text2Pulse})`,
          }}
        >
          No Verification.
        </div>

        {/* "No Security." */}
        <div
          style={{
            ...centerTextStyle,
            opacity: text3Op,
            transform: `scale(${text3Scale * text3Pulse})`,
          }}
        >
          No Security.
        </div>
      </div>

      {/* BOTTOM: Voiceover Caption Bar */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          width: 1200,
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
          "People rely on risky transactions and unprotected conversations. One mistake can lead to scams, unpaid work, and lost trust."
        </div>
      </div>
    </AbsoluteFill>
  );
};
