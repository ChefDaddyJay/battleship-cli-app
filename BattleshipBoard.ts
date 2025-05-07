import { BLUE_DOT, RED_DOT } from "./definitions";

export class Board {
  board: { [key: string]: BoardSpace[] } = {};
  ships: number;
  size: number;
  constructor(size: number) {
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    if (size < 3 || size > rows.length) {
      throw new Error("Invalid board size");
    }

    for (let row = 0; row < size; row++) {
      this.board[rows[row]!] = [];
      for (let col = 0; col < size; col++) {
        this.board[rows[row]!]!.push({
          type: "empty",
          hit: false,
        } as BoardSpace);
      }
    }
    this.ships = 0;
    this.size = size;
  }
  addShip(
    type: "small" | "large",
    id: number,
    row: string,
    col: number,
    dir: "horizontal" | "vertical"
  ) {
    const size = type === "small" ? 2 : 3;
    const boardSize = Object.entries(this.board).length;
    let rowNum = Object.keys(this.board).findIndex((key) => key === row);
    const rows = Object.keys(this.board);

    if (dir === "horizontal") {
      if (col + size > boardSize) {
        throw new Error("Invalid position");
      }
      for (let i = 0; i < size; i++) {
        if (this.board[row]![col + i]!.type !== "empty") {
          throw new Error(`Collision detected at ${row}${col + i}`);
        }
      }
      for (let i = 0; i < size; i++) {
        this.board[row]![col + i]!.type = type;
        this.board[row]![col + i]!.id = id;
      }
    }

    if (dir === "vertical") {
      if (rowNum + size >= boardSize) {
        throw new Error("Invalid position");
      }
      for (let i = 0; i < size; i++) {
        if (this.board[rows[rowNum + i]!]![col]!.type !== "empty") {
          throw new Error(`Collision detected at ${row}${col + i}`);
        }
      }
      for (let i = 0; i < size; i++) {
        this.board[rows[rowNum + i]!]![col]!.type = type;
        this.board[rows[rowNum + i]!]![col]!.id = id;
      }
    }
  }
  populate() {
    let round = this.size;
    let done = false;
    const randomPosition = () => {
      const num1 = Math.floor(Math.random() * this.size);
      const col = Math.floor(Math.random() * this.size);
      const row = Object.keys(this.board)[num1]!;
      return { row: row, col: col };
    };
    for (let i = 3; i <= this.size; i++) {
      const { row, col } = randomPosition();
      const dir = Math.random() < 0.5 ? "horizontal" : "vertical";
      if (i % 2 === 1) {
        try {
          this.addShip("small", i, row, col, dir);
        } catch (err) {
          i--;
          continue;
        }
      } else {
        try {
          this.addShip("large", i, row, col, dir);
        } catch (err) {
          i--;
          continue;
        }
      }
    }
  }
  print(debug?: boolean) {
    const rows = Object.entries(this.board);
    const display: { [key: string]: string[] } = {};
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
}

export type BoardSpace = {
  type: "large" | "small" | "empty";
  id?: number;
  hit: boolean;
};
