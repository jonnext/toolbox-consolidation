// Import all infographic images
import brainstorm1 from "../assets/images/infographics/brainstorm-1.png";
import brainstorm2 from "../assets/images/infographics/brainstorm-2.png";
import brainstorm3 from "../assets/images/infographics/brainstorm-3.png";
import brainstorm4 from "../assets/images/infographics/brainstorm-4.png";
import steps1 from "../assets/images/infographics/steps-1.png";
import steps2 from "../assets/images/infographics/steps-2.png";
import steps3 from "../assets/images/infographics/steps-3.png";
import steps4 from "../assets/images/infographics/steps-4.png";
import comicStrip from "../assets/images/infographics/generated-comic-strip.png";
import rockEyebrow from "../assets/images/infographics/the-rock-eyebrow-gif.gif";

// Create an array with all infographic images
export const infographicImages = [
  { src: brainstorm1, alt: "Brainstorm infographic showing key concepts" },
  { src: brainstorm2, alt: "Brainstorm infographic with connected ideas" },
  { src: brainstorm3, alt: "Brainstorm visualization with multiple branches" },
  { src: brainstorm4, alt: "Concept map showing related ideas" },
  { src: steps1, alt: "Step-by-step process visualization - part 1" },
  { src: steps2, alt: "Step-by-step process visualization - part 2" },
  { src: steps3, alt: "Step-by-step process visualization - part 3" },
  { src: steps4, alt: "Step-by-step process visualization - part 4" },
  { src: comicStrip, alt: "Generated comic strip visualization of concepts" },
  { src: rockEyebrow, alt: "The Rock raising eyebrow reaction GIF" },
];

/**
 * Gets a random infographic image from the collection
 * @returns An object containing the image source and alt text
 */
export const getRandomInfographicImage = () => {
  const randomIndex = Math.floor(Math.random() * infographicImages.length);
  return infographicImages[randomIndex];
};

/**
 * Gets a random infographic image but ensures it's different from the currently displayed image
 * @param currentSrc The source of the currently displayed image
 * @returns An object containing the image source and alt text
 */
export const getNewRandomInfographicImage = (currentSrc: string) => {
  // Filter out the current image
  const availableImages = infographicImages.filter(
    (img) => img.src !== currentSrc
  );

  // If there's only one image or no current image, just get a random one
  if (availableImages.length === 0 || !currentSrc) {
    return getRandomInfographicImage();
  }

  // Get a random image from the filtered list
  const randomIndex = Math.floor(Math.random() * availableImages.length);
  return availableImages[randomIndex];
};
