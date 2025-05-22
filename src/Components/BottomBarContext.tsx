import React, { createContext, useContext, useState, ReactNode } from "react";

export type BottomBarMode = "navigation" | "ask" | "chat" | "progress";

export interface BottomBarContextType {
  mode: BottomBarMode;
  setMode: (mode: BottomBarMode) => void;
  openAsk: (text?: string) => void;
  openChat: () => void;
  openProgress: () => void;
  openNavigation: () => void;
  selectedText: string;
}

const BottomBarContext = createContext<BottomBarContextType | undefined>(
  undefined
);

export const useBottomBar = () => {
  const ctx = useContext(BottomBarContext);
  if (!ctx)
    throw new Error("useBottomBar must be used within BottomBarProvider");
  return ctx;
};

export const BottomBarProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<BottomBarMode>("navigation");
  const [selectedText, setSelectedText] = useState("");

  const openAsk = (text = "") => {
    setSelectedText(text);
    setMode("ask");
  };
  const openChat = () => setMode("chat");
  const openProgress = () => setMode("progress");
  const openNavigation = () => setMode("navigation");

  return (
    <BottomBarContext.Provider
      value={{
        mode,
        setMode,
        openAsk,
        openChat,
        openProgress,
        openNavigation,
        selectedText,
      }}
    >
      {children}
    </BottomBarContext.Provider>
  );
};
