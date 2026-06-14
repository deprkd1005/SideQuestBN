import React from "react";
import { interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";

export const AppInterface = ({ phase, subFrame }) => {
  const currentFrame = useCurrentFrame();
  // Use passed subFrame if available, otherwise fallback to hook
  const frame = subFrame !== undefined ? subFrame : currentFrame;
  const { fps } = useVideoConfig();

  // If no phase is provided, default to a timeline loop
  const activePhase = phase || (frame < 60 ? "home" : frame < 120 ? "posting" : frame < 180 ? "success" : "payment");

  // Animate cursor typing for "posting"
  const textTitle = "Product Photo Shoot";
  const typedTitle = activePhase === "posting"
    ? textTitle.slice(0, Math.floor(interpolate(frame % 60, [10, 45], [0, textTitle.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })))
    : textTitle;

  const textBudget = "BND 120.00";
  const typedBudget = activePhase === "posting"
    ? (frame % 60 > 40 ? textBudget : "")
    : textBudget;

  return (
    <div style={{
      width: "100%",
      height: "100%",
      background: "#FFFFFF",
      padding: "20px 16px",
      fontFamily: "'Inter', sans-serif",
      color: "#1A1A2E",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box"
    }}>
      {/* Top Status Bar */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: 11,
        fontWeight: 600,
        marginBottom: 15,
        opacity: 0.6,
        letterSpacing: "0.05em",
        color: "#1A1A2E"
      }}>
        <div>9:41</div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span>5G</span>
          <span>📶</span>
          <span>🔋</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column" }}>

        {/* PHASE 1: HOME FEED */}
        {activePhase === "home" && (
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
              <div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>Location</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#2563EB" }}>📍 Gadong, Brunei</div>
              </div>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#FFFFFF" }}>👤</div>
            </div>

            {/* Promo Card */}
            <div style={{
              background: "linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)",
              borderRadius: 16,
              padding: 15,
              border: "1px solid rgba(0, 0, 0, 0.06)",
              marginBottom: 15,
              position: "relative",
              overflow: "hidden"
            }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#1A1A2E", marginBottom: 4 }}>Earn Side Income</div>
              <div style={{ fontSize: 10, color: "#6B7280", lineHeight: 1.3 }}>Find trusted freelance gigs around you instantly.</div>
              {/* Decorative Glow */}
              <div style={{ position: "absolute", right: -20, bottom: -20, width: 60, height: 60, borderRadius: "50%", background: "#06B6D4", filter: "blur(30px)", opacity: 0.15 }} />
            </div>

            {/* Search Bar */}
            <div style={{
              height: 40,
              background: "#F3F4F6",
              borderRadius: 12,
              border: "1px solid rgba(0, 0, 0, 0.06)",
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
              color: "#9CA3AF",
              fontSize: 12,
              marginBottom: 15
            }}>
              🔍 Search gigs in Brunei...
            </div>

            {/* Gigs List */}
            <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", letterSpacing: "0.1em", textTransform: "uppercase" }}>Gigs Nearby</div>

              {[
                { title: "Website Bug Fix", client: "Amanah Corp", price: "BND 80", type: "Tech", badge: "Verified Client", color: "#2563EB" },
                { title: "Event Photography", client: "Sarah M. (Wedding)", price: "BND 150", type: "Media", badge: "Verified Student", color: "#06B6D4" },
                { title: "O-Level Physics Tutor", client: "Haji Rosli", price: "BND 40/hr", type: "Tuition", badge: "Secured", color: "#10B981" }
              ].map((gig, idx) => (
                <div key={idx} style={{
                  background: "#F9FAFB",
                  border: "1px solid rgba(0, 0, 0, 0.06)",
                  borderRadius: 12,
                  padding: 10,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)"
                }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#1A1A2E" }}>{gig.title}</div>
                    <div style={{ fontSize: 10, color: "#6B7280", marginTop: 2 }}>{gig.client}</div>
                    <span style={{
                      fontSize: 8,
                      padding: "2px 6px",
                      borderRadius: 4,
                      background: `${gig.color}12`,
                      color: gig.color,
                      fontWeight: 800,
                      display: "inline-block",
                      marginTop: 4
                    }}>{gig.badge}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: "#10B981" }}>{gig.price}</div>
                </div>
              ))}
            </div>

            {/* Floating Action Button */}
            <div style={{
              position: "absolute",
              bottom: 20,
              right: 10,
              width: 50,
              height: 50,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #2563EB, #06B6D4)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              fontWeight: "bold",
              boxShadow: "0 8px 24px rgba(37, 99, 235, 0.3)",
              cursor: "pointer"
            }}>
              +
            </div>
          </div>
        )}

        {/* PHASE 2: POSTING FORM */}
        {activePhase === "posting" && (
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 15, borderBottom: "1px solid rgba(0, 0, 0, 0.06)", paddingBottom: 10, color: "#1A1A2E" }}>Post a New Quest</div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
              <div>
                <label style={{ fontSize: 10, color: "#6B7280", display: "block", marginBottom: 4, fontWeight: 600, letterSpacing: "0.05em" }}>QUEST TITLE</label>
                <div style={{
                  height: 38,
                  background: "#F3F4F6",
                  borderRadius: 10,
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  padding: "10px 12px",
                  fontSize: 12,
                  color: "#1A1A2E",
                  display: "flex",
                  alignItems: "center"
                }}>
                  {typedTitle}
                  <span style={{ width: 2, height: 14, background: "var(--color-primary)", marginLeft: 2, opacity: frame % 15 > 7 ? 1 : 0 }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 10, color: "#6B7280", display: "block", marginBottom: 4, fontWeight: 600, letterSpacing: "0.05em" }}>BUDGET (BND)</label>
                <div style={{
                  height: 38,
                  background: "#F3F4F6",
                  borderRadius: 10,
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  padding: "10px 12px",
                  fontSize: 12,
                  color: "#10B981",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center"
                }}>
                  {typedBudget}
                  {frame % 60 <= 40 && frame % 60 > 30 && <span style={{ width: 2, height: 14, background: "var(--color-primary)", marginLeft: 2 }} />}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 10, color: "#6B7280", display: "block", marginBottom: 4, fontWeight: 600, letterSpacing: "0.05em" }}>CATEGORY</label>
                <div style={{
                  height: 38,
                  background: "#F3F4F6",
                  borderRadius: 10,
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  padding: "10px 12px",
                  fontSize: 12,
                  color: "#1A1A2E",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}>
                  <span>Photography & Media</span>
                  <span style={{ fontSize: 8, color: "#6B7280" }}>▼</span>
                </div>
              </div>

              <div style={{
                marginTop: 20,
                height: 48,
                background: frame % 60 > 45 ? "#10B981" : "#F3F4F6",
                borderRadius: 12,
                border: frame % 60 > 45 ? "none" : "1px solid rgba(0, 0, 0, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: frame % 60 > 45 ? "#FFFFFF" : "#6B7280",
                fontWeight: 800,
                fontSize: 13,
                boxShadow: frame % 60 > 45 ? "0 8px 20px rgba(16, 185, 129, 0.25)" : "none",
              }}>
                Secure Deposit & Post
              </div>
            </div>
          </div>
        )}

        {/* PHASE 3: SUCCESS & MATCHING */}
        {activePhase === "success" && (
          <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "center", alignItems: "center" }}>
            <div style={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              background: "rgba(16, 185, 129, 0.08)",
              border: "2px solid #10B981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              marginBottom: 20,
              boxShadow: "0 4px 16px rgba(16, 185, 129, 0.15)",
              transform: `scale(${spring({ frame: frame % 60, fps, config: { damping: 10 } })})`
            }}>
              ✓
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 8, textAlign: "center", color: "#1A1A2E" }}>Quest Active!</div>
            <div style={{ fontSize: 11, color: "#6B7280", textAlign: "center", marginBottom: 25, maxWidth: 200 }}>
              BND 120.00 is secured in escrow. Finding local freelancers...
            </div>

            {/* Hustler Card Pop In */}
            {frame % 60 > 20 && (
              <div style={{
                width: "100%",
                background: "#F3F4F6",
                border: "1px solid rgba(0, 0, 0, 0.06)",
                borderRadius: 16,
                padding: 12,
                transform: `translateY(${interpolate(spring({ frame: (frame % 60) - 20, fps }), [0, 1], [30, 0])}px)`,
                opacity: interpolate(frame % 60, [20, 28], [0, 1]),
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)"
              }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👩‍🎓</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#1A1A2E" }}>Sarah M.</div>
                    <div style={{ fontSize: 9, color: "#2563EB", fontWeight: 600 }}>UTB Student • verified</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: "#10B981" }}>★ 4.9</div>
                    <div style={{ fontSize: 8, color: "#6B7280" }}>24 Quests</div>
                  </div>
                </div>
                <div style={{
                  marginTop: 10,
                  height: 28,
                  background: "#2563EB",
                  color: "#FFFFFF",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 800
                }}>
                  Accept Offer
                </div>
              </div>
            )}
          </div>
        )}

        {/* PHASE 4: PAYMENT / ESCROW */}
        {activePhase === "payment" && (
          <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "center", alignItems: "center", textAlign: "center" }}>

            {/* Escrow Lock Visualizer */}
            <div style={{ position: "relative", marginBottom: 25 }}>
              <div style={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                background: "rgba(37, 99, 235, 0.06)",
                border: "2px solid #2563EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 40,
                boxShadow: "0 4px 20px rgba(37, 99, 235, 0.12)"
              }}>
                🔒
              </div>

              {/* Unlocking animation overlay */}
              {frame % 120 > 50 && (
                <div style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: "rgba(16, 185, 129, 0.06)",
                  border: "2px solid #10B981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 40,
                  boxShadow: "0 4px 20px rgba(16, 185, 129, 0.15)",
                  transform: `scale(${spring({ frame: (frame % 120) - 50, fps })})`,
                  opacity: interpolate(frame % 120, [50, 55], [0, 1]),
                  zIndex: 2
                }}>
                  🔓
                </div>
              )}
            </div>

            <div style={{ fontSize: 13, color: "#6B7280", fontWeight: 500 }}>
              {frame % 120 > 50 ? "Escrow Payment Released" : "Funds Held Securely in Escrow"}
            </div>

            <div style={{
              fontSize: 32,
              fontWeight: 950,
              color: frame % 120 > 50 ? "#10B981" : "#1A1A2E",
              marginTop: 8,
              letterSpacing: "-0.02em",
              textShadow: frame % 120 > 50 ? "0 2px 8px rgba(16, 185, 129, 0.15)" : "none"
            }}>
              {frame % 120 > 50 ? "+BND 120.00" : "BND 120.00"}
            </div>

            {/* Verification Tag */}
            <div style={{
              marginTop: 15,
              padding: "4px 12px",
              background: "rgba(16, 185, 129, 0.06)",
              border: "1px solid rgba(16, 185, 129, 0.15)",
              borderRadius: 20,
              fontSize: 9,
              color: "#10B981",
              fontWeight: 700,
              letterSpacing: "0.05em",
              display: "inline-flex",
              alignItems: "center",
              gap: 4
            }}>
              🛡️ SECURED GIG TRANSACTION
            </div>
          </div>
        )}
      </div>

      {/* Navigation Bar at Bottom */}
      <div style={{
        height: 48,
        borderTop: "1px solid #E5E7EB",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        fontSize: 18,
        opacity: 0.9,
        marginTop: 10
      }}>
        <div style={{ color: activePhase === "home" ? "#2563EB" : "#6B7280" }}>🏠</div>
        <div style={{ color: activePhase === "posting" ? "#2563EB" : "#6B7280" }}>📝</div>
        <div style={{ color: activePhase === "success" ? "#2563EB" : "#6B7280" }}>🔔</div>
        <div style={{ color: activePhase === "payment" ? "#2563EB" : "#6B7280" }}>💼</div>
      </div>
    </div>
  );
};
