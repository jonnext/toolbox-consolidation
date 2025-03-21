import { useState, useEffect } from "react";
import { calculateRemainingChars, hasMinimumWords } from "../utils/formatters";

interface CharacterLimitOptions {
  maxLength: number;
  initialText?: string;
  requiredWordCount?: number;
}

export const useCharacterLimit = ({
  maxLength,
  initialText = "",
  requiredWordCount = 2,
}: CharacterLimitOptions) => {
  const [text, setText] = useState(initialText);
  const [userHasTyped, setUserHasTyped] = useState(false);
  const [hasCompletedWords, setHasCompletedWords] = useState(false);
  const [showWarningPulse, setShowWarningPulse] = useState(false);

  const remainingChars = calculateRemainingChars(text, maxLength);
  const progress = (text.length / maxLength) * 100;

  const isNearLimit = remainingChars <= Math.floor(maxLength * 0.2);
  const isAtLimit = remainingChars <= 0;
  const needsMoreSpace = remainingChars <= 70;

  // Determine if the user has completed enough words for submission
  useEffect(() => {
    if (text.trim()) {
      setUserHasTyped(true);
      setHasCompletedWords(hasMinimumWords(text, requiredWordCount));
    } else {
      setUserHasTyped(false);
      setHasCompletedWords(false);
    }
  }, [text, requiredWordCount]);

  // Show warning pulse when reaching the character limit
  useEffect(() => {
    if (isAtLimit) {
      setShowWarningPulse(true);
      const timer = setTimeout(() => setShowWarningPulse(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isAtLimit, text.length]);

  const handleTextChange = (newText: string) => {
    if (newText.length <= maxLength) {
      setText(newText);
    } else {
      // If we're over the limit, truncate the text
      setText(newText.slice(0, maxLength));
      // Show pulse warning
      setShowWarningPulse(true);
      const timer = setTimeout(() => setShowWarningPulse(false), 1000);
      return () => clearTimeout(timer);
    }
  };

  const getCircleColor = () => {
    if (isAtLimit) return "#FF3B30"; // Red
    if (isNearLimit) return "#FFCC00"; // Yellow
    return "#1B1918"; // Default dark
  };

  const isActive = userHasTyped && hasCompletedWords;

  return {
    text,
    setText: handleTextChange,
    remainingChars,
    progress,
    isNearLimit,
    isAtLimit,
    needsMoreSpace,
    userHasTyped,
    hasCompletedWords,
    isActive,
    showWarningPulse,
    getCircleColor,
  };
};
