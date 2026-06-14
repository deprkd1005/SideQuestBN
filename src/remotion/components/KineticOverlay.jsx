import React from "react";
import { Sequence, AbsoluteFill } from "remotion";
import { spring } from "remotion";

// Simple fast‑cut text overlay that appears on beat
export const KineticOverlay = ({frame, fps, texts}) => {
  // texts: array of {content, startFrame, duration}
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {texts.map((t, i) => {
        const opacity = spring({frame: frame - t.startFrame, fps, config: {damping: 200, mass: 0.5}});
        const visible = frame >= t.startFrame && frame < t.startFrame + t.duration;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${20 + i * 12}%`,
              width: "100%",
              textAlign: "center",
              fontSize: "2rem",
              fontFamily: "Inter, sans-serif",
              color: "#fff",
              opacity: visible ? opacity : 0,
              transform: `scale(${1 + 0.1 * opacity})`,
            }}
          >
            {t.content}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
