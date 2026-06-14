import React from "react";

export const PhoneFrame = ({ children, scale = 1, rotateY = 0, rotateX = 0, translateZ = 0, shadowColor = "rgba(37, 99, 235, 0.12)" }) => {
  return (
    <div
      style={{
        width: 320,
        height: 650,
        backgroundColor: "#F8F9FA",
        borderRadius: 50,
        padding: 12,
        boxShadow: `
          0 20px 60px rgba(0, 0, 0, 0.15),
          0 0 0 1px rgba(0, 0, 0, 0.04),
          0 8px 24px ${shadowColor},
          inset 0 1px 0px rgba(255, 255, 255, 0.9)
        `,
        position: "relative",
        transform: `perspective(1200px) scale(${scale}) rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateZ(${translateZ}px)`,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Screen */}
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#FFFFFF",
          borderRadius: 40,
          overflow: "hidden",
          position: "relative",
          border: "1px solid rgba(0, 0, 0, 0.06)",
        }}
      >
        {children}
      </div>

      {/* Notch / Dynamic Island */}
      <div
        style={{
          position: "absolute",
          top: 24,
          left: "50%",
          transform: "translateX(-50%)",
          width: 90,
          height: 28,
          backgroundColor: "#1A1A2E",
          borderRadius: 14,
          zIndex: 99,
        }}
      />

      {/* Glossy Reflection Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 12,
          borderRadius: 40,
          background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%)",
          pointerEvents: "none",
          zIndex: 98,
        }}
      />

      {/* Side Buttons */}
      <div style={{ position: "absolute", left: -3, top: 120, width: 3, height: 40, backgroundColor: "#D1D5DB", borderRadius: "2px 0 0 2px" }} />
      <div style={{ position: "absolute", left: -3, top: 170, width: 3, height: 60, backgroundColor: "#D1D5DB", borderRadius: "2px 0 0 2px" }} />
      <div style={{ position: "absolute", right: -3, top: 150, width: 3, height: 80, backgroundColor: "#D1D5DB", borderRadius: "0 2px 2px 0" }} />
    </div>
  );
};

export const BruneiPattern = ({ opacity = 0.1 }) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      {/* Geometric Weaving Pattern (Tenunan) */}
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="tenunan" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
            <path d="M0 60 L60 0 L120 60 L60 120 Z" fill="none" stroke="#F59E0B" strokeWidth="0.8" opacity="0.2" />
            <circle cx="60" cy="60" r="3" fill="#2563EB" opacity="0.15" />
            <path d="M0 0 L120 120 M120 0 L0 120" stroke="#2563EB" strokeWidth="0.4" opacity="0.1" />
            <rect x="54" y="54" width="12" height="12" fill="none" stroke="#F59E0B" strokeWidth="0.5" transform="rotate(45 60 60)" opacity="0.2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#tenunan)" />
      </svg>

      {/* Subtle overlay gradient to fade the pattern edges */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(circle at center, transparent 10%, #FAFBFE 85%)"
      }} />
    </div>
  );
};
