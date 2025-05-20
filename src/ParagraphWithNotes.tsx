import React, { useRef, useEffect } from "react";
import SegmentedParagraph from "./Components/SegmentedParagraph";
import { useMultiParagraphNotes } from "./MultiParagraphNotesContext";

export function ParagraphWithNotes({ id, text }) {
  const ref = useRef(null);
  const { paragraphRefs, setActiveParagraphId } = useMultiParagraphNotes();

  // Register this ref in the context
  useEffect(() => {
    paragraphRefs.current[id] = ref;
    return () => {
      delete paragraphRefs.current[id];
    };
  }, [id, paragraphRefs]);

  // When user selects text in this paragraph, set as active
  function handleSelection() {
    setActiveParagraphId(id);
  }

  return (
    <SegmentedParagraph
      ref={ref}
      text={text}
      className="text-left self-stretch text-[#101828] text-lg font-normal font-['Inter'] leading-7"
      onSelection={handleSelection}
    />
  );
}
