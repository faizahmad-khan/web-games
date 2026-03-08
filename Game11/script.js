document.addEventListener('DOMContentLoaded', () => {
    // ── State ──────────────────────────────────────────────
    let currentPlayer = 'X';
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let scores = { X: 0, O: 0, draw: 0 };
    let gameMode = 'pvp'; // 'pvp' or 'ai'
    let aiDifficulty = 'medium';
    let aiThinking = false;

    // ── DOM ────────────────────────────────────────────────
    const cells = document.querySelectorAll('.cell');
    const currentPlayerDisplay = document.getElementById('current-player');
    const messageElement = document.getElementById('message');
    const resetButton = document.getElementById('reset-btn');
    const newGameButton = document.getElementById('new-game-btn');
    const scoreXElement = document.getElementById('score-x');
    const scoreOElement = document.getElementById('score-o');
    const scoreDrawElement = document.getElementById('score-draw');
    const anotherRoundButton = document.getElementById('another-round-btn');
    const gameModeSelect = document.getElementById('game-mode');
    const difficultySelect = document.getElementById('difficulty');
    const difficultyGroup = document.getElementById('difficulty-group');
    const confettiCanvas = document.getElementById('confetti-canvas');
    const confettiCtx = confettiCanvas.getContext('2d');

    // Winning combinations
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    // ── Audio helpers (Web Audio API) ──────────────────────
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    let audioCtx;

    function ensureAudio() {
        if (!audioCtx) audioCtx = new AudioCtx();
    }

    function playTone(freq, duration, type = 'sine') {
        ensureAudio();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    }

    function sfxPlace()  { playTone(520, 0.12, 'triangle'); }
    function sfxWin()    { [523, 659, 784].forEach((f, i) => setTimeout(() => playTone(f, 0.25, 'sine'), i * 120)); }
    function sfxDraw()   { playTone(300, 0.35, 'sawtooth'); }

    // ── Confetti ───────────────────────────────────────────
    let confettiPieces = [];
    let confettiRunning = false;

    function resizeConfettiCanvas() {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeConfettiCanvas);
    resizeConfettiCanvas();

    function launchConfetti() {
        confettiPieces = [];
        const colors = ['#ff6b6b', '#54a0ff', '#2ed573', '#ffa502', '#a55eea', '#00d2d3', '#ff6348'];
        for (let i = 0; i < 150; i++) {
            confettiPieces.push({
                x: Math.random() * confettiCanvas.width,
                y: Math.random() * confettiCanvas.height - confettiCanvas.height,
                w: Math.random() * 8 + 4,
                h: Math.random() * 6 + 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                vx: (Math.random() - 0.5) * 4,
                vy: Math.random() * 3 + 2,
                rot: Math.random() * 360,
                rotV: (Math.random() - 0.5) * 10
            });
        }
        if (!confettiRunning) {
            confettiRunning = true;
            animateConfetti();
        }
    }

    function animateConfetti() {
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        let alive = false;
        confettiPieces.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.04;
            p.rot += p.rotV;
            if (p.y < confettiCanvas.height + 20) {
                alive = true;
                confettiCtx.save();
                confettiCtx.translate(p.x, p.y);
                confettiCtx.rotate((p.rot * Math.PI) / 180);
                confettiCtx.fillStyle = p.color;
                confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                confettiCtx.restore();
            }
        });
        if (alive) {
            requestAnimationFrame(animateConfetti);
        } else {
            confettiRunning = false;
            confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        }
    }

    // ── Init ───────────────────────────────────────────────
    initGame();

    function initGame() {
        cells.forEach((cell, index) => {
            cell.addEventListener('click', () => handleCellClick(index));
            cell.classList.remove('x', 'o', 'win', 'played');
            cell.textContent = '';
        });

        resetButton.addEventListener('click', resetGame);
        newGameButton.addEventListener('click', newGame);
        anotherRoundButton.addEventListener('click', anotherRound);

        gameModeSelect.addEventListener('change', () => {
            gameMode = gameModeSelect.value;
            difficultyGroup.classList.toggle('hidden', gameMode !== 'ai');
            newGame();
        });

        difficultySelect.addEventListener('change', () => {
            aiDifficulty = difficultySelect.value;
        });

        // Keyboard support
        document.addEventListener('keydown', handleKeyboard);

        updateScoreDisplay();
    }

    // ── Keyboard ───────────────────────────────────────────
    function handleKeyboard(e) {
        if (e.key === 'r' || e.key === 'R') { resetGame(); return; }
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= 9) {
            // Map 1-9 (numpad-style: bottom-left = 1) to board indices
            // 7 8 9 → 0 1 2
            // 4 5 6 → 3 4 5
            // 1 2 3 → 6 7 8
            const map = [6, 7, 8, 3, 4, 5, 0, 1, 2];
            handleCellClick(map[num - 1]);
        }
    }

    // ── Cell click ─────────────────────────────────────────
    function handleCellClick(index) {
        if (gameBoard[index] !== '' || !gameActive || aiThinking) return;

        makeMove(index, currentPlayer);

        // After human move, let AI play if applicable
        if (gameActive && gameMode === 'ai' && currentPlayer === 'O') {
            aiThinking = true;
            setTimeout(() => {
                const aiMove = getAIMove();
                if (aiMove !== -1) makeMove(aiMove, 'O');
                aiThinking = false;
            }, 350);
        }
    }

    function makeMove(index, player) {
        gameBoard[index] = player;
        cells[index].textContent = player;
        cells[index].classList.add(player.toLowerCase(), 'played');
        sfxPlace();

        const winCombo = getWinCombo();
        if (winCombo) {
            endGame(`${player} Wins!`, 'winner');
            scores[player]++;
            winCombo.forEach(i => cells[i].classList.add('win'));
            sfxWin();
            launchConfetti();
        } else if (checkDraw()) {
            endGame("It's a Draw!", 'draw');
            scores.draw++;
            sfxDraw();
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            currentPlayerDisplay.textContent = currentPlayer;
        }
        updateScoreDisplay();
    }

    // ── Win / Draw checks ──────────────────────────────────
    function getWinCombo() {
        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
                return pattern;
            }
        }
        return null;
    }

    function checkDraw() {
        return !gameBoard.includes('');
    }

    // ── AI ─────────────────────────────────────────────────
    function getAIMove() {
        const empty = gameBoard.reduce((acc, v, i) => { if (!v) acc.push(i); return acc; }, []);
        if (empty.length === 0) return -1;

        if (aiDifficulty === 'easy') {
            return empty[Math.floor(Math.random() * empty.length)];
        }

        if (aiDifficulty === 'medium') {
            // 60% smart, 40% random
            if (Math.random() < 0.6) return bestMove();
            return empty[Math.floor(Math.random() * empty.length)];
        }

        // hard – minimax
        return bestMove();
    }

    function bestMove() {
        let best = -Infinity;
        let move = -1;
        for (let i = 0; i < 9; i++) {
            if (gameBoard[i] === '') {
                gameBoard[i] = 'O';
                const score = minimax(gameBoard, 0, false);
                gameBoard[i] = '';
                if (score > best) { best = score; move = i; }
            }
        }
        return move;
    }

    function minimax(board, depth, isMax) {
        const w = getWinComboFromBoard(board);
        if (w === 'O') return 10 - depth;
        if (w === 'X') return depth - 10;
        if (!board.includes('')) return 0;

        if (isMax) {
            let best = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    best = Math.max(best, minimax(board, depth + 1, false));
                    board[i] = '';
                }
            }
            return best;
        } else {
            let best = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    best = Math.min(best, minimax(board, depth + 1, true));
                    board[i] = '';
                }
            }
            return best;
        }
    }

    function getWinComboFromBoard(board) {
        for (const [a, b, c] of winPatterns) {
            if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
        }
        return null;
    }

    // ── End / Reset ────────────────────────────────────────
    function endGame(message, className) {
        gameActive = false;
        document.querySelector('.message-text').textContent = message;
        messageElement.className = `message ${className}`;
        messageElement.classList.remove('hidden');
    }

    function resetGame() {
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        aiThinking = false;
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'win', 'played');
        });
        messageElement.classList.add('hidden');
        currentPlayer = 'X';
        currentPlayerDisplay.textContent = currentPlayer;
    }

    function anotherRound() {
        resetGame();
    }

    function newGame() {
        resetGame();
        scores = { X: 0, O: 0, draw: 0 };
        updateScoreDisplay();
    }

    function updateScoreDisplay() {
        scoreXElement.textContent = scores.X;
        scoreOElement.textContent = scores.O;
        scoreDrawElement.textContent = scores.draw;
    }
});