import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Audio,
  staticFile,
} from "remotion";
import { PhoneFrame, BruneiPattern } from "../components/PhoneMockup";
import { FloatingParticles, SoftGradientOrb, GridBackground } from "../components/Effects";

export const PosterDemo = ({ duration = 450 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = duration / 450;

  // Step windows:
  // Step 1: 0 - 150
  // Step 2: 151 - 300
  // Step 3: 301 - 450
  const activeStep = frame <= 150 * scale ? 1 : frame <= 300 * scale ? 2 : 3;

  // Step Opacities
  const step1Opacity = interpolate(frame, [0, 15 * scale, 135 * scale, 150 * scale], [0.3, 1, 1, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const step2Opacity = interpolate(frame, [135 * scale, 165 * scale, 285 * scale, 300 * scale], [0.3, 1, 1, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const step3Opacity = interpolate(frame, [285 * scale, 315 * scale, 435 * scale, 450 * scale], [0.3, 1, 1, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const getSubtitleText = () => {
    if (activeStep === 1) {
      return "Seamless task creation: Hire local verified talent in under a minute.";
    } else if (activeStep === 2) {
      return "Define your budget and lock payments securely in a protective escrow vault.";
    } else {
      return "Publish instantly to dispatch nearby gig providers and track job progress.";
    }
  };

  // STEP 1: Click transition to the Post Task Form
  // Tapping the banner around frame 80
  const bannerTapS = spring({
    frame: frame - 80 * scale,
    fps,
    config: { damping: 10, stiffness: 200 }
  });
  
  const showForm = frame >= 85 * scale;
  const formEntryX = spring({
    frame: frame - 85 * scale,
    fps,
    config: { damping: 18, stiffness: 100 }
  });
  const formTranslate = interpolate(formEntryX, [0, 1], [320, 0]);

  // STEP 2: Input Field Typing Animations
  // Title types from frame 120 to 180
  const titleText = "Product Photo Shoot";
  const titleTyped = frame < 120 * scale ? "" : titleText.slice(0, Math.floor(interpolate(frame, [120 * scale, 180 * scale], [0, titleText.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })));

  // Budget types from frame 190 to 240
  const budgetText = "120.00";
  const budgetTyped = frame < 190 * scale ? "" : budgetText.slice(0, Math.floor(interpolate(frame, [190 * scale, 240 * scale], [0, budgetText.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })));

  // Description types from frame 245 to 290
  const descText = "Need 10 photos of products for a local startup.";
  const descTyped = frame < 245 * scale ? "" : descText.slice(0, Math.floor(interpolate(frame, [245 * scale, 290 * scale], [0, descText.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })));

  // Blinking Caret
  const caretOpacity = frame % 12 > 6 ? 1 : 0;

  // STEP 3: Click Publish button at frame 320
  const publishTapS = spring({
    frame: frame - 320 * scale,
    fps,
    config: { damping: 10, stiffness: 200 }
  });
  
  const isPublishProcessing = frame >= 320 * scale && frame < 365 * scale;
  const isPublishSuccess = frame >= 365 * scale;

  const successScale = spring({
    frame: frame - 365 * scale,
    fps,
    config: { damping: 12, stiffness: 130 }
  });

  // Touch pointer tracking
  const pointerOpacity = interpolate(frame, [40 * scale, 60 * scale, 100 * scale, 120 * scale, 300 * scale, 315 * scale, 335 * scale, 350 * scale], [0, 1, 1, 0, 1, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  
  let pointerX = 160;
  let pointerY = 320;
  if (frame < 120 * scale) {
    // Click banner
    pointerX = interpolate(frame, [40 * scale, 80 * scale], [250, 160], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    pointerY = interpolate(frame, [40 * scale, 80 * scale], [450, 210], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  } else {
    // Click Publish button
    pointerX = interpolate(frame, [290 * scale, 320 * scale], [160, 160], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    pointerY = interpolate(frame, [290 * scale, 320 * scale], [210, 565], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  }

  return (
    <AbsoluteFill
      style={{
        background: "#090d0b",
        color: "#ffffff",
        fontFamily: "'Outfit', 'Inter', sans-serif",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "80px 100px",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <Audio src={
            {
              1: staticFile("assets/posterdemo_voice_step1.mp3"),
              2: staticFile("assets/posterdemo_voice_step2.mp3"),
              3: staticFile("assets/posterdemo_voice_step3.mp3"),
            }[activeStep] || staticFile("assets/posterdemo_voice.mp3")
          } />
      {/* Background FX */}
      <GridBackground opacity={0.02} color="16, 185, 129" />
      <SoftGradientOrb color="#10b981" size={700} x="25%" y="30%" />
      <SoftGradientOrb color="#047857" size={500} x="80%" y="75%" />
      <FloatingParticles count={25} color="#10b981" />
      <BruneiPattern opacity={0.015} />

      {/* LEFT COLUMN */}
      <div
        style={{
          flex: 1.1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          paddingRight: 40,
          zIndex: 10,
        }}
      >
        {/* Pitch Deck Branding */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>
              Instant Gig Dispatch
            </span>
          </div>
          <h1 style={{ fontSize: 52, fontWeight: 900, letterSpacing: "-1.5px", margin: 0, lineHeight: 1.1 }}>
            SideQuest<span style={{ color: "#10b981" }}>.BN</span>
          </h1>
          <p style={{ fontSize: 20, color: "#9ca3af", margin: "6px 0 0 0", fontWeight: 500 }}>
            Poster Task Creator Mode
          </p>
        </div>

        {/* Steps List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 32, margin: "40px 0" }}>
          {/* Step 1 */}
          <div style={{ display: "flex", gap: 20, opacity: step1Opacity, transition: "opacity 0.2s ease" }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(16, 185, 129, 0.15)", border: "1.5px solid #10b981", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: "#10b981" }}>
              1
            </div>
            <div>
              <h3 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 4px 0" }}>Instant Quest Posting</h3>
              <p style={{ fontSize: 14, color: "#9ca3af", margin: 0, lineHeight: 1.4 }}>Initiate quick custom tasks directly from a premium dispatch dashboard.</p>
            </div>
          </div>

          {/* Step 2 */}
          <div style={{ display: "flex", gap: 20, opacity: step2Opacity, transition: "opacity 0.2s ease" }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(245, 158, 11, 0.15)", border: "1.5px solid #f59e0b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: "#f59e0b" }}>
              2
            </div>
            <div>
              <h3 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 4px 0" }}>Escrow Budget Lock</h3>
              <p style={{ fontSize: 14, color: "#9ca3af", margin: 0, lineHeight: 1.4 }}>Lock job payments safely in digital escrow to build trust with local providers.</p>
            </div>
          </div>

          {/* Step 3 */}
          <div style={{ display: "flex", gap: 20, opacity: step3Opacity, transition: "opacity 0.2s ease" }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(37, 99, 235, 0.15)", border: "1.5px solid #2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: "#2563eb" }}>
              3
            </div>
            <div>
              <h3 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 4px 0" }}>Real-time Dispatch</h3>
              <p style={{ fontSize: 14, color: "#9ca3af", margin: 0, lineHeight: 1.4 }}>Broadcast your task to verified gig providers within geofence instantly.</p>
            </div>
          </div>
        </div>

        {/* Dynamic Caption Box */}
        <div style={{
          background: "rgba(255, 255, 255, 0.04)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 20,
          padding: "20px 24px",
          minHeight: 80,
          display: "flex",
          alignItems: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
        }}>
          <p style={{ fontSize: 16, lineHeight: 1.5, color: "#e5e7eb", margin: 0, fontWeight: 500 }}>
            🎙️ <span style={{ color: "#10b981", fontWeight: 700 }}>VOICEOVER:</span> "{getSubtitleText()}"
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: Mobile Poster View */}
      <div
        style={{
          flex: 0.9,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Touch Cursor Simulation */}
        <div
          style={{
            position: "absolute",
            left: pointerX + 15,
            top: pointerY - 5,
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "rgba(16, 185, 129, 0.4)",
            border: "2px solid #10b981",
            zIndex: 9999,
            pointerEvents: "none",
            opacity: pointerOpacity,
            boxShadow: "0 0 10px rgba(16, 185, 129, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div style={{ position: "absolute", right: -5, bottom: -5, fontSize: 16 }}>👆</div>
        </div>

        <div style={{ filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.5))" }}>
          <PhoneFrame scale={1.05} rotateY={-6} rotateX={3}>
            {/* Screen UI Wrapper */}
            <div style={{
              width: "100%",
              height: "100%",
              background: "#ffffff",
              color: "#1f2937",
              fontFamily: "'Inter', sans-serif",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column"
            }}>
              
              {/* DASHBOARD FEED VIEW (STEP 1) */}
              <div style={{
                width: "100%",
                height: "100%",
                padding: "24px 16px",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box"
              }}>
                {/* Header info */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 900, fontFamily: "Outfit", margin: 0, color: "#1f2937" }}>SideQuest<span style={{ color: "#10b981" }}>.BN</span></h3>
                    <span style={{ fontSize: 9, color: "#6b7280", fontWeight: 700 }}>FIND LOCAL HELP IN BRUNEI</span>
                  </div>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(16,185,129,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>🔔</div>
                </div>

                {/* Search banner */}
                <div style={{ background: "#f3f4f6", border: "1px solid rgba(0,0,0,0.05)", borderRadius: 12, padding: "8px 12px", display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#9ca3af", marginBottom: 16 }}>
                  <span>🔍</span> What do you need help with?
                </div>

                {/* Dynamic green gradient clickable Custom Task banner */}
                <div style={{
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  borderRadius: 16,
                  padding: 18,
                  color: "white",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 8px 20px rgba(16, 185, 129, 0.25)",
                  transform: `scale(${bannerTapS > 0 ? interpolate(bannerTapS, [0, 0.5, 1], [1, 0.95, 1]) : 1})`,
                  transition: "transform 0.1s"
                }}>
                  <div style={{ position: "absolute", right: -10, bottom: -10, fontSize: "3rem", opacity: 0.15 }}>🚀</div>
                  <h4 style={{ fontSize: 13, fontWeight: 900, margin: "0 0 4px 0", fontFamily: "Outfit" }}>Need custom help?</h4>
                  <p style={{ fontSize: 9, color: "rgba(255,255,255,0.9)", margin: "0 0 12px 0", lineHeight: 1.3, maxWidth: "80%" }}>
                    Post a custom SideQuest task and get applications from local Brunei hustlers.
                  </p>
                  <span style={{ background: "white", color: "#10b981", fontSize: 8, fontWeight: 800, padding: "5px 12px", borderRadius: 6 }}>
                    Post a Task Now
                  </span>
                </div>

                {/* Static categories underneath */}
                <h4 style={{ fontSize: 11, fontWeight: 800, fontFamily: "Outfit", margin: "20px 0 10px 0", textTransform: "uppercase" }}>Featured Services</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ background: "#fafafa", border: "1px solid #f0f0f0", borderRadius: 12, padding: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 800 }}>Grass Cutting Gadong</div>
                      <div style={{ fontSize: 8, color: "#6b7280", marginTop: 2 }}>🧹 Garden & Yard Work</div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 900, color: "#10b981" }}>BND 45</span>
                  </div>
                  <div style={{ background: "#fafafa", border: "1px solid #f0f0f0", borderRadius: 12, padding: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 800 }}>AC servicing chemical wash</div>
                      <div style={{ fontSize: 8, color: "#6b7280", marginTop: 2 }}>🔨 Maintenance & Repairs</div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 900, color: "#10b981" }}>BND 70</span>
                  </div>
                </div>
              </div>

              {/* POST QUEST TASK FORM PANEL OVERLAY (STEP 2) */}
              {showForm && (
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "#f9fafb",
                  zIndex: 10,
                  transform: `translateX(${formTranslate}px)`,
                  display: "flex",
                  flexDirection: "column",
                  padding: "24px 16px"
                }}>
                  {/* Header row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: "white", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800 }}>←</div>
                    <h3 style={{ fontSize: 15, fontWeight: 900, fontFamily: "Outfit", margin: 0, color: "#111827" }}>Post a Task</h3>
                  </div>

                  {/* Form Container */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
                    {/* Task Title */}
                    <div>
                      <label style={{ fontSize: 9, fontWeight: 800, color: "#4b5563", display: "block", marginBottom: 5 }}>SERVICE TITLE</label>
                      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 10, padding: "8px 12px", fontSize: 11, display: "flex", alignItems: "center", minHeight: 34 }}>
                        <span style={{ marginRight: 6 }}>⚡</span>
                        <span style={{ fontWeight: 600, color: "#111827" }}>{titleTyped}</span>
                        {activeStep === 2 && frame < 185 && <span style={{ width: 1.5, height: 12, background: "#10b981", opacity: caretOpacity, marginLeft: 2 }} />}
                      </div>
                    </div>

                    {/* Category Select */}
                    <div>
                      <label style={{ fontSize: 9, fontWeight: 800, color: "#4b5563", display: "block", marginBottom: 5 }}>CATEGORY</label>
                      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 10, padding: "8px 12px", fontSize: 11, display: "flex", justifyContent: "space-between", alignItems: "center", height: 34 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span>📸</span>
                          <span style={{ fontWeight: 600, color: "#111827" }}>Photography & Media</span>
                        </div>
                        <span style={{ fontSize: 7, color: "#9ca3af" }}>▼</span>
                      </div>
                    </div>

                    {/* Price Input */}
                    <div>
                      <label style={{ fontSize: 9, fontWeight: 800, color: "#4b5563", display: "block", marginBottom: 5 }}>PRICE (BND)</label>
                      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 10, padding: "8px 12px", fontSize: 11, display: "flex", alignItems: "center", minHeight: 34 }}>
                        <span style={{ color: "#10b981", fontWeight: 800, marginRight: 6 }}>$</span>
                        <span style={{ fontWeight: 700, color: "#111827" }}>{budgetTyped}</span>
                        {activeStep === 2 && frame >= 185 && frame < 242 && <span style={{ width: 1.5, height: 12, background: "#10b981", opacity: caretOpacity, marginLeft: 2 }} />}
                      </div>
                    </div>

                    {/* Description Textarea */}
                    <div>
                      <label style={{ fontSize: 9, fontWeight: 800, color: "#4b5563", display: "block", marginBottom: 5 }}>DESCRIPTION</label>
                      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 12px", fontSize: 10, display: "flex", alignItems: "flex-start", minHeight: 74 }}>
                        <span style={{ marginRight: 6 }}>📝</span>
                        <span style={{ fontWeight: 500, color: "#4b5563", lineHeight: 1.4 }}>{descTyped}</span>
                        {activeStep === 2 && frame >= 242 && <span style={{ width: 1.5, height: 12, background: "#10b981", opacity: caretOpacity, marginLeft: 2 }} />}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div style={{
                      marginTop: 15,
                      height: 38,
                      borderRadius: 8,
                      background: "#10b981",
                      color: "white",
                      fontSize: 11,
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      boxShadow: "0 6px 15px rgba(16, 185, 129, 0.25)",
                      transform: `scale(${publishTapS > 0 ? interpolate(publishTapS, [0, 0.5, 1], [1, 0.95, 1]) : 1})`,
                      transition: "all 0.1s"
                    }}>
                      {isPublishProcessing ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ width: 10, height: 10, borderRadius: "50%", border: "1.5px solid white", borderTopColor: "transparent", animation: "spin 1s linear infinite" }} />
                          Securing Escrow via BIBD...
                        </div>
                      ) : (
                        <span>Publish Task & Lock Escrow</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* SUCCESS MODAL POPUP (STEP 3) */}
              {isPublishSuccess && (
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(255, 255, 255, 0.98)",
                  zIndex: 30,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 24,
                  transform: `scale(${successScale})`,
                  opacity: successScale
                }}>
                  <div style={{
                    width: 72, height: 72,
                    borderRadius: "50%",
                    background: "rgba(16, 185, 129, 0.08)",
                    border: "3.5px solid #10b981",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 32,
                    color: "#10b981",
                    marginBottom: 16,
                    boxShadow: "0 10px 24px rgba(16, 185, 129, 0.15)"
                  }}>
                    ✓
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 900, margin: "0 0 6px 0", color: "#111827", fontFamily: "Outfit" }}>Task Dispatch Active!</h3>
                  <p style={{ fontSize: 10, color: "#6b7280", textAlign: "center", margin: 0, lineHeight: 1.4, maxWidth: 190 }}>
                    Funds of <span style={{ color: "#10b981", fontWeight: 800 }}>BND 120.00</span> securely deposited in escrow vault. Nearby photography hustlers are being alerted.
                  </p>

                  <div style={{
                    marginTop: 24,
                    padding: "6px 14px",
                    background: "rgba(16,185,129,0.06)",
                    border: "1px solid rgba(16,185,129,0.12)",
                    borderRadius: 20,
                    fontSize: 8,
                    fontWeight: 800,
                    color: "#10b981",
                    letterSpacing: "0.5px"
                  }}>
                    🛡️ SECURED GIG LOCK ACTIVE
                  </div>
                </div>
              )}

              {/* NAVIGATION BAR - FIXED AT BOTTOM */}
              <div style={{
                position: "absolute",
                bottom: 0, left: 0, right: 0,
                height: 52,
                background: "#ffffff",
                borderTop: "1px solid #e5e7eb",
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                fontSize: 16,
                zIndex: 5
              }}>
                <span style={{ color: "#10b981" }}>🏠</span>
                <span style={{ color: "#9ca3af" }}>📝</span>
                <span style={{ color: "#9ca3af" }}>💬</span>
                <span style={{ color: "#9ca3af" }}>💼</span>
              </div>

            </div>
          </PhoneFrame>
        </div>
      </div>
    </AbsoluteFill>
  );
};
