export const MAX_TEXT_LENGTH = 250;
export const DIFFICULTY_LEVELS = ["easy", "medium", "hard", "god"] as const;

export const DIFFICULTY_CONFIG = {
  easy: {
    text: "Easy mode",
    dotColor: "#47CD89",
    labelColor: "#1B191F",
  },
  medium: {
    text: "Medium mode",
    dotColor: "#F79009",
    labelColor: "#1B191F",
  },
  hard: {
    text: "Hard mode",
    dotColor: "#F04438",
    labelColor: "#1B191F",
  },
  god: {
    text: "God mode",
    dotColor: "#7A1BF2",
    labelColor: "#1B191F",
  },
} as const;

export const ACCEPTED_FILE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/pdf",
  "video/mp4",
  "audio/mpeg",
] as const;

export const MAX_FILE_SIZE_MB = 5;
