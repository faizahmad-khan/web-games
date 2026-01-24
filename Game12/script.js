// Maze game constants
const CELL_SIZE = 30;
const MAZE_WIDTH = 15; // Number of cells horizontally
const MAZE_HEIGHT = 12; // Number of cells vertically
const PLAYER_COLOR = '#3498db';
const WALL_COLOR = '#e74c3c';
const PATH_COLOR = '#2ecc71';
const START_COLOR = '#f1c40f';
const DESTINATION_COLOR = '#27ae60';

// Canvas setup
const canvas = document.getElementById('maze-canvas');
const ctx = canvas.getContext('2d');

// Game state
let playerPos = { x: 0, y: 0 };
let destination = { x: MAZE_WIDTH - 1, y: MAZE_HEIGHT - 1 };
let moves = 0;
let moveCountElement = document.getElementById('move-count');
let resetBtn = document.getElementById('reset-btn');

// Generate a random maze using depth-first search algorithm
function generateMaze() {
    // Initialize maze grid - 0 = path, 1 = wall
    const maze = Array(MAZE_HEIGHT).fill().map(() => Array(MAZE_WIDTH).fill(1));
    
    // Recursive backtracking function to generate maze
    function carve(x, y) {
        maze[y][x] = 0; // Mark current cell as path
        
        // Define directions: right, down, left, up
        const directions = [
            [1, 0], [0, 1], [-1, 0], [0, -1]
        ];
        
        // Shuffle directions randomly
        shuffleArray(directions);
        
        for (let [dx, dy] of directions) {
            const nx = x + dx * 2;
            const ny = y + dy * 2;
            
            // Check if new position is within bounds and unvisited
            if (nx >= 0 && nx < MAZE_WIDTH && ny >= 0 && ny < MAZE_HEIGHT && maze[ny][nx] === 1) {
                maze[y + dy][x + dx] = 0; // Remove wall between current and new cell
                carve(nx, ny); // Recursively carve from new position
            }
        }
    }
    
    // Start carving from (0, 0)
    carve(0, 0);
    
    // Make sure start and destination are paths
    maze[0][0] = 0;
    maze[MAZE_HEIGHT - 1][MAZE_WIDTH - 1] = 0;
    
    return maze;
}

// Helper function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Draw the maze on canvas
function drawMaze(maze) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let y = 0; y < MAZE_HEIGHT; y++) {
        for (let x = 0; x < MAZE_WIDTH; x++) {
            // Calculate position on canvas
            const px = x * CELL_SIZE;
            const py = y * CELL_SIZE;
            
            if (maze[y][x] === 1) {
                // Draw wall
                ctx.fillStyle = WALL_COLOR;
                ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);
                
                // Add some texture to walls
                ctx.strokeStyle = '#c0392b';
                ctx.lineWidth = 2;
                ctx.strokeRect(px, py, CELL_SIZE, CELL_SIZE);
            } else {
                // Draw path
                ctx.fillStyle = PATH_COLOR;
                ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);
                
                // Add subtle grid lines
                ctx.strokeStyle = '#27ae60';
                ctx.lineWidth = 0.5;
                ctx.strokeRect(px, py, CELL_SIZE, CELL_SIZE);
            }
        }
    }
    
    // Draw start position
    ctx.fillStyle = START_COLOR;
    ctx.fillRect(0, 0, CELL_SIZE, CELL_SIZE);
    ctx.strokeStyle = '#f39c12';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, CELL_SIZE, CELL_SIZE);
    
    // Draw destination
    ctx.fillStyle = DESTINATION_COLOR;
    ctx.fillRect(
        (MAZE_WIDTH - 1) * CELL_SIZE,
        (MAZE_HEIGHT - 1) * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
    );
    ctx.strokeStyle = '#2ecc71';
    ctx.lineWidth = 2;
    ctx.strokeRect(
        (MAZE_WIDTH - 1) * CELL_SIZE,
        (MAZE_HEIGHT - 1) * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
    );
    
    // Draw player
    ctx.fillStyle = PLAYER_COLOR;
    ctx.beginPath();
    ctx.arc(
        playerPos.x * CELL_SIZE + CELL_SIZE / 2,
        playerPos.y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 3,
        0,
        Math.PI * 2
    );
    ctx.fill();
    
    // Add shine effect to player
    ctx.fillStyle = '#5dade2';
    ctx.beginPath();
    ctx.arc(
        playerPos.x * CELL_SIZE + CELL_SIZE / 3,
        playerPos.y * CELL_SIZE + CELL_SIZE / 3,
        CELL_SIZE / 8,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

// Move player in the maze
function movePlayer(dx, dy) {
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;
    
    // Check if new position is within bounds and not a wall
    if (
        newX >= 0 && 
        newX < MAZE_WIDTH && 
        newY >= 0 && 
        newY < MAZE_HEIGHT && 
        maze[newY][newX] !== 1
    ) {
        playerPos.x = newX;
        playerPos.y = newY;
        moves++;
        moveCountElement.textContent = moves;
        
        // Check if player reached destination
        if (playerPos.x === destination.x && playerPos.y === destination.y) {
            setTimeout(() => {
                alert(`Congratulations! You solved the maze in ${moves} moves!`);
                resetGame();
            }, 100);
        }
        
        drawMaze(maze);
    }
}

// Reset the game
function resetGame() {
    playerPos = { x: 0, y: 0 };
    moves = 0;
    moveCountElement.textContent = moves;
    maze = generateMaze();
    drawMaze(maze);
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            e.preventDefault();
            movePlayer(0, -1);
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            e.preventDefault();
            movePlayer(0, 1);
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            e.preventDefault();
            movePlayer(-1, 0);
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            e.preventDefault();
            movePlayer(1, 0);
            break;
    }
});

// Touch controls for mobile
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    e.preventDefault();
});

canvas.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    
    // Determine swipe direction based on greatest movement
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 50) {
            movePlayer(1, 0); // Right
        } else if (diffX < -50) {
            movePlayer(-1, 0); // Left
        }
    } else {
        // Vertical swipe
        if (diffY > 50) {
            movePlayer(0, 1); // Down
        } else if (diffY < -50) {
            movePlayer(0, -1); // Up
        }
    }
    
    e.preventDefault();
});

// Button event listeners
resetBtn.addEventListener('click', resetGame);

// Initialize the game
let maze = generateMaze();
drawMaze(maze);