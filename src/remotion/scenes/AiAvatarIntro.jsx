import React from "react";
import { AbsoluteFill, Sequence, Audio, Img, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Effects } from "../components/Effects";
import { PhoneMockup } from "../components/PhoneMockup";
import { KineticOverlay } from "../components/KineticOverlay";
import "../styles.css";

// Placeholder avatar image generated earlier (semi‑realistic AI avatar)
// Using remote placeholder avatar image
const avatarImg = "https://placehold.co/400x400?text=Avatar";

export const AiAvatarIntro = ({ duration = 900 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Dynamic frames based on duration
  const totalFrames = duration;
  const fadeIn = Math.min(30, Math.floor(duration * 0.1)); // 10% fade-in or 30 frames
  const speechStart = fadeIn;
  const speechEnd = totalFrames - Math.min(60, Math.floor(duration * 0.2)); // leave space for cut-to-black
  
  // Ambient synth track with deep bass pulses (placeholder)
  const ambientSynth = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3";

  // Simple voiceover audio placeholder – replace with actual TTS file
  const voiceoverSrc = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3";

  return (
    <AbsoluteFill style={{ background: "#0a0a1a", overflow: "hidden" }}>
      {/* Ambient particles */}
      <Effects />

      {/* Kinetic overlay text on beat */}
      <KineticOverlay
        frame={frame}
        fps={fps}
        texts={[
          { content: "Fast", startFrame: 30, duration: 30 },
          { content: "Secure", startFrame: 90, duration: 30 },
          { content: "Earn", startFrame: 150, duration: 30 },
          { content: "Trust", startFrame: 210, duration: 30 },
        ]}
      />

      {/* Floating holographic UI elements – can be simple semi‑transparent boxes */}
      <Sequence from={0} durationInFrames={totalFrames}>
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "10%",
            width: "80%",
            height: "60%",
            border: "2px solid rgba(0, 150, 255, 0.4)",
            boxShadow: "0 0 30px rgba(0, 150, 255, 0.3)",
            backdropFilter: "blur(8px)",
          }}
        />
      </Sequence>

      {/* Avatar appearance with glitch/fade‑in */}
      <Sequence from={fadeIn} durationInFrames={120}>
        <Img
          src={avatarImg}
          style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "40%",
            opacity: spring({ frame, fps: 30, config: { damping: 200, mass: 0.5 } }),
          }}
        />
      </Sequence>

      {/* Voiceover text captions */}
      <Sequence from={speechStart} durationInFrames={speechEnd - speechStart}>
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            width: "100%",
            textAlign: "center",
            color: "#e0e8ff",
            fontFamily: "Inter, sans-serif",
            fontSize: "2rem",
            lineHeight: "1.4",
            padding: "0 5%",
          }}
        >
          Hello. I am SideQuest.BN.<br />
          <br />
          Have you ever struggled to find trusted opportunities online?<br />
          <br />
          Maybe you’re a student searching for income…<br />
          a freelancer looking for secure clients…<br />
          or a business trying to find reliable local talent.<br />
          <br />
          In Brunei, opportunities exist everywhere.<br />
          <br />
          But trust, security, and connection are still missing.<br />
          <br />
          Until now.
        </div>
      </Sequence>

      {/* Cut to black and logo impact – 2 seconds */}
      <Sequence from={speechEnd} durationInFrames={60}>
        {/* Fade to black */}
        <div
          style={{
            ...AbsoluteFill.style,
            background: "black",
            opacity: spring({ frame: 0, fps: 30, config: { damping: 200, mass: 0.5 } }) ,
          }}
        />
        {/* Logo reveal – use existing LogoReveal component logic or simple animation */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "4rem",
            fontFamily: "Inter, sans-serif",
            fontWeight: "bold",
            color: "#00c7ff",
            opacity: spring({ frame: 30, fps: 30, config: { damping: 200, mass: 0.5 } }) ,
          }}
        >
          SideQuest.BN
        </div>
      </Sequence>

      {/* Background music – ambient synth with bass */}
      <Audio
        src={ambientSynth}
        startFrom={0}
        endAt={totalFrames / 30}
        volume={0.5}
      />
      {/* Voiceover audio */}
      <Audio src={voiceoverSrc} startFrom={speechStart / 30} endAt={speechEnd / 30} volume={0.8} />
    </AbsoluteFill>
  );
};
