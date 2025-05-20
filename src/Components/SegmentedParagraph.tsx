import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import NoteComponent from "./NoteComponent";
import { motion, AnimatePresence } from "motion/react";

// Data model for an AskAnchor (inline chat window)
interface AskAnchor {
  id: string;
  selection: { start: number; end: number }; // character indices in the text
  chatHistory: Array<{ sender: "user" | "ai"; message: string }>;
  context: string; // the selected text
}

interface NoteAnchor {
  id: string;
  selection: { start: number; end: number };
  noteType: string;
  question: string;
}

type Anchor = AskAnchor | NoteAnchor;

interface SegmentedParagraphProps {
  text: string;
  className?: string;
  // Optional: callback for when a note is inserted
  onNoteInsert?: (note: NoteAnchor) => void;
  // Optional: callback for when a selection is made
  onSelection?: () => void;
}

// Forward ref to allow parent to call insertNoteAtSelection
const SegmentedParagraph = forwardRef<
  { insertNoteAtSelection: (noteType: string, question: string) => void },
  SegmentedParagraphProps
>(({ text, className = "", onNoteInsert, onSelection }, ref) => {
  // State for all anchors in this paragraph
  const [anchors, setAnchors] = useState<Anchor[]>([]);
  // State for current selection (start/end indices)
  const [selection, setSelection] = useState<{
    start: number;
    end: number;
  } | null>(null);
  const paragraphRef = useRef<HTMLDivElement>(null);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

  // Detect text selection within the paragraph
  function handleMouseUp() {
    const selectionObj = window.getSelection();
    if (!selectionObj || selectionObj.isCollapsed) {
      setSelection(null);
      return;
    }
    const anchorNode = selectionObj.anchorNode;
    const focusNode = selectionObj.focusNode;
    if (!paragraphRef.current || !anchorNode || !focusNode) {
      setSelection(null);
      return;
    }
    // Only proceed if selection is within this paragraph
    if (
      !paragraphRef.current.contains(anchorNode) ||
      !paragraphRef.current.contains(focusNode)
    ) {
      setSelection(null);
      return;
    }
    // Calculate start and end indices relative to the paragraph text
    const range = selectionObj.getRangeAt(0);
    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(paragraphRef.current);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    let start = preSelectionRange.toString().length;
    let end = start + range.toString().length;
    // Clamp indices
    start = Math.max(0, Math.min(start, text.length));
    end = Math.max(0, Math.min(end, text.length));
    if (start > end) [start, end] = [end, start];
    if (start !== end) {
      setSelection({ start, end });
      if (onSelection) onSelection();
    } else {
      setSelection(null);
    }
  }

  // Function to insert a NoteAnchor at the current selection
  function insertNoteAtSelection(noteType: string, question: string) {
    if (!selection) return;
    let { start, end } = selection;
    // Clamp indices
    start = Math.max(0, Math.min(start, text.length));
    end = Math.max(0, Math.min(end, text.length));
    if (start > end) [start, end] = [end, start];
    // Prevent duplicate notes for the same selection
    if (
      anchors.some(
        (a) =>
          a.selection.start === start &&
          a.selection.end === end &&
          (a as NoteAnchor).noteType
      )
    ) {
      setSelection(null);
      return;
    }
    const note: NoteAnchor = {
      id: Date.now().toString(),
      selection: { start, end },
      noteType,
      question,
    };
    setAnchors([...anchors, note]);
    setSelection(null); // Clear selection after inserting
    window.getSelection()?.removeAllRanges(); // Clear browser highlight
    if (onNoteInsert) onNoteInsert(note);
  }

  function handleDeleteNote(noteId: string) {
    setDeletingNoteId(noteId);
    setTimeout(() => {
      setAnchors((prev) => prev.filter((a) => a.id !== noteId));
      setDeletingNoteId(null);
    }, 400); // Match animation duration
  }

  // Expose insertNoteAtSelection to parent via ref
  useImperativeHandle(ref, () => ({
    insertNoteAtSelection,
  }));

  // Pseudocode: Render the text as segments, inserting anchors inline
  function renderSegments() {
    let segments = [];
    let lastIndex = 0;
    // Sort anchors by start index
    const sortedAnchors = [...anchors].sort(
      (a, b) => a.selection.start - b.selection.start
    );

    sortedAnchors.forEach((anchor, i) => {
      console.log(
        `Segment ${i}: lastIndex=${lastIndex}, anchor.start=${anchor.selection.start}, anchor.end=${anchor.selection.end}`
      );
      // Text before anchor
      if (anchor.selection.start > lastIndex) {
        const before = text.slice(lastIndex, anchor.selection.start);
        console.log(`  Text before: '${before}'`);
        segments.push(<span key={`text-before-${i}`}>{before}</span>);
      }
      // Highlighted selected text
      const highlighted = text.slice(
        anchor.selection.start,
        anchor.selection.end
      );
      console.log(`  Highlighted: '${highlighted}'`);
      segments.push(
        <span key={`highlight-${i}`} className="bg-yellow-100 font-semibold">
          {highlighted}
        </span>
      );
      // Inline NoteAnchor
      if ((anchor as NoteAnchor).noteType) {
        segments.push(
          <AnimatePresence key={`note-anchor-animate-${i}`}>
            {deletingNoteId !== anchor.id && (
              <motion.div
                key={`note-anchor-${i}`}
                initial={{ opacity: 1, height: "auto", margin: "16px 0" }}
                exit={{ opacity: 0, height: 0, margin: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <NoteComponent
                  question={(anchor as NoteAnchor).question}
                  noteType={(anchor as NoteAnchor).noteType}
                  highlightedText={highlighted}
                  onDelete={() => handleDeleteNote(anchor.id)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        );
      }
      lastIndex = anchor.selection.end;
    });
    // Remaining text (after last anchor)
    if (lastIndex < text.length) {
      const after = text.slice(lastIndex);
      console.log(`Text after last anchor: '${after}'`);
      segments.push(<span key="text-after-last">{after}</span>);
    }
    return segments;
  }

  return (
    <div
      className={className}
      ref={paragraphRef}
      onMouseUp={handleMouseUp}
      style={{ userSelect: "text", cursor: "text" }}
    >
      {/* Optionally, show a floating Ask button when selection is active */}
      {/* {selection && (
        <button
          className="fixed z-50 px-3 py-1 bg-blue-600 text-white rounded shadow"
          style={{ top: 0, left: 0, transform: "translateY(-40px)" }}
          onClick={insertAskAtSelection}
        >
          Ask
        </button>
      )} */}
      <div>{renderSegments()}</div>
    </div>
  );
});

export default SegmentedParagraph;
