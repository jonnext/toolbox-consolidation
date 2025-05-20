import { createContext, useContext, RefObject } from "react";

export const SegmentedParagraphRefContext = createContext<RefObject<{
  insertNoteAtSelection: (noteType: string, question: string) => void;
}> | null>(null);

export function useSegmentedParagraphRef() {
  return useContext(SegmentedParagraphRefContext);
}
