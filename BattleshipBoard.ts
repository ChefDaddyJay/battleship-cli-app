import { BLUE_DOT, MISS_EMOJI, RED_DOT, type BoardSpace } from "./definitions";
import rs from "readline-sync";

export class Board {
  board: { [key: string]: BoardSpace[] } = {};
  shipSpaces: number;
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
    this.shipSpaces = 0;
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
    const boardSize = this.size;
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
    this.shipSpaces += size;
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
        if (space.hit || debug) {
          switch (space.type) {
            case "empty":
              return space.hit ? MISS_EMOJI : "-";
            case "large":
              return RED_DOT;
            case "small":
              return BLUE_DOT;
          }
        } else {
          return "-";
        }
      });
    });
    console.table(display);
  }
  hit(move: string) {
    const moveRow = move.toUpperCase().match(/[A-Z]/);
    if (moveRow === null) {
      throw new Error("Invalid row selector");
    }
    const moveCol = move.match(/[\d]/);
    if (moveCol === null) {
      throw new Error("Invalid column number");
    }
    const row = this.board[moveRow[0]];
    if (!row) {
      throw new Error("Row out of range");
    }
    const space = row[Number(moveCol[0])]!;

    if (space.hit) {
      throw new Error(`${moveRow[0]}${moveCol[0]} has already been hit.`);
    }
    space.hit = true;
    if (space.type !== "empty") {
      this.shipSpaces--;
    }
  }
  static getBoard() {
    while (true) {
      try {
        const size = rs.questionInt("Please select a board size (3 - 10): ");
        const board = new Board(size);
        board.populate();
        return board;
      } catch (error) {
        console.log("Invalid board size. Please try again.");
      }
    }
  }
}
