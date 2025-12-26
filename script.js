const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const modal = document.getElementById('winner-modal');
const winnerText = document.getElementById('winner-text');

let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
const human = "X"; 
const ai = "O"; 

// 1. Attach Clicks
cells.forEach(cell => cell.addEventListener('click', handleCellClick));

function handleCellClick(e) {
    const id = e.target.dataset.index;

    // Only allow move if cell is empty and game is active
    if (board[id] === "" && gameActive) {
        makeMove(id, human);
        
        const winCombo = checkWin(board, human);
        if (winCombo) {
            endGame("🌸 You Win!", winCombo);
        } else if (!board.includes("")) {
            endGame("🌲 It's a Tie!", null);
        } else {
            // AI Turn
            gameActive = false; // Temporarily disable clicks while AI "thinks"
            statusText.innerText = "AI is thinking...";
            setTimeout(aiMove, 600);
        }
    }
}

function aiMove() {
    const bestMove = minimax(board, ai).index;
    makeMove(bestMove, ai);
    
    const winCombo = checkWin(board, ai);
    if (winCombo) {
        endGame("🌻 AI Wins!", winCombo);
    } else if (!board.includes("")) {
        endGame("🌲 It's a Tie!", null);
    } else {
        gameActive = true; // Re-enable human clicks
        statusText.innerText = "Your Turn! 🌸";
    }
}

function makeMove(index, player) {
    board[index] = player;
    cells[index].classList.add(player.toLowerCase());
}

function checkWin(b, p) {
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let comb of wins) {
        if (comb.every(i => b[i] === p)) return comb;
    }
    return null;
}

function minimax(newBoard, player) {
    const availSpots = newBoard.map((v, i) => v === "" ? i : null).filter(v => v !== null);
    if (checkWin(newBoard, human)) return {score: -10};
    if (checkWin(newBoard, ai)) return {score: 10};
    if (availSpots.length === 0) return {score: 0};

    const moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        let move = { index: availSpots[i] };
        newBoard[availSpots[i]] = player;
        move.score = minimax(newBoard, player === ai ? human : ai).score;
        newBoard[availSpots[i]] = "";
        moves.push(move);
    }

    let bestMove, bestScore = (player === ai) ? -1000 : 1000;
    moves.forEach((m, i) => {
        if ((player === ai && m.score > bestScore) || (player === human && m.score < bestScore)) {
            bestScore = m.score;
            bestMove = i;
        }
    });
    return moves[bestMove];
}

function endGame(msg, combo) {
    gameActive = false;
    if (combo) {
        combo.forEach(index => cells[index].classList.add('winner-glow'));
    }
    
    setTimeout(() => {
        winnerText.innerText = msg;
        modal.style.display = 'block';
    }, 800);
}

function closeModalAndReset() {
    modal.style.display = 'none';
    restartGame();
}

function restartGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    statusText.innerText = "Your Turn! 🌸";
    cells.forEach(c => {
        c.classList.remove('x', 'o', 'winner-glow');
    });
}