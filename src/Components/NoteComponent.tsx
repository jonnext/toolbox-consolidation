import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "motion/react";
import AnimationComponent from "./AnimationComponent";
import LearningContextBanner from "./LearningContextBanner";

// VERY OBVIOUS DEBUG LOG
console.log("[NoteComponent] TOP-LEVEL RENDERED");

interface NoteComponentProps {
  question: string;
  noteType?: string;
  highlightedText?: string;
  onDelete?: () => void;
}

// Contextual bullet templates for each note type
const CONTEXTUAL_BULLETS: Record<string, (highlighted: string) => string[]> = {
  explain: (highlighted) => [
    `How "${highlighted}" fits into AWS.`,
    `Related IAM roles and permissions.`,
    `Key differences from EC2.`,
  ],
  example: (highlighted) => [
    `AWS examples of "${highlighted}".`,
    `Examples for your skill level.`,
    `Relevant cloud migration use cases.`,
  ],
  simplify: (highlighted) => [
    `Breaking down "${highlighted}".`,
    `Simpler terms for key concepts.`,
    `Analogies to familiar ideas.`,
  ],
};

// Typewriter effect for a single bullet (imperative, not a hook)
function typewriterEffect(
  text: string,
  onUpdate: (displayed: string) => void,
  onDone: () => void,
  speed = 24
) {
  let i = 0;
  const interval = setInterval(() => {
    onUpdate(text.slice(0, i + 1));
    i++;
    if (i >= text.length) {
      clearInterval(interval);
      onDone();
    }
  }, speed);
  return interval;
}

const BULLET_REVEAL_DELAY = 200; // ms between fade-in of bullets
const MIN_LOADER_TIME = 6500; // ms (6.5s)

// Bouncing dots loader component
const BouncingDots: React.FC = () => (
  <span className="inline-flex gap-1">
    <span className="animate-bounce [animation-delay:-0.2s]">.</span>
    <span className="animate-bounce [animation-delay:0s]">.</span>
    <span className="animate-bounce [animation-delay:0.2s]">.</span>
  </span>
);

const NoteLoader: React.FC<{
  highlightedText?: string;
  aiBullets: string[];
  noteType?: string;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onAllBulletsDone?: () => void;
}> = ({
  highlightedText,
  aiBullets,
  noteType,
  loading,
  error,
  onRetry,
  onAllBulletsDone,
}) => {
  // Determine contextual bullets
  const lowerType = noteType?.toLowerCase() || "";
  let contextKey = "explain";
  if (lowerType.includes("example")) contextKey = "example";
  else if (lowerType.includes("simplify")) contextKey = "simplify";
  const contextualBullets = useMemo(
    () =>
      (CONTEXTUAL_BULLETS[contextKey]?.(highlightedText || "") || []).slice(
        0,
        2
      ),
    [contextKey, highlightedText]
  );
  // Only use contextual bullets for loader (memoized)
  const loaderBullets = useMemo(
    () => [...contextualBullets, "__LOADER__"],
    [contextualBullets]
  );

  // Animation state (managed by refs for robustness)
  const [headerVisible, setHeaderVisible] = useState(false);
  const [highlightVisible, setHighlightVisible] = useState(false);
  const [bulletsVisible, setBulletsVisible] = useState(false);
  const [showLoaderDots, setShowLoaderDots] = useState(true);
  const [displayedBullets, setDisplayedBullets] = useState<string[]>([]); // typewriter text for each bullet
  const [revealedCount, setRevealedCount] = useState(0); // how many bullets are visible
  const bulletIndexRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const displayedBulletsRef = useRef<string[]>([]);
  const revealedCountRef = useRef(0);
  const bulletListRef = useRef<HTMLDivElement>(null);

  // Animation sequence: header -> highlight -> bullets
  useEffect(() => {
    setHeaderVisible(false);
    setHighlightVisible(false);
    setBulletsVisible(false);
    setShowLoaderDots(true);
    const headerTimer = setTimeout(() => setHeaderVisible(true), 100);
    const highlightTimer = setTimeout(() => setHighlightVisible(true), 350);
    const bulletsTimer = setTimeout(() => setBulletsVisible(true), 600);
    return () => {
      clearTimeout(headerTimer);
      clearTimeout(highlightTimer);
      clearTimeout(bulletsTimer);
    };
  }, [highlightedText, noteType]);

  // Typewriter speed
  const TYPEWRITER_SPEED = 12;

  // Reset animation state and run bullet animation only when allBullets changes
  useEffect(() => {
    let cancelled = false;
    displayedBulletsRef.current = Array(loaderBullets.length).fill("");
    revealedCountRef.current = 0;
    bulletIndexRef.current = 0;
    setDisplayedBullets(Array(loaderBullets.length).fill(""));
    setRevealedCount(0);
    if (loaderBullets.length === 0) return;
    function typeBullet(idx: number) {
      if (cancelled || idx >= loaderBullets.length) return;
      const bullet = loaderBullets[idx];
      let charIdx = 0;
      function typeChar() {
        if (cancelled) return;
        charIdx++;
        displayedBulletsRef.current[idx] = bullet.slice(0, charIdx);
        setDisplayedBullets(displayedBulletsRef.current.slice());
        if (charIdx < bullet.length) {
          setTimeout(typeChar, TYPEWRITER_SPEED);
        } else {
          revealedCountRef.current = idx + 1;
          setRevealedCount(revealedCountRef.current);
          setTimeout(() => typeBullet(idx + 1), BULLET_REVEAL_DELAY);
        }
      }
      typeChar();
    }
    typeBullet(0);
    return () => {
      cancelled = true;
    };
  }, [loaderBullets]);

  // Ensure bouncing dots loader stays for at least 3 seconds after last bullet
  useEffect(() => {
    if (
      loaderBullets[loaderBullets.length - 1] === "__LOADER__" &&
      revealedCount === loaderBullets.length
    ) {
      const timer = setTimeout(() => setShowLoaderDots(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [revealedCount, loaderBullets]);

  // Track when all bullets are done
  useEffect(() => {
    if (revealedCount >= loaderBullets.length && loaderBullets.length > 0) {
      onAllBulletsDone && onAllBulletsDone();
    }
  }, [revealedCount, loaderBullets.length, onAllBulletsDone]);

  // Scroll to bottom as new bullets appear
  useEffect(() => {
    if (bulletListRef.current) {
      bulletListRef.current.scrollTop = bulletListRef.current.scrollHeight;
    }
  }, [revealedCount]);

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full h-full flex flex-col gap-4 justify-center items-center animate-fade-in"
      >
        <div className="text-red-600 text-base font-medium mb-2">{error}</div>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full h-full flex flex-col gap-6 justify-start items-start animate-fade-in"
    >
      {/* Header fade-in only */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: headerVisible ? 1 : 0, y: headerVisible ? 0 : 8 }}
        transition={{ duration: 0.25, delay: 0.1, ease: "easeOut" }}
        className={`flex items-center gap-4 mb-2`}
      >
        <div className="w-8 h-8 flex items-center justify-center">
          <AnimationComponent
            riveFile="/animations/nextwork_logo_loader.riv"
            isPlaying={true}
          />
        </div>
        <h2 className="text-2xl text-[#1b191a] font-light tracking-[-0.4px]">
          {noteType && noteType.toLowerCase().includes("example")
            ? "Finding examples..."
            : noteType && noteType.toLowerCase().includes("simplify")
            ? "Simplifying..."
            : "Deepening your knowledge..."}
        </h2>
      </motion.div>
      {/* Sticky highlight section, flat yellow background, no shadow */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{
          opacity: highlightVisible ? 1 : 0,
          y: highlightVisible ? 0 : 8,
        }}
        transition={{ duration: 0.25, delay: 0.2, ease: "easeOut" }}
        className="flex flex-col gap-2 w-full max-w-[90%] items-start sticky top-0 z-10 bg-white pt-2 pb-2"
      >
        <p className="text-sm text-[#6c635f] font-normal">You highlighted:</p>
        <span
          className="text-lg text-[#1b191a] font-semibold break-words max-w-[600px] cursor-pointer bg-[#ffef9f] px-4 py-2 rounded-lg line-clamp-3"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={highlightedText}
        >
          "{highlightedText}"
        </span>
      </motion.div>
      {/* Animated bullet list, not scrollable, grows with content, directly under highlight */}
      <motion.div
        ref={bulletListRef}
        initial={{ opacity: 0, y: 16 }}
        animate={{
          opacity: bulletsVisible ? 1 : 0,
          y: bulletsVisible ? 0 : 16,
        }}
        transition={{ duration: 0.3, delay: 0.3, ease: "easeOut" }}
        className="flex flex-col gap-3 w-full max-w-[90%] items-start mt-2"
      >
        {loaderBullets.map((b, i) => (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{
              opacity: bulletsVisible && i <= revealedCount ? 1 : 0,
              y: bulletsVisible && i <= revealedCount ? 0 : 8,
            }}
            transition={{
              duration: 0.2,
              delay: 0.2 + i * 0.08,
              ease: "easeOut",
            }}
            className="flex flex-row items-start gap-3"
            key={i}
          >
            <div className="w-2 h-2 rounded-full bg-[#403b39] mt-1 flex-shrink-0" />
            <span className="text-sm text-[#403b39] font-normal whitespace-normal break-words">
              {b === "__LOADER__" && showLoaderDots ? (
                <BouncingDots />
              ) : b === "__LOADER__" ? null : (
                displayedBullets[i]
              )}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

const parseBullets = (text: string): string[] => {
  // Try to split by numbered or dashed bullets, or newlines
  if (!text) return [];
  const lines = text
    .split(/\n|\r|\d+\.|\-|•/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  // If the AI returns a single paragraph, just return as one bullet
  return lines.length > 1 ? lines : [text];
};

// Utility to parse note content into paragraphs and bullet lists
function renderNoteContent(content: string) {
  if (!content) return null;
  // Split by double newlines for paragraphs
  const blocks = content.split(/\n\s*\n/);
  return blocks.map((block, idx) => {
    // Bullet/numbered list detection
    const lines = block.split(/\n/).filter(Boolean);
    const isList =
      lines.length > 1 && lines.every((l) => /^(-|\d+\.|•)/.test(l.trim()));
    if (isList) {
      return (
        <ul className="list-disc pl-6 mb-3" key={idx}>
          {lines.map((line, i) => (
            <li key={i}>{line.replace(/^(-|\d+\.|•)\s*/, "")}</li>
          ))}
        </ul>
      );
    } else {
      return (
        <p className="mb-3" key={idx}>
          {block}
        </p>
      );
    }
  });
}

const NoteComponent: React.FC<NoteComponentProps> = ({
  question,
  noteType,
  highlightedText,
  onDelete = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState<string | null>(null);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [apiDone, setApiDone] = useState(false);
  const [bullets, setBullets] = useState<string[]>([]);
  const [retryCount, setRetryCount] = useState(0);
  const [allBulletsDone, setAllBulletsDone] = useState(false);

  // Compose the prompt for the API based on noteType
  const buildPrompt = () => {
    if (!noteType || !highlightedText) return "";
    const lower = noteType.toLowerCase();
    if (lower.includes("explain")) {
      return `Explain the following concept in 2-3 concise, educational bullet points for an AWS learner.\n\nConcept: ${highlightedText}`;
    } else if (lower.includes("example")) {
      return `Give 2-3 practical, real-world examples of the following concept for an AWS learner.\n\nConcept: ${highlightedText}`;
    } else if (lower.includes("simplify")) {
      return `Simplify the following concept in 2-3 easy-to-understand bullet points for a beginner AWS learner.\n\nConcept: ${highlightedText}`;
    }
    // Default fallback
    return highlightedText;
  };

  // API call logic
  const fetchBullets = async () => {
    setLoading(true);
    setError(null);
    setApiDone(false);
    setBullets([]);
    setNoteContent(null);
    setMinTimeElapsed(false);
    try {
      const prompt = buildPrompt();
      if (!prompt) {
        setApiDone(true);
        setBullets([]);
        setNoteContent("");
        setLoading(false);
        return;
      }
      const res = await fetch("http://localhost:4000/api/ask", {
        method: "POST",
        headers: {},
        body: (() => {
          const formData = new FormData();
          formData.append("message", prompt);
          return formData;
        })(),
      });
      if (!res.ok) throw new Error("Failed to get AI response");
      const data = await res.json();
      setApiDone(true);
      setNoteContent(data.ai);
      setBullets(parseBullets(data.ai));
    } catch (err: any) {
      setError("Error generating note. Please try again.");
      setApiDone(false);
    } finally {
      setLoading(false);
    }
  };

  // Auto-trigger loading for note types
  useEffect(() => {
    setAllBulletsDone(false);
    if (!noteType) return;
    const lower = noteType.toLowerCase();
    if (lower.includes("blank")) {
      // Blank note: skip loader, show empty note area
      setLoading(false);
      setError(null);
      setApiDone(true);
      setBullets([]);
      setNoteContent("");
      setMinTimeElapsed(true);
      return;
    }
    // For all other types, fetch bullets
    fetchBullets();
    const minTimer = setTimeout(() => setMinTimeElapsed(true), MIN_LOADER_TIME);
    return () => clearTimeout(minTimer);
    // eslint-disable-next-line
  }, [noteType, question, highlightedText, retryCount]);

  // Show loader until both API and min time are done AND all bullets are done
  const showLoader =
    noteType &&
    !noteType.toLowerCase().includes("blank") &&
    (loading || !apiDone || !minTimeElapsed || !allBulletsDone);

  const handleRetry = () => {
    setRetryCount((c) => c + 1);
  };

  return (
    <div
      data-type="note"
      className="w-[688px] h-[410px] max-h-[480px] min-h-[260px] p-6 relative bg-white rounded-3xl outline outline-1 outline-offset-[-1px] outline-[#dedbda] inline-flex flex-col justify-start items-start gap-6 overflow-hidden"
    >
      {/* Contextual banner at the top, flush with the card's top and matching padding */}
      {!showLoader && (
        <div className="w-full">
          <LearningContextBanner
            noteType={noteType || "explain"}
            highlightedText={highlightedText || ""}
            onDelete={onDelete}
          />
        </div>
      )}
      {/* Loader, error, or note content */}
      <div className="flex-1 w-full flex flex-col items-center justify-center relative">
        {showLoader ? (
          <NoteLoader
            highlightedText={highlightedText}
            aiBullets={bullets}
            noteType={noteType}
            loading={loading}
            error={error}
            onRetry={handleRetry}
            onAllBulletsDone={() => setAllBulletsDone(true)}
          />
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : noteType && noteType.toLowerCase().includes("blank") ? (
          <div className="text-gray-400 italic">(Blank note)</div>
        ) : noteContent ? (
          <>
            <div className="text-gray-800 animate-fade-in-ease w-full overflow-y-auto max-h-[300px] pr-2">
              {renderNoteContent(noteContent)}
            </div>
            {/* Gradient overlay at bottom, fixed to container */}
            <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-8 bg-gradient-to-t from-white to-transparent z-10" />
          </>
        ) : null}
      </div>
    </div>
  );
};

// Truncate and tooltip utility
const truncateWithTooltip = (text: string, maxLength: number) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

export default NoteComponent;
