export type BoardSpace = {
  type: "large" | "small" | "empty";
  id?: number;
  hit: boolean;
};

export type Board = {
  [key: string]: BoardSpace[];
};

export type DisplayBoard = {
  [key: string]: string[];
};

export const BLUE_DOT = "\u{1F535}";
export const RED_DOT = "\u{1F534}";
export const SHIP_EMOJI = "\u{1F6A2}";
