/*----- constants -----*/
const SIZE = 7;
/*----- state variables -----*/
const game = {
  screen: "game",
  turn: 1, //to move to click start button later
  board: [], //insert whatever size board you want here
  scoreCounts: [0, 0],
};

/*----- cached elements  -----*/
const welcomeScreen = document.querySelector("#welcome");
const gameScreen = document.querySelector("#game");
const scoreScreen = document.querySelector("#score");
const gameBoard = document.querySelector("#game-board");
/*----- event listeners -----*/

function clickStartButton() {
  game.screen = "game";
  game.turn = 1;
  renderAll();
}

function clickScoreButton() {
  game.screen = "score";
  renderAll();
}

function clickGameButton(event) {
  event.preventDefault();
  clicked = event.target;
  if (isInvalidClick(clicked)) return;

  const col = parseInt(clicked.getAttribute("id").slice(-1));
  dropDisc(0, col);

  if (checkWinner()) updateWinner();

  game.turn *= -1;
  renderAll();
}

function updateWinner() {
  if (game.turn === 1) {
    game.scoreCounts[0] += 1;
    renderWinner("Player 1 Wins!");
  } else {
    game.scoreCounts[1] += 1;
    renderWinner("Player 2 Wins!");
  }
}

function renderWinner() {}

function dropDisc(row, colToDrop) {
  //drop if last row or next row is occupied
  if (row === SIZE - 1 || game.board[row + 1][colToDrop] !== 0) {
    game.board[row][colToDrop] = game.turn;
  } else {
    //go to next row
    dropDisc(row + 1, colToDrop);
  }
}

function checkWinner() {
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 7; j++) {
      if (game.board[i][j] !== 0) {
        if (checkRight(i, j)) return true;
        if (checkDown(i, j)) return true;
        if (checkDiagUp(i, j)) return true;
        if (checkDiagDown(i, j)) return true;
      }
    }
  }
}

function checkRight(x, y) {
  if (y > SIZE - 4) return false;
  let count = 0;
  let i = 0;
  while (game.board[x][y] === game.board[x][y + i] && i < 4) {
    count += 1;
    i += 1;
    if (count === 4) return true;
  }
  return false;
}

function checkDown(x, y) {
  if (x > SIZE - 4) return false;
  let count = 0;
  let i = 0;
  while (game.board[x][y] === game.board[x + i][y] && i < 4) {
    count += 1;
    i += 1;
    if (count === 4) return true;
  }
  return false;
}

function checkDiagUp(x, y) {
  if (x < 3 || y > SIZE - 4) return false;
  let count = 0;
  let i = 0;
  let j = 0;
  while (game.board[x][y] === game.board[x - i][y + j] && i < 4) {
    count += 1;
    i += 1;
    j += 1;
    if (count === 4) return true;
  }
  return false;
}

function checkDiagDown(x, y) {
  if (x > SIZE - 4 || y > SIZE - 4) return false;
  let count = 0;
  let i = 0;
  let j = 0;
  while (game.board[x][y] === game.board[x + i][y + j] && i < 4) {
    count += 1;
    i += 1;
    j += 1;
    if (count === 4) return true;
  }
  return false;
}

function isInvalidClick(clicked) {
  //check that button is clicked
  if (clicked.getAttribute("class") !== "game-button") {
    console.log("not a button");
    return true;
  }
  //check that column has space for drop
  const col = parseInt(clicked.getAttribute("id").slice(-1));
  if (game.board[0][col] !== 0) {
    console.log("column is full");
    return true;
  }

  return false;
}

function renderScreen() {
  gameScreen.style.display = "none";
  welcomeScreen.style.display = "none"; //? block will show
  scoreScreen.style.display = "none";
  const renderScreen = document.querySelector(`#${game.screen}`);
  renderScreen.style.display = "block";
}

function renderButtons() {
  const buttonsRow = document.createElement("tr");
  buttonsRow.setAttribute("id", "gameButtons");
  for (let i = 0; i < SIZE; i++) {
    const insertButton = document.createElement("td");
    insertButton.innerHTML = `<button id="b${i}" class="game-button">&#8595</button`;
    buttonsRow.append(insertButton);
  }
  document.querySelector("table").append(buttonsRow);
}

function renderRows() {
  for (row of game.board) {
    const gameRow = document.createElement("tr");
    for (node of row) {
      const gameNode = document.createElement("td");
      gameNode.innerText = node;
      gameRow.append(gameNode);
    }
    gameBoard.append(gameRow);
  }
}

function renderBoard() {
  if (!gameBoard.firstChild) {
    renderButtons();
  }
  //clear board
  while (gameBoard.childElementCount > 1) {
    gameBoard.lastChild.remove();
  }
  renderRows();
}

function renderAll() {
  renderScreen();
  renderBoard();
}

function initialize() {
  for (let i = 0; i < SIZE; i++) {
    const row = [];
    for (let j = 0; j < SIZE; j++) {
      row.push(0);
    }
    game.board.push(row);
  }
  // console.log(game.board);
  renderAll();
}

/*----- functions -----*/
initialize();

const startButton = document.querySelector("#startButton");
startButton.addEventListener("click", clickStartButton);

const scoreButton = document.querySelector("#scoreButton");
scoreButton.addEventListener("click", clickScoreButton);

const gameButtons = document.querySelector("#gameButtons");
gameButtons.addEventListener("click", clickGameButton);
