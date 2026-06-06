document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const scoreDisplay = document.getElementById('score');
    const timerDisplay = document.getElementById('timer');
    const bestDisplay = document.getElementById('best');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const gameOverOverlay = document.getElementById('gameOverOverlay');
    const finalScoreDisplay = document.getElementById('finalScore');
    const bestMsgDisplay = document.getElementById('bestMsg');
    const playAgainBtn = document.getElementById('play-again-btn');
    const difficultyBtns = document.querySelectorAll('.diff-btn');

    const DIFFICULTIES = {
        easy: { time: 40, moles: 4, speed: 1000 },
        normal: { time: 30, moles: 6, speed: 700 },
        hard: { time: 20, moles: 8, speed: 500 }
    };

    const MOLE_EMOJIS = ['🐭', '🐹', '🐀', '🐿️', '🦝', '🦗'];

    let difficulty = 'normal';
    let gameActive = false;
    let score = 0;
    let timeRemaining = DIFFICULTIES[difficulty].time;
    let timerInterval = null;
    let moleTimeout = null;
    let activeMoles = new Set();

    // Initialize game board
    function initializeBoard() {
        gameBoard.innerHTML = '';
        const numMoles = DIFFICULTIES[difficulty].moles;
        for (let i = 0; i < numMoles; i++) {
            const hole = document.createElement('div');
            hole.className = 'mole-hole';
            hole.dataset.id = i;
            hole.addEventListener('click', whackMole);
            gameBoard.appendChild(hole);
        }
    }

    // Load best score
    function loadBest() {
        const saved = localStorage.getItem('whackamole_best');
        return saved ? parseInt(saved) : 0;
    }

    // Save best score
    function saveBest(score) {
        const currentBest = loadBest();
        if (score > currentBest) {
            localStorage.setItem('whackamole_best', score.toString());
            return true;
        }
        return false;
    }

    // Update best score display
    function updateBestDisplay() {
        const best = loadBest();
        bestDisplay.textContent = best === 0 ? '—' : best;
    }

    // Show random mole
    function showRandomMole() {
        if (!gameActive) return;

        const holes = Array.from(gameBoard.querySelectorAll('.mole-hole'));
        const availableHoles = holes.filter(hole => !activeMoles.has(hole.dataset.id));

        if (availableHoles.length === 0) {
            scheduleMole();
            return;
        }

        const randomHole = availableHoles[Math.floor(Math.random() * availableHoles.length)];
        const moleEmoji = MOLE_EMOJIS[Math.floor(Math.random() * MOLE_EMOJIS.length)];
        
        activeMoles.add(randomHole.dataset.id);
        randomHole.classList.add('active');
        randomHole.innerHTML = `<div class="mole">${moleEmoji}</div>`;

        // Auto hide mole after delay
        const hideMoleTimeout = setTimeout(() => {
            if (randomHole.classList.contains('active')) {
                hideMole(randomHole);
            }
        }, 1200);

        randomHole.dataset.timeout = hideMoleTimeout;
    }

    // Hide mole
    function hideMole(hole) {
        activeMoles.delete(hole.dataset.id);
        hole.classList.remove('active');
        hole.innerHTML = '';
        if (hole.dataset.timeout) {
            clearTimeout(hole.dataset.timeout);
        }
    }

    // Whack mole
    function whackMole(e) {
        if (!gameActive) return;

        const hole = e.currentTarget;
        if (!hole.classList.contains('active')) return;

        score++;
        scoreDisplay.textContent = score;
        hole.classList.add('hit');

        // Clear timeout so mole doesn't auto-hide
        if (hole.dataset.timeout) {
            clearTimeout(hole.dataset.timeout);
        }

        setTimeout(() => {
            hideMole(hole);
            hole.classList.remove('hit');
        }, 150);
    }

    // Schedule next mole
    function scheduleMole() {
        if (!gameActive) return;

        moleTimeout = setTimeout(() => {
            showRandomMole();
            scheduleMole();
        }, DIFFICULTIES[difficulty].speed);
    }

    // Start game
    function startGame() {
        score = 0;
        timeRemaining = DIFFICULTIES[difficulty].time;
        gameActive = true;
        activeMoles.clear();

        scoreDisplay.textContent = score;
        timerDisplay.textContent = timeRemaining;
        startBtn.disabled = true;
        resetBtn.disabled = false;
        difficultyBtns.forEach(btn => btn.disabled = true);

        initializeBoard();
        scheduleMole();

        timerInterval = setInterval(() => {
            timeRemaining--;
            timerDisplay.textContent = timeRemaining;

            if (timeRemaining <= 0) {
                endGame();
            }
        }, 1000);
    }

    // End game
    function endGame() {
        gameActive = false;
        clearInterval(timerInterval);
        clearTimeout(moleTimeout);

        // Hide all active moles
        gameBoard.querySelectorAll('.mole-hole.active').forEach(hole => {
            hideMole(hole);
        });

        startBtn.disabled = false;
        resetBtn.disabled = false;
        difficultyBtns.forEach(btn => btn.disabled = false);

        // Show game over overlay
        finalScoreDisplay.textContent = score;
        const isNewBest = saveBest(score);
        if (isNewBest) {
            bestMsgDisplay.textContent = '🎉 New Best Score! 🎉';
            bestMsgDisplay.style.color = '#ffd700';
        } else {
            const best = loadBest();
            bestMsgDisplay.textContent = `Best: ${best}`;
        }
        updateBestDisplay();
        gameOverOverlay.classList.remove('hidden');
    }

    // Reset game
    function resetGame() {
        if (gameActive) {
            gameActive = false;
            clearInterval(timerInterval);
            clearTimeout(moleTimeout);
            gameBoard.querySelectorAll('.mole-hole.active').forEach(hole => {
                hideMole(hole);
            });
        }

        score = 0;
        timeRemaining = DIFFICULTIES[difficulty].time;
        scoreDisplay.textContent = score;
        timerDisplay.textContent = timeRemaining;
        startBtn.disabled = false;
        resetBtn.disabled = false;
        gameOverOverlay.classList.add('hidden');
    }

    // Difficulty selection
    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (gameActive) return;

            difficultyBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            difficulty = btn.dataset.difficulty;
            timeRemaining = DIFFICULTIES[difficulty].time;
            timerDisplay.textContent = timeRemaining;
            initializeBoard();
        });
    });

    // Event listeners
    startBtn.addEventListener('click', startGame);
    resetBtn.addEventListener('click', resetGame);
    playAgainBtn.addEventListener('click', () => {
        gameOverOverlay.classList.add('hidden');
        startGame();
    });

    // Initialize
    initializeBoard();
    updateBestDisplay();
});
