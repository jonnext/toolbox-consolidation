import React, { useRef, useLayoutEffect, useState } from "react";
import ReactDOM from "react-dom";
import NextWorkAsk from "./Components/NextWorkAsk";
import { useOverlayManager } from "./OverlayManager";

interface ToolbarPosition {
  top: number;
  left: number;
}

const AskOverlay: React.FC<{
  position?: ToolbarPosition;
  containerRef?: React.RefObject<HTMLDivElement>;
}> = ({ position, containerRef }) => {
  const { closeOverlay } = useOverlayManager();
  const askRef = useRef<HTMLDivElement>(null);
  const [askHeight, setAskHeight] = useState(0);

  // Measure Ask component height after mount
  useLayoutEffect(() => {
    if (askRef.current) {
      setAskHeight(askRef.current.offsetHeight);
    }
  }, [position]);

  // Click-outside handler: only close if background is clicked
  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      closeOverlay();
    }
  }

  if (!position || !containerRef?.current) return null;

  // Position so the bottom edge is 8px above the selection
  const top = position.top - askHeight;

  return ReactDOM.createPortal(
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        width: "100%",
        zIndex: 1000,
        pointerEvents: "auto",
        background: "none",
      }}
      onPointerDown={handlePointerDown}
    >
      <div ref={askRef} style={{ width: "100%" }}>
        <NextWorkAsk onRequestClose={closeOverlay} />
      </div>
    </div>,
    containerRef.current
  );
};

export default AskOverlay;
