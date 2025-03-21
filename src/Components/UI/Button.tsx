import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "icon";
  size?: "sm" | "md" | "lg";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  isFullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
}

const variants = {
  primary: "bg-black text-white hover:bg-gray-800",
  secondary: "bg-[#F9FAFB] border border-[#E5E7EB] hover:bg-gray-100",
  ghost: "hover:bg-gray-100",
  icon: "flex items-center justify-center hover:bg-gray-100",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2",
  lg: "px-6 py-3 text-lg",
};

const iconSizes = {
  sm: "w-8 h-8 p-1.5",
  md: "w-9 h-9 p-2",
  lg: "w-10 h-10 p-2.5",
};

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  isLoading = false,
  isFullWidth = false,
  className = "",
  children,
  disabled,
  ...props
}) => {
  // Determine the appropriate classes based on the props
  const baseClasses =
    "rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black";
  const variantClasses = variants[variant];
  const sizeClasses = variant === "icon" ? iconSizes[size] : sizes[size];
  const widthClass = isFullWidth ? "w-full" : "";
  const disabledClass = disabled ? "opacity-60 cursor-not-allowed" : "";

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${widthClass} ${disabledClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </div>
      ) : (
        <div className="flex items-center justify-center">
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </div>
      )}
    </button>
  );
};

export default Button;
