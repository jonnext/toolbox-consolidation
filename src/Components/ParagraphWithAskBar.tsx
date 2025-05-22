import React, { useState } from "react";
import SegmentedParagraph from "./SegmentedParagraph";
import AskAnythingBar from "./BottomBarModes/AskAnythingBar";

// Data model for anchors (copied from SegmentedParagraph)
interface AskAnchor {
  id: string;
  selection: { start: number; end: number };
  chatHistory: Array<{ sender: "user" | "ai"; message: string }>;
  context: string;
}
interface NoteAnchor {
  id: string;
  selection: { start: number; end: number };
  noteType: string;
  question: string;
}
type Anchor = AskAnchor | NoteAnchor;

const initialText = "";

const ParagraphWithAskBar: React.FC = () => {
  const [anchors, setAnchors] = useState<Anchor[]>([]);
  const [activeHighlightId, setActiveHighlightId] = useState<string | null>(
    null
  );
  const [askBarOpen, setAskBarOpen] = useState(false);

  // Called when a highlight is clicked in SegmentedParagraph
  function handleHighlightClick(id: string) {
    setActiveHighlightId(id);
    setAskBarOpen(true);
  }

  // Add a message to the chatHistory of the active AskAnchor
  function addMessageToHighlight(
    id: string,
    message: { sender: "user" | "ai"; message: string }
  ) {
    setAnchors((prev) =>
      prev.map((a) =>
        a.id === id && "chatHistory" in a
          ? { ...a, chatHistory: [...(a as AskAnchor).chatHistory, message] }
          : a
      )
    );
  }

  // Find the active AskAnchor
  const activeAskAnchor = anchors.find(
    (a) => a.id === activeHighlightId && "chatHistory" in a
  ) as AskAnchor | undefined;

  return (
    <div>
      <SegmentedParagraph
        text={initialText}
        anchors={anchors}
        setAnchors={setAnchors}
        activeHighlightId={activeHighlightId}
        onHighlightClick={handleHighlightClick}
      />
      {askBarOpen && activeAskAnchor && (
        <AskAnythingBar
          initialText={
            activeAskAnchor.chatHistory?.[
              activeAskAnchor.chatHistory.length - 1
            ]?.message || ""
          }
          onClose={() => setAskBarOpen(false)}
        />
      )}
    </div>
  );
};

export default ParagraphWithAskBar;
