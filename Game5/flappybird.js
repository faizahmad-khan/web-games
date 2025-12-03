const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over');
const scoreDisplay = document.getElementById('score');
const finalScoreDisplay = document.getElementById('final-score');
const highScoreDisplay = document.getElementById('high-score-value');
const gameOverHighScoreDisplay = document.getElementById('game-over-high-score');

// Game variables
let gameRunning = false;
let score = 0;
let highScore = 0;
let frames = 0;

// Load high score from localStorage
highScore = localStorage.getItem('flappyHighScore') || 0;
highScoreDisplay.textContent = highScore;
gameOverHighScoreDisplay.textContent = highScore;

// Bird properties
const birdImg = new Image();
birdImg.src = 'assets/anibird.webp';

const bird = {
    x: 50,
    y: canvas.height / 2 - 10,
    width: 50,
    height: 35,
    gravity: 0.25,
    velocity: 0,
    jump: -6,
    
    draw: function() {
        // Draw bird image with rotation based on velocity
        const rotation = this.velocity * 0.05; // Adjust rotation sensitivity
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(rotation);
        
        if (birdImg.complete && birdImg.naturalWidth !== 0) {
            ctx.drawImage(birdImg, -this.width/2, -this.height/2, this.width, this.height);
        } else {
            // Fallback to circle if image is not loaded
            ctx.fillStyle = '#FFD700'; // Yellow
            ctx.beginPath();
            ctx.arc(0, 0, 20, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw eye
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(8, -3, 4, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw beak
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
    
    update: function() {
        if (gameRunning) {
            this.velocity += this.gravity;
            this.y += this.velocity;
            
            // Floor collision
            if (this.y + 15 >= canvas.height - 20) {
                this.y = canvas.height - 35;
                if (gameRunning) gameOver();
            }
            
            // Ceiling collision
            if (this.y - 15 <= 0) {
                this.y = 15;
                this.velocity = 0;
            }
        }
    },
    
    flap: function() {
        this.velocity = this.jump;
    },
    
    reset: function() {
        this.y = canvas.height / 2 - 10;
        this.velocity = 0;
    }
};

// Pipes
const pipes = {
    position: [],
    gap: 180,
    maxYPos: -150,
    dx: 2,
    
    draw: function() {
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];
            
            // Top pipe
            ctx.fillStyle = '#2E8B57';
            ctx.fillRect(p.x, p.y, p.width, p.height);
            
            // Pipe cap
            ctx.fillStyle = '#228B22';
            ctx.fillRect(p.x - 5, p.y, p.width + 10, 20);
            
            // Bottom pipe
            ctx.fillStyle = '#2E8B57';
            ctx.fillRect(p.x, p.y + p.height + this.gap, p.width, canvas.height);
            
            // Pipe cap
            ctx.fillStyle = '#228B2';
            ctx.fillRect(p.x - 5, p.y + p.height + this.gap, p.width + 10, 20);
        }
    },
    
    update: function() {
        if (gameRunning) {
            if (frames % 100 === 0) {
                this.position.push({
                    x: canvas.width,
                    y: this.maxYPos * (Math.random() + 1),
                    width: 60,
                    height: 300
                });
            }
            
            for (let i = 0; i < this.position.length; i++) {
                let p = this.position[i];
                
                p.x -= this.dx;
                
                // If pipe goes beyond canvas, remove it and add score
                if (p.x + p.width <= 0) {
                    this.position.splice(i, 1);
                    score++;
                    scoreDisplay.textContent = score;
                    i--;
                }
                
                // Collision detection
                // Top pipe
                if (
                    bird.x + 15 > p.x &&
                    bird.x - 15 < p.x + p.width &&
                    bird.y - 15 < p.y + p.height
                ) {
                    if (gameRunning) gameOver();
                }
                
                // Bottom pipe
                if (
                    bird.x + 15 > p.x &&
                    bird.x - 15 < p.x + p.width &&
                    bird.y + 15 > p.y + p.height + this.gap
                ) {
                    if (gameRunning) gameOver();
                }
            }
        }
    },
    
    reset: function() {
        this.position = [];
    }
};

// Background
const backgroundImg = new Image();
backgroundImg.src = 'assets/background.png';

function drawBackground() {
    // Draw background image
    if (backgroundImg.complete && backgroundImg.naturalWidth !== 0) {
        // Draw the background image
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    } else {
        // Fallback to gradient if image is not loaded
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#E0F7FA');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

// Game functions
function gameOver() {
    if (gameRunning) {
        gameRunning = false;
        finalScoreDisplay.textContent = score;
        
        // Update high score if current score is higher
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('flappyHighScore', highScore);
            gameOverHighScoreDisplay.textContent = highScore;
        }
        
        gameOverScreen.classList.remove('hidden');
    }
}

function resetGame() {
    score = 0;
    frames = 0;
    scoreDisplay.textContent = score;
    bird.reset();
    pipes.reset();
    gameOverScreen.classList.add('hidden');
    startScreen.classList.add('hidden');
    
    // Update high score display
    highScoreDisplay.textContent = highScore;
}

function startGame() {
    resetGame();
    startScreen.classList.add('hidden');
    gameRunning = true;
}



// Initial state - hide game over screen at start
gameOverScreen.classList.add('hidden');

// Event listeners
startBtn.addEventListener('click', () => {
    startGame();
    startScreen.classList.add('hidden');
});

restartBtn.addEventListener('click', () => {
    startGame();
});

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (!gameRunning && !startScreen.classList.contains('hidden') && gameOverScreen.classList.contains('hidden')) {
            startGame();
            startScreen.classList.add('hidden');
        } else if (!gameRunning && startScreen.classList.contains('hidden') && !gameOverScreen.classList.contains('hidden')) {
            startGame();
        } else if (gameRunning) {
            bird.flap();
        }
    }
});

canvas.addEventListener('click', () => {
    if (gameRunning) {
        bird.flap();
    } else if (!gameRunning && !startScreen.classList.contains('hidden') && gameOverScreen.classList.contains('hidden')) {
        startGame();
        startScreen.classList.add('hidden');
    } else if (!gameRunning && startScreen.classList.contains('hidden') && !gameOverScreen.classList.contains('hidden')) {
        startGame();
    }
});

// Game loop
function loop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw and update game elements
    drawBackground();
    pipes.draw();
    bird.draw();
    pipes.update();
    bird.update();
    
    frames++;
    
    requestAnimationFrame(loop);
}

// Start the game loop
gameOverScreen.classList.add('hidden');
loop();