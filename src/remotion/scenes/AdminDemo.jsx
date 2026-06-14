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

export const AdminDemo = ({ duration = 450 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = duration / 450;

  // Define Step Frame Windows
  // Step 1: 0 - 150
  // Step 2: 151 - 300
  // Step 3: 301 - 450
  const activeStep = frame <= 150 * scale ? 1 : frame <= 300 * scale ? 2 : 3;

  // Fade in / out effects for active steps on the left side
  const step1Opacity = interpolate(frame, [0, 15 * scale, 135 * scale, 150 * scale], [0.3, 1, 1, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const step2Opacity = interpolate(frame, [135 * scale, 165 * scale, 285 * scale, 300 * scale], [0.3, 1, 1, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const step3Opacity = interpolate(frame, [285 * scale, 315 * scale, 435 * scale, 450 * scale], [0.3, 1, 1, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Subtitle script
  const getSubtitleText = () => {
    if (activeStep === 1) {
      return "Integrity audit: Real-time tracking of transaction volume and active escrow flows.";
    } else if (activeStep === 2) {
      return "Instant KYC queue moderation to secure trust and safety across the gig economy.";
    } else {
      return "Fully automated ledger audit logs tracking every deposit and release.";
    }
  };

  // Step 1: Count Animations
  const countProgress = spring({
    frame: frame,
    fps,
    config: { damping: 20, stiffness: 40 },
  });
  
  const totalUsers = Math.floor(interpolate(countProgress, [0, 1], [1120, 1248]));
  const activeJobs = Math.floor(interpolate(countProgress, [0, 1], [270, 320]));
  const escrowFlow = Math.floor(interpolate(countProgress, [0, 1], [14300, 18240]));

  // Step 2: KYC Click Animation
  // Tapping the approve button around frame 210
  const clickS = spring({
    frame: frame - 210 * scale,
    fps,
    config: { damping: 10, stiffness: 200 },
  });
  
  const cursorOpacity = interpolate(frame, [155 * scale, 175 * scale, 215 * scale, 235 * scale], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cursorX = interpolate(frame, [155 * scale, 210 * scale], [250, 195], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cursorY = interpolate(frame, [155 * scale, 210 * scale], [550, 480], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const kycApproved = frame >= 210 * scale;

  // Shockwave expansion from the button click
  const shockScale = interpolate(frame - 210 * scale, [0, 25 * scale], [0.2, 3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shockOpacity = interpolate(frame - 210 * scale, [0, 5 * scale, 25 * scale], [0, 0.8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Step 3: Scroll animation
  const scrollY = interpolate(frame - 300 * scale, [0, 130 * scale], [0, -180], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{
      background: "#0b0c10",
      color: "#ffffff",
      fontFamily: "'Outfit', 'Inter', sans-serif",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "80px 100px",
      boxSizing: "border-box",
      overflow: "hidden",
    }}>
      {/* Voiceover */}
      <Audio src={
        {
          1: staticFile("assets/admindemo_voice_step1.mp3"),
          2: staticFile("assets/admindemo_voice_step2.mp3"),
          3: staticFile("assets/admindemo_voice_step3.mp3"),
        }[activeStep] || staticFile("assets/admindemo_voice.mp3")
      } />
      
      {/* Background FX */}
      <GridBackground opacity={0.02} color="16, 185, 129" />
      <SoftGradientOrb color="#10B981" size={700} x="10%" y="30%" />
      <SoftGradientOrb color="#059669" size={500} x="85%" y="75%" />
      <FloatingParticles count={25} color="#10B981" />
      <BruneiPattern opacity={0.015} />

      {/* LEFT COLUMN: Presentation info and subtitles */}
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
            <span style={{ background: "rgba(16, 185, 129, 0.15)", color: "var(--emerald)", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>
              Secure Infrastructure
            </span>
          </div>
          <h1 style={{ fontSize: 52, fontWeight: 900, letterSpacing: "-1.5px", margin: 0, lineHeight: 1.1 }}>
            SideQuest<span style={{ color: "#10b981" }}>.BN</span>
          </h1>
          <p style={{ fontSize: 20, color: "#9ca3af", margin: "6px 0 0 0", fontWeight: 500 }}>
            Brunei Gig Economy Admin Portal
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
              <h3 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 4px 0" }}>Live Escrow Audit</h3>
              <p style={{ fontSize: 14, color: "#9ca3af", margin: 0, lineHeight: 1.4 }}>Monitor system stats, active jobs, and transaction flow.</p>
            </div>
          </div>

          {/* Step 2 */}
          <div style={{ display: "flex", gap: 20, opacity: step2Opacity, transition: "opacity 0.2s ease" }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(245, 158, 11, 0.15)", border: "1.5px solid #f59e0b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: "#f59e0b" }}>
              2
            </div>
            <div>
              <h3 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 4px 0" }}>KYC Moderation Queue</h3>
              <p style={{ fontSize: 14, color: "#9ca3af", margin: 0, lineHeight: 1.4 }}>Verify profiles to maintain a high-trust, safe marketplace.</p>
            </div>
          </div>

          {/* Step 3 */}
          <div style={{ display: "flex", gap: 20, opacity: step3Opacity, transition: "opacity 0.2s ease" }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(37, 99, 235, 0.15)", border: "1.5px solid #2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: "#2563eb" }}>
              3
            </div>
            <div>
              <h3 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 4px 0" }}>Real-Time Audit Ledger</h3>
              <p style={{ fontSize: 14, color: "#9ca3af", margin: 0, lineHeight: 1.4 }}>Continuous monitoring of payment releases and security logs.</p>
            </div>
          </div>
        </div>

        {/* Dynamic Caption / Voiceover Box */}
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

      {/* RIGHT COLUMN: Mobile View of Dashboard */}
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
        {/* Touch cursor simulation */}
        {activeStep === 2 && (
          <div
            style={{
              position: "absolute",
              left: cursorX,
              top: cursorY,
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "rgba(16, 185, 129, 0.4)",
              border: "2.5px solid #10b981",
              zIndex: 9999,
              pointerEvents: "none",
              opacity: cursorOpacity,
              transform: `scale(${clickS > 0 ? interpolate(clickS, [0, 0.5, 1], [1, 0.7, 1]) : 1})`,
              boxShadow: "0 0 15px rgba(16, 185, 129, 0.5)"
            }}
          >
            {/* Pointer indicator */}
            <div style={{ position: "absolute", right: -5, bottom: -5, fontSize: 18 }}>👆</div>
          </div>
        )}

        <div style={{ filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.5))" }}>
          <PhoneFrame scale={1.05} rotateY={-6} rotateX={3}>
            {/* Screen UI Wrapper */}
            <div style={{
              width: "100%",
              height: "100%",
              background: "#0d0e12",
              color: "#ffffff",
              padding: "24px 16px",
              fontFamily: "'Inter', sans-serif",
              display: "flex",
              flexDirection: "column",
              boxSizing: "border-box"
            }}>
              
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 900, fontFamily: "Outfit", margin: 0 }}>Admin <span style={{ color: "#10b981" }}>Portal</span></h3>
                  <span style={{ fontSize: 9, color: "#9ca3af", fontWeight: 700, letterSpacing: "0.5px" }}>SYSTEM INTEGRITY MONITOR</span>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>🔔</div>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>🛡️</div>
                </div>
              </div>

              {/* Step 1 View: Dynamic Stats Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 20 }}>
                {/* Stat 1 */}
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 12 }}>
                  <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase" }}>Total Users</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#10b981", marginTop: 4 }}>{totalUsers}</div>
                </div>
                {/* Stat 2 */}
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 12 }}>
                  <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase" }}>Active Jobs</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#f59e0b", marginTop: 4 }}>{activeJobs}</div>
                </div>
                {/* Stat 3 */}
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 12, gridColumn: "span 2" }}>
                  <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase" }}>Escrow Flow</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#ffffff", marginTop: 4, display: "flex", alignItems: "baseline", gap: 4 }}>
                    <span style={{ fontSize: 11, color: "#10b981" }}>BND</span> {escrowFlow.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Step 2 View: KYC Moderation */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <h4 style={{ fontSize: 11, fontWeight: 800, fontFamily: "Outfit", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>KYC Moderation</h4>
                  <span style={{ background: "rgba(245, 158, 11, 0.12)", color: "#f59e0b", fontSize: 8, padding: "2px 6px", borderRadius: 4, fontWeight: 800 }}>Action Required</span>
                </div>

                {/* KYC Card */}
                <div style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderLeft: kycApproved ? "3px solid #10b981" : "3px solid #f59e0b",
                  transition: "all 0.3s ease",
                  borderRadius: 12,
                  padding: 12,
                  position: "relative",
                  overflow: "hidden"
                }}>
                  {/* Click Shockwave overlay */}
                  {frame >= 210 && activeStep === 2 && (
                    <div style={{
                      position: "absolute",
                      left: 175,
                      top: 48,
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      border: "2px solid #10b981",
                      opacity: shockOpacity,
                      transform: `scale(${shockScale}) translate(-50%, -50%)`,
                      transformOrigin: "center"
                    }} />
                  )}

                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👩‍🎓</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 800 }}>Sarah M.</div>
                      <div style={{ fontSize: 8, color: "#9ca3af", marginTop: 1 }}>sarah.m@utb.edu.bn</div>
                    </div>
                    <span style={{
                      fontSize: 8,
                      padding: "2px 6px",
                      borderRadius: 4,
                      fontWeight: 800,
                      background: kycApproved ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                      color: kycApproved ? "#10b981" : "#f59e0b",
                      transition: "all 0.3s ease"
                    }}>
                      {kycApproved ? "Verified ✓" : "Pending ⏳"}
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <div style={{
                      flex: 1,
                      height: 28,
                      borderRadius: 6,
                      background: kycApproved ? "#10b981" : "linear-gradient(135deg, #10b981, #059669)",
                      color: "#ffffff",
                      fontSize: 9,
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                      boxShadow: kycApproved ? "none" : "0 4px 10px rgba(16, 185, 129, 0.2)",
                      cursor: "pointer",
                      transition: "all 0.3s ease"
                    }}>
                      {kycApproved ? "Approve Complete ✅" : "Approve Profile"}
                    </div>
                    {!kycApproved && (
                      <div style={{
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        border: "1.5px solid rgba(239, 68, 68, 0.3)",
                        color: "#ef4444",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 800
                      }}>
                        ✕
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 3 View: Ledger Log Feed */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <h4 style={{ fontSize: 11, fontWeight: 800, fontFamily: "Outfit", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>Real-time Audit Ledger</h4>
                  <span style={{ background: "rgba(16, 185, 129, 0.12)", color: "#10b981", fontSize: 8, padding: "2px 6px", borderRadius: 4, fontWeight: 800 }}>Live Feed</span>
                </div>

                {/* Audit items scroll container */}
                <div style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  position: "relative",
                  maskImage: "linear-gradient(to bottom, #fff 70%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, #fff 70%, transparent 100%)",
                }}>
                  <div style={{
                    transform: `translateY(${activeStep === 3 ? scrollY : 0}px)`,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    transition: "transform 0.1s linear"
                  }}>
                    {[
                      { id: "tx-9", title: "Product Photography", desc: "Escrow funds released", amt: "+BND 120.00", status: "released", statusColor: "#10b981" },
                      { id: "tx-8", title: "Grass Cutting Gadong", desc: "Poster budget locked", amt: "BND 45.00", status: "held", statusColor: "#f59e0b" },
                      { id: "tx-7", title: "A-Level Tutor fees", desc: "Escrow funds released", amt: "+BND 80.00", status: "released", statusColor: "#10b981" },
                      { id: "tx-6", title: "Office Deep Cleaning", desc: "Payment released to provider", amt: "+BND 150.00", status: "released", statusColor: "#10b981" },
                      { id: "tx-5", title: "Parcel delivery Jerudong", desc: "Funds held in escrow", amt: "BND 15.00", status: "held", statusColor: "#f59e0b" },
                      { id: "tx-4", title: "Logo Design Amanah", desc: "Escrow funds released", amt: "+BND 250.00", status: "released", statusColor: "#10b981" }
                    ].map((tx) => (
                      <div key={tx.id} style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.04)",
                        borderRadius: 10,
                        padding: "8px 12px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}>
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 700 }}>{tx.title}</div>
                          <div style={{ fontSize: 7, color: "#9ca3af", marginTop: 2 }}>{tx.desc}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 10, fontWeight: 800, color: tx.statusColor }}>{tx.amt}</div>
                          <span style={{ fontSize: 6, textTransform: "uppercase", color: "#9ca3af", fontWeight: 700 }}>{tx.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </PhoneFrame>
        </div>
      </div>
    </AbsoluteFill>
  );
};
