// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const levelElement = document.getElementById('level');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreElement = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');
const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');
const pauseScreen = document.getElementById('pauseScreen');

// Game state
let score = 0;
let lives = 3;
let level = 1;
let gameRunning = false;
let gamePaused = false;
let dots = [];
let powerPellets = [];
let ghosts = [];
let pacman = {
    x: 300,
    y: 400,
    radius: 10,
    speed: 3,
    direction: 'right',
    nextDirection: 'right',
    mouthOpen: 0,
    mouthChange: 0.1
};

// Maze layout (1 = wall, 0 = dot path, 2 = power pellet, 3 = empty space)
const maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 2, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 2, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 1, 3, 1, 1, 0, 1, 1, 1, 1, 1],
    [3, 3, 3, 1, 0, 1, 3, 3, 3, 3, 3, 3, 1, 0, 1, 3, 3, 3],
    [1, 1, 1, 0, 1, 3, 1, 1, 1, 1, 3, 0, 1, 1, 1, 1, 1, 1],
    [3, 3, 3, 3, 0, 3, 3, 1, 3, 3, 1, 3, 3, 0, 3, 3, 3, 3],
    [1, 1, 0, 1, 3, 1, 1, 1, 1, 1, 3, 0, 1, 1, 1, 1, 1],
    [3, 3, 3, 1, 0, 1, 3, 3, 3, 3, 3, 3, 1, 0, 1, 3, 3, 3],
    [1, 1, 1, 1, 0, 1, 3, 1, 1, 1, 1, 1, 3, 0, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
    [1, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 1],
    [1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// Initialize game
function initGame() {
    // Create dots and power pellets based on maze
    dots = [];
    powerPellets = [];
    
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            const x = col * 30 + 15;
            const y = row * 30 + 15;
            
            if (maze[row][col] === 0) {
                dots.push({x, y, eaten: false});
            } else if (maze[row][col] === 2) {
                powerPellets.push({x, y, eaten: false});
            }
        }
    }
    
    // Create ghosts
    ghosts = [
        {x: 300, y: 200, color: '#FF0000', direction: 'left', speed: 2}, // Red ghost
        {x: 270, y: 200, color: '#FFB8FF', direction: 'up', speed: 2},   // Pink ghost
        {x: 330, y: 200, color: '#00FFFF', direction: 'down', speed: 2}, // Cyan ghost
        {x: 300, y: 170, color: '#FFB852', direction: 'right', speed: 2} // Orange ghost
    ];
    
    // Reset Pacman position
    pacman.x = 30;
    pacman.y = 400;
    pacman.direction = 'right';
    pacman.nextDirection = 'right';
    
    // Reset game state
    score = 0;
    lives = 3;
    level = 1;
    
    updateUI();
}

// Draw maze
function drawMaze() {
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            const x = col * 30;
            const y = row * 30;
            
            if (maze[row][col] === 1) { // Wall
                ctx.fillStyle = '#2233AA';
                ctx.fillRect(x, y, 30, 30);
                
                ctx.strokeStyle = '#0000FF';
                ctx.lineWidth = 2;
                ctx.strokeRect(x, y, 30, 30);
            } else if (maze[row][col] === 3) { // Empty space
                ctx.fillStyle = '#000';
                ctx.fillRect(x, y, 30);
            }
        }
    }
}

// Draw dots
function drawDots() {
    dots.forEach(dot => {
        if (!dot.eaten) {
            ctx.fillStyle = '#FFCC00';
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    });
    
    powerPellets.forEach(pellet => {
        if (!pellet.eaten) {
            ctx.fillStyle = '#FFCC00';
            ctx.beginPath();
            ctx.arc(pellet.x, pellet.y, 6, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

// Draw Pacman
function drawPacman() {
    ctx.save();
    ctx.translate(pacman.x, pacman.y);
    
    // Rotate based on direction
    if (pacman.direction === 'right') ctx.rotate(0);
    else if (pacman.direction === 'down') ctx.rotate(Math.PI / 2);
    else if (pacman.direction === 'left') ctx.rotate(Math.PI);
    else if (pacman.direction === 'up') ctx.rotate(Math.PI * 1.5);
    
    // Draw Pacman with animated mouth
    ctx.fillStyle = '#FFCC00';
    ctx.beginPath();
    
    const startAngle = pacman.mouthOpen;
    const endAngle = Math.PI * 2 - pacman.mouthOpen;
    
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, pacman.radius, startAngle, endAngle);
    ctx.lineTo(0, 0);
    ctx.fill();
    
    ctx.restore();
}

// Draw ghosts
function drawGhosts() {
    ghosts.forEach(ghost => {
        // Ghost body
        ctx.fillStyle = ghost.color;
        ctx.beginPath();
        ctx.arc(ghost.x, ghost.y, 10, Math.PI, 0, false); // Top half circle
        ctx.lineTo(ghost.x + 10, ghost.y + 10);
        
        // Wavy bottom
        ctx.lineTo(ghost.x + 7, ghost.y + 7);
        ctx.lineTo(ghost.x + 4, ghost.y + 10);
        ctx.lineTo(ghost.x + 1, ghost.y + 7);
        ctx.lineTo(ghost.x - 2, ghost.y + 10);
        ctx.lineTo(ghost.x - 5, ghost.y + 7);
        ctx.lineTo(ghost.x - 8, ghost.y + 10);
        ctx.lineTo(ghost.x - 10, ghost.y + 10);
        ctx.closePath();
        ctx.fill();
        
        // Eyes
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(ghost.x - 3, ghost.y - 2, 3, 0, Math.PI * 2);
        ctx.arc(ghost.x + 3, ghost.y - 2, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(ghost.x - 3, ghost.y - 2, 1.5, 0, Math.PI * 2);
        ctx.arc(ghost.x + 3, ghost.y - 2, 1.5, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Update Pacman's mouth animation
function updatePacmanMouth() {
    pacman.mouthOpen += pacman.mouthChange;
    if (pacman.mouthOpen > 0.5 || pacman.mouthOpen < 0) {
        pacman.mouthChange *= -1;
    }
}

// Move Pacman
function movePacman() {
    // Try to change direction if requested
    let nextX = pacman.x;
    let nextY = pacman.y;
    
    if (pacman.nextDirection === 'right') nextX += pacman.speed;
    else if (pacman.nextDirection === 'left') nextX -= pacman.speed;
    else if (pacman.nextDirection === 'up') nextY -= pacman.speed;
    else if (pacman.nextDirection === 'down') nextY += pacman.speed;
    
    // Check if the next position is valid
    const nextCol = Math.floor(nextX / 30);
    const nextRow = Math.floor(nextY / 30);
    
    if (nextRow >= 0 && nextRow < maze.length && nextCol >= 0 && nextCol < maze[0].length) {
        if (maze[nextRow][nextCol] !== 1) { // Not a wall
            pacman.x = nextX;
            pacman.y = nextY;
            pacman.direction = pacman.nextDirection;
        }
    }
    
    // Wrap around tunnel
    if (pacman.x < 0) pacman.x = canvas.width;
    else if (pacman.x > canvas.width) pacman.x = 0;
    
    // Handle dot collection
    dots.forEach(dot => {
        if (!dot.eaten) {
            const distance = Math.sqrt((pacman.x - dot.x) ** 2 + (pacman.y - dot.y) ** 2);
            if (distance < pacman.radius + 3) {
                dot.eaten = true;
                score += 10;
                updateUI();
            }
        }
    });
    
    // Handle power pellet collection
    powerPellets.forEach(pellet => {
        if (!pellet.eaten) {
            const distance = Math.sqrt((pacman.x - pellet.x) ** 2 + (pacman.y - pellet.y) ** 2);
            if (distance < pacman.radius + 6) {
                pellet.eaten = true;
                score += 50;
                updateUI();
            }
        }
    });
}

// Move ghosts
function moveGhosts() {
    ghosts.forEach(ghost => {
        // Simple AI: move randomly but prefer current direction
        const directions = ['up', 'right', 'down', 'left'];
        let possibleDirections = [];
        
        // Check which directions are valid
        for (const dir of directions) {
            let testX = ghost.x;
            let testY = ghost.y;
            
            if (dir === 'right') testX += ghost.speed;
            else if (dir === 'left') testX -= ghost.speed;
            else if (dir === 'up') testY -= ghost.speed;
            else if (dir === 'down') testY += ghost.speed;
            
            const testCol = Math.floor(testX / 30);
            const testRow = Math.floor(testY / 30);
            
            if (testRow >= 0 && testRow < maze.length && testCol >= 0 && testCol < maze[0].length) {
                if (maze[testRow][testCol] !== 1) { // Not a wall
                    possibleDirections.push(dir);
                }
            }
        }
        
        // Change direction randomly if current direction is blocked or occasionally
        if (possibleDirections.length > 0 && (Math.random() < 0.02 || !possibleDirections.includes(ghost.direction))) {
            ghost.direction = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
        }
        
        // Move in current direction if possible
        if (possibleDirections.includes(ghost.direction)) {
            if (ghost.direction === 'right') ghost.x += ghost.speed;
            else if (ghost.direction === 'left') ghost.x -= ghost.speed;
            else if (ghost.direction === 'up') ghost.y -= ghost.speed;
            else if (ghost.direction === 'down') ghost.y += ghost.speed;
        } else if (possibleDirections.length > 0) {
            // Pick a random possible direction
            ghost.direction = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
        }
        
        // Wrap around tunnel
        if (ghost.x < 0) ghost.x = canvas.width;
        else if (ghost.x > canvas.width) ghost.x = 0;
    });
}

// Check for collisions with ghosts
function checkCollisions() {
    ghosts.forEach(ghost => {
        const distance = Math.sqrt((pacman.x - ghost.x) ** 2 + (pacman.y - ghost.y) ** 2);
        if (distance < pacman.radius + 10) {
            // Collision with ghost
            lives--;
            updateUI();
            
            if (lives <= 0) {
                gameOver();
            } else {
                // Reset positions
                pacman.x = 30;
                pacman.y = 400;
                ghosts[0].x = 300; ghosts[0].y = 200;
                ghosts[1].x = 270; ghosts[1].y = 200;
                ghosts[2].x = 330; ghosts[2].y = 200;
                ghosts[3].x = 300; ghosts[3].y = 170;
            }
        }
    });
}

// Check if level is complete
function checkLevelComplete() {
    const allDotsEaten = dots.every(dot => dot.eaten);
    const allPowerPelletsEaten = powerPellets.every(pellet => pellet.eaten);
    
    if (allDotsEaten && allPowerPelletsEaten) {
        level++;
        initGame(); // Reset the game for the next level
        score += 10 * level; // Bonus for completing the level
        updateUI();
    }
}

// Update UI elements
function updateUI() {
    scoreElement.textContent = score;
    livesElement.textContent = lives;
    levelElement.textContent = level;
}

// Game over
function gameOver() {
    gameRunning = false;
    finalScoreElement.textContent = score;
    gameOverScreen.classList.remove('hidden');
}

// Draw everything
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw game elements
    drawMaze();
    drawDots();
    drawPacman();
    drawGhosts();
}

// Game loop
function gameLoop() {
    if (!gameRunning || gamePaused) return;
    
    updatePacmanMouth();
    movePacman();
    moveGhosts();
    checkCollisions();
    checkLevelComplete();
    draw();
    
    requestAnimationFrame(gameLoop);
}

// Event listeners
document.addEventListener('keydown', (e) => {
    if (!gameRunning || gamePaused) return;
    
    switch(e.key) {
        case 'ArrowUp':
            pacman.nextDirection = 'up';
            break;
        case 'ArrowDown':
            pacman.nextDirection = 'down';
            break;
        case 'ArrowLeft':
            pacman.nextDirection = 'left';
            break;
        case 'ArrowRight':
            pacman.nextDirection = 'right';
            break;
        case ' ': // Space bar to pause
            togglePause();
            break;
    }
});

startButton.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    gameRunning = true;
    initGame();
    gameLoop();
});

restartButton.addEventListener('click', () => {
    gameOverScreen.classList.add('hidden');
    gameRunning = true;
    initGame();
    gameLoop();
});

function togglePause() {
    gamePaused = !gamePaused;
    pauseScreen.classList.toggle('hidden', !gamePaused);
    
    if (gameRunning && !gamePaused) {
        gameLoop();
    }
}

// Initialize the start screen
window.onload = () => {
    draw(); // Draw initial state
};