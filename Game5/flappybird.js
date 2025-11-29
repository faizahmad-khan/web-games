const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

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

// Game assets (replace with actual image paths)
const birdImg = new Image();
birdImg.src = 'flappybird.png'; // You'll need to create this image
const pipeNorthImg = new Image();
pipeNorthImg.src = 'pipeNorth.png'; // You'll need to create this image
const pipeSouthImg = new Image();
pipeSouthImg.src = 'pipeSouth.png'; // You'll need to create this image
const backgroundImg = new Image();
backgroundImg.src = 'background.png'; // You'll need to create this image

// Bird properties
const bird = {
    x: 50,
    y: 250,
    width: 34,
    height: 24,
    gravity: 0.25,
    lift: -5,
    velocity: 0,
    draw() {
        if (birdImg.complete && birdImg.naturalWidth !== 0) {
            ctx.drawImage(birdImg, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = 'yellow';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    },
    flap() {
        this.velocity = this.lift;
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
    }
};

let pipes = [];
const pipeWidth = 52;
const pipeGap = 180;
let pipeSpeed = 2;
const basePipeSpeed = 2;
const maxPipeSpeed = 5;
const speedIncreaseInterval = 5;
const minPipeHeight = 60;
const maxPipeHeight = canvas.height - pipeGap - minPipeHeight - 60; // Increased buffer for ground/ceiling
const pipeSpawnInterval = 90; 

let firstPipeCreated = false;

function createPipe(isInitial = false) {
    let currentMinPipeHeight = minPipeHeight;
    let currentMaxPipeHeight = maxPipeHeight;

    if (isInitial) {
        // For the very first pipe, make sure the gap is centered around the bird's starting position
        const idealGapCenterY = bird.y + (bird.height / 2); // Center of the bird
        const halfPipeGap = pipeGap / 2;

        // The top of the bottom pipe should be around idealGapCenterY + halfPipeGap
        // So, pipeHeight (top pipe height) should be around idealGapCenterY - halfPipeGap
        
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
        let p = pipes[i]; // North pipe
        let p2 = pipes[i+1]; // South pipe

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
        ctx.fillStyle = 'skyblue';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function resetGame() {
    bird.y = 250;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    scoreDisplay.textContent = score;
    pipeSpeed = basePipeSpeed;
    frameCount = 0;
    createPipe(true); // Ensure the first pipe has a good gap
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
createPipe(true); // Create one pipe initially for display before game starts with a good gap