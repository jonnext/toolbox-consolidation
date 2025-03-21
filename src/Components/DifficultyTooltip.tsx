import React from "react";
import { DifficultyLevel } from "./DifficultySlider";

interface DifficultyTooltipProps {
  difficulty: DifficultyLevel;
  visible: boolean;
  position: number;
}

const tooltipContent = {
  easy: {
    title: "Easy Mode",
    description: "Perfect for beginners",
    bullets: ["Simple explanations", "Basic concepts", "Real-world analogies"],
    recommended: "Those new to AWS",
  },
  medium: {
    title: "Medium Mode",
    description: "For intermediate users",
    bullets: [
      "Technical details",
      "Practical applications",
      "Implementation focus",
    ],
    recommended: "Developers with AWS experience",
  },
  hard: {
    title: "Hard Mode",
    description: "Advanced concepts",
    bullets: [
      "System architecture",
      "Performance optimization",
      "Best practices",
    ],
    recommended: "Experienced AWS engineers",
  },
  god: {
    title: "God Mode",
    description: "Think like an architect",
    bullets: ["System design", "Trade-off analysis", "Innovation reasoning"],
    recommended: "Those ready to build the next AWS",
  },
};

const DifficultyTooltip: React.FC<DifficultyTooltipProps> = ({
  difficulty,
  visible,
  position,
}) => {
  const content = tooltipContent[difficulty];

  return (
    <div
      className={`absolute z-10 w-64 transform -translate-x-1/2 bottom-full mb-4 transition-all duration-200
        ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      style={{ left: `${position}%` }}
    >
      <div className="bg-[#101828] rounded-lg p-4 shadow-lg">
        <div className="text-white">
          <h3 className="font-semibold text-base mb-1">{content.title}</h3>
          <p className="text-[#E9EEF5] text-sm mb-2">{content.description}</p>

          <ul className="space-y-1 mb-2">
            {content.bullets.map((bullet, index) => (
              <li
                key={index}
                className="text-[#E9EEF5] text-sm flex items-center"
              >
                <span className="w-1 h-1 bg-[#47CD89] rounded-full mr-2" />
                {bullet}
              </li>
            ))}
          </ul>

          <div className="text-[#E9EEF5] text-xs">
            Recommended for: {content.recommended}
          </div>
        </div>
      </div>

      {/* Tooltip arrow */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2 -bottom-2 
          border-8 border-transparent border-t-[#101828]"
      />
    </div>
  );
};

export default DifficultyTooltip;
