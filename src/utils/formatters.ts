/**
 * Formats a file size in bytes to a human-readable string
 * @param bytes File size in bytes
 * @returns Human-readable file size (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

/**
 * Truncates text to a specific length and adds an ellipsis if needed
 * @param text Text to truncate
 * @param maxLength Maximum length of the text
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

/**
 * Calculates the remaining characters for a text input
 * @param text Current text
 * @param maxLength Maximum allowed length
 * @returns Number of remaining characters
 */
export const calculateRemainingChars = (
  text: string,
  maxLength: number
): number => {
  return maxLength - text.length;
};

/**
 * Checks if a string contains more than specified number of words
 * @param text Text to analyze
 * @param minWords Minimum number of words required
 * @returns Boolean indicating if text has more than the minimum words
 */
export const hasMinimumWords = (
  text: string,
  minWords: number = 2
): boolean => {
  const trimmedValue = text.trim();
  const words = trimmedValue.split(/\s+/).filter((word) => word.length > 0);
  return words.length >= minWords;
};
