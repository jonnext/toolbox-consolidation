import React, { useState, useRef, useEffect } from "react";
import { ChevronsLeftRight } from "lucide-react";

export type DifficultyLevel = "easy" | "medium" | "hard" | "god";

interface DifficultySliderProps {
  initialDifficulty?: DifficultyLevel;
  onDifficultyChange: (difficulty: DifficultyLevel) => void;
}

const difficultyStops = {
  easy: 0,
  medium: 33.33,
  hard: 66.66,
  god: 100,
};

const DifficultySlider: React.FC<DifficultySliderProps> = ({
  initialDifficulty = "easy",
  onDifficultyChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(
    difficultyStops[initialDifficulty]
  );
  const [currentDifficulty, setCurrentDifficulty] =
    useState<DifficultyLevel>(initialDifficulty);
  const sliderRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const calculateDifficulty = (position: number): DifficultyLevel => {
    if (position <= 25) return "easy";
    if (position <= 58.33) return "medium";
    if (position <= 91.66) return "hard";
    return "god";
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updatePosition(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    updatePosition(e);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Snap to nearest difficulty
    const nearestDifficulty = calculateDifficulty(currentPosition);
    setCurrentPosition(difficultyStops[nearestDifficulty]);
    setCurrentDifficulty(nearestDifficulty);
    onDifficultyChange(nearestDifficulty);
  };

  const updatePosition = (e: React.MouseEvent | MouseEvent) => {
    if (!trackRef.current || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const handleWidth = 48; // 12 * 4 (w-12 = 3rem = 48px)
    const containerPadding = 12; // px-3 = 0.75rem = 12px

    // Calculate the effective track width (container width minus handle width and padding)
    const effectiveTrackWidth = containerRect.width - handleWidth;

    // Calculate position relative to the container's left edge
    const relativeX = e.clientX - containerRect.left - handleWidth / 2;

    // Calculate percentage position with bounds checking
    const boundedX = Math.max(0, Math.min(relativeX, effectiveTrackWidth));
    const position = (boundedX / effectiveTrackWidth) * 100;

    setCurrentPosition(position);
    const newDifficulty = calculateDifficulty(position);
    if (newDifficulty !== currentDifficulty) {
      setCurrentDifficulty(newDifficulty);
      onDifficultyChange(newDifficulty);
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="relative w-[616px] h-12" ref={containerRef}>
      <div
        ref={trackRef}
        className="w-full h-12 bg-[#F1F0EF] border border-[#DEDBD9] rounded-[32px] px-1 py-3.5 flex items-center cursor-pointer"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center justify-between w-full px-3">
          <span
            className={`text-xs font-['FK_Grotesk_Neue'] ${
              currentDifficulty === "easy" ? "text-[#101828]" : "text-[#B0ABA8]"
            }`}
          >
            Easy
          </span>
          <div className="w-[105px] h-[0.58px] bg-[#D0CCC9]" />
          <span
            className={`text-xs font-['FK_Grotesk_Neue'] ${
              currentDifficulty === "medium"
                ? "text-[#101828]"
                : "text-[#B0ABA8]"
            }`}
          >
            Medium
          </span>
          <div className="w-[105px] h-[0.58px] bg-[#D0CCC9]" />
          <span
            className={`text-xs font-['FK_Grotesk_Neue'] ${
              currentDifficulty === "hard" ? "text-[#101828]" : "text-[#B0ABA8]"
            }`}
          >
            Hard
          </span>
          <div className="w-[105px] h-[0.58px] bg-[#D0CCC9]" />
          <span
            className={`text-xs font-['FK_Grotesk_Neue'] ${
              currentDifficulty === "god" ? "text-[#101828]" : "text-[#B0ABA8]"
            }`}
          >
            God
          </span>
        </div>
      </div>

      {/* Slider handle */}
      <div
        ref={sliderRef}
        className={`absolute top-0 flex items-center justify-center w-12 h-12 bg-white border border-[#ECEBE9] rounded-full transform -translate-x-1/2 cursor-pointer transition-transform ${
          isDragging ? "scale-105" : ""
        }`}
        style={{
          left: `${currentPosition}%`,
          transition: isDragging ? "none" : "all 0.3s ease",
        }}
      >
        <ChevronsLeftRight className="w-7 h-7 text-[#101828]" />
      </div>
    </div>
  );
};

export default DifficultySlider;
