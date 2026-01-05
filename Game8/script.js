document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('tetris');
    const context = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const levelElement = document.getElementById('level');
    const linesElement = document.getElementById('lines');
    const startButton = document.getElementById('start-button');

    // Game constants
    const COLS = 10;
    const ROWS = 20;
    const BLOCK_SIZE = 20;
    const COLORS = [
        null,
        '#FF0D72', // I
        '#0DC2FF', // J
        '#0DFF72', // L
        '#F538FF', // O
        '#FF8E0D', // S
        '#FFE138', // T
        '#3877FF'  // Z
    ];

    // Tetromino shapes
    const SHAPES = [
        [],
        [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]], // I
        [[2,0,0], [2,2,2], [0,0]],                   // J
        [[0,0,3], [3,3,3], [0,0,0]],                   // L
        [[4,4], [4,4]],                                // O
        [[0,5,5], [5,5,0], [0,0,0]],                   // S
        [[0,6,0], [6,6,6], [0,0]],                   // T
        [[7,7,0], [0,7,7], [0,0,0]]                    // Z
    ];

    // Game variables
    let board = createMatrix(COLS, ROWS);
    let player = {
        pos: {x: 0, y: 0},
        matrix: null,
        score: 0,
        level: 1,
        lines: 0,
        dropCounter: 0,
        dropInterval: 1000
    };
    let gameInterval;
    let isPaused = false;

    // Create matrix
    function createMatrix(w, h) {
        const matrix = [];
        while (h--) {
            matrix.push(new Array(w).fill(0));
        }
        return matrix;
    }

    // Create piece
    function createPiece() {
        const rand = Math.floor(Math.random() * 7) + 1;
        return SHAPES[rand].map(row => [...row]);
    }

    // Draw matrix
    function drawMatrix(matrix, offset) {
        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    context.fillStyle = COLORS[value];
                    context.fillRect(
                        (x + offset.x) * BLOCK_SIZE,
                        (y + offset.y) * BLOCK_SIZE,
                        BLOCK_SIZE,
                        BLOCK_SIZE
                    );
                    context.strokeStyle = '#000';
                    context.strokeRect(
                        (x + offset.x) * BLOCK_SIZE,
                        (y + offset.y) * BLOCK_SIZE,
                        BLOCK_SIZE,
                        BLOCK_SIZE
                    );
                }
            });
        });
    }

    // Draw game board
    function draw() {
        context.fillStyle = '#000';
        context.fillRect(0, 0, canvas.width, canvas.height);

        drawMatrix(board, {x: 0, y: 0});
        drawMatrix(player.matrix, player.pos);
    }

    // Merge player piece with board
    function merge(board, player) {
        player.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    board[y + player.pos.y][x + player.pos.x] = value;
                }
            });
        });
    }

    // Collision detection
    function collide(board, player) {
        const [m, o] = [player.matrix, player.pos];
        for (let y = 0; y < m.length; ++y) {
            for (let x = 0; x < m[y].length; ++x) {
                if (m[y][x] !== 0 &&
                   (board[y + o.y] &&
                   board[y + o.y][x + o.x]) !== 0) {
                    return true;
                }
            }
        }
        return false;
    }

    // Rotate piece
    function rotate(matrix, dir) {
        for (let y = 0; y < matrix.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
            }
        }

        if (dir > 0) {
            matrix.forEach(row => row.reverse());
        } else {
            matrix.reverse();
        }
    }

    // Player rotation
    function playerRotate(dir) {
        const pos = player.pos.x;
        let offset = 1;
        rotate(player.matrix, dir);
        
        while (collide(board, player)) {
            player.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > player.matrix[0].length) {
                rotate(player.matrix, -dir);
                player.pos.x = pos;
                return;
            }
        }
    }

    // Player drop
    function playerDrop() {
        player.pos.y++;
        if (collide(board, player)) {
            player.pos.y--;
            merge(board, player);
            playerReset();
            sweepRows();
            updateScore();
        }
        player.dropCounter = 0;
    }

    // Hard drop
    function playerHardDrop() {
        while (!collide(board, player)) {
            player.pos.y++;
        }
        player.pos.y--;
        merge(board, player);
        playerReset();
        sweepRows();
        updateScore();
        player.dropCounter = 0;
    }

    // Player move
    function playerMove(dir) {
        player.pos.x += dir;
        if (collide(board, player)) {
            player.pos.x -= dir;
        }
    }

    // Player reset
    function playerReset() {
        const pieces = 'TJLOSZI';
        player.matrix = createPiece();
        player.pos.y = 0;
        player.pos.x = Math.floor((board[0].length - player.matrix[0].length) / 2);

        if (collide(board, player)) {
            gameOver();
        }
    }

    // Sweep completed rows
    function sweepRows() {
        let rowCount = 0;
        outer: for (let y = board.length - 1; y >= 0; --y) {
            for (let x = 0; x < board[y].length; ++x) {
                if (board[y][x] === 0) {
                    continue outer;
                }
            }

            const row = board.splice(y, 1)[0].fill(0);
            board.unshift(row);
            ++y;
            rowCount++;
        }
        
        if (rowCount > 0) {
            player.lines += rowCount;
            player.score += rowCount * 100 * player.level;
            player.level = Math.floor(player.lines / 10) + 1;
            player.dropInterval = 1000 - (player.level - 1) * 100; // Increase speed with level
            
            // Update UI
            scoreElement.textContent = player.score;
            levelElement.textContent = player.level;
            linesElement.textContent = player.lines;
        }
    }

    // Update score display
    function updateScore() {
        scoreElement.textContent = player.score;
    }

    // Game over
    function gameOver() {
        clearInterval(gameInterval);
        alert(`Game Over! Final Score: ${player.score}`);
    }

    // Game loop
    function update(time = 0) {
        if (isPaused) return;
        
        const deltaTime = time - (player.lastTime || 0);
        player.lastTime = time;

        player.dropCounter += deltaTime;
        if (player.dropCounter > player.dropInterval) {
            playerDrop();
        }

        draw();
    }

    // Initialize game
    function init() {
        player.score = 0;
        player.level = 1;
        player.lines = 0;
        player.dropInterval = 1000;
        
        board = createMatrix(COLS, ROWS);
        playerReset();
        updateScore();
        
        if (gameInterval) {
            clearInterval(gameInterval);
        }
        
        gameInterval = setInterval(() => {
            update();
        }, 1000 / 60); // 60fps
    }

    // Toggle pause
    function togglePause() {
        isPaused = !isPaused;
        if (!isPaused) {
            requestAnimationFrame(update);
        }
    }

    // Event listeners
    document.addEventListener('keydown', event => {
        if (isPaused) return;
        
        switch (event.keyCode) {
            case 37: // Left arrow
                playerMove(-1);
                break;
            case 39: // Right arrow
                playerMove(1);
                break;
            case 40: // Down arrow
                playerDrop();
                break;
            case 38: // Up arrow
                playerRotate(1);
                break;
            case 32: // Space
                playerHardDrop();
                break;
            case 80: // P
                togglePause();
                break;
        }
    });

    startButton.addEventListener('click', () => {
        init();
        isPaused = false;
        requestAnimationFrame(update);
    });

    // Initialize the game board display
    draw();
});