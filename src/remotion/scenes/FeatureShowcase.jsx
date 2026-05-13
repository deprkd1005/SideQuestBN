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
import { Shockwave, FloatingParticles } from "../components/Effects";

export const FeatureShowcase = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 10, 110, 120], [0, 1, 1, 0]);
  
  /* ── Entry Motion ── */
  const entryS = spring({ frame, fps, config: { damping: 12, stiffness: 120 } });
  const scale = interpolate(entryS, [0, 1], [0.5, 1.4]);
  const rotateZ = interpolate(entryS, [0, 1], [-15, 0]);

  /* ── Click Impact ── */
  const clickFrame = 50;
  const clickS = spring({ frame: frame - clickFrame, fps, config: { damping: 8, stiffness: 200 } });
  const clickImpact = interpolate(clickS, [0, 0.2, 1], [0, -40, 0]);
  const shake = Math.sin(frame * 0.8) * interpolate(frame - clickFrame, [0, 10], [10, 0], { extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ opacity, background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <BruneiPattern opacity={0.1} />
      <FloatingParticles count={30} color="#00A682" />
      
      <Shockwave startFrame={clickFrame} color="#00A682" />

      <div style={{ 
        transform: `scale(${scale}) rotateZ(${rotateZ}deg) translateY(${clickImpact}px) translateX(${shake}px)`,
        perspective: 1000,
      }}>
        <div style={{ filter: "brightness(1.1) drop-shadow(0 50px 100px rgba(0,0,0,0.15))" }}>
          <PhoneFrame scale={1} rotateY={0} rotateX={0}>
            <AppInterface phase="posting" />
          </PhoneFrame>
        </div>
        
        {/* Kinetic Label */}
        <div style={{
          position: "absolute",
          top: -120,
          left: "50%",
          transform: `translateX(-50%) scale(${interpolate(clickS, [0, 1], [1, 1.2])})`,
          background: "#111827",
          color: "white",
          padding: "18px 50px",
          borderRadius: 100,
          fontSize: 32,
          fontWeight: 900,
          boxShadow: "0 30px 60px rgba(0,0,0,0.3)",
          whiteSpace: "nowrap"
        }}>
          ONE CLICK. DONE. ⚡
        </div>
      </div>
    </AbsoluteFill>
  );
};
