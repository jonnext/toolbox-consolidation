import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBottomBar } from "./BottomBarContext";
import NavigationBar from "./BottomBarModes/NavigationBar";
import AskAnythingBar from "./BottomBarModes/AskAnythingBar";
import { ArrowUpRight } from "lucide-react";
// Placeholders for future modes
const ChatBar = () => <div className="p-6">ChatBar (coming soon)</div>;
const ProgressBar = () => <div className="p-6">ProgressBar (coming soon)</div>;

const barMorphVariants = {
  navigation: {
    height: 72,
    borderRadius: 24,
    padding: "1rem",
  },
  ask: {
    height: 180,
    borderRadius: 24,
    padding: "1.25rem 1.25rem 0.75rem 1.25rem",
  },
  chat: {
    height: 180,
    borderRadius: 24,
    padding: "1.25rem 1.25rem 0.75rem 1.25rem",
  },
  progress: {
    height: 120,
    borderRadius: 24,
    padding: "1rem",
  },
};

// Mock: Replace with real payment/pro state
const isPro = false;

const ExplorePathButton = () => (
  <div
    className="w-full flex justify-center"
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      bottom: "100%",
      zIndex: 10,
    }}
  >
    <button
      className="flex items-center gap-2 bg-[#1B191F] text-white py-1 px-5 rounded-t-[12px] shadow-md"
      tabIndex={0}
      aria-label="Explore your path"
      // onClick={handleOpenPricing} // TODO: Implement pricing modal
    >
      <span className="text-sm font-bold">Explore your path</span>
      <ArrowUpRight size={24} className="text-white" />
    </button>
  </div>
);

const BottomBar = () => {
  const { mode, selectedText, openNavigation } = useBottomBar();
  const prevMode = useRef<string | null>(null);
  const [showNavContent, setShowNavContent] = useState(true);

  // Track previous mode
  useEffect(() => {
    // If transitioning from ask to navigation, delay showing nav content
    if (prevMode.current === "ask" && mode === "navigation") {
      setShowNavContent(false);
      // Wait for morph transition (match motion.div transition duration)
      const timeout = setTimeout(() => {
        setShowNavContent(true);
      }, 320); // 320ms matches spring morph
      return () => clearTimeout(timeout);
    } else {
      setShowNavContent(true);
    }
    prevMode.current = mode;
  }, [mode]);

  let content = null;
  if (mode === "navigation") {
    // Only stagger nav in if coming from ask and after morph
    const staggerNavIn = prevMode.current === "ask";
    content = showNavContent ? (
      <NavigationBar staggerNavIn={staggerNavIn} />
    ) : null;
  } else if (mode === "ask") {
    content = (
      <AskAnythingBar initialText={selectedText} onClose={openNavigation} />
    );
  } else if (mode === "chat") {
    content = <ChatBar />;
  } else if (mode === "progress") {
    content = <ProgressBar />;
  }

  return (
    <div
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[720px] mx-auto z-50 mb-6"
      style={{ position: "fixed" }}
    >
      {/* Explore button above the bar, only if not Pro */}
      {!isPro && <ExplorePathButton />}
      <nav role="navigation" aria-label="Primary">
        <motion.div
          key={mode}
          layout
          layoutId="bottom-bar-morph"
          initial={false}
          animate={barMorphVariants[mode]}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
          className="bg-white border border-[#D0CCC8] w-full shadow-lg mt-0 overflow-hidden flex items-center justify-between"
          style={{ alignItems: "stretch" }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 32 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.18, ease: "easeOut" },
              }}
              exit={{
                opacity: 0,
                y: 32,
                transition: { duration: 0.22, ease: "easeIn" },
              }}
              style={{ width: "100%" }}
            >
              {content}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </nav>
    </div>
  );
};

export default BottomBar;
