import React, { useState, useRef, useEffect } from "react";
import {
  getRandomInfographicImage,
  getNewRandomInfographicImage,
} from "../utils/infographicImages";

interface ImageData {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

interface ParagraphProps {
  children: React.ReactNode;
  className?: string;
}

const ParagraphToImageConversion: React.FC<ParagraphProps> = ({
  children,
  className = "",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showAsVisuals, setShowAsVisuals] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [currentImage, setCurrentImage] = useState<ImageData>(() => ({
    ...getRandomInfographicImage(),
    width: 1200,
    height: 675, // Default 16:9 aspect ratio
  }));
  const [nextImage, setNextImage] = useState<ImageData | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const waffleRef = useRef<HTMLButtonElement>(null);
  const paragraphRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        waffleRef.current &&
        !waffleRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Reset announcement after it's been read
  useEffect(() => {
    if (announcement) {
      const timer = setTimeout(() => {
        setAnnouncement("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [announcement]);

  // Preload next image when currentImage changes
  useEffect(() => {
    if (hasImage && !isConverting) {
      const newImage = getNewRandomInfographicImage(currentImage.src);
      const img = new Image();
      img.src = newImage.src;
      img.onload = () => {
        setNextImage({
          ...newImage,
          width: 1200,
          height: 675,
        });
      };
    }
  }, [currentImage, hasImage, isConverting]);

  const handleConvertToImage = () => {
    setIsMenuOpen(false);
    setIsConverting(true);
    setAnnouncement("Converting text to image. Please wait...");

    // If we have a preloaded image, use it immediately
    if (nextImage) {
      setTimeout(() => {
        setCurrentImage(nextImage);
        setNextImage(null);
        setIsConverting(false);
        setHasImage(true);
        setAnnouncement(
          "Image has been generated and is displayed below the text."
        );
      }, 1000);
    } else {
      // Fallback to the original behavior if no preloaded image
      setTimeout(() => {
        const newImage = getNewRandomInfographicImage(currentImage.src);
        setCurrentImage({
          ...newImage,
          width: 1200,
          height: 675,
        });
        setIsConverting(false);
        setHasImage(true);
        setAnnouncement(
          "Image has been generated and is displayed below the text."
        );
      }, 2000);
    }
  };

  const handleWaffleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      setAnnouncement("Paragraph options menu opened");
    } else {
      setAnnouncement("Paragraph options menu closed");
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    setIsMenuOpen(false);
    setAnnouncement(isBookmarked ? "Bookmark removed" : "Bookmark added");
  };

  const handleShowAsVisuals = () => {
    setIsMenuOpen(false);

    if (!showAsVisuals) {
      // Only start conversion if we're turning visual mode on and don't already have an image
      if (!hasImage) {
        setIsConverting(true);
        setAnnouncement("Converting text to image. Please wait...");

        // If we have a preloaded image, use it immediately
        if (nextImage) {
          setTimeout(() => {
            setCurrentImage(nextImage);
            setNextImage(null);
            setIsConverting(false);
            setHasImage(true);
            setShowAsVisuals(true);
            setAnnouncement(
              "Image has been generated and is displayed below the text."
            );
          }, 1000);
        } else {
          // Fallback to the original behavior
          setTimeout(() => {
            const newImage = getNewRandomInfographicImage(currentImage.src);
            setCurrentImage({
              ...newImage,
              width: 1200,
              height: 675,
            });
            setIsConverting(false);
            setHasImage(true);
            setShowAsVisuals(true);
            setAnnouncement(
              "Image has been generated and is displayed below the text."
            );
          }, 2000);
        }
      } else {
        // Already have an image, just show it
        setShowAsVisuals(true);
        setAnnouncement("Content displayed as visuals");
      }
    } else {
      // Turning visual mode off
      setShowAsVisuals(false);
      setAnnouncement("Visual display mode disabled");
    }
  };

  const handleAddComment = () => {
    // Implementation for adding comments would go here
    setIsMenuOpen(false);
  };

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Accessibility announcement */}
      {announcement && (
        <div className="sr-only" role="status" aria-live="polite">
          {announcement}
        </div>
      )}

      {/* Paragraph content */}
      <div className="relative pl-6 mb-4">
        <div className="relative" ref={paragraphRef}>
          {children}

          {/* Waffle menu icon - positioned at top left of paragraph */}
          <button
            ref={waffleRef}
            className={`absolute left-0 -ml-6 top-0 w-6 h-6 flex items-center justify-center rounded transition-all duration-150 ${
              isHovered || isMenuOpen ? "opacity-100" : "opacity-0"
            } ${isMenuOpen ? "bg-gray-100" : "hover:bg-gray-50"}`}
            onClick={handleWaffleClick}
            aria-label={
              isMenuOpen ? "Close paragraph options" : "Open paragraph options"
            }
            aria-haspopup="true"
            aria-expanded={isMenuOpen}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="text-gray-500"
              aria-hidden="true"
            >
              <path d="M3 4a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm4 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm4 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm-8 4a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm4 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm4 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm-8 4a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm4 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm4 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0z" />
            </svg>
          </button>

          {/* Contextual menu - Updated to be positioned to the right of the trigger button */}
          {isMenuOpen && (
            <div
              ref={menuRef}
              className="absolute left-0 -ml-6 top-0 transform -translate-x-full mr-2 bg-white shadow-lg rounded-md border border-gray-200 py-2 z-10 w-64"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="paragraph-options-button"
            >
              <button
                className="flex justify-between items-center px-4 py-3 text-sm hover:bg-gray-100 w-full text-left text-gray-800"
                onClick={handleBookmark}
                role="menuitem"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 flex items-center justify-center">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </span>
                  <span>Bookmark</span>
                </div>
                <div className="flex items-center justify-center rounded bg-gray-100 px-2 py-1 text-xs text-gray-500">
                  ⌘B
                </div>
              </button>

              <button
                className="flex justify-between items-center px-4 py-3 text-sm hover:bg-gray-100 w-full text-left text-gray-800"
                onClick={handleShowAsVisuals}
                role="menuitem"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 flex items-center justify-center">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                      ></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  </span>
                  <span>Show as visuals</span>
                </div>
                <div className="flex items-center justify-center rounded bg-gray-100 px-2 py-1 text-xs text-gray-500">
                  ⌘V
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Image container - This establishes the space */}
      <div
        className={`mt-4 mb-8 transition-all duration-500 ease-in-out overflow-hidden ${
          hasImage || isConverting || showAsVisuals
            ? "max-h-[1000px] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        {/* Skeleton loader and image wrapper */}
        <div className="relative">
          {/* Skeleton loader */}
          <div
            className={`overflow-hidden rounded-lg shadow-sm transition-all duration-300 ease-in-out ${
              isConverting ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
            aria-busy={isConverting}
            aria-hidden={!isConverting}
            aria-label="Converting text to image, please wait"
          >
            <div
              className="bg-gray-200 animate-pulse w-full"
              style={{
                aspectRatio:
                  currentImage.width && currentImage.height
                    ? `${currentImage.width}/${currentImage.height}`
                    : "16/9",
              }}
            >
              <div className="flex items-center justify-center h-full">
                <svg
                  className="w-12 h-12 text-gray-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Generated image */}
          <div
            className={`overflow-hidden rounded-lg shadow-sm transition-opacity duration-300 ease-in-out absolute inset-0 ${
              hasImage && !isConverting
                ? "opacity-100 visible"
                : "opacity-0 invisible"
            }`}
            aria-hidden={isConverting || !hasImage}
          >
            {/* Close button - positioned at top right */}
            <button
              onClick={() => {
                setHasImage(false);
                setShowAsVisuals(false);
                setAnnouncement("Image has been closed.");
              }}
              className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 rounded-full text-white transition-all duration-200"
              aria-label="Close image"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <img
              ref={imageRef}
              src={currentImage.src}
              alt={currentImage.alt}
              className="w-full h-auto"
              loading="eager"
              width={currentImage.width}
              height={currentImage.height}
              onLoad={() => {
                // When image loads, ensure it's properly displayed
                if (imageRef.current) {
                  imageRef.current.style.opacity = "1";
                }
              }}
            />
            <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Generated image based on paragraph text
              </span>
              <button
                onClick={() => {
                  setHasImage(false);
                  setShowAsVisuals(false);
                  setAnnouncement("Image has been closed.");
                }}
                className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                aria-label="Close image"
              >
                Close
              </button>
            </div>
          </div>
        </div>

        {/* Standalone regenerate button at the bottom */}
        {hasImage && !isConverting && (
          <div className="mt-4 flex justify-center transition-opacity duration-300 ease-in-out">
            <button
              onClick={() => {
                setIsConverting(true);
                setAnnouncement("Generating a new image. Please wait...");

                // If we have a preloaded image, use it
                if (nextImage) {
                  setTimeout(() => {
                    setCurrentImage(nextImage);
                    setNextImage(null);
                    setIsConverting(false);
                    setAnnouncement("New image has been generated.");
                  }, 1000);
                } else {
                  // Fallback to original behavior
                  setTimeout(() => {
                    const newImage = getNewRandomInfographicImage(
                      currentImage.src
                    );
                    setCurrentImage({
                      ...newImage,
                      width: 1200,
                      height: 675,
                    });
                    setIsConverting(false);
                    setAnnouncement("New image has been generated.");
                  }, 1000);
                }
              }}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
              aria-label="Regenerate image"
              disabled={isConverting}
            >
              Regenerate
            </button>
          </div>
        )}
      </div>

      {/* Bookmark indicator */}
      {isBookmarked && (
        <div className="mt-2 flex items-center text-sm text-blue-600">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="none"
            className="mr-1"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
          <span>Bookmarked</span>
        </div>
      )}
    </div>
  );
};

export default ParagraphToImageConversion;
