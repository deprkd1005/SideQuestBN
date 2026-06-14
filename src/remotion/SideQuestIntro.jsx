import React from "react";
import { AbsoluteFill, Sequence, Audio } from "remotion";
import { AiAvatarIntro } from "./scenes/AiAvatarIntro";
import { PlatformShowcase } from "./scenes/PlatformShowcase";
import { EscrowShowcase } from "./scenes/EscrowShowcase";
import { Vision } from "./scenes/Vision";
import { ActionCall } from "./scenes/ActionCall";
import "./styles.css";

export const SideQuestIntro = () => {
  return (
    <AbsoluteFill
      style={{
        background: "#FAFBFE",
        overflow: "hidden",
      }}
    >
      {/* Audio track */}
      <Audio
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        volume={0.5}
      />

        {/* Scene 1: Avatar Intro */}
        <Sequence from={0} durationInFrames={1800}>
          <AiAvatarIntro />
        </Sequence>

        {/* Scene 2: Platform Showcase */}
        <Sequence from={1800} durationInFrames={1050}>
          <PlatformShowcase />
        </Sequence>

        {/* Scene 3: Escrow Showcase */}
        <Sequence from={2850} durationInFrames={1050}>
          <EscrowShowcase />
        </Sequence>

        {/* Scene 4: Vision */}
        <Sequence from={3900} durationInFrames={450}>
          <Vision />
        </Sequence>

        {/* Scene 5: Action Call */}
        <Sequence from={4350} durationInFrames={300}>
          <ActionCall />
        </Sequence>

      {/* Subtle white edge vignette */}
      <AbsoluteFill
        style={{
          boxShadow: "inset 0 0 150px rgba(250, 251, 254, 0.4)",
          pointerEvents: "none",
          zIndex: 999,
        }}
      />
    </AbsoluteFill>
  );
};
