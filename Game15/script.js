// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ─── Sound Engine (Web Audio API) ───
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function ensureAudio() {
    if (!audioCtx) audioCtx = new AudioCtx();
}
function playTone(freq, duration, type = 'square', vol = 0.12) {
    ensureAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + duration);
}
const Sound = {
    paddleHit()  { playTone(440, 0.08, 'triangle', 0.15); },
    wallHit()    { playTone(300, 0.06, 'sine', 0.1); },
    brickHit(pts){ playTone(600 + pts * 6, 0.1, 'square', 0.12); },
    powerUp()    { playTone(880, 0.15, 'sine', 0.18); playTone(1100, 0.15, 'sine', 0.14); },
    loseLife()   { playTone(200, 0.3, 'sawtooth', 0.15); },
    levelUp()    { [0,100,200,300].forEach((d,i) => setTimeout(() => playTone(660+i*110, 0.12, 'triangle', 0.14), d)); },
    gameOverSnd(){ [0,150,300].forEach((d,i) => setTimeout(() => playTone(300-i*80, 0.2, 'sawtooth', 0.13), d)); },
};

// ─── Game State ───
let gameState = 'start';
let score = 0;
let highScore = parseInt(localStorage.getItem('brickBreakerHighScore')) || 0;
let level = 1;
let lives = 3;
let combo = 0;
let maxCombo = 0;
let comboTimer = 0;
const COMBO_WINDOW = 90; // frames to keep combo alive
let screenShake = 0;
let bricksDestroyed = 0;

// ─── Game Objects ───
const BASE_PADDLE_WIDTH = 120;
let paddle = {
    x: canvas.width / 2 - 60,
    y: canvas.height - 30,
    width: BASE_PADDLE_WIDTH,
    height: 15,
    speed: 8,
    dx: 0
};

let balls = [];
function createBall(x, y, dx, dy, launched) {
    return { x, y, radius: 8, speed: 4 + (level - 1) * 0.5, dx, dy, launched, trail: [] };
}
let mainBall = createBall(canvas.width / 2, canvas.height - 50, 0, 0, false);
balls = [mainBall];

let bricks = [];
const brickRowCount = 6;
const brickColumnCount = 10;
const brickWidth = 70;
const brickHeight = 25;
const brickPadding = 5;
const brickOffsetTop = 50;
const brickOffsetLeft = 35;

// Brick colors and points
const brickColors = [
    { color: '#e74c3c', points: 50 },  // Red
    { color: '#e67e22', points: 40 },  // Orange
    { color: '#f39c12', points: 30 },  // Yellow
    { color: '#27ae60', points: 20 },  // Green
    { color: '#3498db', points: 10 },  // Blue
    { color: '#9b59b6', points: 10 }   // Purple
];

// ─── Power-Ups ───
const POWERUP_TYPES = [
    { type: 'wide',      label: '↔',  color: '#3498db', desc: 'Wide Paddle' },
    { type: 'extraLife',  label: '❤',  color: '#e74c3c', desc: 'Extra Life' },
    { type: 'multiBall',  label: '⊕',  color: '#f39c12', desc: 'Multi Ball' },
    { type: 'slow',       label: '⏳', color: '#27ae60', desc: 'Slow Ball' },
    { type: 'fireball',   label: '🔥', color: '#ff6b35', desc: 'Fire Ball' },
];
let powerUps = [];          // falling power-up items
let activePowerUps = {};    // { type: framesRemaining }
const POWERUP_DURATION = 480; // 8 seconds at 60fps
const POWERUP_DROP_CHANCE = 0.18;

// ─── Particles ───
let particles = [];
function spawnParticles(x, y, color, count = 12) {
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 3;
        particles.push({
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 30 + Math.random() * 20,
            maxLife: 50,
            color,
            size: 2 + Math.random() * 3
        });
    }
}
function spawnPowerUpParticles(x, y) {
    for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 2;
        particles.push({
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 25 + Math.random() * 15,
            maxLife: 40,
            color: `hsl(${Math.random() * 60 + 30}, 100%, 60%)`,
            size: 3 + Math.random() * 3
        });
    }
}

// ─── Floating Score Text ───
let floatingTexts = [];
function spawnFloatingText(x, y, text, color = '#fff') {
    floatingTexts.push({ x, y, text, color, life: 45, maxLife: 45 });
}

// ─── Brick Patterns per Level ───
function getBrickPattern(lvl) {
    const pattern = (lvl - 1) % 6;
    const grid = [];
    for (let r = 0; r < brickRowCount; r++) {
        grid[r] = [];
        for (let c = 0; c < brickColumnCount; c++) {
            switch (pattern) {
                case 0: // Full grid
                    grid[r][c] = 1;
                    break;
                case 1: // Checkerboard
                    grid[r][c] = (r + c) % 2 === 0 ? 1 : 0;
                    break;
                case 2: // Diamond
                    grid[r][c] = (Math.abs(r - 2.5) + Math.abs(c - 4.5)) <= 4.5 ? 1 : 0;
                    break;
                case 3: // Rows with gaps
                    grid[r][c] = (c >= 1 && c <= 8 && r !== 2 && r !== 4) ? 1 : 0;
                    break;
                case 4: // Pyramid
                    grid[r][c] = (c >= r && c < brickColumnCount - r) ? 1 : 0;
                    break;
                case 5: // Stripes
                    grid[r][c] = (c % 3 !== 0) ? 1 : 0;
                    break;
            }
        }
    }
    return grid;
}

// Input handling
let keys = {};
let mouseX = canvas.width / 2;

// Event listeners
document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('restartButton').addEventListener('click', restartGame);
document.getElementById('nextLevelButton').addEventListener('click', nextLevel);

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;

    if (e.key === ' ' && gameState === 'playing') {
        const unlaunched = balls.find(b => !b.launched);
        if (unlaunched) launchBall(unlaunched);
    }

    if (e.key === 'p' || e.key === 'P') {
        togglePause();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    mouseX = (e.clientX - rect.left) * scaleX;
});

// ─── Initialize ───
function init() {
    updateDisplay();
    createBricks();
    gameLoop();
}

// Create bricks with level pattern
function createBricks() {
    bricks = [];
    const pattern = getBrickPattern(level);
    for (let row = 0; row < brickRowCount; row++) {
        bricks[row] = [];
        for (let col = 0; col < brickColumnCount; col++) {
            const hp = level >= 5 && row <= 1 ? 2 : 1; // tough bricks in higher levels
            bricks[row][col] = {
                x: brickOffsetLeft + col * (brickWidth + brickPadding),
                y: brickOffsetTop + row * (brickHeight + brickPadding),
                status: pattern[row][col] ? hp : 0,
                color: brickColors[row].color,
                points: brickColors[row].points,
                maxHp: hp
            };
        }
    }
}

// Start game
function startGame() {
    ensureAudio();
    gameState = 'playing';
    document.getElementById('startScreen').classList.add('hidden');
    resetBalls();
}

// Restart game
function restartGame() {
    score = 0;
    level = 1;
    lives = 3;
    combo = 0;
    maxCombo = 0;
    bricksDestroyed = 0;
    activePowerUps = {};
    powerUps = [];
    particles = [];
    floatingTexts = [];
    paddle.width = BASE_PADDLE_WIDTH;
    gameState = 'playing';
    document.getElementById('gameOverScreen').classList.add('hidden');
    createBricks();
    resetBalls();
    updateDisplay();
}

// Next level
function nextLevel() {
    level++;
    activePowerUps = {};
    powerUps = [];
    paddle.width = BASE_PADDLE_WIDTH;
    gameState = 'playing';
    document.getElementById('levelCompleteScreen').classList.add('hidden');
    createBricks();
    resetBalls();
    updateDisplay();
    Sound.levelUp();
}

// Reset balls
function resetBalls() {
    mainBall = createBall(
        paddle.x + paddle.width / 2,
        paddle.y - 8,
        0, 0, false
    );
    mainBall.speed = 4 + (level - 1) * 0.5;
    balls = [mainBall];
}

// Launch ball
function launchBall(b) {
    const angle = (Math.random() * Math.PI / 3) - Math.PI / 6;
    b.dx = b.speed * Math.sin(angle);
    b.dy = -b.speed * Math.cos(angle);
    b.launched = true;
}

// Toggle pause
function togglePause() {
    if (gameState === 'playing') {
        gameState = 'paused';
        document.getElementById('pauseScreen').classList.remove('hidden');
    } else if (gameState === 'paused') {
        gameState = 'playing';
        document.getElementById('pauseScreen').classList.add('hidden');
    }
}

// Update display
function updateDisplay() {
    document.getElementById('score').textContent = score;
    document.getElementById('highScore').textContent = highScore;
    document.getElementById('level').textContent = level;

    const livesContainer = document.getElementById('lives');
    livesContainer.innerHTML = '';
    for (let i = 0; i < lives; i++) {
        const span = document.createElement('span');
        span.className = 'life';
        span.textContent = '❤️';
        livesContainer.appendChild(span);
    }

    const comboEl = document.getElementById('combo');
    if (comboEl) {
        comboEl.textContent = combo > 1 ? `x${combo}` : '';
        comboEl.className = 'stat-value' + (combo >= 5 ? ' combo-hot' : combo >= 3 ? ' combo-warm' : '');
    }
}

// ─── Power-Up Logic ───
function maybeDropPowerUp(x, y) {
    if (Math.random() < POWERUP_DROP_CHANCE) {
        const pu = POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)];
        powerUps.push({ x, y, width: 28, height: 28, vy: 2, ...pu });
    }
}

function activatePowerUp(pu) {
    Sound.powerUp();
    spawnPowerUpParticles(pu.x, pu.y);
    spawnFloatingText(pu.x, pu.y - 15, pu.desc, pu.color);

    switch (pu.type) {
        case 'wide':
            paddle.width = Math.min(200, BASE_PADDLE_WIDTH * 1.6);
            activePowerUps['wide'] = POWERUP_DURATION;
            break;
        case 'extraLife':
            lives = Math.min(lives + 1, 5);
            updateDisplay();
            break;
        case 'multiBall': {
            const existing = balls.filter(b => b.launched);
            if (existing.length > 0) {
                const src = existing[0];
                for (let i = 0; i < 2; i++) {
                    const angle = (Math.random() - 0.5) * Math.PI / 2;
                    const nb = createBall(src.x, src.y,
                        src.speed * Math.sin(angle),
                        -src.speed * Math.cos(angle),
                        true);
                    nb.speed = src.speed;
                    balls.push(nb);
                }
            }
            break;
        }
        case 'slow':
            balls.forEach(b => { b.speed = Math.max(2, b.speed * 0.6); });
            activePowerUps['slow'] = POWERUP_DURATION;
            break;
        case 'fireball':
            activePowerUps['fireball'] = POWERUP_DURATION;
            break;
    }
}

function updatePowerUpTimers() {
    for (const type in activePowerUps) {
        activePowerUps[type]--;
        if (activePowerUps[type] <= 0) {
            delete activePowerUps[type];
            if (type === 'wide') paddle.width = BASE_PADDLE_WIDTH;
            if (type === 'slow') balls.forEach(b => { b.speed = 4 + (level - 1) * 0.5; });
        }
    }
}

// ─── Update ───
function update() {
    if (gameState !== 'playing') return;

    // Combo timer
    if (combo > 0) {
        comboTimer--;
        if (comboTimer <= 0) { combo = 0; updateDisplay(); }
    }

    // Power-up timers
    updatePowerUpTimers();

    // Screen shake decay
    if (screenShake > 0) screenShake *= 0.85;
    if (screenShake < 0.5) screenShake = 0;

    // Move paddle
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
        paddle.x -= paddle.speed;
    } else if (keys['ArrowRight'] || keys['d'] || keys['D']) {
        paddle.x += paddle.speed;
    } else {
        const scaleX = canvas.width / canvas.getBoundingClientRect().width;
        paddle.x = mouseX - paddle.width / 2;
    }
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;

    // Update falling power-ups
    for (let i = powerUps.length - 1; i >= 0; i--) {
        const pu = powerUps[i];
        pu.y += pu.vy;
        if (pu.y > canvas.height) { powerUps.splice(i, 1); continue; }
        // Paddle catch
        if (pu.y + pu.height > paddle.y &&
            pu.x + pu.width > paddle.x &&
            pu.x < paddle.x + paddle.width) {
            activatePowerUp(pu);
            powerUps.splice(i, 1);
        }
    }

    // Update particles
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        p.vy += 0.05; // gravity
        p.life--;
        if (p.life <= 0) particles.splice(i, 1);
    }

    // Update floating texts
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
        const ft = floatingTexts[i];
        ft.y -= 0.8;
        ft.life--;
        if (ft.life <= 0) floatingTexts.splice(i, 1);
    }

    // Update all balls
    const ballsToRemove = [];
    for (let bi = 0; bi < balls.length; bi++) {
        const ball = balls[bi];

        if (!ball.launched) {
            ball.x = paddle.x + paddle.width / 2;
            ball.y = paddle.y - ball.radius;
            continue;
        }

        // Trail
        ball.trail.push({ x: ball.x, y: ball.y });
        if (ball.trail.length > 8) ball.trail.shift();

        ball.x += ball.dx;
        ball.y += ball.dy;

        // Wall collision
        if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
            ball.dx = -ball.dx;
            Sound.wallHit();
        }
        if (ball.y - ball.radius < 0) {
            ball.dy = -ball.dy;
            Sound.wallHit();
        }

        // Paddle collision
        if (ball.dy > 0 &&
            ball.y + ball.radius > paddle.y &&
            ball.y + ball.radius < paddle.y + paddle.height + 5 &&
            ball.x > paddle.x &&
            ball.x < paddle.x + paddle.width) {
            const hitPos = (ball.x - paddle.x) / paddle.width;
            const angle = (hitPos - 0.5) * Math.PI / 3;
            ball.dx = ball.speed * Math.sin(angle);
            ball.dy = -ball.speed * Math.cos(angle);
            Sound.paddleHit();
        }

        // Ball falls below
        if (ball.y - ball.radius > canvas.height) {
            ballsToRemove.push(bi);
        }

        // Brick collision
        for (let row = 0; row < brickRowCount; row++) {
            for (let col = 0; col < brickColumnCount; col++) {
                const brick = bricks[row][col];
                if (brick.status <= 0) continue;
                if (ball.x + ball.radius > brick.x &&
                    ball.x - ball.radius < brick.x + brickWidth &&
                    ball.y + ball.radius > brick.y &&
                    ball.y - ball.radius < brick.y + brickHeight) {

                    const isFireball = !!activePowerUps['fireball'];
                    if (!isFireball) ball.dy = -ball.dy;

                    brick.status--;
                    if (brick.status <= 0) {
                        // Combo
                        combo++;
                        comboTimer = COMBO_WINDOW;
                        if (combo > maxCombo) maxCombo = combo;
                        bricksDestroyed++;

                        const comboMult = combo >= 10 ? 4 : combo >= 5 ? 3 : combo >= 3 ? 2 : 1;
                        const points = brick.points * comboMult;
                        score += points;

                        spawnParticles(brick.x + brickWidth / 2, brick.y + brickHeight / 2, brick.color);
                        spawnFloatingText(brick.x + brickWidth / 2, brick.y,
                            `+${points}` + (comboMult > 1 ? ` x${comboMult}` : ''), brick.color);
                        Sound.brickHit(brick.points);

                        maybeDropPowerUp(brick.x + brickWidth / 2, brick.y + brickHeight / 2);
                    } else {
                        // Brick cracked but not destroyed
                        spawnParticles(brick.x + brickWidth / 2, brick.y + brickHeight / 2, brick.color, 5);
                        Sound.brickHit(brick.points);
                    }

                    if (score > highScore) {
                        highScore = score;
                        localStorage.setItem('brickBreakerHighScore', String(highScore));
                    }
                    updateDisplay();

                    if (checkLevelComplete()) {
                        levelComplete();
                        return;
                    }
                }
            }
        }
    }

    // Remove lost balls (iterate backwards)
    for (let i = ballsToRemove.length - 1; i >= 0; i--) {
        balls.splice(ballsToRemove[i], 1);
    }

    // If no balls left, lose a life
    if (balls.length === 0) {
        lives--;
        combo = 0;
        screenShake = 12;
        Sound.loseLife();
        updateDisplay();
        if (lives === 0) {
            gameOver();
        } else {
            resetBalls();
        }
    }
}

// Check if level is complete
function checkLevelComplete() {
    for (let row = 0; row < brickRowCount; row++) {
        for (let col = 0; col < brickColumnCount; col++) {
            if (bricks[row][col].status > 0) return false;
        }
    }
    return true;
}

// Level complete
function levelComplete() {
    gameState = 'levelComplete';
    document.getElementById('levelScore').textContent = score;
    document.getElementById('nextLevel').textContent = level + 1;
    document.getElementById('levelCompleteScreen').classList.remove('hidden');
    Sound.levelUp();
}

// Game over
function gameOver() {
    gameState = 'gameover';
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalLevel').textContent = level;
    document.getElementById('finalCombo').textContent = maxCombo;
    document.getElementById('finalBricks').textContent = bricksDestroyed;
    document.getElementById('gameOverScreen').classList.remove('hidden');
    Sound.gameOverSnd();
}

// ─── Draw ───
function draw() {
    ctx.save();

    // Screen shake
    if (screenShake > 0) {
        const sx = (Math.random() - 0.5) * screenShake;
        const sy = (Math.random() - 0.5) * screenShake;
        ctx.translate(sx, sy);
    }

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(-5, -5, canvas.width + 10, canvas.height + 10);

    // Draw bricks
    for (let row = 0; row < brickRowCount; row++) {
        for (let col = 0; col < brickColumnCount; col++) {
            const brick = bricks[row][col];
            if (brick.status <= 0) continue;

            ctx.fillStyle = brick.color;
            ctx.fillRect(brick.x, brick.y, brickWidth, brickHeight);

            // Shine
            const grad = ctx.createLinearGradient(brick.x, brick.y, brick.x, brick.y + brickHeight);
            grad.addColorStop(0, 'rgba(255,255,255,0.3)');
            grad.addColorStop(1, 'rgba(0,0,0,0.1)');
            ctx.fillStyle = grad;
            ctx.fillRect(brick.x, brick.y, brickWidth, brickHeight);

            // Border
            ctx.strokeStyle = 'rgba(255,255,255,0.3)';
            ctx.lineWidth = 2;
            ctx.strokeRect(brick.x, brick.y, brickWidth, brickHeight);

            // Cracked overlay for multi-hp bricks
            if (brick.maxHp > 1 && brick.status < brick.maxHp) {
                ctx.strokeStyle = 'rgba(255,255,255,0.6)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(brick.x + brickWidth * 0.3, brick.y);
                ctx.lineTo(brick.x + brickWidth * 0.5, brick.y + brickHeight * 0.5);
                ctx.lineTo(brick.x + brickWidth * 0.7, brick.y + brickHeight);
                ctx.stroke();
            }
        }
    }

    // Draw particles
    for (const p of particles) {
        const alpha = p.life / p.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }
    ctx.globalAlpha = 1;

    // Draw floating texts
    for (const ft of floatingTexts) {
        const alpha = ft.life / ft.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = ft.color;
        ctx.font = `bold ${14 + (1 - alpha) * 4}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
    }
    ctx.globalAlpha = 1;

    // Draw power-ups falling
    for (const pu of powerUps) {
        ctx.fillStyle = pu.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = pu.color;
        ctx.beginPath();
        ctx.roundRect(pu.x - pu.width / 2, pu.y, pu.width, pu.height, 6);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(pu.label, pu.x, pu.y + 20);
    }

    // Draw paddle
    const paddleGrad = ctx.createLinearGradient(paddle.x, paddle.y, paddle.x, paddle.y + paddle.height);
    if (activePowerUps['wide']) {
        paddleGrad.addColorStop(0, '#3498db');
        paddleGrad.addColorStop(1, '#2980b9');
    } else {
        paddleGrad.addColorStop(0, '#667eea');
        paddleGrad.addColorStop(1, '#764ba2');
    }
    ctx.fillStyle = paddleGrad;
    ctx.beginPath();
    ctx.roundRect(paddle.x, paddle.y, paddle.width, paddle.height, 6);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw balls
    for (const ball of balls) {
        // Trail
        for (let i = 0; i < ball.trail.length; i++) {
            const t = ball.trail[i];
            const alpha = (i / ball.trail.length) * 0.35;
            const size = ball.radius * (i / ball.trail.length) * 0.8;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = activePowerUps['fireball'] ? '#ff6b35' : '#f093fb';
            ctx.beginPath();
            ctx.arc(t.x, t.y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;

        // Ball
        const ballColor = activePowerUps['fireball'] ? '#ff6b35' : '#f093fb';
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        const bg = ctx.createRadialGradient(ball.x - 2, ball.y - 2, 0, ball.x, ball.y, ball.radius);
        bg.addColorStop(0, '#ffffff');
        bg.addColorStop(1, ballColor);
        ctx.fillStyle = bg;
        ctx.fill();

        // Glow
        ctx.shadowBlur = 20;
        ctx.shadowColor = ballColor;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    // Active power-up indicators on canvas
    const activeKeys = Object.keys(activePowerUps);
    if (activeKeys.length > 0) {
        ctx.textAlign = 'left';
        activeKeys.forEach((type, i) => {
            const pu = POWERUP_TYPES.find(p => p.type === type);
            if (!pu) return;
            const remaining = activePowerUps[type] / POWERUP_DURATION;
            ctx.fillStyle = pu.color;
            ctx.globalAlpha = 0.8;
            ctx.fillRect(10, canvas.height - 25 - i * 22, 80 * remaining, 16);
            ctx.globalAlpha = 1;
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 11px Arial';
            ctx.fillText(`${pu.label} ${pu.desc}`, 12, canvas.height - 13 - i * 22);
        });
    }

    // Launch instruction
    if (balls.some(b => !b.launched) && gameState === 'playing') {
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Press SPACE to launch!', canvas.width / 2, canvas.height / 2);
    }

    ctx.restore();
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Initialize game
init();
