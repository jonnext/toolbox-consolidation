import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import { useEffect } from "react";
import "./AnimationComponent.css";

interface AnimationComponentProps {
  isPlaying?: boolean;
  stateMachineName?: string;
  animationName?: string;
  riveFile: string;
}

const AnimationComponent = ({
  isPlaying = true,
  stateMachineName,
  animationName,
  riveFile,
}: AnimationComponentProps) => {
  const { rive, RiveComponent } = useRive({
    src: riveFile,
    stateMachines: stateMachineName ? [stateMachineName] : undefined,
    animations: animationName ? [animationName] : undefined,
    autoplay: isPlaying,
  });

  useEffect(() => {
    if (rive) {
      // You can add additional logic here to control the animation
      if (isPlaying) {
        rive.play();
      } else {
        rive.pause();
      }
    }
  }, [rive, isPlaying]);

  return (
    <div className="animation-container">
      <RiveComponent />
    </div>
  );
};

export default AnimationComponent;
