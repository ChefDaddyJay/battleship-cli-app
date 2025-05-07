export type BoardSpace = {
  type: "large" | "small" | "empty";
  id?: number;
  hit: boolean;
};

export const BLUE_DOT = "\u{1F535}";
export const RED_DOT = "\u{1F534}";
export const SHIP_EMOJI = "\u{1F6A2}";
export const MISS_EMOJI = "\u{1F4A2}";
export const YOU_WIN = `========
__   _______ _   _   _    _ _____ _   _
\\ \\ / /  _  | | | | | |  | |_   _| \\ | |
 \\ V /| | | | | | | | |  | | | | |  \\| |
  \\ / | | | | | | | | |/\\| | | | | . ' |
  | | \\ \\_/ / |_| | \\  /\\  /_| |_| |\\  |
  \\_/  \\___/ \\___/   \\/  \\/ \\___/\\_| \\_/
========`;
