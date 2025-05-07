import React, { useState, useRef, useEffect, forwardRef } from "react";
import TextareaAutosize from "react-textarea-autosize";

// NextWorkAsk: Enables learners to ask questions and upload error screenshots
// Accessibility and UI/UX comments included for clarity

interface NextWorkAskProps {
  onRequestClose: () => void;
}

const NextWorkAsk = forwardRef<HTMLDivElement, NextWorkAskProps>(
  (props, ref) => {
    // State management
    const [questionText, setQuestionText] = useState("");
    const [attachedImages, setAttachedImages] = useState<File[]>([]);
    const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isSending, setIsSending] = useState(false);
    // Placeholder for chatbot window state
    const [showChatbot, setShowChatbot] = useState(false);
    // Track which image is hovered/focused for tooltip preview
    const [hoveredPreviewIdx, setHoveredPreviewIdx] = useState<number | null>(
      null
    );

    // Ref for file input
    const fileInputRef = useRef<HTMLInputElement>(null);
    // Support both forwarded and local refs
    const localRef = useRef<HTMLDivElement>(null);
    const rootRef = (ref as React.RefObject<HTMLDivElement>) || localRef;

    useEffect(() => {
      function handleClick(e: MouseEvent) {
        if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
          props.onRequestClose();
        }
      }
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }, [rootRef, props]);

    useEffect(() => {
      if (ref && typeof ref === "object") {
        console.log("[NextWorkAsk] ref current:", ref.current);
      }
    }, [ref]);

    // Handler for textarea change
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setQuestionText(e.target.value);
    };

    // Handler for paperclip click (triggers file input)
    const handleAttachClick = () => {
      fileInputRef.current?.click();
    };

    // Handler for "Ask the community" button
    const handleAskCommunity = () => {
      window.open("https://community.nextwork.org", "_blank", "noopener");
    };

    // Handler for send button (placeholder)
    const handleSend = () => {
      if (!questionText && attachedImages.length === 0) return;
      setIsSending(true);
      // Placeholder: open chatbot window
      setTimeout(() => {
        setShowChatbot(true);
        setIsSending(false);
        setQuestionText("");
        setAttachedImages([]);
        setImagePreviewUrls([]);
      }, 1000);
    };

    // Keyboard accessibility: Enter to send, Esc to clear
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      } else if (e.key === "Escape") {
        setQuestionText("");
      }
    };

    // Handler for file input change (image upload)
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(null);
      const files = e.target.files;
      if (!files || files.length === 0) return;
      const newFiles: File[] = Array.from(files);
      const validFiles: File[] = [];
      const newPreviews: string[] = [];
      let errorMsg = "";
      // Prevent duplicates and limit to 5 images
      const currentNames = attachedImages.map((f) => f.name);
      for (const file of newFiles) {
        if (!["image/png", "image/jpeg", "image/gif"].includes(file.type)) {
          errorMsg = "Only PNG, JPEG, and GIF images are allowed.";
          continue;
        }
        if (file.size > 5 * 1024 * 1024) {
          errorMsg = "Image must be under 5MB.";
          continue;
        }
        if (currentNames.includes(file.name)) {
          errorMsg = "Duplicate image skipped.";
          continue;
        }
        if (validFiles.length + attachedImages.length >= 5) {
          errorMsg = "Maximum 5 images allowed.";
          break;
        }
        validFiles.push(file);
      }
      if (validFiles.length === 0) {
        setError(errorMsg);
        return;
      }
      // Read previews for all valid files
      let filesProcessed = 0;
      validFiles.forEach((file, idx) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          newPreviews[idx] = event.target?.result as string;
          filesProcessed++;
          if (filesProcessed === validFiles.length) {
            setAttachedImages((prev) => [...prev, ...validFiles]);
            setImagePreviewUrls((prev) => [...prev, ...newPreviews]);
            if (errorMsg) setError(errorMsg);
          }
        };
        reader.readAsDataURL(file);
      });
    };

    // Remove attached image
    const handleRemoveImage = (idx: number) => {
      setAttachedImages((prev) => prev.filter((_, i) => i !== idx));
      setImagePreviewUrls((prev) => prev.filter((_, i) => i !== idx));
      setError(null);
      fileInputRef.current?.focus();
    };

    // Drag-and-drop event handlers
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        // Create a synthetic event to reuse handleFileChange
        const fileList = e.dataTransfer.files;
        const syntheticEvent = {
          target: { files: fileList },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        handleFileChange(syntheticEvent);
      }
    };

    // Tooltip component for button icons
    const IconTooltip: React.FC<{ text: string }> = ({ text }) => (
      <div className="absolute z-30 left-1/2 -translate-x-1/2 -top-2 translate-y-[-100%] bg-[#1B1918] text-white text-xs px-2 py-1 rounded shadow transition-all duration-200 ease-out opacity-100 pointer-events-none whitespace-nowrap">
        {text}
      </div>
    );

    return (
      <div
        ref={rootRef}
        onMouseDownCapture={(e) => {
          if (typeof window !== "undefined") window.clickedInsideAsk = true;
          console.log(
            "[NextWorkAsk] onMouseDownCapture fired. Target:",
            e.target
          );
        }}
        // Make the component take full width of its parent container and set vertical padding to 12px
        className="w-full bg-white rounded-xl shadow py-4 px-6 relative focus:outline-none"
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        tabIndex={0} // Make container focusable for accessibility
        aria-label="Ask a question or drop an image to attach"
      >
        {/* Question input area */}
        <TextareaAutosize
          className="w-full min-h-[50px] resize-none border-none outline-none text-base py-3 placeholder:text-gray-400 bg-transparent"
          placeholder="Turn curiosity into knowledge. Ask anything..."
          value={questionText}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          aria-label="Ask a question"
        />

        {/* Action row: Attach, Community, Send */}
        <div className="flex items-center gap-3 py-1">
          {/* Paperclip (attach) button */}
          <button
            type="button"
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring relative"
            aria-label="Attach image"
            onClick={handleAttachClick}
            onMouseEnter={() => setHoveredPreviewIdx(-1)}
            onMouseLeave={() => setHoveredPreviewIdx(null)}
            onFocus={() => setHoveredPreviewIdx(-1)}
            onBlur={() => setHoveredPreviewIdx(null)}
          >
            {/* Paperclip icon - set to #403B39 */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#403B39"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.48-8.48l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
            </svg>
            {/* Tooltip for paperclip */}
            {hoveredPreviewIdx === -1 && <IconTooltip text="Attach image" />}
          </button>
          {/* Divider */}
          <div className="w-px h-6 bg-gray-200" />
          {/* Community button - set icon to #403B39 */}
          <button
            type="button"
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring relative"
            aria-label="Ask the community"
            onClick={handleAskCommunity}
            onMouseEnter={() => setHoveredPreviewIdx(-2)}
            onMouseLeave={() => setHoveredPreviewIdx(null)}
            onFocus={() => setHoveredPreviewIdx(-2)}
            onBlur={() => setHoveredPreviewIdx(null)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#403B39"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            {/* Tooltip for community */}
            {hoveredPreviewIdx === -2 && (
              <IconTooltip text="Ask the community" />
            )}
          </button>
          {/* Spacer */}
          <div className="flex-1" />
          {/* Send button - set icon to #403B39 */}
          <button
            type="button"
            className="w-11 h-11 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring relative"
            aria-label="Send question"
            onClick={handleSend}
            disabled={
              isSending || (!questionText && attachedImages.length === 0)
            }
            onMouseEnter={() => setHoveredPreviewIdx(-3)}
            onMouseLeave={() => setHoveredPreviewIdx(null)}
            onFocus={() => setHoveredPreviewIdx(-3)}
            onBlur={() => setHoveredPreviewIdx(null)}
          >
            {isSending ? (
              // Loading spinner for send action
              <svg
                className="animate-spin w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#403B39"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#403B39"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="#403B39"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
            ) : (
              // Send icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#403B39"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 transform rotate-45"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            )}
            {/* Tooltip for send */}
            {hoveredPreviewIdx === -3 && <IconTooltip text="Send" />}
          </button>
        </div>

        {/* Hidden file input for image upload */}
        <input
          type="file"
          accept="image/png,image/jpeg,image/gif"
          className="hidden"
          ref={fileInputRef}
          tabIndex={-1}
          aria-hidden="true"
          onChange={handleFileChange}
          multiple
        />

        {/* Image preview section - stack vertically for multiple images */}
        {attachedImages.length > 0 && (
          <div className="flex flex-col gap-2 mt-2" aria-live="polite">
            {attachedImages.map((file, idx) => (
              <div
                key={file.name}
                className="flex items-center border border-dashed border-gray-200 rounded-md p-2 max-w-full bg-gray-50 relative"
              >
                {/* Thumbnail with tooltip on hover/focus */}
                <div
                  className="relative"
                  onMouseEnter={() => setHoveredPreviewIdx(idx)}
                  onMouseLeave={() => setHoveredPreviewIdx(null)}
                  onFocus={() => setHoveredPreviewIdx(idx)}
                  onBlur={() => setHoveredPreviewIdx(null)}
                  tabIndex={0}
                  aria-describedby={
                    hoveredPreviewIdx === idx ? `img-tooltip-${idx}` : undefined
                  }
                >
                  <img
                    src={imagePreviewUrls[idx]}
                    alt={file.name}
                    className="w-8 h-8 rounded object-cover mr-2 cursor-pointer"
                  />
                  {/* Tooltip preview */}
                  {hoveredPreviewIdx === idx && (
                    <div
                      id={`img-tooltip-${idx}`}
                      className="absolute z-20 left-1/2 -translate-x-1/2 -top-2 translate-y-[-100%] bg-white border border-gray-300 rounded shadow-lg p-2 flex items-center transition-all duration-200 ease-out opacity-100 scale-100"
                      style={{ minWidth: 120, minHeight: 120 }}
                      role="tooltip"
                    >
                      <img
                        src={imagePreviewUrls[idx]}
                        alt={file.name}
                        className="w-32 h-32 object-contain rounded"
                      />
                    </div>
                  )}
                </div>
                <span
                  className="truncate text-sm text-gray-700 max-w-[150px]"
                  title={file.name}
                >
                  {file.name}
                </span>
                {/* Remove button - set icon to #403B39 */}
                <button
                  type="button"
                  className="ml-auto p-1 text-gray-400 hover:text-gray-700 focus:outline-none relative"
                  aria-label={`Remove attached image ${file.name}`}
                  onClick={() => handleRemoveImage(idx)}
                  onMouseEnter={() => setHoveredPreviewIdx(1000 + idx)}
                  onMouseLeave={() => setHoveredPreviewIdx(null)}
                  onFocus={() => setHoveredPreviewIdx(1000 + idx)}
                  onBlur={() => setHoveredPreviewIdx(null)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#403B39"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  {/* Tooltip for remove */}
                  {hoveredPreviewIdx === 1000 + idx && (
                    <IconTooltip text="Remove" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-2 text-sm text-red-600" role="alert">
            {error}
          </div>
        )}

        {/* Drag-and-drop overlay */}
        {isDragging && (
          <div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/90 border-2 border-dashed border-indigo-400 rounded-xl transition"
            aria-live="polite"
            role="alert"
          >
            {/* Drag icon */}
            <svg
              className="w-12 h-12 text-indigo-500 mb-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <div className="text-lg font-medium text-gray-800">
              Drop your image here
            </div>
            <div className="text-sm text-gray-500">PNG, JPG, GIF up to 5MB</div>
          </div>
        )}

        {/* Placeholder for AI chatbot window */}
        {showChatbot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
              {/* Close button - set icon to #403B39 */}
              <button
                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-700 focus:outline-none relative"
                aria-label="Close chatbot"
                onClick={() => setShowChatbot(false)}
                onMouseEnter={() => setHoveredPreviewIdx(-4)}
                onMouseLeave={() => setHoveredPreviewIdx(null)}
                onFocus={() => setHoveredPreviewIdx(-4)}
                onBlur={() => setHoveredPreviewIdx(null)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#403B39"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                {/* Tooltip for close */}
                {hoveredPreviewIdx === -4 && <IconTooltip text="Close" />}
              </button>
              <div className="text-lg font-semibold mb-2">
                AI Chatbot (Coming Soon)
              </div>
              <div className="text-gray-600">
                Your question has been sent! This is a placeholder for the AI
                chat window.
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

declare global {
  interface Window {
    clickedInsideAsk?: boolean;
  }
}

export default NextWorkAsk;
