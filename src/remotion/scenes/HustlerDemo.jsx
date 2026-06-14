import { Audio, staticFile } from "remotion";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { PhoneFrame, BruneiPattern } from "../components/PhoneMockup";
import { FloatingParticles, SoftGradientOrb, GridBackground } from "../components/Effects";

export const HustlerDemo = ({ duration = 450 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = duration / 450;

  // Step frames:
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
      return "Discover location-based freelance gigs instantly in your neighborhood.";
    } else if (activeStep === 2) {
      return "Adjust geofenced radar search radius dynamically to pinpoint local opportunities.";
    } else {
      return "Tap to view job descriptions and instantly lock in secure escrow-protected work.";
    }
  };

  // Radar rotating angle
  const radarRotation = (frame * 2.5) % 360;

  // Step 2: Geofence circle size expansion from frame 160 to 220
  const radiusExpansion = spring({
    frame: frame - 160 * scale,
    fps,
    config: { damping: 15, stiffness: 60 },
  });
  
  const radarRadius = interpolate(radiusExpansion, [0, 1], [90, 170]); // pixels in mobile screen
  const radiusLabel = Math.floor(interpolate(radiusExpansion, [0, 1], [5, 15]));

  // New pins appearing as radius expands
  const pin1Scale = spring({ frame: frame - 180 * scale, fps, config: { damping: 8, stiffness: 150 } });
  const pin2Scale = spring({ frame: frame - 200 * scale, fps, config: { damping: 8, stiffness: 150 } });
  const pin3Scale = spring({ frame: frame - 220 * scale, fps, config: { damping: 8, stiffness: 150 } });

  // Step 3: Touch pointer path
  const touchOpacity = interpolate(frame, [290 * scale, 305 * scale, 420 * scale, 440 * scale], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  
  let pointerX = 160;
  let pointerY = 320;
  let isClicking = false;

  if (frame < 330 * scale) {
    // Travel to marker
    pointerX = interpolate(frame, [290 * scale, 320 * scale], [240, 160], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    pointerY = interpolate(frame, [290 * scale, 320 * scale], [450, 270], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    isClicking = frame >= 318 * scale && frame <= 324 * scale;
  } else {
    // Travel to bottom sheet Accept Button
    pointerX = interpolate(frame, [335 * scale, 375 * scale], [160, 220], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    pointerY = interpolate(frame, [335 * scale, 375 * scale], [270, 560], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    isClicking = frame >= 373 * scale && frame <= 378 * scale;
  }

  // Touch pointer click compression
  const pointerClickS = spring({
    frame: isClicking ? 5 : 0,
    fps,
    config: { damping: 6, stiffness: 300 }
  });
  const pointerScale = interpolate(pointerClickS, [0, 1], [1, 0.7]);

  // Dynamic UI sheets popping up
  const showDetailSheet = frame >= 320 * scale;
  const sheetY = spring({
    frame: frame - 320 * scale,
    fps,
    config: { damping: 16, stiffness: 100 }
  });
  const sheetTranslate = interpolate(sheetY, [0, 1], [300, 0]);

  // Booking accept logic
  const questAccepted = frame >= 375 * scale;
  const successScale = spring({
    frame: frame - 375 * scale,
    fps,
    config: { damping: 12, stiffness: 120 }
  });

    return (
      <AbsoluteFill
        style={{
          background: "#0c0a09",
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
        {/* Voiceover */}
        <Audio src={
          {
            1: staticFile("assets/hustlerdemo_voice_step1.mp3"),
            2: staticFile("assets/hustlerdemo_voice_step2.mp3"),
            3: staticFile("assets/hustlerdemo_voice_step3.mp3"),
          }[activeStep] || staticFile("assets/hustlerdemo_voice.mp3")
        } />
        <GridBackground opacity={0.025} color="217, 119, 6" />
        <SoftGradientOrb color="#d97706" size={700} x="20%" y="25%" />
        <SoftGradientOrb color="#b45309" size={500} x="80%" y="70%" />
        <FloatingParticles count={25} color="#d97706" />
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
            <span style={{ background: "rgba(217, 119, 6, 0.15)", color: "#d97706", border: "1px solid rgba(217, 119, 6, 0.3)", padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>
              Location Gig Engine
            </span>
          </div>
          <h1 style={{ fontSize: 52, fontWeight: 900, letterSpacing: "-1.5px", margin: 0, lineHeight: 1.1 }}>
            SideQuest<span style={{ color: "#d97706" }}>.BN</span>
          </h1>
          <p style={{ fontSize: 20, color: "#9ca3af", margin: "6px 0 0 0", fontWeight: 500 }}>
            Hustler Map & Discovery Mode
          </p>
        </div>

        {/* Steps List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 32, margin: "40px 0" }}>
          {/* Step 1 */}
          <div style={{ display: "flex", gap: 20, opacity: step1Opacity, transition: "opacity 0.2s ease" }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(217, 119, 6, 0.15)", border: "1.5px solid #d97706", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: "#d97706" }}>
              1
            </div>
            <div>
              <h3 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 4px 0" }}>Geofenced Quest Radar</h3>
              <p style={{ fontSize: 14, color: "#9ca3af", margin: 0, lineHeight: 1.4 }}>Instant scanning of your physical neighborhood for local micro-gigs.</p>
            </div>
          </div>

          {/* Step 2 */}
          <div style={{ display: "flex", gap: 20, opacity: step2Opacity, transition: "opacity 0.2s ease" }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(245, 158, 11, 0.15)", border: "1.5px solid #f59e0b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: "#f59e0b" }}>
              2
            </div>
            <div>
              <h3 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 4px 0" }}>Dynamic Radius Tuning</h3>
              <p style={{ fontSize: 14, color: "#9ca3af", margin: 0, lineHeight: 1.4 }}>Squeeze or expand search range dynamically to capture more work.</p>
            </div>
          </div>

          {/* Step 3 */}
          <div style={{ display: "flex", gap: 20, opacity: step3Opacity, transition: "opacity 0.2s ease" }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(16, 185, 129, 0.15)", border: "1.5px solid #10b981", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: "#10b981" }}>
              3
            </div>
            <div>
              <h3 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 4px 0" }}>Instant Accept & Lock</h3>
              <p style={{ fontSize: 14, color: "#9ca3af", margin: 0, lineHeight: 1.4 }}>Tap to audit tasks, confirm instant hiring, and lock down protected pay.</p>
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
            🎙️ <span style={{ color: "#d97706", fontWeight: 700 }}>VOICEOVER:</span> "{getSubtitleText()}"
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: Mobile Map View */}
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
        {/* Virtual Touch Cursor */}
        {activeStep === 3 && (
          <div
            style={{
              position: "absolute",
              left: pointerX + 15, // Offset slightly to account for device alignment
              top: pointerY - 10,
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "rgba(217, 119, 6, 0.4)",
              border: "2px solid #d97706",
              zIndex: 9999,
              pointerEvents: "none",
              opacity: touchOpacity,
              transform: `scale(${pointerScale})`,
              boxShadow: "0 0 10px rgba(217, 119, 6, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <div style={{ position: "absolute", right: -5, bottom: -5, fontSize: 16 }}>👆</div>
          </div>
        )}

        <div style={{ filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.5))" }}>
          <PhoneFrame scale={1.05} rotateY={-6} rotateX={3}>
            {/* Map Dashboard Layout */}
            <div style={{
              width: "100%",
              height: "100%",
              background: "#18181b", // dark road background
              color: "#ffffff",
              fontFamily: "'Inter', sans-serif",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column"
            }}>
              
              {/* STYLISH CUSTOM VECTOR MAP BACKGROUND */}
              <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
                {/* Roads lines */}
                <svg width="100%" height="100%">
                  <path d="M -20,200 L 400,280" stroke="#27272a" strokeWidth="6" fill="none" />
                  <path d="M 100,-20 L 150,700" stroke="#27272a" strokeWidth="8" fill="none" />
                  <path d="M -50,450 L 380,420" stroke="#27272a" strokeWidth="6" fill="none" />
                  <path d="M 280,-20 L 220,700" stroke="#27272a" strokeWidth="4" fill="none" />
                  {/* Finer routes */}
                  <path d="M 50,220 L 220,180 L 300,320" stroke="#3f3f46" strokeWidth="2.5" fill="none" />
                  <path d="M 0,380 L 120,400 L 250,550" stroke="#3f3f46" strokeWidth="2.5" fill="none" />
                </svg>

                {/* Grid references */}
                <div style={{ position: "absolute", left: 10, top: 120, fontSize: 8, color: "#3f3f46", fontFamily: "monospace" }}>04°53'N / 114°56'E</div>
                <div style={{ position: "absolute", right: 10, top: 400, fontSize: 8, color: "#3f3f46", fontFamily: "monospace" }}>GADONG REGION</div>
              </div>

              {/* FLOATING MAP RADAR OVERLAYS */}
              <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none" }}>
                
                {/* Center User Pin (Hustler Radar Center) */}
                <div style={{ position: "absolute", left: "50%", top: "45%", transform: "translate(-50%, -50%)" }}>
                  {/* Pulse Rings */}
                  <div style={{
                    position: "absolute",
                    left: -20, top: -20,
                    width: 40, height: 40,
                    borderRadius: "50%",
                    border: "1.5px solid rgba(217, 119, 6, 0.4)",
                    animation: "pulse 2s infinite"
                  }} />
                  {/* Radar sweep cone */}
                  <div style={{
                    position: "absolute",
                    left: -radarRadius, top: -radarRadius,
                    width: radarRadius * 2, height: radarRadius * 2,
                    borderRadius: "50%",
                    background: `conic-gradient(from ${radarRotation}deg, transparent 75%, rgba(217, 175, 55, 0.12) 100%)`,
                    transition: "width 0.1s, height 0.1s, left 0.1s, top 0.1s"
                  }} />
                  {/* Radar geofence circle boundary */}
                  <div style={{
                    position: "absolute",
                    left: -radarRadius, top: -radarRadius,
                    width: radarRadius * 2, height: radarRadius * 2,
                    borderRadius: "50%",
                    border: "1.5px dashed rgba(217, 119, 6, 0.25)",
                    background: "rgba(217, 119, 6, 0.02)",
                    transition: "all 0.1s ease"
                  }} />
                  {/* Center Dot */}
                  <div style={{
                    width: 14, height: 14,
                    borderRadius: "50%",
                    background: "#d97706",
                    border: "2.5px solid white",
                    boxShadow: "0 0 10px rgba(217, 119, 6, 0.8)"
                  }} />
                </div>

                {/* STATIC GIG PINS - ALWAYS ACTIVE */}
                <div style={{ position: "absolute", left: 80, top: 180 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, background: "#3b82f6", border: "2px solid white", borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)", boxShadow: "0 4px 10px rgba(0,0,0,0.3)" }}>
                    <span style={{ transform: "rotate(45deg)", fontSize: 12 }}>🚗</span>
                  </div>
                </div>

                {/* DYNAMIC GIG PINS - POPPING UP IN STEP 2 */}
                {/* Pin 1: Grass Cutting Gadong ($45) */}
                <div style={{
                  position: "absolute",
                  left: 145, top: 255,
                  transform: `scale(${pin1Scale})`,
                  opacity: pin1Scale
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 32,
                    height: 32,
                    background: "#f59e0b",
                    border: "2px solid white",
                    borderRadius: "50% 50% 50% 0",
                    transform: "rotate(-45deg)",
                    boxShadow: "0 6px 12px rgba(0,0,0,0.4)"
                  }}>
                    <span style={{ transform: "rotate(45deg)", fontSize: 13 }}>🧹</span>
                  </div>
                  {/* Small tag */}
                  <div style={{ position: "absolute", top: -20, left: -6, background: "#10b981", padding: "1px 6px", borderRadius: 4, fontSize: 8, fontWeight: 900, whiteSpace: "nowrap" }}>
                    BND 45
                  </div>
                </div>

                {/* Pin 2: AC Service */}
                {frame >= 200 && (
                  <div style={{
                    position: "absolute",
                    left: 210, top: 190,
                    transform: `scale(${pin2Scale})`,
                    opacity: pin2Scale
                  }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, background: "#f59e0b", border: "2px solid white", borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)", boxShadow: "0 4px 10px rgba(0,0,0,0.3)" }}>
                      <span style={{ transform: "rotate(45deg)", fontSize: 12 }}>🔨</span>
                    </div>
                  </div>
                )}

                {/* Pin 3: Tutoring */}
                {frame >= 220 && (
                  <div style={{
                    position: "absolute",
                    left: 100, top: 380,
                    transform: `scale(${pin3Scale})`,
                    opacity: pin3Scale
                  }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, background: "#8b5cf6", border: "2px solid white", borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)", boxShadow: "0 4px 10px rgba(0,0,0,0.3)" }}>
                      <span style={{ transform: "rotate(45deg)", fontSize: 12 }}>📚</span>
                    </div>
                  </div>
                )}

              </div>

              {/* MAP FLOATING TOP NAVIGATION (Z-INDEX 5) */}
              <div style={{ position: "relative", zIndex: 5, padding: "16px 12px 0 12px", pointerEvents: "none" }}>
                
                {/* Search Bar & Switcher */}
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <div style={{ flex: 1, background: "rgba(24, 24, 27, 0.9)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(10px)", borderRadius: 50, padding: "8px 12px", display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#9ca3af" }}>
                    <span>🔍</span>
                    <span style={{ fontWeight: 600 }}>Search nearby quests...</span>
                  </div>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(24,24,27,0.9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🧭</div>
                </div>

                {/* Location indicator */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(24,24,27,0.9)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(10px)", borderRadius: 30, padding: "4px 10px" }}>
                  <span style={{ fontSize: 9 }}>📍</span>
                  <span style={{ fontSize: 9, fontWeight: 800 }}>Gadong, Brunei Muara</span>
                </div>
              </div>

              {/* MAP BOTTOM STATS ROW (Z-INDEX 5) */}
              <div style={{ position: "absolute", bottom: 85, left: 12, right: 12, zIndex: 5, display: "flex", gap: 8, pointerEvents: "none" }}>
                {/* Geofence Tuning stat */}
                <div style={{ flex: 1, background: "rgba(24,24,27,0.9)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(10px)", borderRadius: 12, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(217,119,6,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#d97706", fontWeight: 900 }}>R</div>
                  <div>
                    <div style={{ fontSize: 7, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase" }}>Radar Tuning</div>
                    <div style={{ fontSize: 10, fontWeight: 900 }}>Geofence: {radiusLabel} km</div>
                  </div>
                </div>

                {/* Earnings Pool stat */}
                <div style={{ flex: 1, background: "rgba(24,24,27,0.9)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(10px)", borderRadius: 12, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(16,185,129,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#10b981", fontWeight: 900 }}>$</div>
                  <div>
                    <div style={{ fontSize: 7, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase" }}>Est. Payout</div>
                    <div style={{ fontSize: 10, fontWeight: 900, color: "#10b981" }}>BND 215.00</div>
                  </div>
                </div>
              </div>

              {/* STEP 3 POPUP: Job details sheet & Booking success */}
              {showDetailSheet && (
                <div style={{
                  position: "absolute",
                  bottom: 0, left: 0, right: 0,
                  background: "#18181b",
                  borderTop: "1.5px solid rgba(255,255,255,0.1)",
                  borderRadius: "24px 24px 0 0",
                  padding: "16px 20px 24px 20px",
                  zIndex: 20,
                  transform: `translateY(${sheetTranslate}px)`,
                  display: "flex",
                  flexDirection: "column"
                }}>
                  {/* Notch indicator */}
                  <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)", alignSelf: "center", marginBottom: 12 }} />

                  {/* Header info */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div>
                      <span style={{ background: "rgba(217,119,6,0.15)", color: "#f59e0b", fontSize: 8, padding: "2px 6px", borderRadius: 4, fontWeight: 800, textTransform: "uppercase" }}>Cleaning & Garden</span>
                      <h4 style={{ fontSize: 14, fontWeight: 900, margin: "4px 0 0 0" }}>Grass cutting for back garden</h4>
                      <p style={{ fontSize: 8, color: "#9ca3af", margin: "2px 0 0 0" }}>Client: Sarah M. • verified</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 15, fontWeight: 900, color: "#10b981" }}>BND 45.00</div>
                      <span style={{ fontSize: 7, color: "#9ca3af", fontWeight: 700 }}>Escrow Secured</span>
                    </div>
                  </div>

                  {/* Booking actions */}
                  <div style={{
                    width: "100%",
                    height: 38,
                    borderRadius: 8,
                    background: questAccepted ? "#10b981" : "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
                    color: "white",
                    fontSize: 11,
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    cursor: "pointer",
                    boxShadow: questAccepted ? "none" : "0 6px 15px rgba(217, 119, 6, 0.25)",
                    transition: "all 0.3s ease"
                  }}>
                    {questAccepted ? (
                      <span>✓ Quest Accepted! Locking escrow...</span>
                    ) : (
                      <span>⚡ Accept Quest & Claim Job</span>
                    )}
                  </div>
                </div>
              )}

              {/* ACCEPT SUCCESS FULL SCREEN SCREEN */}
              {questAccepted && (
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(24, 24, 27, 0.95)",
                  backdropFilter: "blur(8px)",
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
                    width: 76, height: 76,
                    borderRadius: "50%",
                    background: "rgba(16, 185, 129, 0.1)",
                    border: "3px solid #10b981",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 32,
                    marginBottom: 16,
                    boxShadow: "0 0 20px rgba(16, 185, 129, 0.4)"
                  }}>
                    🛡️
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 900, margin: "0 0 4px 0", color: "#ffffff", textAlign: "center" }}>Hustle Confirmed!</h3>
                  <p style={{ fontSize: 10, color: "#9ca3af", textAlign: "center", margin: 0, lineHeight: 1.4, maxWidth: 180 }}>
                    Escrow payout of <span style={{ color: "#10b981", fontWeight: 800 }}>BND 45.00</span> locked in secure protective holding.
                  </p>

                  <div style={{
                    marginTop: 24,
                    padding: "6px 16px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 20,
                    fontSize: 8,
                    fontWeight: 700,
                    color: "#d97706",
                    letterSpacing: "0.5px"
                  }}>
                    DIAL HUSTLE CHAT OPENED
                  </div>
                </div>
              )}

              {/* NAVIGATION BAR - FIXED AT BOTTOM */}
              <div style={{
                position: "absolute",
                bottom: 0, left: 0, right: 0,
                height: 52,
                background: "rgba(24,24,27,0.95)",
                borderTop: "1px solid rgba(255,255,255,0.05)",
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                fontSize: 16,
                zIndex: 10
              }}>
                <span style={{ color: "#d97706", filter: "drop-shadow(0 0 5px rgba(217, 119, 6, 0.4))" }}>🗺️</span>
                <span style={{ color: "#71717a" }}>📝</span>
                <span style={{ color: "#71717a" }}>💬</span>
                <span style={{ color: "#71717a" }}>💼</span>
              </div>

            </div>
          </PhoneFrame>
        </div>
      </div>
    </AbsoluteFill>
  );
};
