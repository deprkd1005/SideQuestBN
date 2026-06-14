import React from "react";
import { AbsoluteFill, Sequence, Audio } from "remotion";
import { LogoReveal } from "./scenes/LogoReveal";
import { AiAvatarIntro } from "./scenes/AiAvatarIntro";
import { Struggle } from "./scenes/Struggle";
import { BrokenSystem } from "./scenes/BrokenSystem";
import { PlatformShowcase } from "./scenes/PlatformShowcase";
import { EscrowShowcase } from "./scenes/EscrowShowcase";
import { HustlerDemo } from "./scenes/HustlerDemo";
import { PosterDemo } from "./scenes/PosterDemo";
import { AdminDemo } from "./scenes/AdminDemo";
import { Vision } from "./scenes/Vision";
import { ActionCall } from "./scenes/ActionCall";
import "./styles.css";

export const SideQuestBranding = () => {
  return (
    <AbsoluteFill
      style={{
        background: "#FAFBFE",
        overflow: "hidden",
      }}
    >
      {/* Dynamic background background music track */}
      <Audio
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        volume={0.4}
      />

      {/* Scene 1: Logo Reveal (1.5s = 45 frames) */}
      <Sequence from={0} durationInFrames={45}>
        <LogoReveal duration={45} />
      </Sequence>

      {/* Scene 2: AI Avatar Intro (10s = 300 frames) */}
      <Sequence from={45} durationInFrames={300}>
        <AiAvatarIntro duration={300} />
      </Sequence>

      {/* Scene 3: The Struggle (3.5s = 105 frames) */}
      <Sequence from={345} durationInFrames={105}>
        <Struggle duration={105} />
      </Sequence>

      {/* Scene 4: Broken System (3.5s = 105 frames) */}
      <Sequence from={450} durationInFrames={105}>
        <BrokenSystem duration={105} />
      </Sequence>

      {/* Scene 5: Platform Showcase (6.5s = 195 frames) */}
      <Sequence from={555} durationInFrames={195}>
        <PlatformShowcase duration={195} />
      </Sequence>

      {/* Scene 6: Escrow Showcase (6.5s = 195 frames) */}
      <Sequence from={750} durationInFrames={195}>
        <EscrowShowcase duration={195} />
      </Sequence>

      {/* Scene 7: Hustler Demo (10s = 300 frames) */}
      <Sequence from={945} durationInFrames={300}>
        <HustlerDemo duration={300} />
      </Sequence>

      {/* Scene 8: Poster Demo (10s = 300 frames) */}
      <Sequence from={1245} durationInFrames={300}>
        <PosterDemo duration={300} />
      </Sequence>

      {/* Scene 9: Admin Demo (5s = 150 frames) */}
      <Sequence from={1545} durationInFrames={150}>
        <AdminDemo duration={150} />
      </Sequence>

      {/* Scene 10: Vision (2.5s = 75 frames) */}
      <Sequence from={1695} durationInFrames={75}>
        <Vision duration={75} />
      </Sequence>

      {/* Scene 11: Call to Action (1s / 30 frames to reach exactly 1800 frames) */}
      <Sequence from={1770} durationInFrames={30}>
        <ActionCall duration={30} />
      </Sequence>

      {/* Subtle white edge vignette overlay for cinema aesthetics */}
      <AbsoluteFill
        style={{
          boxShadow: "inset 0 0 150px rgba(250, 251, 254, 0.45)",
          pointerEvents: "none",
          zIndex: 999,
        }}
      />
    </AbsoluteFill>
  );
};
