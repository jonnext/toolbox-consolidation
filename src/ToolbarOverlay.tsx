import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { useOverlayManager } from "./OverlayManager";
import { Highlighter, MessageSquare, Plus } from "lucide-react";

interface ToolbarPosition {
  top: number;
  left: number;
}

const ToolbarOverlay: React.FC<{
  position?: ToolbarPosition;
  containerRef?: React.RefObject<HTMLDivElement>;
}> = ({ position, containerRef }) => {
  const { openOverlay, closeOverlay } = useOverlayManager();
  const ref = useRef<HTMLDivElement>(null);

  // Click-outside handler
  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        closeOverlay();
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [closeOverlay]);

  if (!position || !containerRef?.current) return null;

  return ReactDOM.createPortal(
    <div
      ref={ref}
      role="toolbar"
      tabIndex={0}
      aria-label="Text selection toolbar"
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        transform: "translate(-50%, -100%)",
        zIndex: 1000,
        background: "white",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        padding: 4,
        display: "flex",
        gap: 2,
        alignItems: "center",
        minHeight: 40,
        margin: 0,
      }}
    >
      <button
        className="flex items-center px-3 py-2 bg-white rounded space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Highlight selected text"
        // onClick={handleHighlight}
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
        className="flex items-center px-3 py-2 bg-white rounded space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Ask about selected text"
        onClick={() => openOverlay("ask", position, containerRef)}
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
        className="flex items-center px-3 py-2 bg-white rounded space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Add note to selected text"
        // onClick={handleNote}
      >
        <Plus size={20} className="text-[#344154]" />
        <span
          className="text-[14px] font-medium text-[#344154]"
          style={{ letterSpacing: "-0.4px" }}
        >
          Note
        </span>
      </button>
    </div>,
    containerRef.current
  );
};

export default ToolbarOverlay;
