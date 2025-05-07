import React, {
  useRef,
  useState,
  useEffect,
  ReactNode,
  RefObject,
} from "react";
import { Highlighter, MessageSquare, Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import NextWorkAsk from "../Components/NextWorkAsk";

interface ToolbarPosition {
  top: number;
  left: number;
}

interface TextSelectionToolbarProviderProps {
  children: ReactNode;
}

type ToolbarMode = "toolbar" | "ask" | null;

const TOOLBAR_GAP = 8; // px gap above the selection
const TOOLBAR_DEFAULT_HEIGHT = 40; // px fallback height

const Toolbar: React.FC<{
  position: ToolbarPosition;
  onDismiss: () => void;
  onAsk: () => void;
  toolbarRef: RefObject<HTMLDivElement>;
}> = ({ position, onDismiss, onAsk, toolbarRef }) => {
  // Restore real toolbar button group UI
  const handleHighlight = () => {
    // TODO: Implement highlight logic
    console.log("Highlight clicked");
    onDismiss();
  };
  const handleAsk = () => {
    onAsk();
  };
  const handleNote = () => {
    // TODO: Implement note logic
    console.log("Note clicked");
    onDismiss();
  };

  return (
    <div
      ref={toolbarRef}
      role="toolbar"
      tabIndex={0}
      aria-label="Text selection toolbar"
      className="absolute z-50 p-1 bg-white rounded-lg shadow-[0_1px_2px_rgba(27,25,24,0.05)]"
      style={{
        top: position.top,
        left: position.left,
        transform: "translate(-50%, -100%)",
      }}
    >
      <div className="flex items-center">
        <button
          className="flex items-center px-4 py-2 mr-1 bg-white rounded space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Highlight selected text"
          onClick={handleHighlight}
        >
          <Highlighter size={20} className="text-[#344154]" />
          <span
            className="text-[14px] font-medium text-[#344154]"
            style={{ letterSpacing: "-0.4px" }}
          >
            Highlight
          </span>
        </button>
        <button
          className="flex items-center px-4 py-2 mr-1 bg-white rounded space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Ask about selected text"
          onClick={handleAsk}
        >
          <MessageSquare size={20} className="text-[#344154]" />
          <span
            className="text-[14px] font-medium text-[#344154]"
            style={{ letterSpacing: "-0.4px" }}
          >
            Ask
          </span>
        </button>
        <button
          className="flex items-center px-4 py-2 bg-white rounded space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Add note to selected text"
          onClick={handleNote}
        >
          <Plus size={20} className="text-[#344154]" />
          <span
            className="text-[14px] font-medium text-[#344154]"
            style={{ letterSpacing: "-0.4px" }}
          >
            Note
          </span>
        </button>
      </div>
    </div>
  );
};

const AskWrapper: React.FC<{
  position: ToolbarPosition;
  onDismiss: () => void;
  onRequestClose: () => void;
}> = ({ position, onDismiss, onRequestClose }) => {
  // Use the same gap as the toolbar
  const TOOLBAR_GAP = 8;

  return (
    <div
      className="absolute z-50 w-full left-0 nextwork-ask-root"
      style={{
        top: position.top - TOOLBAR_GAP,
        transform: "translateY(-100%)",
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* NextWork Ask component, default placeholder */}
      <NextWorkAsk onRequestClose={onRequestClose} />
    </div>
  );
};

const TextSelectionToolbarProvider: React.FC<
  TextSelectionToolbarProviderProps
> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const justOpenedAsk = useRef(false);
  const [mode, setMode] = useState<ToolbarMode>(null);
  const [toolbarPosition, setToolbarPosition] = useState<ToolbarPosition>({
    top: 0,
    left: 0,
  });
  const [toolbarHeight, setToolbarHeight] = useState<number>(
    TOOLBAR_DEFAULT_HEIGHT
  );

  // Helper: Get selection rect relative to container, using the bounding rect for centering
  const getSelectionRectRelativeToContainer = (): ToolbarPosition | null => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    const range = selection.getRangeAt(0);
    const container = containerRef.current;
    if (!container || !range || selection.isCollapsed) return null;
    if (!container.contains(range.commonAncestorContainer)) return null;
    // Use the bounding rect for perfect centering above multi-line selections
    const boundingRect = range.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    // Place the toolbar's bottom center TOOLBAR_GAP px above the selection
    const top = boundingRect.top - containerRect.top - TOOLBAR_GAP;
    const left =
      boundingRect.left - containerRect.left + boundingRect.width / 2;
    // Debug logging
    console.log("boundingRect:", boundingRect);
    console.log("containerRect:", containerRect);
    console.log("calculated top:", top, "calculated left:", left);
    return {
      top,
      left,
    };
  };

  // Show toolbar on mouseup if valid selection
  useEffect(() => {
    const handleMouseUp = () => {
      const pos = getSelectionRectRelativeToContainer();
      if (pos && !isNaN(pos.top) && !isNaN(pos.left)) {
        setToolbarPosition(pos);
        setMode("toolbar");
      } else {
        setMode(null);
      }
    };
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, [toolbarHeight]);

  // Measure toolbar height when shown
  useEffect(() => {
    if (mode === "toolbar" && toolbarRef.current) {
      setToolbarHeight(
        toolbarRef.current.offsetHeight || TOOLBAR_DEFAULT_HEIGHT
      );
    }
  }, [mode]);

  // Utility to log full DOM path and computed styles
  function logDomPathAndStyles(target: EventTarget | null) {
    let node = target as HTMLElement | null;
    let path = [];
    while (node) {
      if (node.nodeType === 1) {
        const styles = window.getComputedStyle(node);
        path.push({
          tag: node.tagName,
          class: node.className,
          id: node.id,
          zIndex: styles.zIndex,
          pointerEvents: styles.pointerEvents,
          display: styles.display,
          node,
        });
      }
      node = node.parentElement;
    }
    console.log("[DOM Path & Styles]", path);
  }

  // Dismiss toolbar or Ask on click outside or Escape
  useEffect(() => {
    if (!mode) return;
    const handleClick = (e: MouseEvent) => {
      if (justOpenedAsk.current) {
        justOpenedAsk.current = false;
        console.log(
          "[TextSelectionToolbarProvider] Ignoring first click after opening Ask."
        );
        return;
      }
      const toolbar = document.querySelector('[role="toolbar"]');
      console.log(
        "[TextSelectionToolbarProvider] Document mousedown. mode:",
        mode,
        "Target:",
        e.target
      );
      logDomPathAndStyles(e.target);
      // Class-based check for Ask UI
      let node = e.target as HTMLElement | null;
      while (node) {
        if (node.classList && node.classList.contains("nextwork-ask-root")) {
          console.log(
            "[TextSelectionToolbarProvider] Click inside Ask detected by class, not closing."
          );
          return;
        }
        node = node.parentElement;
      }
      if (
        (mode === "toolbar" &&
          toolbar &&
          !toolbar.contains(e.target as Node)) ||
        mode === "ask"
      ) {
        console.log(
          "[TextSelectionToolbarProvider] Click outside detected, closing Ask/Toolbar."
        );
        setMode(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMode(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mode]);

  // Reposition toolbar/Ask on scroll/resize
  useEffect(() => {
    if (!mode) return;
    const handleReposition = () => {
      const pos = getSelectionRectRelativeToContainer();
      if (pos && !isNaN(pos.top) && !isNaN(pos.left)) {
        setToolbarPosition(pos);
      } else {
        setMode(null);
      }
    };
    window.addEventListener("scroll", handleReposition);
    window.addEventListener("resize", handleReposition);
    return () => {
      window.removeEventListener("scroll", handleReposition);
      window.removeEventListener("resize", handleReposition);
    };
  }, [mode, toolbarHeight]);

  // Patch: When opening Ask, ignore the next document click
  const handleAsk = () => {
    justOpenedAsk.current = true;
    setMode("ask");
  };

  return (
    <div ref={containerRef} className="relative">
      {children}
      <AnimatePresence>
        {mode === "toolbar" && (
          <Toolbar
            position={toolbarPosition}
            onDismiss={() => setMode(null)}
            onAsk={handleAsk}
            toolbarRef={toolbarRef}
          />
        )}
        {mode === "ask" && (
          <AskWrapper
            position={toolbarPosition}
            onDismiss={() => setMode(null)}
            onRequestClose={() => setMode(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TextSelectionToolbarProvider;

// TODO: Implement action handlers for Highlight, Note
// TODO: Make theme-aware
// TODO: Add tests and documentation
