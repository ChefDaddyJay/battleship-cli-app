import { Board } from "./BattleshipBoard";
import { SHIP_EMOJI, YOU_WIN } from "./definitions";
import rs from "readline-sync";

console.log(`Welcome to Battleship! ${SHIP_EMOJI}`);
const board = Board.getBoard();

while (board.shipSpaces > 0) {
  board.print();
  const move = rs.question("Make a guess (A1, B2, etc...): ");
  try {
    board.hit(move);
  } catch (error) {
    console.log("Sorry, that move isn't valid. Please try again.");
  }
  console.clear();
}

console.log(YOU_WIN);
