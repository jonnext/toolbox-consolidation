import React from "react";

interface TooltipProps {
  message: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ message, children }) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-[#101828] text-white text-sm rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {message}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#101828]" />
      </div>
    </div>
  );
};

export default Tooltip;
