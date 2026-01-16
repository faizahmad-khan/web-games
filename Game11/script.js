document.addEventListener('DOMContentLoaded', () => {
    // Game state variables
    let currentPlayer = 'X';
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let scores = { X: 0, O: 0, draw: 0 };

    // DOM elements
    const cells = document.querySelectorAll('.cell');
    const currentPlayerDisplay = document.getElementById('current-player');
    const messageElement = document.getElementById('message');
    const resetButton = document.getElementById('reset-btn');
    const newGameButton = document.getElementById('new-game-btn');
    const scoreXElement = document.getElementById('score-x');
    const scoreOElement = document.getElementById('score-o');
    const scoreDrawElement = document.getElementById('score-draw');
    const anotherRoundButton = document.getElementById('another-round-btn');

    // Winning combinations
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    // Initialize the game
    initGame();

    function initGame() {
        cells.forEach((cell, index) => {
            cell.addEventListener('click', () => handleCellClick(index));
            cell.classList.remove('x', 'o');
            cell.textContent = '';
        });

        resetButton.addEventListener('click', resetGame);
        newGameButton.addEventListener('click', newGame);
        anotherRoundButton.addEventListener('click', anotherRound);

        updateScoreDisplay();
    }

    function handleCellClick(index) {
        // Check if cell is already played or game is inactive
        if (gameBoard[index] !== '' || !gameActive) {
            return;
        }

        // Update the game board and UI
        gameBoard[index] = currentPlayer;
        cells[index].textContent = currentPlayer;
        cells[index].classList.add(currentPlayer.toLowerCase());

        // Check for win or draw
        if (checkWin()) {
            endGame(`${currentPlayer} Wins!`, 'winner');
            scores[currentPlayer]++;
        } else if (checkDraw()) {
            endGame("It's a Draw!", 'draw');
            scores.draw++;
        } else {
            // Switch player and continue game
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            currentPlayerDisplay.textContent = currentPlayer;
        }

        updateScoreDisplay();
    }

    function checkWin() {
        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return (
                gameBoard[a] !== '' &&
                gameBoard[a] === gameBoard[b] &&
                gameBoard[a] === gameBoard[c]
            );
        });
    }

    function checkDraw() {
        return !gameBoard.includes('');
    }

    function endGame(message, className) {
        gameActive = false;
        document.querySelector('.message-text').textContent = message;
        messageElement.className = `message ${className}`;
        messageElement.classList.remove('hidden');
    }

    function resetGame() {
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o');
        });

        messageElement.classList.add('hidden');
        currentPlayer = 'X';
        currentPlayerDisplay.textContent = currentPlayer;
    }

    function anotherRound() {
        resetGame();
        messageElement.classList.add('hidden');
    }

    function newGame() {
        resetGame();
        scores = { X: 0, O: 0, draw: 0 };
        updateScoreDisplay();
        messageElement.classList.add('hidden');
    }

    function updateScoreDisplay() {
        scoreXElement.textContent = scores.X;
        scoreOElement.textContent = scores.O;
        scoreDrawElement.textContent = scores.draw;
    }
});