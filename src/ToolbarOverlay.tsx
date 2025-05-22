import React, { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useOverlayManager } from "./OverlayManager";
import { Highlighter, MessageSquare, Plus } from "lucide-react";
import { useMultiParagraphNotes } from "./MultiParagraphNotesContext";
import { useBottomBar } from "./Components/BottomBarContext";

interface ToolbarPosition {
  top: number;
  left: number;
}

// NoteSubMenu component (inline for now)
const NoteSubMenu: React.FC<{ onSelect: (option: string) => void }> = ({
  onSelect,
}) => {
  return (
    <div
      data-type="note"
      className="w-[223px] py-1 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(27,25,24,0.05)] outline outline-1 outline-offset-[-1px] outline-[#dedbda] inline-flex flex-col justify-start items-start overflow-hidden"
      style={{
        position: "absolute",
        left: 0,
        bottom: "100%",
        zIndex: 1100,
        marginBottom: 8,
      }}
    >
      <div
        onClick={() => onSelect("Give examples")}
        className="self-stretch px-1.5 py-px inline-flex justify-start items-center cursor-pointer hover:bg-gray-100"
      >
        <div className="flex-1 px-2.5 py-[9px] rounded-md flex justify-start items-center gap-3">
          <div className="flex-1 flex justify-start items-center gap-2">
            <div className="w-4 h-4 relative overflow-hidden">
              <div className="w-3 h-[12.31px] left-[2px] top-[2px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-[#344054]" />
            </div>
            <div className="flex-1 justify-start text-left text-[#403b39] text-sm font-medium font-['FK_Grotesk_Neue'] leading-tight">
              Give examples
            </div>
          </div>
        </div>
      </div>
      <div
        onClick={() => onSelect("Explain more")}
        className="self-stretch px-1.5 py-px inline-flex justify-start items-center cursor-pointer hover:bg-gray-100"
      >
        <div className="flex-1 px-2.5 py-[9px] rounded-md flex justify-start items-center gap-3">
          <div className="flex-1 flex justify-start items-center gap-2">
            <div className="w-4 h-4 relative overflow-hidden">
              <div className="w-3 h-[10.67px] left-[2px] top-[2.67px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-[#344054]" />
            </div>
            <div className="flex-1 justify-start text-left text-[#403b39] text-sm font-medium font-['FK_Grotesk_Neue'] leading-tight">
              Explain more
            </div>
          </div>
        </div>
      </div>
      <div
        onClick={() => onSelect("Blank note")}
        className="self-stretch px-1.5 py-px inline-flex justify-start items-center cursor-pointer hover:bg-gray-100"
      >
        <div className="flex-1 px-2.5 py-[9px] rounded-md flex justify-start items-center gap-3">
          <div className="flex-1 flex justify-start items-center gap-2">
            <div className="w-4 h-4 relative overflow-hidden">
              <div className="w-3 h-3 left-[2px] top-[2px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-[#344054]" />
            </div>
            <div className="flex-1 justify-start text-left text-[#403b39] text-sm font-medium font-['FK_Grotesk_Neue'] leading-tight">
              Blank note
            </div>
          </div>
        </div>
      </div>
      <div
        onClick={() => onSelect("Simplify")}
        className="self-stretch px-1.5 py-px inline-flex justify-start items-center cursor-pointer hover:bg-gray-100"
      >
        <div className="flex-1 px-2.5 py-[9px] rounded-md flex justify-start items-center gap-3">
          <div className="flex-1 flex justify-start items-center gap-2">
            <div className="w-4 h-4 relative">
              <div className="w-[11.25px] h-[13.33px] left-[2.67px] top-[1.33px] absolute outline outline-[1.40px] outline-offset-[-0.70px] outline-black" />
            </div>
            <div className="flex-1 justify-start text-left text-[#403b39] text-sm font-medium font-['FK_Grotesk_Neue'] leading-tight">
              Simplify
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToolbarOverlay: React.FC<{
  position?: ToolbarPosition;
  containerRef?: React.RefObject<HTMLDivElement>;
}> = ({ position, containerRef }) => {
  const { openOverlay, closeOverlay } = useOverlayManager();
  const ref = useRef<HTMLDivElement>(null);
  const noteButtonRef = useRef<HTMLButtonElement>(null);
  const [noteMenuOpen, setNoteMenuOpen] = useState(false);
  const { paragraphRefs, activeParagraphId } = useMultiParagraphNotes();
  const { openAsk } = useBottomBar();

  // Click-outside handler (for toolbar and submenu)
  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node) &&
        (!noteButtonRef.current ||
          !noteButtonRef.current.contains(e.target as Node))
      ) {
        setNoteMenuOpen(false);
        closeOverlay();
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [closeOverlay]);

  // ESC key closes submenu
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setNoteMenuOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Helper to get selected text
  const getSelectedText = () => window.getSelection()?.toString() || "";

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
        onClick={() => {
          openAsk(getSelectedText());
          closeOverlay();
        }}
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
        ref={noteButtonRef}
        className="flex items-center px-3 py-2 bg-white rounded space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500 relative"
        aria-label="Add note to selected text"
        onClick={() => setNoteMenuOpen((open) => !open)}
      >
        <Plus size={20} className="text-[#344154]" />
        <span
          className="text-[14px] font-medium text-[#344154]"
          style={{ letterSpacing: "-0.4px" }}
        >
          Note
        </span>
        {noteMenuOpen && (
          <NoteSubMenu
            onSelect={(option) => {
              const question = window.getSelection()?.toString() || option;
              const paraRef = paragraphRefs.current[activeParagraphId];
              if (paraRef && paraRef.current) {
                paraRef.current.insertNoteAtSelection(option, question);
              }
              setNoteMenuOpen(false);
              closeOverlay();
            }}
          />
        )}
      </button>
    </div>,
    containerRef.current
  );
};

export default ToolbarOverlay;
