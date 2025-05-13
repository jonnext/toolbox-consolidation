import React, { useRef, useEffect, ReactNode } from "react";
import { useOverlayManager } from "../OverlayManager";

interface ToolbarPosition {
  top: number;
  left: number;
}

interface TextSelectionToolbarProviderProps {
  children: ReactNode;
}

const TextSelectionToolbarProvider: React.FC<
  TextSelectionToolbarProviderProps
> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { openOverlay } = useOverlayManager();

  // Helper: Get selection rect relative to container, using the bounding rect for centering
  const getSelectionRectRelativeToContainer = (): ToolbarPosition | null => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    const range = selection.getRangeAt(0);
    const container = containerRef.current;
    if (!container || !range || selection.isCollapsed) return null;
    if (!container.contains(range.commonAncestorContainer)) return null;
    const boundingRect = range.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    // For overlays inside the container, top is relative to container
    const top = boundingRect.top - containerRect.top - 8;
    const left =
      boundingRect.left - containerRect.left + boundingRect.width / 2;
    return { top, left };
  };

  // Show toolbar on mouseup if valid selection
  useEffect(() => {
    const handleMouseUp = () => {
      const pos = getSelectionRectRelativeToContainer();
      if (pos && !isNaN(pos.top) && !isNaN(pos.left)) {
        openOverlay("toolbar", pos, containerRef);
      }
    };
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, [openOverlay]);

  return (
    <div ref={containerRef} className="relative">
      {children}
    </div>
  );
};

export default TextSelectionToolbarProvider;

// TODO: Implement action handlers for Highlight, Note
// TODO: Make theme-aware
// TODO: Add tests and documentation
