import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { PhoneFrame, BruneiPattern } from "./components/PhoneMockup";
import { AppInterface } from "./components/AppInterface";
import { Shockwave, FloatingParticles } from "./components/Effects";
import "./styles.css";

export const SideQuestIntro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* ── Phases ── */
  const isLogo = frame < 60;
  const isDemo = frame >= 60 && frame < 500;
  const isCTA = frame >= 500;

  /* ── Logo Animation ── */
  const logoS = spring({ frame, fps });
  
  /* ── Demo Animation ── */
  const demoFrame = frame - 60;
  const demoS = spring({ frame: demoFrame, fps, config: { damping: 15 } });
  
  /* ── Phone Motion ── */
  const phoneScale = interpolate(demoS, [0, 1], [0.5, 1], { extrapolateLeft: "clamp" });
  const phoneRotateY = interpolate(Math.sin(frame * 0.02), [-1, 1], [-10, 10]);

  /* ── Labels ── */
  const currentLabel = 
    demoFrame < 120 ? "EASY BROWSING" :
    demoFrame < 240 ? "ONE-CLICK POSTING" :
    demoFrame < 360 ? "QUEST COMPLETED" :
    "INSTANT PAYMENT";

  const labelOp = interpolate(demoFrame % 120, [0, 10, 100, 110], [0, 1, 1, 0]);

  return (
    <AbsoluteFill className="remotion-root" style={{ background: "white" }}>
      <BruneiPattern opacity={0.06} />
      <FloatingParticles count={20} />

      {/* ── LOGO PHASE ── */}
      {isLogo && (
        <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 90, fontWeight: 950, transform: `scale(${interpolate(logoS, [0, 1], [0.8, 1])})` }}>
            SideQuest<span style={{ color: "#00A682" }}>.BN</span>
          </div>
        </AbsoluteFill>
      )}

      {/* ── DEMO PHASE ── */}
      {isDemo && (
        <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* Shockwaves at transitions */}
          {demoFrame % 120 === 0 && <Shockwave startFrame={frame} />}

          <div style={{ transform: `scale(${phoneScale}) rotateY(${phoneRotateY}deg)` }}>
             <PhoneFrame scale={1.2}>
                {/* We pass the internal frame to AppInterface */}
                <AppInterface />
             </PhoneFrame>

             {/* Floating Label */}
             <div style={{
               position: "absolute",
               top: -100,
               left: "50%",
               transform: "translateX(-50%)",
               background: "#111827",
               color: "white",
               padding: "15px 40px",
               borderRadius: 100,
               fontSize: 24,
               fontWeight: 900,
               opacity: labelOp,
               boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
               whiteSpace: "nowrap"
             }}>
               {currentLabel}
             </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ── CTA PHASE ── */}
      {isCTA && (
        <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: 80, fontWeight: 950, marginBottom: 30 }}>SideQuest<span style={{ color: "#00A682" }}>.BN</span></h1>
            <div style={{
              padding: "20px 60px",
              background: "#111827",
              color: "white",
              borderRadius: 100,
              fontSize: 28,
              fontWeight: 900,
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
            }}>
              GET STARTED
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Vignette to ensure nothing is 'cut off' visually */}
      <AbsoluteFill style={{ pointerEvents: "none", boxShadow: "inset 0 0 100px rgba(0,0,0,0.05)" }} />
    </AbsoluteFill>
  );
};
