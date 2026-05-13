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

export const EscrowShowcase = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 10, 110, 120], [0, 1, 1, 0]);
  const s = spring({ frame, fps, config: { damping: 15, stiffness: 100 } });

  const payFrame = 40;
  const payS = spring({ frame: frame - payFrame, fps, config: { damping: 10, stiffness: 150 } });

  return (
    <AbsoluteFill style={{ opacity, background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <BruneiPattern opacity={0.1} />
      <FloatingParticles count={40} color="#D4AF37" />
      
      <Shockwave startFrame={payFrame} color="#D4AF37" />

      <div style={{ 
        transform: `scale(${interpolate(s, [0, 1], [1.5, 1.1])}) rotateY(${interpolate(payS, [0, 1], [0, 360])}deg)`,
      }}>
        <div style={{ filter: "brightness(1.1) drop-shadow(0 50px 100px rgba(0,0,0,0.15))" }}>
          <PhoneFrame scale={1} rotateY={0} rotateX={0}>
            <AppInterface phase="payment" />
          </PhoneFrame>
        </div>
        
        {/* Money Label */}
        <div style={{
          position: "absolute",
          top: -120,
          left: "50%",
          transform: `translateX(-50%) scale(${interpolate(payS, [0, 1], [0.8, 1.3])})`,
          background: "#00A682",
          color: "white",
          padding: "18px 50px",
          borderRadius: 100,
          fontSize: 32,
          fontWeight: 900,
          boxShadow: "0 30px 60px rgba(0,166,130,0.3)",
          whiteSpace: "nowrap"
        }}>
          GET PAID. NOW. 💰
        </div>
      </div>

      {/* Floating Money Icons */}
      {frame > payFrame && Array.from({ length: 12 }).map((_, i) => {
        const pop = spring({ frame: frame - payFrame - i, fps });
        return (
          <div key={i} style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            fontSize: 40,
            transform: `translate(${(i - 6) * 100}px, ${interpolate(pop, [0, 1], [0, -400])}px) scale(${pop})`,
            opacity: interpolate(pop, [0.8, 1], [1, 0]),
          }}>
            💵
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
