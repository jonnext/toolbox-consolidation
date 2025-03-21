import React from "react";
import { DifficultyLevel } from "./DifficultySlider";

interface DifficultyQuestionProps {
  difficulty: DifficultyLevel;
  topic: string;
  onQuestionChange?: (question: string) => void;
}

const questionTemplates = {
  easy: {
    prefix: "Explain in simple terms",
    suffix: "using everyday examples",
    focus: ["basic concepts", "real-world analogies", "fundamental operations"],
  },
  medium: {
    prefix: "Explain your understanding of",
    suffix: "including key features and common use cases",
    focus: [
      "technical details",
      "practical applications",
      "implementation patterns",
    ],
  },
  hard: {
    prefix: "Provide a detailed explanation of",
    suffix:
      "including architecture, performance considerations, and best practices",
    focus: ["system design", "optimization strategies", "advanced features"],
  },
  god: {
    prefix: "Architect and explain",
    suffix:
      "as if you were designing it from scratch, considering all technical decisions and trade-offs",
    focus: [
      "architectural decisions",
      "system trade-offs",
      "innovation opportunities",
    ],
  },
};

const generateQuestion = (
  difficulty: DifficultyLevel,
  topic: string
): string => {
  const template = questionTemplates[difficulty];
  const focusPoint =
    template.focus[Math.floor(Math.random() * template.focus.length)];

  return `${template.prefix} how ${topic} works, focusing on ${focusPoint}, ${template.suffix}.`;
};

const DifficultyQuestion: React.FC<DifficultyQuestionProps> = ({
  difficulty,
  topic,
  onQuestionChange,
}) => {
  const [currentQuestion, setCurrentQuestion] = React.useState("");
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  React.useEffect(() => {
    setIsTransitioning(true);

    // Fade out current question
    const timeout1 = setTimeout(() => {
      const newQuestion = generateQuestion(difficulty, topic);
      setCurrentQuestion(newQuestion);
      if (onQuestionChange) {
        onQuestionChange(newQuestion);
      }

      // Fade in new question
      const timeout2 = setTimeout(() => {
        setIsTransitioning(false);
      }, 200);

      return () => clearTimeout(timeout2);
    }, 200);

    return () => clearTimeout(timeout1);
  }, [difficulty, topic]);

  return (
    <div
      className={`transition-opacity duration-200 ease-in-out text-lg font-semibold text-[#101828] leading-7
        ${isTransitioning ? "opacity-0" : "opacity-100"}`}
    >
      {currentQuestion}
    </div>
  );
};

export default DifficultyQuestion;
