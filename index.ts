import {
  BLUE_DOT,
  RED_DOT,
  type Board,
  type BoardSpace,
  type DisplayBoard,
} from "./definitions";

function buildEmptyBoard(size: number) {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

  const board: Board = {};

  if (size < 1 || size > rows.length) {
    return "Invalid board size";
  }

  for (let row = 0; row < size; row++) {
    board[rows[row]!] = [];
    for (let col = 0; col < size; col++) {
      board[rows[row]!]!.push({
        type: "empty",
        hit: false,
      } as BoardSpace);
    }
  }

  return board;
}

function printBoard(board: Board, debug?: boolean) {
  const rows = Object.entries(board);
  const display: DisplayBoard = {};
  rows.forEach((row) => {
    display[row[0]] = row[1].map((space) => {
      if (space.type === "empty") {
        return "-";
      } else if (space.hit || debug) {
        return space.type === "small" ? BLUE_DOT : RED_DOT;
      } else {
        return "-";
      }
    });
  });
  console.table(display);
}

function addShip(
  type: "small" | "large",
  id: number,
  row: string,
  col: number,
  dir: "horizontal" | "vertical",
  board: Board
) {
  const size = type === "small" ? 2 : 3;
  const boardSize = Object.entries(board).length;
  let rowNum = Object.keys(board).findIndex((key) => key === row);
  const rows = Object.keys(board);

  if (dir === "horizontal") {
    if (col + size >= boardSize) {
      throw new Error("Invalid position");
    }
    for (let i = 0; i < size; i++) {
      board[row]![col + i]!.type = type;
      board[row]![col + i]!.id = id;
    }
  }

  if (dir === "vertical") {
    if (rowNum + size >= boardSize) {
      throw new Error("Invalid position");
    }
    for (let i = 0; i < size; i++) {
      board[rows[rowNum + i]!]![col]!.type = type;
      board[rows[rowNum + i]!]![col]!.id = id;
    }
  }
}

const board = buildEmptyBoard(7);
if (board !== "Invalid board size") {
  try {
    addShip("small", 1, "A", 0, "horizontal", board);
    addShip("small", 3, "E", 4, "horizontal", board);
    addShip("large", 2, "B", 2, "vertical", board);
  } catch (err) {
    printBoard(board, true);
  }
  printBoard(board, true);
}
