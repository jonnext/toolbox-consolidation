import React from "react";

interface TooltipProps {
  message: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

const Tooltip: React.FC<TooltipProps> = ({
  message,
  children,
  position = "top",
}) => {
  // Determine positioning classes based on the position prop
  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
  };

  const arrowClasses = {
    top: "absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#101828]",
    bottom:
      "absolute bottom-full left-1/2 transform -translate-x-1/2 -mb-1 border-4 border-transparent border-b-[#101828]",
    left: "absolute left-full top-1/2 transform -translate-y-1/2 -ml-1 border-4 border-transparent border-l-[#101828]",
    right:
      "absolute right-full top-1/2 transform -translate-y-1/2 -mr-1 border-4 border-transparent border-r-[#101828]",
  };

  return (
    <div className="relative group">
      {children}
      <div
        className={`absolute ${positionClasses[position]} px-2 py-1 bg-[#101828] text-white text-sm rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50`}
      >
        {message}
        <div className={arrowClasses[position]} />
      </div>
    </div>
  );
};

export default Tooltip;
