import { Composition } from "remotion";
import { SideQuestIntro } from "./SideQuestIntro";
import { SideQuestBranding } from "./SideQuestBranding";
import { AdminDemo } from "./scenes/AdminDemo";
import { HustlerDemo } from "./scenes/HustlerDemo";
import { PosterDemo } from "./scenes/PosterDemo";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="SideQuestBranding"
        component={SideQuestBranding}
        durationInFrames={1800} /* 1 minute at 30fps */
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SideQuestIntro"
        component={SideQuestIntro}
        durationInFrames={5400} /* 3 minutes at 30fps */
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AdminDemo"
        component={AdminDemo}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="HustlerDemo"
        component={HustlerDemo}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="PosterDemo"
        component={PosterDemo}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};

