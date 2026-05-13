import { Composition } from "remotion";
import { SideQuestIntro } from "./SideQuestIntro";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="SideQuestIntro"
        component={SideQuestIntro}
        durationInFrames={600} /* Snappy 20 seconds */
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
