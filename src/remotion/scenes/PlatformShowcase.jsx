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

const PHASES = [
  {
    label: "The Marketplace",
    heading: "Freelance Opportunities.",
    subtitle:
      "Browse local gigs, discover talented freelancers, and find the perfect match for your next project — all within Brunei's growing digital community.",
    accentColor: "#2563EB",
    appPhase: "home",
    shadowColor: "rgba(37, 99, 235, 0.15)",
  },
  {
    label: "Seamless Hiring",
    heading: "Trusted Transactions.",
    subtitle:
      "Post your quest in seconds — describe what you need, set your budget, and let verified local talent come to you with competitive offers.",
    accentColor: "#06B6D4",
    appPhase: "posting",
    shadowColor: "rgba(6, 182, 212, 0.15)",
  },
  {
    label: "Smart Matching",
    heading: "Digital Services.",
    subtitle:
      "Our intelligent matching system connects you with verified talent, ensuring every quest finds the right freelancer for the job.",
    accentColor: "#10B981",
    appPhase: "success",
    shadowColor: "rgba(16, 185, 129, 0.15)",
  },
  {
    label: "Secure Wallet",
    heading: "Empowering Bruneians.",
    subtitle:
      "Escrow-protected payments ensure peace of mind — funds are held securely and released only when both parties are satisfied.",
    accentColor: "#F59E0B",
    appPhase: "payment",
    shadowColor: "rgba(245, 158, 11, 0.15)",
  },
];

const PHASE_DURATION = 260;

const voiceovers = [
  "Explore a vibrant marketplace of local freelance opportunities.",
  "Post your quest and connect with trusted professionals instantly.",
  "Smart matching pairs you with verified, skilled talent in Brunei.",
  "Secure escrow payments protect every transaction end-to-end.",
];

export const PlatformShowcase = ({ duration = 1050 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalDuration = duration;
  const phaseDuration = totalDuration / 4;

  const sceneOpacity = interpolate(
    frame,
    [0, 20, totalDuration - 30, totalDuration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const phaseIndex = Math.min(
    Math.floor(frame / phaseDuration),
    PHASES.length - 1
  );
  const phaseFrame = frame - phaseIndex * phaseDuration;
  const currentPhase = PHASES[phaseIndex];

  const textSlideX = spring({
    frame: phaseFrame,
    fps,
    config: { damping: 18, stiffness: 80, mass: 0.8 },
  });

  const textOpacity = interpolate(phaseFrame, [0, Math.min(20, phaseDuration * 0.1)], [0, 1], {
    extrapolateRight: "clamp",
  });

  const phaseTransitionOut =
    phaseFrame > phaseDuration - 20
      ? interpolate(
          phaseFrame,
          [phaseDuration - 20, phaseDuration],
          [1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        )
      : 1;

  const phoneRotateY = Math.sin(frame * 0.008) * 5;
  const phoneRotateX = Math.cos(frame * 0.006) * 3;

  const phoneScale = spring({
    frame: phaseFrame,
    fps,
    config: { damping: 15, stiffness: 60, mass: 1 },
  });

  // Map subFrame to original 260 frames so app animation speed looks consistent
  const subFrame = Math.min(phaseFrame * (260 / phaseDuration), 260);

  const currentVoiceover = voiceovers[phaseIndex];

  const captionOpacity = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: "clamp",
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
      <GridBackground opacity={0.03} color="37, 99, 235" />

      <SoftGradientOrb
        color={currentPhase.accentColor}
        size={500}
        x={-10}
        y={20}
      />
      <SoftGradientOrb color="#06B6D4" size={350} x={80} y={70} />

      <FloatingParticles count={15} color="rgba(37, 99, 235, 0.08)" />

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
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 80px",
          gap: 60,
        }}
      >
        {/* LEFT: Text content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            opacity: textOpacity * phaseTransitionOut,
            transform: `translateX(${interpolate(textSlideX, [0, 1], [-60, 0])}px)`,
          }}
        >
          {/* Phase label */}
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: currentPhase.accentColor,
              marginBottom: 16,
              fontFamily:
                "'SF Pro Display', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            }}
          >
            {currentPhase.label}
          </div>

          {/* Heading */}
          <div
            style={{
              fontSize: 56,
              fontWeight: 950,
              color: "#1A1A2E",
              lineHeight: 1.1,
              marginBottom: 20,
              fontFamily:
                "'SF Pro Display', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            {currentPhase.heading}
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 18,
              fontWeight: 400,
              color: "#6B7280",
              lineHeight: 1.7,
              maxWidth: 440,
              fontFamily:
                "'SF Pro Text', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            }}
          >
            {currentPhase.subtitle}
          </div>

          {/* Phase indicators */}
          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 40,
            }}
          >
            {PHASES.map((p, i) => (
              <div
                key={i}
                style={{
                  width: i === phaseIndex ? 40 : 10,
                  height: 10,
                  borderRadius: 5,
                  background:
                    i === phaseIndex ? currentPhase.accentColor : "#E5E7EB",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>

        {/* RIGHT: Phone mockup */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PhoneFrame
            scale={0.85 * interpolate(phoneScale, [0, 1], [0.9, 1])}
            rotateY={phoneRotateY}
            rotateX={phoneRotateX}
            translateZ={0}
            shadowColor={currentPhase.shadowColor}
          >
            <AppInterface phase={currentPhase.appPhase} subFrame={subFrame} />
          </PhoneFrame>
        </div>
      </div>

      {/* Voiceover caption */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
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
            fontSize: 16,
            fontWeight: 500,
            color: "#1A1A2E",
            maxWidth: 700,
            textAlign: "center",
            lineHeight: 1.5,
            boxShadow:
              "0 2px 20px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.04)",
            fontFamily:
              "'SF Pro Text', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          "More than just a freelance platform, SideQuest.BN is building a smarter and safer digital economy for Brunei."
        </div>
      </div>
    </AbsoluteFill>
  );
};
