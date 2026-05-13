import React from "react";
import { interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";

export const AppInterface = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* ── Scene Timing ── */
  // 0-60: Home
  // 60-120: Posting
  // 120-180: Success
  // 180-240: Payment
  
  const scene = frame < 60 ? "home" : frame < 120 ? "posting" : frame < 180 ? "success" : "payment";

  /* ── Tap Animation ── */
  const tapFrame = frame % 60;
  const tapScale = spring({ frame: tapFrame, fps, config: { damping: 10 } });
  const showTap = (frame > 40 && frame < 60) || (frame > 100 && frame < 120);

  return (
    <div style={{ width: "100%", height: "100%", background: "white", padding: 20, fontFamily: "'Inter', sans-serif", color: "#111827", position: "relative" }}>
      {/* Status Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, marginBottom: 20, opacity: 0.5 }}>
        <div>9:41</div>
        <div style={{ display: "flex", gap: 5 }}>📶 🔋</div>
      </div>

      {/* Screen Content */}
      <div style={{ position: "relative", height: "100%" }}>
        {scene === "home" && (
          <div>
            <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 20 }}>Find a <span style={{ color: "#00A682" }}>Quest</span></div>
            <div style={{ height: 120, background: "linear-gradient(135deg, #00A682, #6366F1)", borderRadius: 20, marginBottom: 20 }} />
            <div style={{ height: 60, background: "#F3F4F6", borderRadius: 15, display: "flex", alignItems: "center", padding: "0 20px", color: "#9CA3AF" }}>Search jobs...</div>
            
            {/* FAB Button */}
            <div style={{ 
              position: "absolute", 
              bottom: 150, 
              right: 10, 
              width: 60, 
              height: 60, 
              borderRadius: "50%", 
              background: "#111827", 
              color: "white", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              fontSize: 30,
              boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
            }}>
              +
            </div>
          </div>
        )}

        {scene === "posting" && (
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>Post your Quest</div>
            <div style={{ marginBottom: 15 }}>
               <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 5 }}>TITLE</div>
               <div style={{ height: 45, background: "#F9FAFB", borderRadius: 10, border: "1px solid #EEE", padding: "12px", fontSize: 14 }}>Delivery to Gadong</div>
            </div>
            <div style={{ marginBottom: 15 }}>
               <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 5 }}>BUDGET</div>
               <div style={{ height: 45, background: "#F9FAFB", borderRadius: 10, border: "1px solid #EEE", padding: "12px", fontSize: 14 }}>BND 25.00</div>
            </div>
            <div style={{ 
              marginTop: 30, 
              height: 55, 
              background: "#00A682", 
              borderRadius: 15, 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              color: "white", 
              fontWeight: 800 
            }}>
              Post Now
            </div>
          </div>
        )}

        {scene === "success" && (
           <div style={{ textAlign: "center", paddingTop: 100 }}>
              <div style={{ fontSize: 80, marginBottom: 20 }}>✅</div>
              <div style={{ fontSize: 24, fontWeight: 900 }}>Quest Posted!</div>
              <div style={{ fontSize: 14, color: "#6B7280", marginTop: 10 }}>Hustlers are being notified.</div>
           </div>
        )}

        {scene === "payment" && (
           <div style={{ textAlign: "center", paddingTop: 80 }}>
              <div style={{ 
                width: 100, 
                height: 100, 
                background: "#00A68211", 
                borderRadius: "50%", 
                margin: "0 auto 30px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                fontSize: 50
              }}>
                💰
              </div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>Payment Received</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#00A682", marginTop: 10 }}>+BND 25.00</div>
           </div>
        )}
      </div>

      {/* Tap Visualizer */}
      {showTap && (
        <div style={{ 
          position: "absolute", 
          top: scene === "home" ? "80%" : "60%", 
          left: scene === "home" ? "85%" : "50%", 
          width: 40, 
          height: 40, 
          borderRadius: "50%", 
          background: "rgba(0,166,130,0.4)", 
          transform: `scale(${interpolate(tapScale, [0, 1], [0, 2])})`,
          opacity: interpolate(tapScale, [0, 1], [1, 0]),
          pointerEvents: "none",
          zIndex: 100
        }} />
      )}
    </div>
  );
};
