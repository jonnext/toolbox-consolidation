import { Edit } from "lucide-react";
import Tooltip from "./Tooltip";
import { DifficultyLevel } from "./DifficultySlider";

interface SecondaryActionsContainerProps {
  onDifficultyToggle: () => void;
  isDifficultyMode: boolean;
  currentDifficulty: DifficultyLevel;
}

const difficultyConfig = {
  easy: {
    text: "Easy mode",
    dotColor: "#47CD89",
    labelColor: "#1B191F",
  },
  medium: {
    text: "Medium mode",
    dotColor: "#F79009",
    labelColor: "#1B191F",
  },
  hard: {
    text: "Hard mode",
    dotColor: "#F04438",
    labelColor: "#1B191F",
  },
  expert: {
    text: "Expert mode",
    dotColor: "#7A1BF2",
    labelColor: "#1B191F",
  },
};

const SecondaryActionsContainer: React.FC<SecondaryActionsContainerProps> = ({
  onDifficultyToggle,
  isDifficultyMode,
  currentDifficulty,
}) => {
  const config = difficultyConfig[currentDifficulty];

  return (
    <div className="flex items-center gap-2">
      <Tooltip message="Save draft">
        <button className="w-9 h-9 flex items-center justify-center rounded-lg p-2 hover:bg-gray-100 transition-colors">
          <Edit className="w-5 h-5 text-[#9F988E]" />
        </button>
      </Tooltip>

      <Tooltip message="Toggle difficulty">
        <button
          className={`h-9 px-3 py-2 flex items-center gap-1 rounded-lg transition-colors
            ${
              isDifficultyMode
                ? "bg-[#F9FAFB] border border-[#E5E7EB]"
                : "hover:bg-gray-100"
            }`}
          onClick={onDifficultyToggle}
        >
          <div className="relative">
            <div
              className="absolute w-2 h-2 rounded-full left-0 top-[6px]"
              style={{ backgroundColor: config.dotColor }}
            />
            <span
              className="text-sm font-['FK_Grotesk_Neue'] tracking-[-0.4px] pl-3"
              style={{ color: config.labelColor }}
            >
              {config.text}
            </span>
          </div>
        </button>
      </Tooltip>
    </div>
  );
};

export default SecondaryActionsContainer;
