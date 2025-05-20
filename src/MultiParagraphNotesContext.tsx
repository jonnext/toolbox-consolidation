import React, { createContext, useContext, useRef, useState } from "react";

export const MultiParagraphNotesContext = createContext(null);

export function useMultiParagraphNotes() {
  return useContext(MultiParagraphNotesContext);
}

export function MultiParagraphNotesProvider({ children }) {
  // Map of refs: { [id]: ref }
  const paragraphRefs = useRef({});
  const [activeParagraphId, setActiveParagraphId] = useState(null);

  return (
    <MultiParagraphNotesContext.Provider
      value={{ paragraphRefs, activeParagraphId, setActiveParagraphId }}
    >
      {children}
    </MultiParagraphNotesContext.Provider>
  );
}
