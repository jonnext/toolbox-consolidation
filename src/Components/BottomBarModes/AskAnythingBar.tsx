import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { askClaude } from "../../utils/askClaude";

const askButtonStagger = {
  visible: { transition: { staggerChildren: 0, delayChildren: 0 } },
  hidden: { transition: { staggerChildren: 0, staggerDirection: -1 } },
};
const askButtonVariants = {
  hidden: {
    opacity: 0,
    y: 16,
    transition: { duration: 0.14, ease: "easeOut" },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.14, ease: "easeOut" },
  },
};

const AskAnythingBar = ({
  initialText = "",
  onClose,
}: {
  initialText?: string;
  onClose: () => void;
}) => {
  const [text, setText] = useState("");
  const [userMessage, setUserMessage] = useState<string>("");
  const [claudeResponse, setClaudeResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setText(""); // Always start empty
    if (inputRef.current) {
      inputRef.current.setSelectionRange(0, 0);
    }
  }, []);

  const handleSend = async () => {
    if (!text.trim()) return;
    setUserMessage(text);
    setClaudeResponse("");
    setError(null);
    setLoading(true);
    try {
      const response = await askClaude(text);
      setClaudeResponse(response);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
      setText("");
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      handleSend();
    }
  };

  return (
    <div className="relative flex flex-col w-full h-full justify-between">
      {/* Top: Input bar */}
      <div className="flex items-center gap-4 px-0 pt-4 pb-2">
        <input
          ref={inputRef}
          className={`text-base font-normal bg-transparent outline-none flex-1 caret-black ${
            text ? "text-[#1b1918]" : "text-[#b0aba8]"
          }`}
          style={{ letterSpacing: "-0.4px" }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Turn curiosity into knowledge. Ask anything...."
          autoFocus
        />
        <button
          onClick={onClose}
          className="ml-2 text-xs text-[#b0aba8] px-3 py-1 rounded-lg hover:bg-gray-100"
        >
          Close
        </button>
      </div>
      {/* Middle: Chat/messages area */}
      <div className="flex flex-col gap-2 flex-grow overflow-y-auto">
        {userMessage && (
          <div className="self-end max-w-xs bg-blue-500 text-white rounded-lg px-4 py-2 shadow">
            {userMessage}
          </div>
        )}
        {loading && (
          <div className="self-start max-w-xs bg-gray-100 text-[#1b1918] rounded-lg px-4 py-2 shadow animate-pulse">
            Claude is thinking…
          </div>
        )}
        {claudeResponse && (
          <div className="self-start max-w-xs bg-gray-100 text-[#1b1918] rounded-lg px-4 py-2 shadow">
            {claudeResponse}
          </div>
        )}
        {error && (
          <div className="self-start max-w-xs bg-red-100 text-red-700 rounded-lg px-4 py-2 shadow">
            {error}
          </div>
        )}
      </div>
      {/* Bottom: Action buttons and send button fixed to bottom */}
      <motion.div
        className="absolute left-0 bottom-0 w-full flex items-center justify-between bg-white z-10"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={askButtonStagger}
        style={{ borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}
      >
        <div className="flex items-center gap-3">
          <motion.button
            className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-100"
            variants={askButtonVariants}
          >
            <svg
              className="w-5 h-5 text-[#1b1918]"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.48-8.48l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
            </svg>
            <span className="text-sm font-bold text-[#1b1918]">Add</span>
          </motion.button>
          <motion.button
            className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-100"
            variants={askButtonVariants}
          >
            <svg
              className="w-5 h-5 text-[#1b1918]"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 15c1.333-2 2.667-2 4 0" />
              <path d="M9 9h.01" />
              <path d="M15 9h.01" />
            </svg>
            <span className="text-sm font-bold text-[#1b1918]">
              Ask Community
            </span>
          </motion.button>
        </div>
        <motion.button
          className="w-9 h-9 flex items-center justify-center bg-[#faf9f8] border border-[#d0cdc8] rounded-lg shadow-[0_1px_2px_0_rgba(27,25,24,0.05),0_-2px_0_0_rgba(27,25,24,0.05)_inset,0_0_0_1px_rgba(27,25,24,0.18)_inset] hover:bg-gray-100 ml-2"
          variants={askButtonVariants}
          onClick={handleSend}
          disabled={loading || !text.trim()}
        >
          <svg
            className="w-5 h-5 text-[#161412]"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <polyline points="15 17 20 12 15 7" />
            <line x1="4" y1="12" x2="20" y2="12" />
          </svg>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default AskAnythingBar;
