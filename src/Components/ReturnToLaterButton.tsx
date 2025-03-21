import React from "react";

interface ReturnToLaterButtonProps {
  onClick?: () => void;
}

const ReturnToLaterButton: React.FC<ReturnToLaterButtonProps> = ({
  onClick,
}) => {
  return (
    <div className="flex flex-col items-center h-12 filter drop-shadow-md">
      <div className="flex flex-col items-start justify-start h-8 px-3 py-2 bg-slate-900 rounded-lg">
        <div className="text-xs font-semibold text-white leading-[18px]">
          Return to later
        </div>
      </div>
      <div
        className="w-3 h-3 bg-slate-900 rounded-[1px] -mt-3 origin-center"
        style={{
          transform: "rotate(45deg) translateX(50%)",
        }}
      />
    </div>
  );
};

export default ReturnToLaterButton;
