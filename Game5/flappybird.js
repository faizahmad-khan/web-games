const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const pauseBtn = document.getElementById('pause-btn');

const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over');
const pauseOverlay = document.getElementById('pause-overlay');

const scoreDisplay = document.getElementById('score');
const finalScoreDisplay = document.getElementById('final-score');
const highScoreDisplay = document.getElementById('high-score-value');
const gameOverHighScoreDisplay = document.getElementById('game-over-high-score');
const difficultyValueDisplay = document.getElementById('difficulty-value');
const medalValueDisplay = document.getElementById('medal-value');

const tapHint = document.getElementById('tap-hint');
const achievementToast = document.getElementById('achievement-toast');
const unlockedAchievementsDisplay = document.getElementById('unlocked-achievements');
const gameContainer = document.getElementById('game-container');

const STORAGE_KEYS = {
    bestScore: 'flappyHighScore',
    totalRuns: 'flappyTotalRuns',
    totalFlaps: 'flappyTotalFlaps',
    medalsUnlocked: 'flappyMedalsUnlocked',
    achievementsUnlocked: 'flappyAchievementsUnlocked'
};

const ACHIEVEMENTS = [
    { id: 'firstFlight', name: 'First Flight', check: (stats) => stats.totalRuns >= 1 },
    { id: 'gettingWarm', name: 'Getting Warm', check: (stats, runScore) => runScore >= 10 },
    { id: 'skyMaster', name: 'Sky Master', check: (stats, runScore) => runScore >= 25 },
    { id: 'persistent', name: 'Persistent', check: (stats) => stats.totalRuns >= 10 }
];

const MEDALS = [
    { id: 'platinum', name: 'Platinum', minScore: 50 },
    { id: 'gold', name: 'Gold', minScore: 35 },
    { id: 'silver', name: 'Silver', minScore: 20 },
    { id: 'bronze', name: 'Bronze', minScore: 10 }
];

const stats = {
    bestScore: 0,
    totalRuns: 0,
    totalFlaps: 0,
    medalsUnlocked: {},
    achievementsUnlocked: {}
};

let gameState = 'menu';
let score = 0;
let frames = 0;
let recentUnlocks = [];
let toastTimer = null;
let scorePopTimer = null;

const particles = [];

const birdImg = new Image();
birdImg.src = 'assets/anibird.webp';

const backgroundImg = new Image();
backgroundImg.src = 'assets/background.png';

function safeParseInt(value, fallback = 0) {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function loadPersistence() {
    stats.bestScore = safeParseInt(localStorage.getItem(STORAGE_KEYS.bestScore), 0);
    stats.totalRuns = safeParseInt(localStorage.getItem(STORAGE_KEYS.totalRuns), 0);
    stats.totalFlaps = safeParseInt(localStorage.getItem(STORAGE_KEYS.totalFlaps), 0);

    try {
        stats.medalsUnlocked = JSON.parse(localStorage.getItem(STORAGE_KEYS.medalsUnlocked) || '{}');
    } catch (error) {
        stats.medalsUnlocked = {};
    }

    try {
        stats.achievementsUnlocked = JSON.parse(localStorage.getItem(STORAGE_KEYS.achievementsUnlocked) || '{}');
    } catch (error) {
        stats.achievementsUnlocked = {};
    }

    highScoreDisplay.textContent = stats.bestScore;
    gameOverHighScoreDisplay.textContent = stats.bestScore;
}

function savePersistence() {
    localStorage.setItem(STORAGE_KEYS.bestScore, String(stats.bestScore));
    localStorage.setItem(STORAGE_KEYS.totalRuns, String(stats.totalRuns));
    localStorage.setItem(STORAGE_KEYS.totalFlaps, String(stats.totalFlaps));
    localStorage.setItem(STORAGE_KEYS.medalsUnlocked, JSON.stringify(stats.medalsUnlocked));
    localStorage.setItem(STORAGE_KEYS.achievementsUnlocked, JSON.stringify(stats.achievementsUnlocked));
}

const bird = {
    x: 70,
    y: canvas.height / 2,
    width: 50,
    height: 35,
    gravity: 0.25,
    velocity: 0,
    jump: -6,

    draw() {
        const rotation = Math.max(-0.6, Math.min(0.8, this.velocity * 0.06));

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(rotation);

        if (birdImg.complete && birdImg.naturalWidth !== 0) {
            ctx.drawImage(birdImg, -this.width / 2, -this.height / 2, this.width, this.height);
        } else {
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(0, 0, 20, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(8, -3, 4, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#FF8C00';
            ctx.beginPath();
            ctx.moveTo(15, 0);
            ctx.lineTo(30, -3);
            ctx.lineTo(30, 3);
            ctx.closePath();
            ctx.fill();
        }

        ctx.restore();
    },

    update() {
        if (gameState !== 'playing') {
            return;
        }

        this.velocity += this.gravity;
        this.y += this.velocity;

        if (this.y + 15 >= canvas.height - 20) {
            this.y = canvas.height - 35;
            triggerImpactEffect();
            gameOver();
        }

        if (this.y - 15 <= 0) {
            this.y = 15;
            this.velocity = 0;
        }
    },

    flap() {
        if (gameState !== 'playing') {
            return;
        }

        this.velocity = this.jump;
        stats.totalFlaps += 1;

        for (let i = 0; i < 5; i += 1) {
            particles.push({
                x: this.x - 15,
                y: this.y + (Math.random() * 10 - 5),
                vx: -1 - Math.random() * 1.5,
                vy: Math.random() * 1.2 - 0.6,
                size: 2 + Math.random() * 2,
                life: 24,
                color: 'rgba(255, 255, 255, 0.9)'
            });
        }
    },

    reset() {
        this.y = canvas.height / 2;
        this.velocity = 0;
    }
};

const pipes = {
    position: [],
    baseGap: 180,
    minGap: 130,
    gap: 180,
    maxYPos: -150,
    baseDx: 2,
    dx: 2,
    spawnInterval: 100,

    draw() {
        for (let i = 0; i < this.position.length; i += 1) {
            const p = this.position[i];

            ctx.fillStyle = '#2E8B57';
            ctx.fillRect(p.x, p.y, p.width, p.height);

            ctx.fillStyle = '#228B22';
            ctx.fillRect(p.x - 5, p.y, p.width + 10, 20);

            ctx.fillStyle = '#2E8B57';
            ctx.fillRect(p.x, p.y + p.height + this.gap, p.width, canvas.height);

            ctx.fillStyle = '#228B22';
            ctx.fillRect(p.x - 5, p.y + p.height + this.gap, p.width + 10, 20);
        }
    },

    update() {
        if (gameState !== 'playing') {
            return;
        }

        if (frames % this.spawnInterval === 0) {
            this.position.push({
                x: canvas.width,
                y: this.maxYPos * (Math.random() + 1),
                width: 60,
                height: 300,
                passed: false
            });
        }

        for (let i = 0; i < this.position.length; i += 1) {
            const p = this.position[i];
            p.x -= this.dx;

            if (!p.passed && p.x + p.width < bird.x - 10) {
                p.passed = true;
                incrementScore();
            }

            if (p.x + p.width <= 0) {
                this.position.splice(i, 1);
                i -= 1;
                continue;
            }

            const hitsX = bird.x + 15 > p.x && bird.x - 15 < p.x + p.width;
            const hitsTop = bird.y - 15 < p.y + p.height;
            const hitsBottom = bird.y + 15 > p.y + p.height + this.gap;

            if (hitsX && (hitsTop || hitsBottom)) {
                triggerImpactEffect();
                gameOver();
                return;
            }
        }
    },

    reset() {
        this.position = [];
        this.dx = this.baseDx;
        this.gap = this.baseGap;
    }
};

function getDifficultyLabel() {
    const level = Math.floor(score / 5);
    if (level >= 8) return 'Hard';
    if (level >= 4) return 'Medium';
    return 'Easy';
}

function updateDifficulty() {
    const level = Math.floor(score / 5);
    pipes.dx = Math.min(pipes.baseDx + level * 0.15, 4.6);
    pipes.gap = Math.max(pipes.baseGap - level * 2, pipes.minGap);
    difficultyValueDisplay.textContent = getDifficultyLabel();
}

function drawBackground() {
    if (backgroundImg.complete && backgroundImg.naturalWidth !== 0) {
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    } else {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#E0F7FA');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function drawParticles() {
    for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        ctx.globalAlpha = Math.max(0, p.life / 26);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

function updateParticles() {
    for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;

        if (p.life <= 0) {
            particles.splice(i, 1);
            i -= 1;
        }
    }
}

function pulseScore() {
    scoreDisplay.classList.remove('pop');
    // Reflow so consecutive pulses still animate.
    // eslint-disable-next-line no-unused-expressions
    scoreDisplay.offsetWidth;
    scoreDisplay.classList.add('pop');

    if (scorePopTimer) {
        clearTimeout(scorePopTimer);
    }
    scorePopTimer = setTimeout(() => {
        scoreDisplay.classList.remove('pop');
    }, 180);
}

function showAchievementToast(text) {
    achievementToast.textContent = text;
    achievementToast.classList.remove('hidden');

    if (toastTimer) {
        clearTimeout(toastTimer);
    }

    toastTimer = setTimeout(() => {
        achievementToast.classList.add('hidden');
    }, 2200);
}

function unlockAchievement(id, label) {
    if (stats.achievementsUnlocked[id]) {
        return;
    }

    stats.achievementsUnlocked[id] = true;
    recentUnlocks.push(label);
    showAchievementToast(`Achievement Unlocked: ${label}`);
}

function evaluateAchievements() {
    for (let i = 0; i < ACHIEVEMENTS.length; i += 1) {
        const achievement = ACHIEVEMENTS[i];
        if (achievement.check(stats, score)) {
            unlockAchievement(achievement.id, achievement.name);
        }
    }
}

function medalFromScore(currentScore) {
    for (let i = 0; i < MEDALS.length; i += 1) {
        if (currentScore >= MEDALS[i].minScore) {
            return MEDALS[i];
        }
    }
    return null;
}

function updateAchievementSummary() {
    if (recentUnlocks.length === 0) {
        unlockedAchievementsDisplay.textContent = 'No new achievements this run.';
        return;
    }

    unlockedAchievementsDisplay.textContent = `New Unlocks: ${recentUnlocks.join(' • ')}`;
}

function triggerImpactEffect() {
    gameContainer.classList.remove('impact-flash');
    gameContainer.classList.remove('impact-shake');
    // eslint-disable-next-line no-unused-expressions
    gameContainer.offsetWidth;
    gameContainer.classList.add('impact-flash');
    gameContainer.classList.add('impact-shake');

    setTimeout(() => {
        gameContainer.classList.remove('impact-flash');
        gameContainer.classList.remove('impact-shake');
    }, 220);
}

function incrementScore() {
    score += 1;
    scoreDisplay.textContent = score;
    pulseScore();
    updateDifficulty();

    for (let i = 0; i < 6; i += 1) {
        particles.push({
            x: bird.x + 10,
            y: bird.y,
            vx: Math.random() * 2,
            vy: Math.random() * 2 - 1,
            size: 2 + Math.random() * 2,
            life: 20,
            color: 'rgba(255, 236, 92, 0.95)'
        });
    }

    evaluateAchievements();
}

function updateTapHint() {
    if (gameState === 'playing') {
        tapHint.classList.add('hidden');
    } else {
        tapHint.classList.remove('hidden');
    }
}

function gameOver() {
    if (gameState !== 'playing') {
        return;
    }

    gameState = 'gameover';
    finalScoreDisplay.textContent = score;

    stats.totalRuns += 1;
    if (score > stats.bestScore) {
        stats.bestScore = score;
    }

    const medal = medalFromScore(score);
    if (medal) {
        medalValueDisplay.textContent = medal.name;
        stats.medalsUnlocked[medal.id] = true;
    } else {
        medalValueDisplay.textContent = 'None';
    }

    evaluateAchievements();
    updateAchievementSummary();

    highScoreDisplay.textContent = stats.bestScore;
    gameOverHighScoreDisplay.textContent = stats.bestScore;

    savePersistence();

    pauseBtn.classList.add('hidden');
    pauseOverlay.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
    updateTapHint();
}

function resetRun() {
    score = 0;
    frames = 0;
    recentUnlocks = [];
    particles.length = 0;

    scoreDisplay.textContent = score;
    medalValueDisplay.textContent = 'None';
    unlockedAchievementsDisplay.textContent = '';

    bird.reset();
    pipes.reset();
    updateDifficulty();
}

function setPlayingState() {
    gameState = 'playing';
    pauseBtn.classList.remove('hidden');
    pauseBtn.textContent = 'Pause';
    pauseOverlay.classList.add('hidden');
    updateTapHint();
}

function startGame() {
    resetRun();
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    setPlayingState();
}

function togglePause() {
    if (gameState === 'playing') {
        gameState = 'paused';
        pauseOverlay.classList.remove('hidden');
        pauseBtn.textContent = 'Resume';
        updateTapHint();
    } else if (gameState === 'paused') {
        setPlayingState();
    }
}

function primaryAction() {
    if (gameState === 'menu') {
        startGame();
        return;
    }

    if (gameState === 'gameover') {
        startGame();
        return;
    }

    if (gameState === 'playing') {
        bird.flap();
    }
}

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);

canvas.addEventListener('click', primaryAction);
canvas.addEventListener('touchstart', (event) => {
    event.preventDefault();
    primaryAction();
}, { passive: false });

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault();

        if (gameState === 'paused') {
            togglePause();
            return;
        }

        primaryAction();
    }

    if ((event.code === 'KeyP' || event.code === 'Escape') && (gameState === 'playing' || gameState === 'paused')) {
        event.preventDefault();
        togglePause();
    }
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden && gameState === 'playing') {
        togglePause();
    }
});

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    pipes.draw();
    bird.draw();
    drawParticles();

    pipes.update();
    bird.update();
    updateParticles();

    if (gameState === 'playing') {
        frames += 1;
    }

    requestAnimationFrame(loop);
}

function init() {
    loadPersistence();
    updateDifficulty();
    scoreDisplay.textContent = '0';
    gameOverScreen.classList.add('hidden');
    pauseOverlay.classList.add('hidden');
    pauseBtn.classList.add('hidden');
    updateTapHint();
    loop();
}

init();
