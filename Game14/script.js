// Game Canvas Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game State
let gameState = 'start'; // 'start', 'playing', 'paused', 'gameOver', 'levelComplete'
let score = 0;
let highScore = localStorage.getItem('spaceInvadersHighScore') || 0;
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
    moveRight: false
};

// Bullets
let bullets = [];
const bulletSpeed = 7;
const maxBullets = 3;

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
    barrierHealth: 3
};

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
}

// Create Barriers
function createBarriers() {
    barriers = [];
    const barrierWidth = 60;
    const barrierHeight = 40;
    const numBarriers = 4;
    const spacing = (canvas.width - (numBarriers * barrierWidth)) / (numBarriers + 1);

    for (let i = 0; i < numBarriers; i++) {
        barriers.push({
            x: spacing + i * (barrierWidth + spacing),
            y: canvas.height - 150,
            width: barrierWidth,
            height: barrierHeight,
            health: config.barrierHealth
        });
    }
}

// Start Mystery Ship Timer
function startMysteryShipTimer() {
    if (mysteryShipInterval) clearInterval(mysteryShipInterval);
    
    mysteryShipInterval = setInterval(() => {
        if (gameState === 'playing' && !mysteryShip && Math.random() < 0.3) {
            mysteryShip = {
                x: -50,
                y: 40,
                width: 40,
                height: 20,
                speed: 2,
                direction: 1
            };
        }
    }, 10000);
}

// Draw Player
function drawPlayer() {
    ctx.fillStyle = '#0f0';
    ctx.font = '30px Arial';
    ctx.fillText('🚀', player.x, player.y + player.height);
}

// Draw Aliens
function drawAliens() {
    aliens.forEach(alien => {
        if (alien.alive) {
            ctx.font = '25px Arial';
            ctx.fillText(alien.type.emoji, alien.x, alien.y + alien.height);
        }
    });
}

// Draw Bullets
function drawBullets() {
    ctx.fillStyle = '#0ff';
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, 3, 15);
    });

    ctx.fillStyle = '#f0f';
    alienBullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, 3, 15);
    });
}

// Draw Barriers
function drawBarriers() {
    barriers.forEach(barrier => {
        if (barrier.health > 0) {
            const alpha = barrier.health / config.barrierHealth;
            ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
            ctx.fillRect(barrier.x, barrier.y, barrier.width, barrier.height);
            
            // Draw barrier blocks
            const blockSize = 10;
            ctx.fillStyle = `rgba(0, 150, 0, ${alpha})`;
            for (let i = 0; i < barrier.width; i += blockSize) {
                for (let j = 0; j < barrier.height; j += blockSize) {
                    if (Math.random() > 0.3) {
                        ctx.fillRect(barrier.x + i, barrier.y + j, blockSize - 1, blockSize - 1);
                    }
                }
            }
        }
    });
}

// Draw Mystery Ship
function drawMysteryShip() {
    if (mysteryShip) {
        ctx.font = '20px Arial';
        ctx.fillText('🛸', mysteryShip.x, mysteryShip.y + mysteryShip.height);
    }
}

// Update Player
function updatePlayer() {
    if (player.moveLeft && player.x > 0) {
        player.x -= player.speed;
    }
    if (player.moveRight && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
}

// Update Bullets
function updateBullets() {
    // Player bullets
    bullets = bullets.filter(bullet => {
        bullet.y -= bulletSpeed;
        return bullet.y > 0;
    });

    // Alien bullets
    alienBullets = alienBullets.filter(bullet => {
        bullet.y += bulletSpeed * 0.8;
        return bullet.y < canvas.height;
    });
}

// Update Aliens
function updateAliens() {
    let shouldDrop = false;
    const aliveAliens = aliens.filter(a => a.alive);

    // Move aliens
    aliveAliens.forEach(alien => {
        alien.x += alienSpeed * alienDirection;
        
        // Check boundaries
        if (alien.x <= 0 || alien.x >= canvas.width - alien.width) {
            shouldDrop = true;
        }

        // Animation frame
        alien.frame = (alien.frame + 1) % 60;
    });

    // Drop and reverse direction
    if (shouldDrop) {
        alienDirection *= -1;
        aliveAliens.forEach(alien => {
            alien.y += alienDropDistance;
        });
    }

    // Alien shooting
    if (Date.now() - lastAlienShot > alienShootInterval && aliveAliens.length > 0) {
        const shooter = aliveAliens[Math.floor(Math.random() * aliveAliens.length)];
        alienBullets.push({
            x: shooter.x + shooter.width / 2,
            y: shooter.y + shooter.height
        });
        lastAlienShot = Date.now();
    }

    // Increase speed as aliens decrease
    const speedMultiplier = 1 + (1 - aliveAliens.length / (alienRows * alienCols)) * 0.5;
    alienSpeed = (1 + level * 0.2) * speedMultiplier;
}

// Update Mystery Ship
function updateMysteryShip() {
    if (mysteryShip) {
        mysteryShip.x += mysteryShip.speed * mysteryShip.direction;
        
        if (mysteryShip.x > canvas.width || mysteryShip.x < -mysteryShip.width) {
            mysteryShip = null;
        }
    }
}

// Check Collisions
function checkCollisions() {
    // Player bullets hit aliens
    bullets.forEach((bullet, bulletIndex) => {
        aliens.forEach(alien => {
            if (alien.alive && 
                bullet.x > alien.x && 
                bullet.x < alien.x + alien.width &&
                bullet.y > alien.y && 
                bullet.y < alien.y + alien.height) {
                
                alien.alive = false;
                bullets.splice(bulletIndex, 1);
                score += alien.type.points;
                createExplosion(alien.x + alien.width / 2, alien.y + alien.height / 2);
            }
        });

        // Bullets hit mystery ship
        if (mysteryShip && 
            bullet.x > mysteryShip.x && 
            bullet.x < mysteryShip.x + mysteryShip.width &&
            bullet.y > mysteryShip.y && 
            bullet.y < mysteryShip.y + mysteryShip.height) {
            
            score += config.mysteryShipPoints;
            createExplosion(mysteryShip.x + mysteryShip.width / 2, mysteryShip.y + mysteryShip.height / 2);
            mysteryShip = null;
            bullets.splice(bulletIndex, 1);
        }

        // Bullets hit barriers
        barriers.forEach(barrier => {
            if (barrier.health > 0 &&
                bullet.x > barrier.x && 
                bullet.x < barrier.x + barrier.width &&
                bullet.y > barrier.y && 
                bullet.y < barrier.y + barrier.height) {
                
                barrier.health--;
                bullets.splice(bulletIndex, 1);
            }
        });
    });

    // Alien bullets hit player
    alienBullets.forEach((bullet, bulletIndex) => {
        if (bullet.x > player.x && 
            bullet.x < player.x + player.width &&
            bullet.y > player.y && 
            bullet.y < player.y + player.height) {
            
            alienBullets.splice(bulletIndex, 1);
            loseLife();
        }

        // Alien bullets hit barriers
        barriers.forEach(barrier => {
            if (barrier.health > 0 &&
                bullet.x > barrier.x && 
                bullet.x < barrier.x + barrier.width &&
                bullet.y > barrier.y && 
                bullet.y < barrier.y + barrier.height) {
                
                barrier.health--;
                alienBullets.splice(bulletIndex, 1);
            }
        });
    });

    // Aliens hit player
    aliens.forEach(alien => {
        if (alien.alive && 
            alien.y + alien.height > player.y) {
            gameOver();
        }
    });
}

// Create Explosion Effect
function createExplosion(x, y) {
    ctx.fillStyle = '#ff0';
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fill();
}

// Shoot Bullet
function shoot() {
    if (bullets.length < maxBullets) {
        bullets.push({
            x: player.x + player.width / 2,
            y: player.y
        });
    }
}

// Lose Life
function loseLife() {
    lives--;
    updateLivesDisplay();
    
    if (lives <= 0) {
        gameOver();
    } else {
        // Reset player position
        player.x = canvas.width / 2 - 20;
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
    createAliens();
    createBarriers();
    alienShootInterval = Math.max(500, 1000 - level * 50);
    
    gameState = 'playing';
}

// Game Over
function gameOver() {
    gameState = 'gameOver';
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalLevel').textContent = level;
    document.getElementById('gameOverScreen').classList.remove('hidden');
    
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('spaceInvadersHighScore', highScore);
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

    // Draw stars
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 50; i++) {
        const x = (i * 137) % canvas.width;
        const y = (i * 197) % canvas.height;
        ctx.fillRect(x, y, 1, 1);
    }

    // Draw game elements
    drawBarriers();
    drawPlayer();
    drawAliens();
    drawBullets();
    drawMysteryShip();

    // Draw game info
    updateScore();
}

// Game Loop
function gameLoop() {
    if (gameState === 'playing') {
        updatePlayer();
        updateBullets();
        updateAliens();
        updateMysteryShip();
        checkCollisions();
        checkLevelComplete();
        draw();
        animationId = requestAnimationFrame(gameLoop);
    }
}

// Start Game
function startGame() {
    document.getElementById('startScreen').classList.add('hidden');
    gameState = 'playing';
    score = 0;
    level = 1;
    lives = 3;
    
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
    updateLivesDisplay();
    
    bullets = [];
    alienBullets = [];
    createAliens();
    createBarriers();
    
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
        document.getElementById('pauseScreen').classList.remove('hidden');
    } else if (gameState === 'paused') {
        gameState = 'playing';
        document.getElementById('pauseScreen').classList.add('hidden');
        gameLoop();
    }
}

// Event Listeners
document.addEventListener('keydown', (e) => {
    if (gameState !== 'playing' && gameState !== 'paused') return;

    switch(e.key) {
        case 'ArrowLeft':
            player.moveLeft = true;
            e.preventDefault();
            break;
        case 'ArrowRight':
            player.moveRight = true;
            e.preventDefault();
            break;
        case ' ':
            if (gameState === 'playing') {
                shoot();
            }
            e.preventDefault();
            break;
        case 'p':
        case 'P':
            togglePause();
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
});

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
}, { passive: false });

canvas.addEventListener('touchend', () => {
    player.moveLeft = false;
    player.moveRight = false;
});

// Initialize
init();
