import React, { useState, useCallback, useEffect } from "react";
import FlipBackwardIcon from "../assets/Buttons/flip-backward.svg";
import CheckGreenIcon from "../assets/Buttons/check-green.svg";
import PencilIcon from "../assets/Buttons/pencil-01.svg";
import MessageQuestionCircle from "../assets/Buttons/message-question-circle.svg";
import ListIcon from "../assets/Buttons/list.svg";
import CheckIcon from "../assets/Buttons/check.svg";
import CheckWhiteIcon from "../assets/Buttons/check-white.svg";
import IconButton from "./IconButton";
import "./QuestionComponent.css";
import SecondaryActionsContainer from "./SecondaryActionsContainer";
import DifficultySlider from "./DifficultySlider";
import DifficultyQuestion from "./DifficultyQuestion";
import { DifficultyLevel } from "./DifficultySlider";

const QuestionComponent: React.FC = () => {
  const [answer, setAnswer] = useState("");
  const [savedAnswer, setSavedAnswer] = useState("");
  const [userHasTyped, setUserHasTyped] = useState(false);
  const [hasCompletedWord, setHasCompletedWord] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [markedForReview, setMarkedForReview] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<string>("");
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [isDifficultyMode, setIsDifficultyMode] = useState(false);
  const [currentDifficulty, setCurrentDifficulty] =
    useState<DifficultyLevel>("easy");
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [showPulse, setShowPulse] = useState(false);

  const maxLength = 250;
  const remainingChars = maxLength - answer.length;
  const progress = (answer.length / maxLength) * 100;
  const isActive = userHasTyped && hasCompletedWord;

  const isNearLimit = remainingChars <= Math.floor(maxLength * 0.2);
  const isAtLimit = remainingChars <= 0;
  const showNeedMoreSpace = remainingChars <= 70;

  const getCircleColor = () => {
    if (isAtLimit) return "#FF3B30";
    if (isNearLimit) return "#FFCC00";
    return "#1B1918";
  };

  useEffect(() => {
    if (isAtLimit) {
      setShowPulse(true);
      const timer = setTimeout(() => setShowPulse(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isAtLimit, answer.length]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setAnswer(value);
      setUserHasTyped(true);

      const trimmedValue = value.trim();
      const words = trimmedValue.split(/\s+/).filter((word) => word.length > 0);
      setHasCompletedWord(words.length > 1);
    }
  };

  const handleTextAreaFocus = () => {
    if (answer === "") {
      setAnswer("S3 storage containers work by");
      setTimeout(() => {
        const textarea = document.querySelector("textarea");
        if (textarea) {
          textarea.selectionStart = textarea.selectionEnd =
            "S3 storage containers work by".length;
        }
      }, 0);
    }
    setIsFocused(true);
  };

  const handleReturnToLater = () => {
    setSavedAnswer(answer);
    setMarkedForReview(true);
    setIsFocused(false);
    setUserHasTyped(true);
    setHasCompletedWord(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && isActive) {
      e.preventDefault();
      handleCompletion();
    }
  };

  const handleCompletion = () => {
    if (isActive) {
      setIsCompleted(true);
      console.log("Answer saved:", answer);
    }
  };

  const handleResetFromReview = () => {
    setMarkedForReview(false);
    setIsFocused(true);
  };

  const handleDifficultyToggle = () => {
    if (isDifficultyMode) {
      handleDifficultyChange(currentDifficulty);
    }
    setIsDifficultyMode(!isDifficultyMode);
  };

  const handleDifficultyChange = (difficulty: DifficultyLevel) => {
    setCurrentDifficulty(difficulty);
  };

  const handleQuestionChange = (question: string) => {
    setCurrentQuestion(question);
  };

  const getFeedback = useCallback(async () => {
    setIsLoadingFeedback(true);
    try {
      // Check if API key exists
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

      if (!apiKey) {
        setFeedback(
          "OpenAI API key is not configured. Please add your API key to the .env file to use the feedback feature."
        );
        setIsLoadingFeedback(false);
        return;
      }

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content:
                  "You are a helpful programming tutor. Analyze the following answer about S3 storage and provide constructive feedback. Include both strengths and areas for improvement.",
              },
              {
                role: "user",
                content: answer,
              },
            ],
            temperature: 0.7,
            max_tokens: 500,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.error?.message || "API request failed");
      }

      const data = await response.json();
      console.log("API Response:", data);
      setFeedback(data.choices[0].message.content);
    } catch (error) {
      console.error("Error getting feedback:", error);
      setFeedback(
        "Sorry, there was an error getting feedback. Please try again. Error: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    } finally {
      setIsLoadingFeedback(false);
    }
  }, [answer]);

  return (
    <div className="w-[688px] h-[214px] bg-white justify-start items-start gap-6 inline-flex relative">
      <div
        className={`w-14 h-14 rounded-full justify-center items-center inline-flex transition-all duration-200 ease-in-out ${
          isCompleted
            ? "bg-[#47CD89] check-complete-container"
            : markedForReview
            ? "bg-[#dbf9e6] border border-[#47cd89]"
            : isFocused
            ? "bg-[#F8F8F8]"
            : "bg-[#F2F4F7]"
        }`}
      >
        {isCompleted ? (
          <img
            src={CheckWhiteIcon}
            alt="Check Icon"
            className="w-6 h-6 text-green-500 check-complete-icon"
          />
        ) : markedForReview ? (
          <div className="w-6 h-6 justify-center items-center inline-flex">
            <img
              src={FlipBackwardIcon}
              alt="Return Icon"
              className="w-6 h-6"
              style={{
                filter:
                  "invert(67%) sepia(93%) saturate(380%) hue-rotate(93deg) brightness(96%) contrast(87%)",
              }}
            />
          </div>
        ) : isFocused ? (
          <img
            src={PencilIcon}
            alt="Pencil Icon"
            className="w-6 h-6 pencil-animate"
            style={{ filter: "brightness(0)" }}
          />
        ) : (
          <img src={ListIcon} alt="List Icon" className="w-6 h-6" />
        )}
      </div>

      <div className="grow shrink basis-0 flex-col justify-start items-start gap-10 inline-flex">
        <div className="self-stretch h-[122px] flex-col justify-start items-start gap-4 flex">
          <div className="text-left self-stretch text-[#101828] text-lg font-semibold font-['Inter'] leading-7">
            <DifficultyQuestion
              difficulty={currentDifficulty}
              topic="S3 storage"
              onQuestionChange={handleQuestionChange}
            />
          </div>

          <div className="self-stretch flex-col justify-start items-start gap-4 flex">
            {isDifficultyMode ? (
              <div className="self-stretch">
                <DifficultySlider
                  initialDifficulty={currentDifficulty}
                  onDifficultyChange={handleDifficultyChange}
                />
              </div>
            ) : (
              <div className="self-stretch relative">
                <textarea
                  value={answer}
                  onChange={handleInputChange}
                  onFocus={handleTextAreaFocus}
                  onKeyPress={handleKeyPress}
                  placeholder="S3 storage containers work by..."
                  className={`w-full p-2 resize-none text-lg font-normal font-['Inter'] leading-7 focus:outline-none ${
                    isCompleted
                      ? "text-[#101828] cursor-not-allowed"
                      : "text-[#667085]"
                  }`}
                  rows={1}
                  readOnly={isCompleted}
                  onInput={(e) => {
                    e.currentTarget.style.height = "auto";
                    e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                  }}
                />

                {/* Character counter circle */}
                {!isDifficultyMode && !isCompleted && (
                  <div className="absolute bottom-2 right-2 flex items-center z-10">
                    <div
                      className={`relative w-10 h-10 ${
                        showPulse ? "animate-pulse" : ""
                      } rounded-full bg-white/90 shadow-sm`}
                    >
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path
                          d="M18 2.5a15.5 15.5 0 100 31 15.5 15.5 0 000-31z"
                          fill="none"
                          stroke="#E7E5E4"
                          strokeWidth="3"
                        />

                        <path
                          d="M18 2.5a15.5 15.5 0 100 31 15.5 15.5 0 000-31z"
                          fill="none"
                          stroke={getCircleColor()}
                          strokeWidth="3"
                          strokeDasharray="100"
                          strokeDashoffset={
                            -(100 - (answer.length / maxLength) * 100)
                          }
                          strokeLinecap="round"
                          transform="rotate(-90 18 18)"
                        />
                      </svg>

                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ color: getCircleColor() }}
                      >
                        <span className="text-sm font-medium">
                          {remainingChars}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Static underline stroke for text input container */}
                <div
                  className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#d0d5dd] transition-opacity duration-200 ${
                    isCompleted ? "opacity-0" : "opacity-100"
                  }`}
                />
              </div>
            )}

            {!isDifficultyMode && !isCompleted && (
              <div className="mt-1 text-left self-stretch text-[#667085] text-xs font-normal font-['Inter'] leading-[18px] transition-opacity duration-200">
                {/* Message removed */}
              </div>
            )}

            {showFeedback && (
              <div className="w-full p-6 bg-white rounded-3xl border border-[#d0d5dd] flex-col justify-start items-start gap-4 inline-flex">
                <div className="self-stretch pb-3 border-b border-[#eaecf0] justify-between items-center inline-flex">
                  <div className="text-[#101828] text-lg font-semibold font-['Inter'] leading-7">
                    Feedback on your answer
                  </div>
                  <div className="justify-start items-center gap-2 flex">
                    <div className="p-2.5 rounded-lg justify-center items-center gap-2 flex">
                      <div className="w-5 h-5 px-[2.50px] py-[1.67px] justify-center items-center flex" />
                    </div>
                  </div>
                </div>
                <div className="self-stretch flex-col justify-start items-start gap-4 inline-flex">
                  {isLoadingFeedback ? (
                    <div className="text-[#667085] text-lg font-normal font-['Inter'] leading-7">
                      Analyzing your answer...
                    </div>
                  ) : (
                    <div className="text-[#101828] text-lg font-normal font-['Inter'] leading-7 whitespace-pre-line">
                      {feedback}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="w-full mt-4">
              <div
                className={`w-full h-[52px] flex-col justify-center items-left gap-2 flex action-toolbar ${
                  isCompleted ? "action-toolbar-completed" : ""
                }`}
              >
                <div className="w-full self-stretch justify-between items-center inline-flex">
                  <div className="flex items-center gap-3">
                    {!isCompleted ? (
                      markedForReview ? (
                        <div
                          onClick={handleResetFromReview}
                          className="h-9 px-3 py-2 bg-white rounded-lg border border-[#75dfa6] justify-center items-center gap-1 inline-flex cursor-pointer"
                        >
                          <div className="px-0.5 justify-center items-center flex">
                            <div className="text-[#17b169] text-sm font-semibold font-['Inter'] leading-tight">
                              Continue task
                            </div>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={handleCompletion}
                          className={`px-3 py-2 rounded-lg border flex items-center ${
                            isActive
                              ? "bg-white border-[#000000] cursor-pointer"
                              : "bg-[#f2f4f7] border-[#eaecf0] cursor-not-allowed"
                          }`}
                          disabled={!isActive}
                        >
                          <span
                            className={`text-sm font-semibold font-['Inter'] leading-tight ${
                              isActive ? "text-[#000000]" : "text-[#98a1b2]"
                            }`}
                          >
                            {isActive
                              ? "Submit answer"
                              : "Task still to complete"}
                          </span>
                        </button>
                      )
                    ) : (
                      <div
                        onClick={() => setIsCompleted(false)}
                        className="h-9 px-3 py-2 bg-white rounded-lg border border-[#75dfa6] justify-center items-center gap-1 inline-flex cursor-pointer"
                      >
                        <div className="px-0.5 justify-center items-center flex">
                          <div className="text-[#17b169] text-sm font-semibold font-['Inter'] leading-tight">
                            Edit answer
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="h-8 w-[1px] bg-[#EAECF0] mx-1"></div>

                    <SecondaryActionsContainer
                      onDifficultyToggle={handleDifficultyToggle}
                      isDifficultyMode={isDifficultyMode}
                      currentDifficulty={currentDifficulty}
                    />
                  </div>
                  {!isDifficultyMode && !isCompleted && showNeedMoreSpace && (
                    <div className="text-[#667085] text-sm font-normal">
                      {isAtLimit
                        ? "character limit reached"
                        : "Need more space?"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionComponent;
