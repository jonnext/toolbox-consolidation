import React from "react";
import Tooltip from "./Tooltip";

interface IconButtonProps {
  icon: string;
  alt: string;
  tooltipMessage: string;
  onClick: () => void;
  disabled?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  alt,
  tooltipMessage,
  onClick,
  disabled = false,
}) => {
  return (
    <Tooltip message={tooltipMessage}>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`p-2 rounded-lg border border-[#EAECF0] hover:bg-[#F2F4F7] transition-colors duration-200 
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <img src={icon} alt={alt} className="w-5 h-5" />
      </button>
    </Tooltip>
  );
};

export default IconButton;
