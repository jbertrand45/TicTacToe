

function checkWin(board, player) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6]          // diagonals
  ];
  return wins.find(line => line.every(i => board[i] === player)) || null;
}


 /*return true when board is full
  @param {string[]} board
  @returns {boolean}*/

function isDraw(board) {
  return board.every(cell => cell !== "");
}


//Choosing a random move for the computer

function getComputerMove(board) {
  const empty = board.map((v, i) => v === "" ? i : null).filter(i => i !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}

// Logic for presentation

const boardElement = document.getElementById("board");
const toggleButton = document.getElementById("toggleButton");
let board = Array(9).fill("");
let gameOver = false;

// Board is initialized with two random "X"s
function drawBoard() {
  boardElement.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("td");
    cell.dataset.index = i;
    cell.textContent = board[i];
    if (board[i] === "") {
      cell.addEventListener("click", playerMove);
    }
    boardElement.appendChild(cell);
    if ((i + 1) % 3 === 0) boardElement.appendChild(document.createElement("tr"));
  }
}

// Handles the player's move.
function playerMove(e) {
  const i = +e.target.dataset.index;
  if (board[i] !== "" || gameOver) return;
  board[i] = "X";
  updateGame();
}

 //Updates the game after a move.

function updateGame() {
  drawBoard();

  const winX = checkWin(board, "X");
  const winO = checkWin(board, "O");

  if (winX || winO || isDraw(board)) {
    gameOver = true;
    if (winX || winO) highlightWin(winX || winO);
    return;
  }

  // Delay computer move
  setTimeout(() => {
    const move = getComputerMove(board);
    if (move !== undefined) {
      board[move] = "O";
      drawBoard();
      const winO = checkWin(board, "O");
      if (winO) {
        highlightWin(winO);
        gameOver = true;
      } else if (isDraw(board)) {
        gameOver = true;
      }
    }
  }, 500);
}

/**
 * Highlights the winning combination.
 * @param {number[]} winLine
 */
function highlightWin(winLine) {
  winLine.forEach(i => {
    const td = boardElement.querySelector(`td[data-index="${i}"]`);
    if (td) td.classList.add("win");
  });
}


 //Starts or resets the game.
 
function toggleGame() {
  if (toggleButton.textContent === "Start") {
    board = Array(9).fill("");
    gameOver = false;

    // human has 2 random X's
    const empty = [...Array(9).keys()];
    const first = empty.splice(Math.floor(Math.random() * empty.length), 1)[0];
    const second = empty.splice(Math.floor(Math.random() * empty.length), 1)[0];
    board[first] = board[second] = "X";

    drawBoard();
    toggleButton.textContent = "Clear";
  } else {
    board = Array(9).fill("");
    gameOver = false;
    drawBoard();
    toggleButton.textContent = "Start";
  }
}

toggleButton.addEventListener("click", toggleGame);
drawBoard();
