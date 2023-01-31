const rl = require("readline-sync");

let board = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"];
let ships = [];
let guesses = [];

function resetBoard() {
  board = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"];
  ships = [];
  guesses = [];
}

rl.keyIn("\x1b[32mPress any key to start the game.\x1b[0m", {
  hideEchoBack: true,
});
playgame();
function playgame() {
  while (ships.length < 2) {
    let randomIndex = Math.floor(Math.random() * board.length);
    if (!ships.includes(board[randomIndex])) {
      ships.push(board[randomIndex]);
    }
  }
  gamePlay();

  function gamePlay() {
    let input = rl
      .question("\n\x1b[36mEnter a location to strike ie 'A2'\x1b[0m")
      .toUpperCase();
    input = input.toUpperCase();
    if (!board.includes(input)) {
      console.log(
        "\x1b[33mInvalid guess. Please enter a valid location.\x1b[0m\n"
      );
      gamePlay();
    }

    if (guesses.includes(input)) {
      console.log(
        "\x1b[33mYou have already picked this location. Miss!\x1b[0m\n"
      );
      gamePlay();
    } else if (ships.includes(input)) {
      ships.splice(ships.indexOf(input), 1);
      // gamePlay();
      guesses.push(input);
      if (ships.length === 0) {
        askIfDone();
        function askIfDone() {
          let answer = rl
            .question(
              "\n\x1b[32mYou have destroyed all battleships. Would you like to play again? Y/N\x1b[0m\n"
            )
            .toUpperCase();
          if (answer.toUpperCase() === "Y") {
            resetBoard();
            playgame();
          } else if (answer.toUpperCase() === "N") {
            process.exit();
          } else {
            console.log("\x1b[33mInvalid response\x1b[0m\n");
            askIfDone();
          }
        }
      } else {
        console.log(
          "\x1b[32mHit. You have sunk a battleship. 1 ship remaining.\x1b[0m\n"
        );
        gamePlay();
      }
    } else {
      console.log("\x1b[33mYou have missed!\x1b[0m\n");
      guesses.push(input);
      gamePlay();
    }
  }
}
