document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const movesDisplay = document.getElementById('moves');
    const matchesDisplay = document.getElementById('matches');
    const totalMatchesDisplay = document.getElementById('total-matches');
    const timerDisplay = document.getElementById('timer');
    const bestDisplay = document.getElementById('bestScore');
    const resetBtn = document.getElementById('reset-btn');
    const winOverlay = document.getElementById('winOverlay');
    const winMoves = document.getElementById('winMoves');
    const winTime = document.getElementById('winTime');
    const newBestMsg = document.getElementById('newBestMsg');
    const playAgainBtn = document.getElementById('play-again-btn');

    const allSymbols = ['🍎','🍌','🍒','🍇','🍊','🍓','🍑','🥝','🌶️','🍋'];
    const SIZES = {
        easy:   { cols: 4, rows: 3, pairs: 6 },
        medium: { cols: 4, rows: 4, pairs: 8 },
        hard:   { cols: 5, rows: 4, pairs: 10 }
    };

    let difficulty = 'easy';
    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let lockBoard = false;
    let timerInterval = null;
    let seconds = 0;
    let gameStarted = false;

    function loadBest() {
        const v = localStorage.getItem('memory_best_' + difficulty);
        return v ? JSON.parse(v) : null;
    }
    function saveBest(moves, time) {
        localStorage.setItem('memory_best_' + difficulty, JSON.stringify({ moves, time }));
    }

    function formatTime(s) {
        return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
    }

    function startTimer() {
        if (timerInterval) clearInterval(timerInterval);
        seconds = 0;
        timerDisplay.textContent = '0:00';
        timerInterval = setInterval(() => {
            seconds++;
            timerDisplay.textContent = formatTime(seconds);
        }, 1000);
    }

    function stopTimer() {
        if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    }

    function shuffleArray(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
    }

    function initGame() {
        stopTimer();
        gameStarted = false;
        const cfg = SIZES[difficulty];
        cards = [];
        flippedCards = [];
        matchedPairs = 0;
        moves = 0;
        lockBoard = false;

        movesDisplay.textContent = 0;
        matchesDisplay.textContent = 0;
        totalMatchesDisplay.textContent = cfg.pairs;
        timerDisplay.textContent = '0:00';
        winOverlay.classList.add('hidden');

        const best = loadBest();
        bestDisplay.textContent = best ? best.moves + ' / ' + formatTime(best.time) : '—';

        gameBoard.innerHTML = '';
        gameBoard.className = 'game-board cols-' + cfg.cols;

        const symbols = allSymbols.slice(0, cfg.pairs);
        let gameSymbols = [...symbols, ...symbols];
        shuffleArray(gameSymbols);

        gameSymbols.forEach((symbol, idx) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.index = idx;

            const front = document.createElement('div');
            front.classList.add('front');
            front.textContent = symbol;

            const back = document.createElement('div');
            back.classList.add('back');
            back.textContent = '?';

            card.appendChild(front);
            card.appendChild(back);
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
            cards.push(card);
        });
    }

    function flipCard() {
        if (lockBoard) return;
        if (this.classList.contains('flipped')) return;
        if (flippedCards.length >= 2) return;

        if (!gameStarted) { gameStarted = true; startTimer(); }

        this.classList.add('flipped');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            moves++;
            movesDisplay.textContent = moves;
            checkForMatch();
        }
    }

    function checkForMatch() {
        const [a, b] = flippedCards;
        const match = a.querySelector('.front').textContent === b.querySelector('.front').textContent;

        if (match) {
            a.classList.add('matched', 'pop');
            b.classList.add('matched', 'pop');
            a.removeEventListener('click', flipCard);
            b.removeEventListener('click', flipCard);
            flippedCards = [];
            lockBoard = false;
            matchedPairs++;
            matchesDisplay.textContent = matchedPairs;

            if (matchedPairs === SIZES[difficulty].pairs) {
                stopTimer();
                showWin();
            }
        } else {
            lockBoard = true;
            setTimeout(() => {
                a.classList.remove('flipped');
                b.classList.remove('flipped');
                flippedCards = [];
                lockBoard = false;
            }, 800);
        }
    }

    function showWin() {
        winMoves.textContent = moves;
        winTime.textContent = formatTime(seconds);

        const best = loadBest();
        let isNew = false;
        if (!best || moves < best.moves || (moves === best.moves && seconds < best.time)) {
            saveBest(moves, seconds);
            isNew = true;
            bestDisplay.textContent = moves + ' / ' + formatTime(seconds);
        }
        newBestMsg.classList.toggle('hidden', !isNew);
        winOverlay.classList.remove('hidden');
    }

    // difficulty buttons
    document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            difficulty = btn.dataset.size;
            initGame();
        });
    });

    resetBtn.addEventListener('click', initGame);
    playAgainBtn.addEventListener('click', initGame);

    initGame();
});
});