import React from "react";

interface ProgressIndicatorProps {
  progress: number;
  variant?: "line" | "circle";
  size?: "sm" | "md" | "lg";
  color?: string;
  showPercentage?: boolean;
  className?: string;
  pulseAnimation?: boolean;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  progress,
  variant = "line",
  size = "md",
  color = "#1B1918",
  showPercentage = false,
  className = "",
  pulseAnimation = false,
}) => {
  // Ensure progress is between 0 and 100
  const normalizedProgress = Math.max(0, Math.min(100, progress));

  // Size variants for line progress
  const lineHeights = {
    sm: "h-1",
    md: "h-1.5",
    lg: "h-2",
  };

  // Size variants for circle progress
  const circleSizes = {
    sm: 24,
    md: 36,
    lg: 48,
  };

  // Default styles
  const baseLineClasses = `${lineHeights[size]} w-full bg-gray-100 rounded-full overflow-hidden`;
  const baseCircleClasses = "transform -rotate-90";

  if (variant === "line") {
    return (
      <div className={`${baseLineClasses} ${className}`}>
        <div
          className={`h-full ${pulseAnimation ? "animate-pulse" : ""}`}
          style={{
            width: `${normalizedProgress}%`,
            backgroundColor: color,
            transition: "width 0.3s ease-in-out",
          }}
        >
          {showPercentage && (
            <span className="sr-only">
              {Math.round(normalizedProgress)}% complete
            </span>
          )}
        </div>
        {showPercentage && (
          <div className="mt-1 text-right text-xs text-gray-600">
            {Math.round(normalizedProgress)}%
          </div>
        )}
      </div>
    );
  }

  // For circle variant
  const circleSize = circleSizes[size];
  const strokeWidth = size === "sm" ? 2 : size === "md" ? 3 : 4;
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (normalizedProgress / 100) * circumference;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
    >
      <svg
        className={baseCircleClasses}
        width={circleSize}
        height={circleSize}
        viewBox={`0 0 ${circleSize} ${circleSize}`}
      >
        <circle
          className="text-gray-100"
          cx={circleSize / 2}
          cy={circleSize / 2}
          r={radius}
          strokeWidth={`${strokeWidth}px`}
          stroke="currentColor"
          fill="transparent"
        />
        <circle
          className={`${pulseAnimation ? "animate-pulse" : ""}`}
          cx={circleSize / 2}
          cy={circleSize / 2}
          r={radius}
          strokeWidth={`${strokeWidth}px`}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          style={{ transition: "stroke-dashoffset 0.3s ease-in-out" }}
        />
      </svg>
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium">
            {Math.round(normalizedProgress)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;
