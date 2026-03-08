// ── State ──────────────────────────────────────────────────
let word;
let guessedLetters = [];
let incorrectGuesses = 0;
const maxIncorrectGuesses = 6;
let gameActive = true;
let gamesWon = 0;
let streak = 0;
let timerInterval = null;
let secondsLeft = 0;
let difficulty = 'medium';
let category = 'all';

// ── Word bank with categories ──────────────────────────────
const wordBank = [
    { word: 'JAVASCRIPT',     cat: 'tech' },
    { word: 'PYTHON',         cat: 'tech' },
    { word: 'COMPUTER',       cat: 'tech' },
    { word: 'PROGRAMMING',    cat: 'tech' },
    { word: 'ALGORITHM',      cat: 'tech' },
    { word: 'FUNCTION',       cat: 'tech' },
    { word: 'VARIABLE',       cat: 'tech' },
    { word: 'STRING',         cat: 'tech' },
    { word: 'ARRAY',          cat: 'tech' },
    { word: 'OBJECT',         cat: 'tech' },
    { word: 'DEVELOPER',      cat: 'tech' },
    { word: 'CODE',           cat: 'tech' },
    { word: 'SYNTAX',         cat: 'tech' },
    { word: 'DEBUG',          cat: 'tech' },
    { word: 'LOOP',           cat: 'tech' },
    { word: 'CONDITIONAL',    cat: 'tech' },
    { word: 'OPERATOR',       cat: 'tech' },
    { word: 'METHOD',         cat: 'tech' },
    { word: 'CLASS',          cat: 'tech' },
    { word: 'FRAMEWORK',      cat: 'tech' },
    { word: 'BLOCKCHAIN',     cat: 'tech' },
    { word: 'CHATBOT',        cat: 'tech' },
    { word: 'METAVERSE',      cat: 'tech' },
    { word: 'CRYPTOCURRENCY', cat: 'tech' },
    { word: 'ARTIFICIAL',     cat: 'tech' },
    { word: 'MACHINE',        cat: 'tech' },
    { word: 'NEURAL',         cat: 'tech' },
    { word: 'QUANTUM',        cat: 'tech' },
    { word: 'CYBERSECURITY',  cat: 'tech' },
    { word: 'ANALYTICS',      cat: 'tech' },
    { word: 'STARTUP',        cat: 'lifestyle' },
    { word: 'INNOVATION',     cat: 'lifestyle' },
    { word: 'VIRAL',          cat: 'lifestyle' },
    { word: 'INFLUENCER',     cat: 'lifestyle' },
    { word: 'PODCAST',        cat: 'lifestyle' },
    { word: 'STREAMING',      cat: 'lifestyle' },
    { word: 'SUSTAINABLE',    cat: 'lifestyle' },
    { word: 'ELECTRIC',       cat: 'lifestyle' },
    { word: 'AUTONOMOUS',     cat: 'lifestyle' },
    { word: 'BIOMETRIC',      cat: 'lifestyle' },
    { word: 'WELLNESS',       cat: 'lifestyle' },
    { word: 'MINDFULNESS',    cat: 'lifestyle' },
    { word: 'VEGAN',          cat: 'lifestyle' },
    { word: 'CROWDFUNDING',   cat: 'lifestyle' },
    { word: 'DISRUPTIVE',     cat: 'lifestyle' },
    { word: 'HANGMAN',        cat: 'gaming' },
    { word: 'GUESS',          cat: 'gaming' },
    { word: 'LETTER',         cat: 'gaming' },
    { word: 'WORD',           cat: 'gaming' },
    { word: 'GAME',           cat: 'gaming' }
];

// Hints for each word
const wordHints = {
    'JAVASCRIPT': 'A popular high-level programming language commonly used for web development, enabling interactive features on websites and running on both client and server sides.',
    'PYTHON': 'A versatile and beginner-friendly programming language known for its clean syntax, widely used in data science, artificial intelligence, web development, and automation.',
    'COMPUTER': 'An electronic device that processes data and performs calculations at high speeds, capable of storing information and executing programmed instructions.',
    'PROGRAMMING': 'The process of creating instructions for computers to follow, involving writing code in various languages to build software applications and solve problems.',
    'ALGORITHM': 'A step-by-step procedure or formula for solving a problem or completing a task, essential in computer science for efficient data processing and decision making.',
    'FUNCTION': 'A reusable block of code designed to perform a specific task, which can accept input parameters and return output values in programming.',
    'VARIABLE': 'A named storage location in programming that holds data which can be modified during program execution, with different types like numbers, strings, or booleans.',
    'STRING': 'A data type representing a sequence of characters or text in programming, commonly used for storing and manipulating textual information.',
    'ARRAY': 'A data structure that stores multiple elements of the same type in a contiguous memory location, accessible through index positions starting from zero.',
    'OBJECT': 'A fundamental data structure in programming that groups related data and functions together, containing properties and methods that define its characteristics and behaviors.',
    'HANGMAN': 'A classic word-guessing game where players try to figure out a hidden word by suggesting letters, with limited wrong guesses before losing.',
    'GUESS': 'The act of estimating or attempting to identify something without complete information, often used in games and problem-solving scenarios.',
    'LETTER': 'A character from an alphabet used in written language, serving as the basic unit for forming words and communicating ideas.',
    'WORD': 'A unit of language consisting of one or more letters that conveys meaning, functioning as the building block of sentences and communication.',
    'GAME': 'A structured activity or competition involving rules, challenges, and objectives, played for entertainment, education, or skill development.',
    'DEVELOPER': 'A professional who designs, creates, and maintains software applications using programming languages and development tools to solve real-world problems.',
    'CODE': 'Written instructions in a programming language that computers can interpret and execute to perform specific tasks or create applications.',
    'SYNTAX': 'The set of rules that define how programs must be written in a specific programming language, including proper structure, punctuation, and keyword usage.',
    'DEBUG': 'The process of identifying, analyzing, and removing errors or bugs from software code to ensure it runs correctly and efficiently.',
    'LOOP': 'A programming construct that repeatedly executes a block of code until a specified condition is met, essential for automating repetitive tasks.',
    'CONDITIONAL': 'A programming statement that executes different code blocks based on whether certain conditions are true or false, enabling decision-making in programs.',
    'OPERATOR': 'A symbol or keyword in programming that performs operations on values or variables, such as arithmetic, comparison, or logical operations.',
    'METHOD': 'A function associated with an object or class in programming that defines behaviors or actions that can be performed on that object.',
    'CLASS': 'A blueprint or template in object-oriented programming that defines the structure and behavior of objects, including their properties and methods.',
    'FRAMEWORK': 'A pre-built software platform providing structure and tools for developing applications more efficiently, offering reusable components and standardized patterns.',
    'BLOCKCHAIN': 'A distributed digital ledger technology that records transactions across multiple computers in a secure, transparent, and immutable way, powering cryptocurrencies.',
    'CHATBOT': 'An artificial intelligence program designed to simulate human conversation through text or voice, used for customer service, information retrieval, and automated assistance.',
    'METAVERSE': 'A collective virtual shared space combining augmented reality, virtual reality, and the internet, where users interact through digital avatars in immersive environments.',
    'CRYPTOCURRENCY': 'A digital or virtual currency secured by cryptography, operating independently of central banks and enabling decentralized peer-to-peer transactions.',
    'ARTIFICIAL': 'Created by humans rather than occurring naturally, often used in the context of artificial intelligence which mimics human cognitive functions.',
    'MACHINE': 'A device or system that performs tasks automatically or with mechanical power, in computing often refers to machine learning algorithms.',
    'NEURAL': 'Related to nerve cells or neurons, commonly used in neural networks which are computing systems inspired by biological brain structures for pattern recognition.',
    'QUANTUM': 'Related to the smallest units of energy and matter, in computing refers to quantum computers that use quantum mechanics for unprecedented processing power.',
    'STARTUP': 'A newly established business venture typically focused on developing innovative products or services, often in the technology sector with high growth potential.',
    'INNOVATION': 'The process of creating new ideas, methods, or products that bring positive change and improvement, driving progress in technology and society.',
    'VIRAL': 'Content that spreads rapidly and widely across the internet through social sharing, capturing massive attention and engagement in a short time.',
    'INFLUENCER': 'A person with significant social media following who shapes opinions and purchasing decisions of their audience through content creation and recommendations.',
    'PODCAST': 'A digital audio series available for streaming or download, covering various topics through episodic content that listeners can enjoy on-demand.',
    'STREAMING': 'The continuous transmission of audio or video content over the internet, allowing real-time consumption without downloading the entire file first.',
    'SUSTAINABLE': 'Practices or products designed to meet present needs without compromising future generations, focusing on environmental protection and resource conservation.',
    'ELECTRIC': 'Powered by electricity rather than fossil fuels, commonly referring to vehicles and devices that are more environmentally friendly and efficient.',
    'AUTONOMOUS': 'Operating independently without human intervention, often describing self-driving vehicles and automated systems that make decisions using artificial intelligence.',
    'BIOMETRIC': 'Biological measurements and characteristics used for identification and access control, including fingerprints, facial recognition, and iris scans.',
    'CYBERSECURITY': 'The practice of protecting computer systems, networks, and data from digital attacks, unauthorized access, and security breaches.',
    'WELLNESS': 'A holistic approach to health focusing on physical, mental, and emotional well-being through healthy lifestyle choices and self-care practices.',
    'MINDFULNESS': 'The practice of being fully present and engaged in the current moment, paying attention to thoughts and feelings without judgment for mental clarity.',
    'VEGAN': 'A lifestyle and diet that excludes all animal products, including meat, dairy, and eggs, often adopted for ethical, environmental, or health reasons.',
    'CROWDFUNDING': 'A method of raising money for projects or ventures by collecting small contributions from a large number of people, typically through online platforms.',
    'DISRUPTIVE': 'Innovation that significantly alters or replaces existing industries, technologies, or business models, creating new markets and value networks.',
    'ANALYTICS': 'The systematic analysis of data using statistical and computational methods to discover patterns, trends, and insights for informed decision-making.'
};

// ── DOM ────────────────────────────────────────────────────
const wordPlaceholder = document.getElementById('wordPlaceholder');
const incorrectLettersDisplay = document.getElementById('incorrectLettersDisplay');
const alphabetContainer = document.querySelector('.alphabet-container');
const restartButton = document.getElementById('restartButton');
const gameMessage = document.getElementById('gameMessage');
const canvas = document.getElementById('hangmanCanvas');
const ctx = canvas.getContext('2d');
const hintDisplay = document.getElementById('hintDisplay');
const levelDisplay = document.getElementById('levelDisplay');
const streakDisplay = document.getElementById('streakDisplay');
const timerDisplay = document.getElementById('timerDisplay');
const livesDisplay = document.getElementById('livesDisplay');
const difficultySelect = document.getElementById('difficulty');
const categorySelect = document.getElementById('category');
const confettiCanvas = document.getElementById('confetti-canvas');
const confettiCtx = confettiCanvas.getContext('2d');

// ── Audio helpers (Web Audio API) ──────────────────────────
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function ensureAudio() {
    if (!audioCtx) audioCtx = new AudioCtx();
}

function playTone(freq, dur, type = 'sine') {
    ensureAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
}

function sfxCorrect() { playTone(660, 0.12, 'triangle'); }
function sfxWrong()   { playTone(220, 0.25, 'sawtooth'); }
function sfxWin()     { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playTone(f, 0.3), i * 120)); }
function sfxLose()    { [300, 250, 200].forEach((f, i) => setTimeout(() => playTone(f, 0.35, 'sawtooth'), i * 150)); }

// ── Confetti ───────────────────────────────────────────────
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

// ── Timer ──────────────────────────────────────────────────
function getTimerSeconds() {
    if (difficulty === 'easy') return 0; // no timer
    if (difficulty === 'medium') return 90;
    return 45; // hard
}

function startTimer() {
    clearInterval(timerInterval);
    secondsLeft = getTimerSeconds();
    if (secondsLeft === 0) {
        timerDisplay.textContent = '--';
        return;
    }
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        secondsLeft--;
        updateTimerDisplay();
        if (secondsLeft <= 0) {
            clearInterval(timerInterval);
            if (gameActive) {
                gameActive = false;
                gameMessage.textContent = `Time's up! The word was: ${word}`;
                gameMessage.classList.add('loser');
                streak = 0;
                updateStatsDisplay();
                disableAllAlphabetButtons();
                sfxLose();
            }
        }
    }, 1000);
}

function updateTimerDisplay() {
    if (secondsLeft === 0 && difficulty === 'easy') {
        timerDisplay.textContent = '--';
        return;
    }
    const m = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
    const s = String(secondsLeft % 60).padStart(2, '0');
    timerDisplay.textContent = `${m}:${s}`;
}

// ── Word selection with difficulty & category ──────────────
function getFilteredWords() {
    let filtered = wordBank;
    if (category !== 'all') {
        filtered = filtered.filter(w => w.cat === category);
    }
    if (difficulty === 'easy') {
        filtered = filtered.filter(w => w.word.length <= 6);
    } else if (difficulty === 'hard') {
        filtered = filtered.filter(w => w.word.length >= 8);
    }
    // fallback: if no words match, use all
    return filtered.length > 0 ? filtered : wordBank;
}

// ── Stats ──────────────────────────────────────────────────
function loadStats() {
    const saved = localStorage.getItem('hangman_stats');
    if (saved) {
        const data = JSON.parse(saved);
        gamesWon = data.gamesWon || 0;
        streak = data.streak || 0;
    }
}

function saveStats() {
    localStorage.setItem('hangman_stats', JSON.stringify({ gamesWon, streak }));
}

function updateStatsDisplay() {
    levelDisplay.textContent = gamesWon + 1;
    streakDisplay.textContent = streak;
    livesDisplay.textContent = maxIncorrectGuesses - incorrectGuesses;
    saveStats();
}

// ── Init ───────────────────────────────────────────────────
function initGame() {
    const candidates = getFilteredWords();
    word = candidates[Math.floor(Math.random() * candidates.length)].word;
    guessedLetters = [];
    incorrectGuesses = 0;
    gameActive = true;

    gameMessage.textContent = '';
    gameMessage.className = 'message';

    drawHangman();
    updateWordDisplay();
    updateIncorrectLettersDisplay();
    updateHintDisplay();
    generateAlphabetButtons();
    updateStatsDisplay();
    startTimer();

    // Remove stale next-level button
    const existing = document.getElementById('nextLevelButton');
    if (existing) existing.remove();
}

// ── Word display ───────────────────────────────────────────
function updateWordDisplay() {
    const display = word.split('').map(letter =>
        guessedLetters.includes(letter) ? letter : '_'
    ).join(' ');

    wordPlaceholder.textContent = display;

    if (!display.includes('_')) {
        gameActive = false;
        clearInterval(timerInterval);
        gamesWon++;
        streak++;
        updateStatsDisplay();
        gameMessage.textContent = `🎉 You won Level ${gamesWon}!`;
        gameMessage.classList.add('winner');
        disableAllAlphabetButtons();
        addNextLevelButton();
        sfxWin();
        launchConfetti();
    }
}

// ── Next level button ──────────────────────────────────────
function addNextLevelButton() {
    const existing = document.getElementById('nextLevelButton');
    if (existing) existing.remove();

    const btn = document.createElement('button');
    btn.id = 'nextLevelButton';
    btn.classList.add('next-level-btn');
    btn.textContent = 'Next Level';
    btn.addEventListener('click', startNextLevel);
    restartButton.insertAdjacentElement('afterend', btn);
}

function startNextLevel() {
    const btn = document.getElementById('nextLevelButton');
    if (btn) btn.remove();
    initGame();
}

// ── Incorrect letters ──────────────────────────────────────
function updateIncorrectLettersDisplay() {
    incorrectLettersDisplay.textContent = guessedLetters
        .filter(letter => !word.includes(letter))
        .join(', ');
}

// ── Hint ───────────────────────────────────────────────────
function updateHintDisplay() {
    if (hintDisplay && wordHints[word]) {
        hintDisplay.textContent = wordHints[word];
    }
}

// ── Alphabet buttons ───────────────────────────────────────
function generateAlphabetButtons() {
    alphabetContainer.innerHTML = '';
    for (let i = 65; i <= 90; i++) {
        const letter = String.fromCharCode(i);
        const button = document.createElement('button');
        button.classList.add('alphabet-btn');
        button.textContent = letter;
        button.addEventListener('click', () => handleLetterGuess(letter));
        alphabetContainer.appendChild(button);
    }
}

// ── Letter guess ───────────────────────────────────────────
function handleLetterGuess(letter) {
    if (!gameActive || guessedLetters.includes(letter)) return;

    guessedLetters.push(letter);

    const button = Array.from(alphabetContainer.children).find(btn => btn.textContent === letter);
    if (button) button.disabled = true;

    if (word.includes(letter)) {
        if (button) button.classList.add('correct');
        sfxCorrect();
        updateWordDisplay();
    } else {
        if (button) button.classList.add('wrong');
        sfxWrong();
        incorrectGuesses++;
        drawHangman();
        updateIncorrectLettersDisplay();
        updateStatsDisplay();

        if (incorrectGuesses >= maxIncorrectGuesses) {
            gameActive = false;
            clearInterval(timerInterval);
            streak = 0;
            updateStatsDisplay();
            gameMessage.textContent = `Game Over! The word was: ${word}`;
            gameMessage.classList.add('loser');
            disableAllAlphabetButtons();
            addNextLevelButton();
            sfxLose();
        }
    }
}

function disableAllAlphabetButtons() {
    document.querySelectorAll('.alphabet-btn').forEach(btn => { btn.disabled = true; });
}

// ── Draw hangman (colored body parts) ──────────────────────
function drawHangman() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    // Stand (always visible)
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 4;
    // Base
    ctx.beginPath(); ctx.moveTo(50, 250); ctx.lineTo(250, 250); ctx.stroke();
    // Pole
    ctx.beginPath(); ctx.moveTo(100, 250); ctx.lineTo(100, 50); ctx.stroke();
    // Top bar
    ctx.beginPath(); ctx.moveTo(100, 50); ctx.lineTo(200, 50); ctx.stroke();
    // Rope
    ctx.beginPath(); ctx.moveTo(200, 50); ctx.lineTo(200, 80); ctx.stroke();

    ctx.lineWidth = 3;

    if (incorrectGuesses >= 1) {
        // Head
        ctx.strokeStyle = '#ff6b6b';
        ctx.beginPath();
        ctx.arc(200, 100, 20, 0, Math.PI * 2);
        ctx.stroke();
        // Face
        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath(); ctx.arc(193, 96, 2, 0, Math.PI * 2); ctx.fill(); // left eye
        ctx.beginPath(); ctx.arc(207, 96, 2, 0, Math.PI * 2); ctx.fill(); // right eye
        if (incorrectGuesses >= maxIncorrectGuesses) {
            // Sad mouth
            ctx.strokeStyle = '#ff6b6b';
            ctx.beginPath(); ctx.arc(200, 112, 6, Math.PI, 0); ctx.stroke();
        }
    }

    if (incorrectGuesses >= 2) {
        // Body
        ctx.strokeStyle = '#54a0ff';
        ctx.beginPath(); ctx.moveTo(200, 120); ctx.lineTo(200, 180); ctx.stroke();
    }

    if (incorrectGuesses >= 3) {
        // Left arm
        ctx.strokeStyle = '#2ed573';
        ctx.beginPath(); ctx.moveTo(200, 140); ctx.lineTo(170, 165); ctx.stroke();
    }

    if (incorrectGuesses >= 4) {
        // Right arm
        ctx.strokeStyle = '#ffa502';
        ctx.beginPath(); ctx.moveTo(200, 140); ctx.lineTo(230, 165); ctx.stroke();
    }

    if (incorrectGuesses >= 5) {
        // Left leg
        ctx.strokeStyle = '#a55eea';
        ctx.beginPath(); ctx.moveTo(200, 180); ctx.lineTo(170, 220); ctx.stroke();
    }

    if (incorrectGuesses >= 6) {
        // Right leg
        ctx.strokeStyle = '#ff6348';
        ctx.beginPath(); ctx.moveTo(200, 180); ctx.lineTo(230, 220); ctx.stroke();
    }
}

// ── Keyboard support ───────────────────────────────────────
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        gamesWon = 0;
        streak = 0;
        initGame();
        return;
    }
    const key = e.key.toUpperCase();
    if (/^[A-Z]$/.test(key)) {
        handleLetterGuess(key);
    }
});

// ── Control listeners ──────────────────────────────────────
restartButton.addEventListener('click', () => {
    gamesWon = 0;
    streak = 0;
    initGame();
});

difficultySelect.addEventListener('change', () => {
    difficulty = difficultySelect.value;
    gamesWon = 0;
    streak = 0;
    initGame();
});

categorySelect.addEventListener('change', () => {
    category = categorySelect.value;
    gamesWon = 0;
    streak = 0;
    initGame();
});

// ── Boot ───────────────────────────────────────────────────
loadStats();
window.onload = initGame;