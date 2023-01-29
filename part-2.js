const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let boardSize = null;

const ships = [
  { name: "Carrier", size: 5, coordinates: [], hits: 0 },
  { name: "Battleship", size: 4, coordinates: [], hits: 0 },
  { name: "Cruiser", size: 3, coordinates: [], hits: 0 },
  { name: "Submarine", size: 3, coordinates: [], hits: 0 },
  { name: "Destroyer", size: 2, coordinates: [], hits: 0 },
];

askForBoardSize();

function askForBoardSize() {
  rl.question("Please enter a number between 5-10: ", (chosenSize) => {
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
  });
}
//
//
function buildBoard(size) {
  board = [];
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
  let occupiedCoordinates = new Set();
  ships.forEach((ship) => {
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
    occupiedCoordinates = new Set([...occupiedCoordinates, ...coordinates]);
    ship.coordinates = coordinates;
    // console.log(ship.coordinates);
  });
  playerTurn();
}
//
//
function playerTurn() {
  rl.question("Enter a location to strike ie 'A2' ", async (answer) => {
    answer = answer.toUpperCase();
    const validCoordinates = await getValidCoordinates();
    if (!validCoordinates.has(answer)) {
      console.log(
        "Invalid coordinates. Please enter a valid coordinate on the board."
      );
      return playerTurn();
    }
    let x = answer.charCodeAt(0) - 65;
    let y = parseInt(answer.slice(1)) - 1;
    let hit = false;
    let alreadyTried = false;
    if (board[x][y] === "X" || board[x][y] === "O") {
      alreadyTried = true;
    }
    for (let i = 0; i < ships.length; i++) {
      if (ships[i].coordinates.includes(answer)) {
        if (!alreadyTried) {
          ships[i].hits++;
          console.log("HIT");
          board[x][y] = "X";
          hit = true;
          if (ships[i].hits === ships[i].size) {
            console.log(`You sank the ${ships[i].name}!`);
          }
        } else {
          if (board[x][y] === "X") {
            console.log(
              "You have already picked this location, and it was a hit!"
            );
          } else {
            console.log("You have already picked this location. Miss!");
          }
        }
      }
    }
    if (!hit && !alreadyTried) {
      console.log("You have missed!");
      board[x][y] = "O";
    }
    printNewBoard();

    let allSunk = true;
    for (let i = 0; i < ships.length; i++) {
      if (ships[i].hits < ships[i].size) {
        allSunk = false;
        break;
      }
    }
    if (allSunk) {
      askIfDone();
    } else {
      playerTurn();
    }
  });
}
//
//
function printNewBoard() {
  for (let i = 0; i < boardSize; i++) {
    let row = "";
    for (let j = 0; j < boardSize; j++) {
      if (board[i][j] === "X") {
        row += "\x1b[31mX\x1b[0m ";
      } else if (board[i][j] === "O") {
        row += "\x1b[33mO\x1b[0m ";
      } else {
        row += board[i][j] + " ";
      }
    }
    console.log(row);
  }
}
//
//
async function getValidCoordinates() {
  let validCoordinates = new Set();
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      validCoordinates.add(board[i][j]);
    }
  }
  return validCoordinates;
}
//
//
function askIfDone() {
  rl.question(
    "You have destroyed all battleships!! Would you like to play again? Y/N ",
    (answer) => {
      if (answer.toUpperCase() === "Y") {
        rl.removeAllListeners("line");
        boardSize = null;
        ships.forEach((ship) => {
          ship.coordinates = [];
          ship.hits = 0;
        });
        askForBoardSize();
      } else if (answer.toUpperCase() === "N") {
        rl.close();
      } else {
        console.log("Please enter a valid response");
        askIfDone();
      }
    }
  );
}
