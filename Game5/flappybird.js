const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const bird = {
    x: 50,
    y: 150,
    width: 20,
    height: 20,
    gravity: 0.5,
    lift: -8,
    velocity: 0,
    draw() {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x, this.y, this.width, this.height);
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
        }
        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }
    }
};

let pipes = [];
const pipeWidth = 40;
const pipeGap = 120; // Gap between top and bottom pipes
const pipeSpeed = 2;

function createPipe() {
    const pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap - 60)) + 30;
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

let frameCount = 0;
const pipeSpawnInterval = 150;

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
            // Collision detected, reset game (for now)
            resetGame();
        }

        if (p.x + p.width < bird.x && !p.passed) {
            p.passed = true;
            // You can add score logic here
        }
    }
    // Remove offscreen pipes
    pipes = pipes.filter(p => p.x + p.width > 0);

    if (frameCount % pipeSpawnInterval === 0) {
        createPipe();
    }
}

function drawPipes() {
    for (let i = 0; i < pipes.length; i++) {
        let p = pipes[i];
        ctx.fillStyle = 'green';
        ctx.fillRect(p.x, p.y, p.width, p.height);
    }
}

function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    frameCount = 0;
    createPipe();
}

document.addEventListener('keydown', e => {
    if (e.code === 'Space') {
        bird.flap();
    }
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bird.update();
    bird.draw();

    updatePipes();
    drawPipes();

    frameCount++;
    requestAnimationFrame(gameLoop);
}

createPipe(); // Initial pipe
gameLoop();