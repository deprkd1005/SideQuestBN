import React from "react";
import { AbsoluteFill, interpolate } from "remotion";

export const PhoneFrame = ({ children, scale = 1, rotateY = 0, rotateX = 0, translateZ = 0 }) => {
  return (
    <div
      style={{
        width: 320,
        height: 650,
        backgroundColor: "#111",
        borderRadius: 45,
        padding: 12,
        boxShadow: `
          0 20px 50px rgba(0,0,0,0.5),
          0 0 0 2px #333,
          inset 0 0 10px rgba(255,255,255,0.1)
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
          backgroundColor: "#06060F",
          borderRadius: 35,
          overflow: "hidden",
          position: "relative",
          border: "1px solid #222",
        }}
      >
        {children}
      </div>

      {/* Notch / Dynamic Island */}
      <div
        style={{
          position: "absolute",
          top: 25,
          left: "50%",
          transform: "translateX(-50%)",
          width: 80,
          height: 25,
          backgroundColor: "#000",
          borderRadius: 15,
          zIndex: 10,
        }}
      />

      {/* Side Buttons */}
      <div style={{ position: "absolute", left: -3, top: 120, width: 3, height: 40, backgroundColor: "#333", borderRadius: "2px 0 0 2px" }} />
      <div style={{ position: "absolute", left: -3, top: 170, width: 3, height: 60, backgroundColor: "#333", borderRadius: "2px 0 0 2px" }} />
      <div style={{ position: "absolute", right: -3, top: 150, width: 3, height: 80, backgroundColor: "#333", borderRadius: "0 2px 2px 0" }} />
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
          <pattern id="tenunan" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M0 50 L50 0 L100 50 L50 100 Z" fill="none" stroke="#FFD700" strokeWidth="0.5" opacity="0.3" />
            <circle cx="50" cy="50" r="2" fill="#FFD700" opacity="0.5" />
            <path d="M0 0 L100 100 M100 0 L0 100" stroke="#00D4AA" strokeWidth="0.2" opacity="0.2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#tenunan)" />
      </svg>
      
      {/* Subtle overlay gradient to fade the pattern edges */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(circle, transparent 20%, #06060F 90%)"
      }} />
    </div>
  );
};
