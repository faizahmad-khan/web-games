const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Store original dimensions for scaling calculations
const ORIGINAL_WIDTH = 300;
const ORIGINAL_HEIGHT = 500;

// Function to handle responsive scaling
function scaleGame() {
    const container = document.getElementById('game-container');
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // Calculate scale factors to fill the screen while maintaining aspect ratio
    const scaleX = containerWidth / ORIGINAL_WIDTH;
    const scaleY = containerHeight / ORIGINAL_HEIGHT;
    
    // Use the smaller scale to maintain aspect ratio and fit within container
    const scale = Math.min(scaleX, scaleY);
    
    // Calculate centered position
    const gameWidth = ORIGINAL_WIDTH * scale;
    const gameHeight = ORIGINAL_HEIGHT * scale;
    const offsetX = (containerWidth - gameWidth) / 2;
    const offsetY = (containerHeight - gameHeight) / 2;
    
    // Apply scaling and positioning to canvas
    canvas.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale}, ${scale})`;
    canvas.style.transformOrigin = '0 0';
    canvas.style.position = 'absolute';
    canvas.style.left = '0';
    canvas.style.top = '0';
}

// Initial scaling
scaleGame();

// Add resize listener to handle window resize
window.addEventListener('resize', scaleGame);

const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const scoreDisplay = document.getElementById('score');
const finalScoreDisplay = document.getElementById('final-score');
const previousScoreDisplay = document.getElementById('previous-score');
const highScoreDisplay = document.getElementById('high-score');

let gameRunning = false;
let score = 0;
let highScore = localStorage.getItem('flappyBirdHighScore') || 0;
let previousScore = localStorage.getItem('flappyBirdPreviousScore') || 0;

// Game assets
const birdImg = new Image();
birdImg.src = 'Narendra-Modi-FACE-PNG.webp';
const pipeNorthImg = new Image();
pipeNorthImg.src = 'pipeNorth.png';
const pipeSouthImg = new Image();
pipeSouthImg.src = 'pipeSouth.png';
const backgroundImg = new Image();
backgroundImg.src = 'background.png';

// Audio
const flapSound = new Audio('maka-bhosda-aag-meme-amitabh-bachan-made-with-Voicemod.mp3');
flapSound.volume = 0.3; // Set volume to 30%

// Fire particle system
const particles = [];

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 6 - 3; // Random horizontal speed
        this.speedY = Math.random() * 3 + 1; // Random vertical speed (upward)
        this.color = `hsl(${Math.random() * 20}, 100%, 50%)`; // Fire color (orange/red hues)
        this.life = 20; // Number of frames before particle dies
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life--;
        this.size *= 0.95; // Shrink over time
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.life / 20; // Fade out as life decreases
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1; // Reset alpha for other drawings
    }
}

// Bird properties
let bird = null;

function initBird() {
    bird = {
        x: 50,
        y: canvas.height / 2,
        width: 40,
        height: 30,
        gravity: 0.25,
        lift: -5,
        velocity: 0,
        draw() {
            if (birdImg.complete && birdImg.naturalWidth !== 0) {
                ctx.drawImage(birdImg, this.x, this.y, this.width, this.height);
            } else {
                // Fallback for missing image
                ctx.fillStyle = 'yellow';
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
            
            // Draw fire particles
            for (let i = 0; i < particles.length; i++) {
                particles[i].draw();
            }
        },
        flap() {
            this.velocity = this.lift;
            
            // Create fire particles when flapping
            for (let i = 0; i < 5; i++) {
                const particleX = this.x + 10; // Fire comes from under the bird
                const particleY = this.y + this.height - 5;
                particles.push(new Particle(particleX, particleY));
            }
            
            // Play flap sound
            flapSound.currentTime = 0; // Reset to beginning
            flapSound.play().catch(e => console.log("Audio play failed:", e)); // Play sound, suppress error if blocked
        },
        update() {
            this.velocity += this.gravity;
            this.y += this.velocity;

            if (this.y + this.height > canvas.height) {
                this.y = canvas.height - this.height;
                this.velocity = 0;
                if (gameRunning) gameOver();
            }
            if (this.y < 0) {
                this.y = 0;
                this.velocity = 0;
            }
            
            // Update particles
            for (let i = particles.length - 1; i >= 0; i--) {
                particles[i].update();
                if (particles[i].life <= 0) {
                    particles.splice(i, 1); // Remove dead particles
                }
            }
        }
    };
}

initBird();

let pipes = [];
const pipeWidth = 52;
const pipeGap = 180;
let pipeSpeed = 2;
const basePipeSpeed = 2;
const maxPipeSpeed = 5;
const speedIncreaseInterval = 5;
const minPipeHeight = 60;
const maxPipeHeight = canvas.height - pipeGap - minPipeHeight - 60; 
const pipeSpawnInterval = 90; 

let firstPipeCreated = false;

function createPipe(isInitial = false) {
    let currentMinPipeHeight = minPipeHeight;
    let currentMaxPipeHeight = maxPipeHeight;

    if (isInitial) {
        const idealGapCenterY = bird.y + (bird.height / 2); 
        const halfPipeGap = pipeGap / 2;
        
        const safePipeHeightMin = Math.max(minPipeHeight, idealGapCenterY - halfPipeGap - (pipeGap * 0.2));
        const safePipeHeightMax = Math.min(maxPipeHeight, idealGapCenterY - halfPipeGap + (pipeGap * 0.2));

        currentMinPipeHeight = safePipeHeightMin;
        currentMaxPipeHeight = safePipeHeightMax;
    }

    const pipeHeight = Math.floor(Math.random() * (currentMaxPipeHeight - currentMinPipeHeight + 1)) + currentMinPipeHeight;

    pipes.push({
        x: canvas.width,
        y: 0,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    });
    pipes.push({
        x: canvas.width,
        y: pipeHeight + pipeGap,
        width: pipeWidth,
        height: canvas.height - pipeHeight - pipeGap,
        passed: false
    });
}

function updatePipes() {
    for (let i = 0; i < pipes.length; i += 2) {
        let p = pipes[i]; 
        let p2 = pipes[i+1]; 

        p.x -= pipeSpeed;
        p2.x -= pipeSpeed;

        // Collision detection
        if (
            bird.x < p.x + p.width &&
            bird.x + bird.width > p.x &&
            (bird.y < p.y + p.height || bird.y + bird.height > p2.y)
        ) {
            if (gameRunning) gameOver();
        }

        // Scoring
        if (p.x + p.width < bird.x && !p.passed) {
            p.passed = true;
            score++;
            scoreDisplay.textContent = score;
            
            if (score % speedIncreaseInterval === 0 && pipeSpeed < maxPipeSpeed) {
                pipeSpeed += 0.5;
            }
        }
    }
    // Remove offscreen pipes
    pipes = pipes.filter(p => p.x + p.width > 0);

    if (gameRunning && (frameCount % pipeSpawnInterval === 0)) {
        createPipe();
    }
}

function drawPipes() {
    for (let i = 0; i < pipes.length; i += 2) {
        let p = pipes[i];
        let p2 = pipes[i+1];
        if (pipeNorthImg.complete && pipeNorthImg.naturalWidth !== 0 && pipeSouthImg.complete && pipeSouthImg.naturalWidth !== 0) {
            ctx.drawImage(pipeNorthImg, p.x, p.y, p.width, p.height);
            ctx.drawImage(pipeSouthImg, p2.x, p2.y, p2.width, p2.height);
        } else {
            // Fallback for missing images
            ctx.fillStyle = 'green';
            ctx.fillRect(p.x, p.y, p.width, p.height);
            ctx.fillRect(p2.x, p2.y, p2.width, p2.height);
        }
    }
}

function drawBackground() {
    if (backgroundImg.complete && backgroundImg.naturalWidth !== 0) {
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    } else {
        // Fallback for missing image
        ctx.fillStyle = 'skyblue';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function resetGame() {
    bird.y = canvas.height / 2; // Center the bird vertically
    bird.velocity = 0;
    pipes = [];
    score = 0;
    scoreDisplay.textContent = score;
    pipeSpeed = basePipeSpeed;
    frameCount = 0;
    createPipe(true);
    gameOverScreen.classList.add('hidden');
    startScreen.classList.add('hidden');
    gameRunning = true;
    highScoreDisplay.textContent = highScore;
    previousScoreDisplay.textContent = previousScore;
    gameLoop();
}

function gameOver() {
    gameRunning = false;
    finalScoreDisplay.textContent = score;
    previousScore = score;
    localStorage.setItem('flappyBirdPreviousScore', previousScore);

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('flappyBirdHighScore', highScore);
    }
    highScoreDisplay.textContent = highScore;
    previousScoreDisplay.textContent = previousScore;
    gameOverScreen.classList.remove('hidden');
}

function startGame() {
    startScreen.classList.add('hidden');
    resetGame();
}

document.addEventListener('keydown', e => {
    if (e.code === 'Space' && gameRunning) {
        e.preventDefault();
        bird.flap();
    }
});

// Touch and click support for mobile devices
canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    if (gameRunning) {
        bird.flap();
    } else if (!gameRunning && gameOverScreen.classList.contains('hidden')) {
        // If game hasn't started yet, start it
        if (startScreen.classList.contains('hidden')) {
            resetGame();
        } else {
            startGame();
        }
    }
});

canvas.addEventListener('click', e => {
    e.preventDefault();
    if (gameRunning) {
        bird.flap();
    } else if (!gameRunning && gameOverScreen.classList.contains('hidden')) {
        // If game hasn't started yet, start it
        if (startScreen.classList.contains('hidden')) {
            resetGame();
        } else {
            startGame();
        }
    }
});

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', resetGame);

let frameCount = 0;
function gameLoop() {
    if (!gameRunning) return;

    drawBackground();
    bird.update();
    bird.draw();

    updatePipes();
    drawPipes();

    frameCount++;
    requestAnimationFrame(gameLoop);
}

// Initial setup
startScreen.classList.remove('hidden');
// Wait for the scaling to be applied before creating the first pipe
setTimeout(() => {
    createPipe(true);
}, 100);