const rl = require("readline-sync");

rl.keyIn("\x1b[32mPress any key to start the game.\x1b[0m", {
  hideEchoBack: true,
});

playGame();

function playGame() {
  let boardSize = null;
  const board = [];

  const redX = "\x1b[31mX\x1b[0m ";
  const yellowO = "\x1b[33mO\x1b[0m ";

  const ships = [
    { name: "Carrier", size: 5, location: [], hits: 0 },
    { name: "Battleship", size: 4, location: [], hits: 0 },
    { name: "Cruiser", size: 3, location: [], hits: 0 },
    { name: "Submarine", size: 3, location: [], hits: 0 },
    { name: "Destroyer", size: 2, location: [], hits: 0 },
  ];

  askForBoardSize();
  //Any size less than 5 won't fit the ships

  function askForBoardSize() {
    let chosenSize = rl.question("\nPlease enter a number between 5-10: ");
    if (
      /\b[5-9]\b|\b(10)\b/.test(chosenSize) &&
      Number.isInteger(parseInt(chosenSize)) &&
      !isNaN(chosenSize)
    ) {
      boardSize = parseInt(chosenSize);
      buildBoard(boardSize);
    } else {
      console.log("Invalid input");
      askForBoardSize();
    }
  }
  //
  //
  function buildBoard(size) {
    for (let i = 0; i < size; i++) {
      let row = [];
      for (let j = 0; j < size; j++) {
        row.push(String.fromCharCode(65 + i) + (j + 1));
      }
      board.push(row);
    }
    placeShips(board);
  }
  //
  //
  function placeShips(board) {
    const occupiedCoordinates = new Set();
    for (let i = 0; i < ships.length; i++) {
      let ship = ships[i];
      let orientation = Math.random() >= 0.5 ? "horizontal" : "vertical";
      let coordinates = [];
      let isValid = false;
      while (!isValid) {
        if (orientation === "horizontal") {
          let startX = Math.floor(Math.random() * (boardSize - ship.size + 1));
          let startY = Math.floor(Math.random() * boardSize);
          coordinates = [];
          for (let i = startX; i < startX + ship.size; i++) {
            coordinates.push(board[startY][i]);
          }
        } else {
          let startX = Math.floor(Math.random() * boardSize);
          let startY = Math.floor(Math.random() * (boardSize - ship.size + 1));
          coordinates = [];
          for (let i = startY; i < startY + ship.size; i++) {
            coordinates.push(board[i][startX]);
          }
        }
        isValid = coordinates.every(
          (coordinate) => !occupiedCoordinates.has(coordinate)
        );
      }
      coordinates.forEach((coordinate) => occupiedCoordinates.add(coordinate));
      ship.location = coordinates;
    }
    //un-comment out the code below to have all ships and their locations printed to terminal

    // ships.map((ship) =>
    //   console.log(
    //     `\n\x1b[34m${ship.name}\x1b[0m \x1b[36m${ship.location}\x1b[0m`
    //   )
    // );
    playerTurn();
  }
  //
  //
  function playerTurn() {
    const triedAndHit = [];
    const triedAndMiss = [];

    function continuePlay() {
      let answer = rl.question(
        "\n\x1b[35mEnter a location to strike ie 'A2'\x1b[0m\n"
      );
      answer = answer.toUpperCase();

      if (!getValidCoordinates().has(answer)) {
        console.log(
          "\n\x1b[36mInvalid coordinates. Please enter a valid coordinate on the board.\x1b[0m"
        );
        return continuePlay();
      }

      let x = answer.charCodeAt(0) - 65;
      let y = parseInt(answer.slice(1)) - 1;

      let isHit = false;
      for (let i = 0; i < ships.length; i++) {
        let ship = ships[i];
        if (ship.location.includes(answer)) {
          isHit = true;
          if (triedAndHit.includes(answer)) {
            console.log(
              "\x1b[38;2;255;165;0mYou have already picked this location, and it was a hit!\x1b[0m"
            );
          } else {
            ship.hits++;
            console.log("\n\x1b[31mHIT!\x1b[0m");
            board[x][y] = "X";
            triedAndHit.push(answer);
            if (ship.hits === ship.size) {
              console.log(
                "\n\x1b[1;4;32mYou sank the " + ship.name + "!\x1b[0m\n"
              );
            }
          }
        }
      }

      if (!isHit) {
        if (triedAndMiss.includes(answer)) {
          console.log(
            "\x1b[38;2;255;165;0mYou have already picked this location. Miss!\x1b[0m"
          );
        } else {
          console.log("\n\x1b[33mYou have missed!\x1b[0m");
          board[x][y] = "O";
          triedAndMiss.push(answer);
        }
      }
      printNewBoard();
      checkGameStatus();

      function checkGameStatus() {
        if (!ships.every((ship) => ship.hits >= ship.size)) {
          return continuePlay();
        } else {
          askIfDone();
        }
      }
    }
    continuePlay();
  }
  //
  //
  function printNewBoard() {
    for (let i = 0; i < boardSize; i++) {
      let row = "";
      for (let j = 0; j < boardSize; j++) {
        if (board[i][j] === "X") {
          row += redX;
        } else if (board[i][j] === "O") {
          row += yellowO;
        } else {
          row += board[i][j] + " | ";
        }
      }
      console.log(row);
    }
  }
  //
  //
  function getValidCoordinates() {
    const validCoordinates = new Set();
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        validCoordinates.add(String.fromCharCode(65 + i) + (j + 1));
      }
    }
    return validCoordinates;
  }
  //
  //
  function askIfDone() {
    let answer = rl.question(
      "\n\x1b[1;10;32mYou have destroyed all battleships!! Would you like to play again? Y/N \x1b[0m"
    );
    if (answer.toUpperCase() === "Y") {
      boardSize = null;
      ships.forEach((ship) => {
        ship.coordinates = [];
        ship.hits = 0;
      });
      playGame();
    } else if (answer.toUpperCase() === "N") {
      process.exit();
    } else {
      console.log("\x1b[36mPlease enter a valid response\x1b[0m");
      askIfDone();
    }
  }
}
