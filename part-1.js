const readline = require("readline");
// const rl = readline;
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let board = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"];
let ships = [];
let guesses = [];

function resetBoard() {
  board = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"];
  ships = [];
  guesses = [];
  rl.removeAllListeners("line");
}

console.log("Press any key to start the game.");

rl.question("", (key) => {
  playgame();
});
// rl.keyInPause("Press any key to start the game.", (key) => {
//   playgame();
// });

function playgame() {
  // randomly assign ship locations
  while (ships.length < 2) {
    let randomIndex = Math.floor(Math.random() * board.length);
    if (!ships.includes(board[randomIndex])) {
      ships.push(board[randomIndex]);
    }
  }

  console.log("Enter a location to strike ie 'A2' ");
  rl.on("line", (input) => {
    input = input.toUpperCase();
    if (!board.includes(input)) {
      console.log("Invalid guess. Please enter a valid location.");
      return;
    }
    if (guesses.includes(input)) {
      console.log("You have already picked this location. Miss!");
    } else if (ships.includes(input)) {
      console.log("Hit. You have sunk a battleship. 1 ship remaining.");
      ships.splice(ships.indexOf(input), 1);
      if (ships.length === 0) {
        console.log(
          "You have destroyed all battleships. Would you like to play again? Y/N"
        );
        rl.question("", (answer) => {
          if (answer.toUpperCase() === "Y") {
            resetBoard();
            playgame();
          } else {
            rl.close();
          }
        });
      }
    } else {
      console.log("You have missed!");
    }
    guesses.push(input);
  });
}
