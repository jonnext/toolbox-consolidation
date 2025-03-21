import React from "react";
import {
  ArrowUpRight,
  Grid,
  Search,
  MessageCircleQuestion,
} from "lucide-react";

const BottomBar = () => {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 mb-10">
      <div className="flex flex-col w-60">
        <div className="bg-[#1B191F] px-5 py-1 flex items-center justify-between w-[194px] mx-auto rounded-t-lg">
          <p
            className="text-white text-sm
           font-normal tracking-[-0.4px]"
          >
            Explore your path
          </p>
          <ArrowUpRight className="text-white w-6 h-6" strokeWidth={1.6} />
        </div>

        <div className="bg-white border border-[#D0CCC8] rounded-3xl px-6 py-4 shadow-[0_4px_6px_-2px_rgba(16,24,40,0.03),0_12px_16px_-4px_rgba(16,24,40,0.08)] w-full mt-0">
          <div className="px-2 py-2">
            <div className="flex items-center space-x-6">
              <button className="w-12 h-12 rounded-lg flex items-center justify-center hover:bg-gray-100">
                <Grid className="w-6 h-6 text-[#57534E]" strokeWidth={2} />
              </button>
              <button className="w-12 h-12 rounded-lg flex items-center justify-center hover:bg-gray-100">
                <Search className="w-6 h-6 text-[#57534E]" strokeWidth={2} />
              </button>
              <button className="w-12 h-12 rounded-lg flex items-center justify-center hover:bg-gray-100">
                <MessageCircleQuestion
                  className="w-6 h-6 text-[#57534E]"
                  strokeWidth={2}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomBar;
