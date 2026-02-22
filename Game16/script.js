// Game state
let score = 0;
let highScore = localStorage.getItem('whackHighScore') || 0;
let timeLeft = 60;
let level = 1;
let isPlaying = false;
let isPaused = false;
let gameInterval = null;
let timerInterval = null;
let moleTimeout = null;

// DOM elements
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');
const timeLeftDisplay = document.getElementById('timeLeft');
const levelDisplay = document.getElementById('level');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const startGameButton = document.getElementById('startGameButton');
const restartButton = document.getElementById('restartButton');
const resumeButton = document.getElementById('resumeButton');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const pauseScreen = document.getElementById('pauseScreen');
const finalScoreDisplay = document.getElementById('finalScore');
const finalLevelDisplay = document.getElementById('finalLevel');
const highScoreMsg = document.getElementById('highScoreMsg');
const holes = document.querySelectorAll('.hole');
const moles = document.querySelectorAll('.mole');

// Initialize
highScoreDisplay.textContent = highScore;

// Event listeners
startButton.addEventListener('click', startGame);
startGameButton.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    startGame();
});
pauseButton.addEventListener('click', togglePause);
resumeButton.addEventListener('click', togglePause);
restartButton.addEventListener('click', resetGame);

// Add click listeners to moles
moles.forEach(mole => {
    mole.addEventListener('click', whackMole);
});

// Start game
function startGame() {
    if (isPlaying) return;
    
    isPlaying = true;
    isPaused = false;
    score = 0;
    timeLeft = 60;
    level = 1;
    
    updateDisplay();
    
    startButton.disabled = true;
    pauseButton.disabled = false;
    
    // Start game loop
    startMoleGame();
    startTimer();
}

// Start mole appearance
function startMoleGame() {
    if (!isPlaying || isPaused) return;
    
    // Calculate difficulty based on level
    const minTime = Math.max(500, 1500 - (level * 100));
    const maxTime = Math.max(1000, 2500 - (level * 150));
    const time = randomTime(minTime, maxTime);
    
    moleTimeout = setTimeout(() => {
        popUpMole();
        startMoleGame();
    }, time);
}

// Pop up a random mole
function popUpMole() {
    if (!isPlaying || isPaused) return;
    
    // Random hole selection
    const randomHole = Math.floor(Math.random() * holes.length);
    const hole = holes[randomHole];
    const mole = hole.querySelector('.mole');
    
    // Check if mole is already up
    if (mole.classList.contains('up')) {
        return popUpMole();
    }
    
    // Determine mole type (regular, golden, or bomb)
    const rand = Math.random();
    mole.classList.remove('golden', 'bomb');
    
    if (rand < 0.1) { // 10% chance for golden mole
        mole.classList.add('golden');
    } else if (rand > 0.85) { // 15% chance for bomb
        mole.classList.add('bomb');
    }
    
    // Show mole
    mole.classList.add('up');
    
    // Hide mole after duration
    const duration = Math.max(600, 1200 - (level * 50));
    setTimeout(() => {
        mole.classList.remove('up');
    }, duration);
}

// Whack mole
function whackMole(e) {
    if (!isPlaying || isPaused) return;
    
    const mole = e.target;
    if (!mole.classList.contains('up')) return;
    
    // Prevent double clicking
    if (mole.classList.contains('whacked')) return;
    
    const hole = mole.parentElement;
    let points = 0;
    
    // Determine points based on mole type
    if (mole.classList.contains('golden')) {
        points = 50;
        hole.classList.add('golden-hit');
    } else if (mole.classList.contains('bomb')) {
        points = -20;
        hole.classList.add('bomb-hit');
    } else {
        points = 10;
        hole.classList.add('hit');
    }
    
    // Update score
    score += points;
    if (score < 0) score = 0;
    scoreDisplay.textContent = score;
    
    // Add whacked animation
    mole.classList.add('whacked');
    mole.classList.remove('up');
    
    // Remove hit class after animation
    setTimeout(() => {
        hole.classList.remove('hit', 'golden-hit', 'bomb-hit');
        mole.classList.remove('whacked');
    }, 500);
    
    // Check for level up (every 100 points)
    const newLevel = Math.floor(score / 100) + 1;
    if (newLevel > level) {
        level = newLevel;
        levelDisplay.textContent = level;
        showLevelUp();
    }
}

// Show level up notification
function showLevelUp() {
    const notification = document.createElement('div');
    notification.textContent = `Level ${level}!`;
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
        color: white;
        padding: 30px 60px;
        border-radius: 20px;
        font-size: 2rem;
        font-weight: bold;
        z-index: 1000;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        animation: levelNotification 1.5s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 1500);
}

// Timer
function startTimer() {
    timerInterval = setInterval(() => {
        if (!isPaused && isPlaying) {
            timeLeft--;
            timeLeftDisplay.textContent = timeLeft;
            
            // Change color when time is running out
            if (timeLeft <= 10) {
                timeLeftDisplay.parentElement.style.background = 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)';
                timeLeftDisplay.parentElement.style.animation = 'pulse 0.5s ease-in-out infinite';
            }
            
            if (timeLeft <= 0) {
                endGame();
            }
        }
    }, 1000);
}

// Toggle pause
function togglePause() {
    if (!isPlaying) return;
    
    isPaused = !isPaused;
    
    if (isPaused) {
        pauseScreen.classList.remove('hidden');
        pauseButton.textContent = 'RESUME';
    } else {
        pauseScreen.classList.add('hidden');
        pauseButton.textContent = 'PAUSE';
        startMoleGame(); // Resume mole spawning
    }
}

// End game
function endGame() {
    isPlaying = false;
    isPaused = false;
    
    clearTimeout(moleTimeout);
    clearInterval(timerInterval);
    
    startButton.disabled = false;
    pauseButton.disabled = true;
    
    // Hide all moles
    moles.forEach(mole => {
        mole.classList.remove('up', 'whacked', 'golden', 'bomb');
    });
    
    // Update high score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('whackHighScore', highScore);
        highScoreDisplay.textContent = highScore;
        highScoreMsg.textContent = '🎉 NEW HIGH SCORE! 🎉';
        highScoreMsg.classList.add('new-high-score');
    } else {
        highScoreMsg.textContent = '';
        highScoreMsg.classList.remove('new-high-score');
    }
    
    // Show game over screen
    finalScoreDisplay.textContent = score;
    finalLevelDisplay.textContent = level;
    gameOverScreen.classList.remove('hidden');
}

// Reset game
function resetGame() {
    gameOverScreen.classList.add('hidden');
    startScreen.classList.add('hidden');
    
    // Reset timer display color
    timeLeftDisplay.parentElement.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    timeLeftDisplay.parentElement.style.animation = '';
    
    startGame();
}

// Update display
function updateDisplay() {
    scoreDisplay.textContent = score;
    timeLeftDisplay.textContent = timeLeft;
    levelDisplay.textContent = level;
}

// Random time helper
function randomTime(min, max) {
    return Math.random() * (max - min) + min;
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (e.key === 'p' || e.key === 'P') {
        if (isPlaying) {
            togglePause();
        }
    }
    
    if (e.key === 'Escape') {
        if (isPlaying && !isPaused) {
            togglePause();
        }
    }
});

// Add CSS animation for level notification
const style = document.createElement('style');
style.textContent = `
    @keyframes levelNotification {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
        }
        50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1);
        }
    }
`;
document.head.appendChild(style);
