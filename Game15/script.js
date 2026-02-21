// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
let gameState = 'start'; // start, playing, paused, gameover, levelComplete
let score = 0;
let highScore = localStorage.getItem('brickBreakerHighScore') || 0;
let level = 1;
let lives = 3;

// Game objects
let paddle = {
    x: canvas.width / 2 - 60,
    y: canvas.height - 30,
    width: 120,
    height: 15,
    speed: 8,
    dx: 0
};

let ball = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    radius: 8,
    speed: 4,
    dx: 0,
    dy: 0,
    launched: false
};

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

// Input handling
let keys = {};
let mouseX = canvas.width / 2;

// Event listeners
document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('restartButton').addEventListener('click', restartGame);
document.getElementById('nextLevelButton').addEventListener('click', nextLevel);

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    
    if (e.key === ' ' && gameState === 'playing' && !ball.launched) {
        launchBall();
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
    mouseX = e.clientX - rect.left;
});

// Initialize game
function init() {
    updateDisplay();
    createBricks();
    gameLoop();
}

// Create bricks
function createBricks() {
    bricks = [];
    for (let row = 0; row < brickRowCount; row++) {
        bricks[row] = [];
        for (let col = 0; col < brickColumnCount; col++) {
            bricks[row][col] = {
                x: brickOffsetLeft + col * (brickWidth + brickPadding),
                y: brickOffsetTop + row * (brickHeight + brickPadding),
                status: 1,
                color: brickColors[row].color,
                points: brickColors[row].points
            };
        }
    }
}

// Start game
function startGame() {
    gameState = 'playing';
    document.getElementById('startScreen').classList.add('hidden');
    resetBall();
}

// Restart game
function restartGame() {
    score = 0;
    level = 1;
    lives = 3;
    gameState = 'playing';
    document.getElementById('gameOverScreen').classList.add('hidden');
    createBricks();
    resetBall();
    updateDisplay();
}

// Next level
function nextLevel() {
    level++;
    ball.speed += 0.5; // Increase difficulty
    gameState = 'playing';
    document.getElementById('levelCompleteScreen').classList.add('hidden');
    createBricks();
    resetBall();
    updateDisplay();
}

// Reset ball
function resetBall() {
    ball.x = paddle.x + paddle.width / 2;
    ball.y = paddle.y - ball.radius;
    ball.dx = 0;
    ball.dy = 0;
    ball.launched = false;
}

// Launch ball
function launchBall() {
    const angle = (Math.random() * Math.PI / 3) - Math.PI / 6; // Random angle between -30 and 30 degrees
    ball.dx = ball.speed * Math.sin(angle);
    ball.dy = -ball.speed * Math.cos(angle);
    ball.launched = true;
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
        livesContainer.innerHTML += '<span class="life">❤️</span>';
    }
}

// Update game
function update() {
    if (gameState !== 'playing') return;
    
    // Move paddle with keyboard
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
        paddle.x -= paddle.speed;
    } else if (keys['ArrowRight'] || keys['d'] || keys['D']) {
        paddle.x += paddle.speed;
    } else {
        // Move paddle with mouse (only when no keyboard input)
        const targetX = mouseX - paddle.width / 2;
        paddle.x = targetX;
    }
    
    // Paddle boundaries
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
    
    // Update ball position
    if (ball.launched) {
        ball.x += ball.dx;
        ball.y += ball.dy;
        
        // Ball collision with walls
        if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
            ball.dx = -ball.dx;
        }
        
        if (ball.y - ball.radius < 0) {
            ball.dy = -ball.dy;
        }
        
        // Ball collision with paddle
        if (ball.y + ball.radius > paddle.y &&
            ball.x > paddle.x &&
            ball.x < paddle.x + paddle.width) {
            
            // Calculate bounce angle based on where ball hits paddle
            const hitPos = (ball.x - paddle.x) / paddle.width;
            const angle = (hitPos - 0.5) * Math.PI / 3; // -60 to 60 degrees
            
            ball.dx = ball.speed * Math.sin(angle);
            ball.dy = -ball.speed * Math.cos(angle);
        }
        
        // Ball falls below paddle
        if (ball.y - ball.radius > canvas.height) {
            lives--;
            updateDisplay();
            
            if (lives === 0) {
                gameOver();
            } else {
                resetBall();
            }
        }
        
        // Ball collision with bricks
        for (let row = 0; row < brickRowCount; row++) {
            for (let col = 0; col < brickColumnCount; col++) {
                const brick = bricks[row][col];
                if (brick.status === 1) {
                    if (ball.x > brick.x &&
                        ball.x < brick.x + brickWidth &&
                        ball.y > brick.y &&
                        ball.y < brick.y + brickHeight) {
                        
                        ball.dy = -ball.dy;
                        brick.status = 0;
                        score += brick.points;
                        updateDisplay();
                        
                        // Check if high score
                        if (score > highScore) {
                            highScore = score;
                            localStorage.setItem('brickBreakerHighScore', highScore);
                            updateDisplay();
                        }
                        
                        // Check if all bricks are destroyed
                        if (checkLevelComplete()) {
                            levelComplete();
                        }
                    }
                }
            }
        }
    } else {
        // Ball follows paddle before launch
        ball.x = paddle.x + paddle.width / 2;
        ball.y = paddle.y - ball.radius;
    }
}

// Check if level is complete
function checkLevelComplete() {
    for (let row = 0; row < brickRowCount; row++) {
        for (let col = 0; col < brickColumnCount; col++) {
            if (bricks[row][col].status === 1) {
                return false;
            }
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
}

// Game over
function gameOver() {
    gameState = 'gameover';
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalLevel').textContent = level;
    document.getElementById('gameOverScreen').classList.remove('hidden');
}

// Draw game
function draw() {
    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw bricks
    for (let row = 0; row < brickRowCount; row++) {
        for (let col = 0; col < brickColumnCount; col++) {
            const brick = bricks[row][col];
            if (brick.status === 1) {
                ctx.fillStyle = brick.color;
                ctx.fillRect(brick.x, brick.y, brickWidth, brickHeight);
                
                // Brick border
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.lineWidth = 2;
                ctx.strokeRect(brick.x, brick.y, brickWidth, brickHeight);
                
                // Brick shine effect
                const gradient = ctx.createLinearGradient(brick.x, brick.y, brick.x, brick.y + brickHeight);
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
                ctx.fillStyle = gradient;
                ctx.fillRect(brick.x, brick.y, brickWidth, brickHeight);
            }
        }
    }
    
    // Draw paddle
    const paddleGradient = ctx.createLinearGradient(paddle.x, paddle.y, paddle.x, paddle.y + paddle.height);
    paddleGradient.addColorStop(0, '#667eea');
    paddleGradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = paddleGradient;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    
    // Paddle border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
    
    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    const ballGradient = ctx.createRadialGradient(ball.x - 2, ball.y - 2, 0, ball.x, ball.y, ball.radius);
    ballGradient.addColorStop(0, '#ffffff');
    ballGradient.addColorStop(1, '#f093fb');
    ctx.fillStyle = ballGradient;
    ctx.fill();
    ctx.closePath();
    
    // Ball glow effect
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#f093fb';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.shadowBlur = 0;
    
    // Draw launch instruction
    if (!ball.launched && gameState === 'playing') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Press SPACE to launch!', canvas.width / 2, canvas.height / 2);
    }
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Initialize game
init();
