import React, {
  useState,
  useRef,
  useEffect,
  TextareaHTMLAttributes,
} from "react";
import { ProgressIndicator } from "./index";
import { useCharacterLimit } from "../../hooks/useCharacterLimit";
import { MAX_TEXT_LENGTH } from "../../constants";

interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  label?: string;
  placeholder?: string;
  hint?: string;
  error?: string;
  showCharacterCount?: boolean;
  showProgressBar?: boolean;
  autoFocus?: boolean;
  rows?: number;
  requiredWordCount?: number;
  className?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  maxLength = MAX_TEXT_LENGTH,
  label,
  placeholder,
  hint,
  error,
  showCharacterCount = true,
  showProgressBar = true,
  autoFocus = false,
  rows = 5,
  requiredWordCount = 2,
  className = "",
  ...props
}) => {
  const {
    text,
    setText,
    remainingChars,
    progress,
    isNearLimit,
    isAtLimit,
    needsMoreSpace,
    showWarningPulse,
  } = useCharacterLimit({
    maxLength,
    initialText: value,
    requiredWordCount,
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update external value when internal state changes
  useEffect(() => {
    onChange(text);
  }, [text, onChange]);

  // Update internal state when external value changes
  useEffect(() => {
    if (value !== text) {
      setText(value);
    }
  }, [value, setText]);

  // Auto resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }, [text]);

  // Set focus if autoFocus is true
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <div className={`flex flex-col w-full ${className}`}>
      {label && (
        <label
          htmlFor={props.id || "textarea"}
          className="mb-1 text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <textarea
          {...props}
          id={props.id || "textarea"}
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          placeholder={placeholder}
          rows={rows}
          className={`
            w-full px-3 py-2 border rounded-lg resize-none
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${error ? "border-red-500" : "border-gray-300"}
            ${isAtLimit ? "border-red-400" : ""}
          `}
        />

        {showCharacterCount && (
          <div
            className={`absolute right-2 bottom-2 text-xs font-medium 
            ${
              isAtLimit
                ? "text-red-500"
                : isNearLimit
                ? "text-yellow-500"
                : "text-gray-500"
            }
            ${showWarningPulse ? "animate-pulse" : ""}
          `}
          >
            {remainingChars}
          </div>
        )}
      </div>

      {showProgressBar && (
        <div className="mt-1">
          <ProgressIndicator
            progress={progress}
            color={isAtLimit ? "#FF3B30" : isNearLimit ? "#FFCC00" : "#1B1918"}
            pulseAnimation={showWarningPulse}
            size="sm"
          />
        </div>
      )}

      {hint && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

      {needsMoreSpace && !error && (
        <p className="mt-1 text-xs text-yellow-500">
          You're running out of space. Consider being more concise.
        </p>
      )}
    </div>
  );
};

export default TextArea;
