// Game Canvas Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game State
let gameState = 'start'; // 'start', 'playing', 'paused', 'gameOver', 'levelComplete'
let score = 0;
let highScore = parseInt(localStorage.getItem('spaceInvadersHighScore')) || 0;
let level = 1;
let lives = 3;
let animationId = null;

// Player Ship
const player = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 60,
    width: 40,
    height: 30,
    speed: 5,
    moveLeft: false,
    moveRight: false,
    shooting: false,
    invulnerable: false,
    invulnerableTimer: 0
};

// Bullets
let bullets = [];
const bulletSpeed = 7;
const bulletWidth = 4;
const bulletHeight = 15;
const maxBullets = 3;
let lastShotTime = 0;
const shootCooldown = 200; // ms between shots

// Aliens
let aliens = [];
let alienBullets = [];
const alienRows = 5;
const alienCols = 11;
let alienSpeed = 1;
let alienDirection = 1;
let alienDropDistance = 20;
let alienShootInterval = 1000;
let lastAlienShot = Date.now();

// Mystery Ship
let mysteryShip = null;
let mysteryShipInterval = null;

// Barriers
let barriers = [];

// Explosions - persistent particle system
let explosions = [];

// Floating score text
let floatingTexts = [];

// Game Configuration
const config = {
    alienTypes: [
        { points: 30, color: '#ff0', emoji: '👽' },
        { points: 20, color: '#0ff', emoji: '🛸' },
        { points: 20, color: '#0ff', emoji: '🛸' },
        { points: 10, color: '#0f0', emoji: '👾' },
        { points: 10, color: '#0f0', emoji: '👾' }
    ],
    mysteryShipPoints: 100,
    barrierHealth: 4
};

// Pre-generate star positions (avoid recalculating each frame)
const stars = [];
for (let i = 0; i < 80; i++) {
    stars.push({
        x: (i * 137 + Math.random() * 50) % canvas.width,
        y: (i * 197 + Math.random() * 50) % canvas.height,
        size: Math.random() < 0.3 ? 2 : 1,
        twinkleSpeed: 0.02 + Math.random() * 0.03,
        twinkleOffset: Math.random() * Math.PI * 2
    });
}
let frameCount = 0;

// Initialize Game
function init() {
    updateHighScore();
    createAliens();
    createBarriers();
    startMysteryShipTimer();
}

// Create Aliens
function createAliens() {
    aliens = [];
    const startX = 80;
    const startY = 80;
    const spacingX = 50;
    const spacingY = 45;

    for (let row = 0; row < alienRows; row++) {
        for (let col = 0; col < alienCols; col++) {
            aliens.push({
                x: startX + col * spacingX,
                y: startY + row * spacingY,
                width: 30,
                height: 25,
                type: config.alienTypes[row],
                alive: true,
                frame: 0
            });
        }
    }
    alienDirection = 1;
}

// Create Barriers with pre-generated block pattern (fixes flickering)
function createBarriers() {
    barriers = [];
    const barrierWidth = 60;
    const barrierHeight = 40;
    const numBarriers = 4;
    const spacing = (canvas.width - (numBarriers * barrierWidth)) / (numBarriers + 1);
    const blockSize = 10;

    for (let i = 0; i < numBarriers; i++) {
        // Pre-generate the block pattern once
        const blocks = [];
        for (let bx = 0; bx < barrierWidth / blockSize; bx++) {
            for (let by = 0; by < barrierHeight / blockSize; by++) {
                if (Math.random() > 0.15) {
                    blocks.push({ bx, by });
                }
            }
        }
        barriers.push({
            x: spacing + i * (barrierWidth + spacing),
            y: canvas.height - 150,
            width: barrierWidth,
            height: barrierHeight,
            health: config.barrierHealth,
            blocks: blocks,
            blockSize: blockSize
        });
    }
}

// Start Mystery Ship Timer
function startMysteryShipTimer() {
    if (mysteryShipInterval) clearInterval(mysteryShipInterval);

    mysteryShipInterval = setInterval(() => {
        if (gameState === 'playing' && !mysteryShip && Math.random() < 0.3) {
            // Randomly spawn from left or right
            const fromLeft = Math.random() < 0.5;
            mysteryShip = {
                x: fromLeft ? -50 : canvas.width + 10,
                y: 40,
                width: 40,
                height: 20,
                speed: 2,
                direction: fromLeft ? 1 : -1
            };
        }
    }, 10000);
}

// Draw Player
function drawPlayer() {
    if (player.invulnerable && Math.floor(frameCount / 5) % 2 === 0) {
        return; // Blink effect during invulnerability
    }
    ctx.font = '30px Arial';
    ctx.fillText('🚀', player.x, player.y + player.height);
}

// Draw Aliens with subtle animation
function drawAliens() {
    aliens.forEach(alien => {
        if (alien.alive) {
            const wobble = Math.sin(frameCount * 0.05 + alien.x * 0.01) * 2;
            ctx.font = '25px Arial';
            ctx.fillText(alien.type.emoji, alien.x, alien.y + alien.height + wobble);
        }
    });
}

// Draw Bullets with glow effect
function drawBullets() {
    // Player bullets - cyan with glow
    bullets.forEach(bullet => {
        ctx.shadowColor = '#0ff';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#0ff';
        ctx.fillRect(bullet.x - bulletWidth / 2, bullet.y, bulletWidth, bulletHeight);
        ctx.shadowBlur = 0;
    });

    // Alien bullets - magenta with glow
    alienBullets.forEach(bullet => {
        ctx.shadowColor = '#f0f';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#f0f';
        ctx.fillRect(bullet.x - bulletWidth / 2, bullet.y, bulletWidth, bulletHeight);
        ctx.shadowBlur = 0;
    });
}

// Draw Barriers (stable, no flickering)
function drawBarriers() {
    barriers.forEach(barrier => {
        if (barrier.health > 0) {
            const alpha = barrier.health / config.barrierHealth;
            const bs = barrier.blockSize;

            // Draw base
            ctx.fillStyle = `rgba(0, 255, 0, ${alpha * 0.4})`;
            ctx.fillRect(barrier.x, barrier.y, barrier.width, barrier.height);

            // Draw pre-generated blocks (no random per frame)
            ctx.fillStyle = `rgba(0, 200, 0, ${alpha})`;
            barrier.blocks.forEach(block => {
                ctx.fillRect(
                    barrier.x + block.bx * bs,
                    barrier.y + block.by * bs,
                    bs - 1, bs - 1
                );
            });

            // Border glow based on health
            ctx.strokeStyle = `rgba(0, 255, 0, ${alpha * 0.6})`;
            ctx.lineWidth = 1;
            ctx.strokeRect(barrier.x, barrier.y, barrier.width, barrier.height);
        }
    });
}

// Draw Mystery Ship with animated glow
function drawMysteryShip() {
    if (mysteryShip) {
        ctx.shadowColor = '#f00';
        ctx.shadowBlur = 15 + Math.sin(frameCount * 0.1) * 5;
        ctx.font = '25px Arial';
        ctx.fillText('🛸', mysteryShip.x, mysteryShip.y + mysteryShip.height);
        ctx.shadowBlur = 0;

        // Draw point value above
        ctx.fillStyle = '#ff0';
        ctx.font = '12px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('100', mysteryShip.x + mysteryShip.width / 2, mysteryShip.y - 5);
        ctx.textAlign = 'left';
    }
}

// Draw Explosions (persistent particle system)
function drawExplosions() {
    explosions = explosions.filter(exp => {
        exp.life -= 0.03;
        if (exp.life <= 0) return false;

        exp.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.05; // gravity
            const size = p.size * exp.life;
            ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${exp.life})`;
            ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
        });

        return true;
    });
}

// Draw Floating Score Texts
function drawFloatingTexts() {
    floatingTexts = floatingTexts.filter(ft => {
        ft.y -= 1;
        ft.life -= 0.02;
        if (ft.life <= 0) return false;

        ctx.fillStyle = `rgba(255, 255, 0, ${ft.life})`;
        ctx.font = 'bold 16px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText(`+${ft.points}`, ft.x, ft.y);
        ctx.textAlign = 'left';
        return true;
    });
}

// Create Explosion Effect (particle system)
function createExplosion(x, y, color) {
    const particles = [];
    const colors = color === 'mystery'
        ? [{ r: 255, g: 50, b: 50 }, { r: 255, g: 150, b: 0 }, { r: 255, g: 255, b: 0 }]
        : [{ r: 255, g: 255, b: 0 }, { r: 255, g: 150, b: 0 }, { r: 0, g: 255, b: 255 }];

    const count = color === 'mystery' ? 20 : 12;
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 / count) * i + Math.random() * 0.5;
        const speed = 1 + Math.random() * 2.5;
        const c = colors[Math.floor(Math.random() * colors.length)];
        particles.push({
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: 2 + Math.random() * 3,
            r: c.r, g: c.g, b: c.b
        });
    }
    explosions.push({ particles, life: 1.0 });
}

// Create Floating Score Text
function createFloatingText(x, y, points) {
    floatingTexts.push({ x, y, points, life: 1.0 });
}

// Update Player
function updatePlayer() {
    if (player.moveLeft && player.x > 0) {
        player.x -= player.speed;
    }
    if (player.moveRight && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
    // Continuous firing while holding space
    if (player.shooting) {
        shoot();
    }
    // Invulnerability timer
    if (player.invulnerable) {
        player.invulnerableTimer -= 16; // approx frame time
        if (player.invulnerableTimer <= 0) {
            player.invulnerable = false;
        }
    }
}

// Update Bullets
function updateBullets() {
    // Player bullets
    bullets = bullets.filter(bullet => {
        bullet.y -= bulletSpeed;
        return bullet.y > -bulletHeight;
    });

    // Alien bullets
    alienBullets = alienBullets.filter(bullet => {
        bullet.y += bulletSpeed * 0.8;
        return bullet.y < canvas.height;
    });
}

// Update Aliens (fixed: check boundaries before moving to prevent jitter)
function updateAliens() {
    const aliveAliens = aliens.filter(a => a.alive);
    if (aliveAliens.length === 0) return;

    // Find the leftmost and rightmost alive aliens
    let minX = Infinity, maxX = -Infinity;
    aliveAliens.forEach(alien => {
        if (alien.x < minX) minX = alien.x;
        if (alien.x + alien.width > maxX) maxX = alien.x + alien.width;
    });

    // Check if the next move would go out of bounds
    const nextMinX = minX + alienSpeed * alienDirection;
    const nextMaxX = maxX + alienSpeed * alienDirection;

    if (nextMinX <= 0 || nextMaxX >= canvas.width) {
        // Reverse direction and drop
        alienDirection *= -1;
        aliveAliens.forEach(alien => {
            alien.y += alienDropDistance;
        });
    }

    // Move aliens
    aliveAliens.forEach(alien => {
        alien.x += alienSpeed * alienDirection;
        alien.frame = (alien.frame + 1) % 60;
    });

    // Alien shooting
    if (Date.now() - lastAlienShot > alienShootInterval && aliveAliens.length > 0) {
        // Prefer bottom-row aliens for shooting (more realistic)
        const bottomAliens = getBottomRowAliens(aliveAliens);
        const shooter = bottomAliens[Math.floor(Math.random() * bottomAliens.length)];
        alienBullets.push({
            x: shooter.x + shooter.width / 2,
            y: shooter.y + shooter.height
        });
        lastAlienShot = Date.now();
    }

    // Increase speed as aliens decrease
    const speedMultiplier = 1 + (1 - aliveAliens.length / (alienRows * alienCols)) * 1.5;
    alienSpeed = (0.8 + level * 0.15) * speedMultiplier;
}

// Get bottom-most alien in each column (for smarter shooting)
function getBottomRowAliens(aliveAliens) {
    const columns = {};
    aliveAliens.forEach(alien => {
        const col = Math.round(alien.x);
        if (!columns[col] || alien.y > columns[col].y) {
            columns[col] = alien;
        }
    });
    return Object.values(columns);
}

// Update Mystery Ship
function updateMysteryShip() {
    if (mysteryShip) {
        mysteryShip.x += mysteryShip.speed * mysteryShip.direction;

        if (mysteryShip.x > canvas.width + 10 || mysteryShip.x < -mysteryShip.width - 10) {
            mysteryShip = null;
        }
    }
}

// Check Collisions (fixed: no splice inside forEach, uses filter for clean removal)
function checkCollisions() {
    const bulletsToRemove = new Set();
    const alienBulletsToRemove = new Set();

    // Player bullets hit aliens
    for (let bi = 0; bi < bullets.length; bi++) {
        const bullet = bullets[bi];
        if (bulletsToRemove.has(bi)) continue;

        for (let ai = 0; ai < aliens.length; ai++) {
            const alien = aliens[ai];
            if (!alien.alive) continue;

            if (bullet.x + bulletWidth / 2 > alien.x &&
                bullet.x - bulletWidth / 2 < alien.x + alien.width &&
                bullet.y > alien.y &&
                bullet.y < alien.y + alien.height) {

                alien.alive = false;
                bulletsToRemove.add(bi);
                score += alien.type.points;
                createExplosion(alien.x + alien.width / 2, alien.y + alien.height / 2);
                createFloatingText(alien.x + alien.width / 2, alien.y, alien.type.points);
                break;
            }
        }

        if (bulletsToRemove.has(bi)) continue;

        // Bullets hit mystery ship
        if (mysteryShip &&
            bullet.x + bulletWidth / 2 > mysteryShip.x &&
            bullet.x - bulletWidth / 2 < mysteryShip.x + mysteryShip.width &&
            bullet.y > mysteryShip.y &&
            bullet.y < mysteryShip.y + mysteryShip.height) {

            score += config.mysteryShipPoints;
            createExplosion(mysteryShip.x + mysteryShip.width / 2, mysteryShip.y + mysteryShip.height / 2, 'mystery');
            createFloatingText(mysteryShip.x + mysteryShip.width / 2, mysteryShip.y, config.mysteryShipPoints);
            mysteryShip = null;
            bulletsToRemove.add(bi);
            continue;
        }

        // Bullets hit barriers
        for (let j = 0; j < barriers.length; j++) {
            const barrier = barriers[j];
            if (barrier.health > 0 &&
                bullet.x + bulletWidth / 2 > barrier.x &&
                bullet.x - bulletWidth / 2 < barrier.x + barrier.width &&
                bullet.y > barrier.y &&
                bullet.y < barrier.y + barrier.height) {

                barrier.health--;
                bulletsToRemove.add(bi);
                break;
            }
        }
    }

    // Alien bullets hit player
    for (let bi = 0; bi < alienBullets.length; bi++) {
        const bullet = alienBullets[bi];
        if (alienBulletsToRemove.has(bi)) continue;

        if (!player.invulnerable &&
            bullet.x + bulletWidth / 2 > player.x &&
            bullet.x - bulletWidth / 2 < player.x + player.width &&
            bullet.y + bulletHeight > player.y &&
            bullet.y < player.y + player.height) {

            alienBulletsToRemove.add(bi);
            loseLife();
            continue;
        }

        // Alien bullets hit barriers
        for (let j = 0; j < barriers.length; j++) {
            const barrier = barriers[j];
            if (barrier.health > 0 &&
                bullet.x + bulletWidth / 2 > barrier.x &&
                bullet.x - bulletWidth / 2 < barrier.x + barrier.width &&
                bullet.y + bulletHeight > barrier.y &&
                bullet.y < barrier.y + barrier.height) {

                barrier.health--;
                alienBulletsToRemove.add(bi);
                break;
            }
        }
    }

    // Remove marked bullets (safe, no index shifting issues)
    bullets = bullets.filter((_, i) => !bulletsToRemove.has(i));
    alienBullets = alienBullets.filter((_, i) => !alienBulletsToRemove.has(i));

    // Aliens reach player line = game over
    aliens.forEach(alien => {
        if (alien.alive && alien.y + alien.height >= player.y) {
            gameOver();
        }
    });
}

// Shoot Bullet
function shoot() {
    const now = Date.now();
    if (bullets.length < maxBullets && now - lastShotTime > shootCooldown) {
        bullets.push({
            x: player.x + player.width / 2,
            y: player.y
        });
        lastShotTime = now;
    }
}

// Lose Life
function loseLife() {
    lives--;
    createExplosion(player.x + player.width / 2, player.y + player.height / 2);
    updateLivesDisplay();

    if (lives <= 0) {
        gameOver();
    } else {
        // Brief invulnerability
        player.x = canvas.width / 2 - 20;
        player.invulnerable = true;
        player.invulnerableTimer = 1500;
        bullets = [];
        alienBullets = [];
    }
}

// Check Level Complete
function checkLevelComplete() {
    const aliveAliens = aliens.filter(a => a.alive);
    if (aliveAliens.length === 0) {
        levelComplete();
    }
}

// Level Complete
function levelComplete() {
    gameState = 'levelComplete';
    cancelAnimationFrame(animationId);
    document.getElementById('levelScore').textContent = score;
    document.getElementById('nextLevel').textContent = level + 1;
    document.getElementById('levelCompleteScreen').classList.remove('hidden');
}

// Next Level
function nextLevel() {
    level++;
    document.getElementById('level').textContent = level;
    document.getElementById('levelCompleteScreen').classList.add('hidden');

    // Reset game elements
    bullets = [];
    alienBullets = [];
    explosions = [];
    floatingTexts = [];
    createAliens();
    createBarriers();
    alienShootInterval = Math.max(400, 1000 - level * 60);

    gameState = 'playing';
    gameLoop();
}

// Game Over
function gameOver() {
    if (gameState === 'gameOver') return; // prevent double-trigger
    gameState = 'gameOver';
    cancelAnimationFrame(animationId);

    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalLevel').textContent = level;
    document.getElementById('gameOverScreen').classList.remove('hidden');

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('spaceInvadersHighScore', String(highScore));
        updateHighScore();
    }

    if (mysteryShipInterval) {
        clearInterval(mysteryShipInterval);
    }
}

// Update Score Display
function updateScore() {
    document.getElementById('score').textContent = score;
}

// Update High Score Display
function updateHighScore() {
    document.getElementById('highScore').textContent = highScore;
}

// Update Lives Display
function updateLivesDisplay() {
    const livesContainer = document.getElementById('lives');
    const lifeElements = livesContainer.querySelectorAll('.life');

    lifeElements.forEach((life, index) => {
        if (index >= lives) {
            life.classList.add('lost');
        } else {
            life.classList.remove('lost');
        }
    });
}

// Draw Game
function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw twinkling stars
    stars.forEach(star => {
        const brightness = 0.4 + 0.6 * Math.abs(Math.sin(frameCount * star.twinkleSpeed + star.twinkleOffset));
        ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
        ctx.fillRect(star.x, star.y, star.size, star.size);
    });

    // Draw game elements
    drawBarriers();
    drawPlayer();
    drawAliens();
    drawBullets();
    drawMysteryShip();
    drawExplosions();
    drawFloatingTexts();

    // Update score
    updateScore();
}

// Game Loop
function gameLoop() {
    if (gameState !== 'playing') return;

    frameCount++;
    updatePlayer();
    updateBullets();
    updateAliens();
    updateMysteryShip();
    checkCollisions();
    checkLevelComplete();
    draw();
    animationId = requestAnimationFrame(gameLoop);
}

// Start Game
function startGame() {
    // Cancel any existing loop
    if (animationId) cancelAnimationFrame(animationId);

    document.getElementById('startScreen').classList.add('hidden');
    gameState = 'playing';
    score = 0;
    level = 1;
    lives = 3;
    frameCount = 0;
    explosions = [];
    floatingTexts = [];

    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
    updateLivesDisplay();

    player.x = canvas.width / 2 - 20;
    player.invulnerable = false;
    player.shooting = false;
    bullets = [];
    alienBullets = [];
    createAliens();
    createBarriers();
    startMysteryShipTimer();

    gameLoop();
}

// Restart Game
function restartGame() {
    document.getElementById('gameOverScreen').classList.add('hidden');
    startGame();
}

// Toggle Pause
function togglePause() {
    if (gameState === 'playing') {
        gameState = 'paused';
        cancelAnimationFrame(animationId);
        document.getElementById('pauseScreen').classList.remove('hidden');
    } else if (gameState === 'paused') {
        gameState = 'playing';
        document.getElementById('pauseScreen').classList.add('hidden');
        gameLoop();
    }
}

// Event Listeners
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowLeft':
            if (gameState === 'playing') player.moveLeft = true;
            e.preventDefault();
            break;
        case 'ArrowRight':
            if (gameState === 'playing') player.moveRight = true;
            e.preventDefault();
            break;
        case ' ':
            if (gameState === 'playing') player.shooting = true;
            e.preventDefault();
            break;
        case 'p':
        case 'P':
            if (gameState === 'playing' || gameState === 'paused') togglePause();
            e.preventDefault();
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch(e.key) {
        case 'ArrowLeft':
            player.moveLeft = false;
            break;
        case 'ArrowRight':
            player.moveRight = false;
            break;
        case ' ':
            player.shooting = false;
            break;
    }
});

// Button Event Listeners
document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('restartButton').addEventListener('click', restartGame);
document.getElementById('nextLevelButton').addEventListener('click', nextLevel);

// Touch Controls for Mobile
let touchStartX = 0;
canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    if (gameState === 'playing') {
        shoot();
    }
    e.preventDefault();
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touchX = e.touches[0].clientX;
    const diff = touchX - touchStartX;

    if (diff < -10) {
        player.moveLeft = true;
        player.moveRight = false;
    } else if (diff > 10) {
        player.moveRight = true;
        player.moveLeft = false;
    }
    touchStartX = touchX; // Update for continuous tracking
}, { passive: false });

canvas.addEventListener('touchend', () => {
    player.moveLeft = false;
    player.moveRight = false;
});

// Initialize
init();
