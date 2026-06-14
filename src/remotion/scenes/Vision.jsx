import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import {
  FloatingParticles,
  GridBackground,
  SoftGradientOrb,
} from "../components/Effects";
import { BruneiPattern } from "../components/PhoneMockup";

const networkNodes = [
  { label: "Students", x: 72, y: 22, color: "#2563EB", size: 50 },
  { label: "Photographers", x: 85, y: 48, color: "#06B6D4", size: 46 },
  { label: "SMEs", x: 68, y: 70, color: "#10B981", size: 52 },
  { label: "Designers", x: 90, y: 30, color: "#F59E0B", size: 44 },
  { label: "Tutors", x: 78, y: 58, color: "#8B5CF6", size: 42 },
];

const connections = [
  [0, 1],
  [1, 2],
  [0, 2],
  [0, 3],
  [1, 4],
  [2, 4],
  [3, 4],
];

const chartPoints = [
  { x: 0, y: 85 },
  { x: 15, y: 78 },
  { x: 30, y: 70 },
  { x: 45, y: 55 },
  { x: 60, y: 48 },
  { x: 75, y: 30 },
  { x: 90, y: 18 },
  { x: 100, y: 10 },
];

const voiceover =
  "This is more than an application. It’s a movement towards a stronger, safer, and more connected digital future for Brunei.";

export const Vision = ({ duration = 450 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = duration / 450;
  const totalDuration = duration;

  const sceneOpacity = interpolate(
    frame,
    [0, 15, totalDuration - 20, totalDuration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const headerSpring = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 80, mass: 0.8 },
  });

  const chartDraw = interpolate(frame, [30 * scale, 180 * scale], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pathData = chartPoints
    .map((p, i) => {
      const cmd = i === 0 ? "M" : "L";
      return `${cmd} ${p.x * 3.6 + 30} ${p.y * 2.2 + 20}`;
    })
    .join(" ");

  const totalPathLength = 850;

  const skylineOpacity = interpolate(frame, [60 * scale, 120 * scale], [0, 0.08], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const captionOpacity = interpolate(frame, [20 * scale, 50 * scale], [0, 1], {
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

      <SoftGradientOrb color="#2563EB" size={500} x={10} y={30} />
      <SoftGradientOrb color="#10B981" size={400} x={70} y={60} />
      <SoftGradientOrb color="#F59E0B" size={300} x={50} y={10} />

      <FloatingParticles count={18} color="rgba(37, 99, 235, 0.06)" />

      <BruneiPattern opacity={0.015} />

      {/* Brunei skyline silhouette at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 180,
          opacity: skylineOpacity,
        }}
      >
        <svg
          viewBox="0 0 1920 180"
          style={{ width: "100%", height: "100%" }}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="skylineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
          </defs>
          <path
            d="M0,180 L0,140 L60,140 L60,100 L80,100 L80,80 L100,60 L120,80 L120,100 L140,100 L140,120 L200,120 L200,90 L220,90 L230,50 L240,90 L260,90 L260,110 L320,110 L320,70 L340,70 L350,40 L360,70 L380,70 L380,100 L440,100 L440,130 L520,130 L520,90 L540,90 L550,60 L560,90 L580,90 L580,110 L660,110 L660,80 L680,80 L690,45 L700,80 L720,80 L720,100 L800,100 L800,120 L880,120 L880,85 L900,85 L910,55 L920,85 L940,85 L940,105 L1020,105 L1020,130 L1100,130 L1100,95 L1120,95 L1130,65 L1140,95 L1160,95 L1160,115 L1240,115 L1240,75 L1260,75 L1270,40 L1280,75 L1300,75 L1300,100 L1380,100 L1380,125 L1460,125 L1460,90 L1480,90 L1490,58 L1500,90 L1520,90 L1520,110 L1600,110 L1600,130 L1700,130 L1700,100 L1720,100 L1730,70 L1740,100 L1760,100 L1760,120 L1840,120 L1840,140 L1920,140 L1920,180 Z"
            fill="url(#skylineGrad)"
          />
        </svg>
      </div>

      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: interpolate(headerSpring, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(headerSpring, [0, 1], [-30, 0])}px)`,
        }}
      >
        <div
          style={{
            fontSize: 16,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "#F59E0B",
            marginBottom: 14,
            fontFamily:
              "'SF Pro Display', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          Wawasan 2035
        </div>
        <div
          style={{
            fontSize: 44,
            fontWeight: 950,
            color: "#1A1A2E",
            lineHeight: 1.15,
            maxWidth: 800,
            margin: "0 auto",
            letterSpacing: "-0.02em",
            fontFamily:
              "'SF Pro Display', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          Empowering the Next Generation
          <br />
          of Bruneian Talent
        </div>
      </div>

      {/* Main content area */}
      <div
        style={{
          position: "absolute",
          top: 200,
          left: 70,
          right: 70,
          bottom: 120,
          display: "flex",
          gap: 50,
          alignItems: "center",
        }}
      >
        {/* LEFT: Growth chart */}
        <div
          style={{
            flex: 1,
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderRadius: 24,
            padding: 36,
            boxShadow:
              "0 4px 30px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.04)",
          }}
        >
          {/* Chart header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "#6B7280",
                fontFamily:
                  "'SF Pro Display', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              }}
            >
              Brunei Gig Economy
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#10B981",
                background: "#F0FDF4",
                padding: "6px 14px",
                borderRadius: 100,
                fontFamily:
                  "'SF Pro Display', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              }}
            >
              +245% YOY
            </div>
          </div>

          {/* SVG Chart */}
          <svg
            viewBox="0 0 400 220"
            style={{ width: "100%", height: 200 }}
          >
            <defs>
              <linearGradient
                id="chartLineGrad"
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="50%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
              <linearGradient
                id="chartFillGrad"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1="30"
                y1={20 + i * 47}
                x2="390"
                y2={20 + i * 47}
                stroke="rgba(0, 0, 0, 0.04)"
                strokeWidth="1"
              />
            ))}

            {/* Fill area */}
            <path
              d={`${pathData} L 390 208 L 30 208 Z`}
              fill="url(#chartFillGrad)"
              opacity={chartDraw}
            />

            {/* Chart line */}
            <path
              d={pathData}
              fill="none"
              stroke="url(#chartLineGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={totalPathLength}
              strokeDashoffset={totalPathLength * (1 - chartDraw)}
            />

            {/* Animated dots */}
            {chartPoints.map((p, i) => {
              const dotSpring = spring({
                frame: Math.max(
                  0,
                  frame - (30 + i * 18) * scale
                ),
                fps,
                config: { damping: 12, stiffness: 100, mass: 0.5 },
              });
              return (
                <circle
                  key={i}
                  cx={p.x * 3.6 + 30}
                  cy={p.y * 2.2 + 20}
                  r={4 * dotSpring}
                  fill="white"
                  stroke="#2563EB"
                  strokeWidth="2"
                />
              );
            })}
          </svg>
        </div>

        {/* RIGHT: Network nodes */}
        <div
          style={{
            flex: 1,
            position: "relative",
            height: 350,
          }}
        >
          {/* Connection lines */}
          <svg
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          >
            {connections.map(([fromIdx, toIdx], i) => {
              const from = networkNodes[fromIdx];
              const to = networkNodes[toIdx];
              const lineOpacity = interpolate(
                frame,
                [(60 + i * 12) * scale, (90 + i * 12) * scale],
                [0, 0.2],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              const fromX = `${(from.x - 65) * 4}%`;
              const fromY = `${from.y}%`;
              const toX = `${(to.x - 65) * 4}%`;
              const toY = `${to.y}%`;
              return (
                <line
                  key={i}
                  x1={fromX}
                  y1={fromY}
                  x2={toX}
                  y2={toY}
                  stroke="#6B7280"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  opacity={lineOpacity}
                />
              );
            })}
          </svg>

          {/* Nodes */}
          {networkNodes.map((node, i) => {
            const nodeSpring = spring({
              frame: Math.max(0, frame - (40 + i * 20) * scale),
              fps,
              config: { damping: 14, stiffness: 80, mass: 0.7 },
            });

            const pulse =
              1 + Math.sin(frame * 0.04 + i * 1.2) * 0.06;

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${(node.x - 65) * 4}%`,
                  top: `${node.y}%`,
                  transform: `translate(-50%, -50%) scale(${nodeSpring * pulse})`,
                  opacity: nodeSpring,
                }}
              >
                <div
                  style={{
                    width: node.size,
                    height: node.size,
                    borderRadius: "50%",
                    background: `${node.color}18`,
                    border: `2px solid ${node.color}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 4px 20px ${node.color}15`,
                  }}
                >
                  <div
                    style={{
                      width: node.size * 0.55,
                      height: node.size * 0.55,
                      borderRadius: "50%",
                      background: `${node.color}30`,
                    }}
                  />
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: node.size + 6,
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#1A1A2E",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                    fontFamily:
                      "'SF Pro Text', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                  }}
                >
                  {node.label}
                </div>
              </div>
            );
          })}
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
            maxWidth: 780,
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
