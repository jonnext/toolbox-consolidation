import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  RefObject,
} from "react";
import AskOverlay from "./AskOverlay";
import ToolbarOverlay from "./ToolbarOverlay";

// Types for overlay
export type OverlayType = "toolbar" | "ask" | null;

interface ToolbarPosition {
  top: number;
  left: number;
}

interface OverlayManagerContextProps {
  overlay: OverlayType;
  overlayPosition?: ToolbarPosition;
  overlayContainerRef?: RefObject<HTMLDivElement>;
  openOverlay: (
    type: OverlayType,
    position?: ToolbarPosition,
    containerRef?: RefObject<HTMLDivElement>
  ) => void;
  closeOverlay: () => void;
}

const OverlayManagerContext = createContext<
  OverlayManagerContextProps | undefined
>(undefined);

export const OverlayManagerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [overlay, setOverlay] = useState<OverlayType>(null);
  const [overlayPosition, setOverlayPosition] = useState<
    ToolbarPosition | undefined
  >(undefined);
  const [overlayContainerRef, setOverlayContainerRef] = useState<
    RefObject<HTMLDivElement> | undefined
  >(undefined);

  const openOverlay = (
    type: OverlayType,
    position?: ToolbarPosition,
    containerRef?: RefObject<HTMLDivElement>
  ) => {
    setOverlay(type);
    setOverlayPosition(position);
    setOverlayContainerRef(containerRef);
  };
  const closeOverlay = () => {
    setOverlay(null);
    setOverlayPosition(undefined);
    setOverlayContainerRef(undefined);
  };

  return (
    <OverlayManagerContext.Provider
      value={{
        overlay,
        overlayPosition,
        overlayContainerRef,
        openOverlay,
        closeOverlay,
      }}
    >
      {children}
      {overlay === "toolbar" && (
        <ToolbarOverlay
          position={overlayPosition}
          containerRef={overlayContainerRef}
        />
      )}
      {overlay === "ask" && (
        <AskOverlay
          position={overlayPosition}
          containerRef={overlayContainerRef}
        />
      )}
    </OverlayManagerContext.Provider>
  );
};

export function useOverlayManager() {
  const context = useContext(OverlayManagerContext);
  if (!context) {
    throw new Error(
      "useOverlayManager must be used within an OverlayManagerProvider"
    );
  }
  return context;
}
