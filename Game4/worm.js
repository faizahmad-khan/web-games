// Game Constants
const GRID_SIZE = 20;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const GRID_COLS = CANVAS_WIDTH / GRID_SIZE;
const GRID_ROWS = CANVAS_HEIGHT / GRID_SIZE;

// Game States
const GameState = {
    IDLE: 0,
    PLAYING: 1,
    PAUSED: 2,
    GAME_OVER: 3
};

// Worm Game Class
class WormGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.state = GameState.IDLE;
        this.score = 0;
        this.level = 1;
        this.gameSpeed = 120; // milliseconds

        // Worm segments - each segment is {x, y}
        this.worm = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ];

        this.direction = { x: 1, y: 0 }; // Initial direction: right
        this.nextDirection = { x: 1, y: 0 };

        // Food
        this.food = this.generateFood();
        this.bonusFood = null;
        this.bonusSpawnChance = 0.15; // 15% chance to spawn bonus after eating
        this.foodEaten = 0;

        // Time Slow Power-up
        this.isTimeSlow = false;
        this.timeSlowEndTime = 0;
        this.timeSlowDuration = 5000; // 5 seconds in milliseconds
        this.originalGameSpeed = this.gameSpeed;
        this.timeSlowMultiplier = 2; // Game runs 2x slower

        // Initialize audio object reference but don't create it yet
        this.gameOverAudio = null;
        this.audioInitialized = false;

        // Game loop variables
        this.lastRenderTime = 0;
        this.gameLoopInterval = null;

        this.setupEventListeners();
        this.setupAudioContext(); // Initialize audio context on user interaction
        this.render();
    }

    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));

        // Button controls
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('restartBtn').addEventListener('click', () => this.restart());
        
        // Canvas click for audio context
        this.canvas.addEventListener('click', () => this.setupAudioContext());
    }
    
    setupAudioContext() {
        // Create audio context on first user interaction to comply with autoplay policy
        if (this.audioContext === undefined) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.audioInitialized = true;
        }
        
        // Resume the audio context if it's suspended (common on mobile browsers and GitHub Pages)
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume()
                .then(() => {
                    console.log("Audio context resumed successfully");
                })
                .catch((err) => {
                    console.log("Failed to resume audio context:", err);
                });
        }
    }

    handleKeyDown(e) {
        if (this.state === GameState.IDLE && ['arrowup', 'w', 'arrowdown', 's', 'arrowleft', 'a', 'arrowright', 'd'].includes(e.key.toLowerCase())) {
            this.startGame();
        }
        switch (e.key.toLowerCase()) {
            case 'arrowup':
            case 'w':
                e.preventDefault();
                if (this.direction.y === 0) {
                    this.nextDirection = { x: 0, y: -1 };
                }
                break;
            case 'arrowdown':
            case 's':
                e.preventDefault();
                if (this.direction.y === 0) {
                    this.nextDirection = { x: 0, y: 1 };
                }
                break;
            case 'arrowleft':
            case 'a':
                e.preventDefault();
                if (this.direction.x === 0) {
                    this.nextDirection = { x: -1, y: 0 };
                }
                break;
            case 'arrowright':
            case 'd':
                e.preventDefault();
                if (this.direction.x === 0) {
                    this.nextDirection = { x: 1, y: 0 };
                }
                break;
            case 'p':
                e.preventDefault();
                if (this.state === GameState.PLAYING || this.state === GameState.PAUSED) {
                    this.togglePause();
                }
                break;
        }
    }

    generateFood() {
        let food;
        let collision = false;
        do {
            collision = false;
            food = {
                x: Math.floor(Math.random() * GRID_COLS),
                y: Math.floor(Math.random() * GRID_ROWS)
            };
            // Make sure food doesn't spawn on worm
            for (let segment of this.worm) {
                if (segment.x === food.x && segment.y === food.y) {
                    collision = true;
                    break;
                }
            }
        } while (collision);
        return food;
    }

    generateBonusFood() {
        let bonus;
        let collision = false;
        do {
            collision = false;
            bonus = {
                x: Math.floor(Math.random() * GRID_COLS),
                y: Math.floor(Math.random() * GRID_ROWS)
            };
            // Make sure bonus food doesn't spawn on worm or regular food
            for (let segment of this.worm) {
                if (segment.x === bonus.x && segment.y === bonus.y) {
                    collision = true;
                    break;
                }
            }
            if (!collision && bonus.x === this.food.x && bonus.y === this.food.y) {
                collision = true;
            }
        } while (collision);
        return bonus;
    }

    startGame() {
        if (this.state === GameState.IDLE) {
            this.state = GameState.PLAYING;
            document.getElementById('startBtn').style.display = 'none';
            document.getElementById('pauseBtn').style.display = 'inline-block';
            this.gameLoopInterval = setInterval(() => this.update(), this.gameSpeed);
        }
    }

    togglePause() {
        if (this.state === GameState.PLAYING) {
            this.state = GameState.PAUSED;
            clearInterval(this.gameLoopInterval);
            document.getElementById('pauseBtn').textContent = 'Resume';
        } else if (this.state === GameState.PAUSED) {
            this.state = GameState.PLAYING;
            document.getElementById('pauseBtn').textContent = 'Pause';
            this.gameLoopInterval = setInterval(() => this.update(), this.gameSpeed);
        }
    }

    update() {
        // Update time slow effect
        if (this.isTimeSlow && Date.now() >= this.timeSlowEndTime) {
            this.deactivateTimeSlow();
        }

        // Update direction
        this.direction = this.nextDirection;

        // Calculate new head position
        const head = this.worm[0];
        const newHead = {
            x: head.x + this.direction.x,
            y: head.y + this.direction.y
        };

        // Check wall collision
        if (this.checkWallCollision(newHead)) {
            this.endGame();
            return;
        }

        // Check self collision
        if (this.checkSelfCollision(newHead)) {
            this.endGame();
            return;
        }

        // Add new head
        this.worm.unshift(newHead);

        // Check regular food collision
        if (newHead.x === this.food.x && newHead.y === this.food.y) {
            this.foodEaten++;
            this.score += 10 * this.level;
            this.food = this.generateFood();

            // Randomly spawn bonus food after eating regular food
            if (Math.random() < this.bonusSpawnChance && !this.bonusFood) {
                this.bonusFood = this.generateBonusFood();
            }

            // Level up every 5 food eaten
            if (this.foodEaten % 5 === 0) {
                this.levelUp();
            }

            this.updateUI();
        } 
        // Check bonus food collision
        else if (this.bonusFood && newHead.x === this.bonusFood.x && newHead.y === this.bonusFood.y) {
            this.score += 50 * this.level;
            this.activateTimeSlow();
            this.bonusFood = null;
            this.updateUI();
        } 
        else {
            // Remove tail if no food eaten
            this.worm.pop();
        }

        this.render();
    }

    activateTimeSlow() {
        if (!this.isTimeSlow) {
            this.isTimeSlow = true;
            this.timeSlowEndTime = Date.now() + this.timeSlowDuration;
            this.originalGameSpeed = this.gameSpeed;
            this.gameSpeed = this.gameSpeed * this.timeSlowMultiplier;
            
            // Restart the game loop with new speed
            clearInterval(this.gameLoopInterval);
            if (this.state === GameState.PLAYING) {
                this.gameLoopInterval = setInterval(() => this.update(), this.gameSpeed);
            }
        }
    }

    deactivateTimeSlow() {
        this.isTimeSlow = false;
        this.gameSpeed = this.originalGameSpeed;
        clearInterval(this.gameLoopInterval);
        if (this.state === GameState.PLAYING) {
            this.gameLoopInterval = setInterval(() => this.update(), this.gameSpeed);
        }
    }

    checkWallCollision(head) {
        return head.x < 0 || head.x >= GRID_COLS || head.y < 0 || head.y >= GRID_ROWS;
    }

    checkSelfCollision(head) {
        for (let segment of this.worm) {
            if (head.x === segment.x && head.y === segment.y) {
                return true;
            }
        }
        return false;
    }

    levelUp() {
        this.level++;
        this.gameSpeed = Math.max(80, 150 - this.level * 10);
        clearInterval(this.gameLoopInterval);
        if (this.state === GameState.PLAYING) {
            this.gameLoopInterval = setInterval(() => this.update(), this.gameSpeed);
        }
    }

    endGame() {
        this.state = GameState.GAME_OVER;
        clearInterval(this.gameLoopInterval);
        this.showGameOverScreen();
        
        console.log("Game Over triggered - attempting to play audio");
        
        // Create and play audio object only when needed
        try {
            // Check if audio context is initialized before playing audio
            if (this.audioInitialized || this.audioContext?.state === 'running') {
                // Create audio element with the correct path for GitHub Pages
                this.gameOverAudio = new Audio();
                this.gameOverAudio.src = './assets/indian-meme.mp3';  // Use relative path with './'
                this.gameOverAudio.preload = 'auto';
                
                // Load audio and play when ready
                this.gameOverAudio.load();
                
                const playAudio = () => {
                    this.gameOverAudio.currentTime = 0;
                    const playPromise = this.gameOverAudio.play();
                    
                    if (playPromise !== undefined) {
                        playPromise
                            .then(() => {
                                console.log("Audio played successfully");
                            })
                            .catch(error => {
                                console.log("Audio play failed:", error);
                                // Fallback: try to play after a small delay
                                setTimeout(() => {
                                    if (this.gameOverAudio) {
                                        const retryPlay = this.gameOverAudio.play();
                                        if (retryPlay !== undefined) {
                                            retryPlay.catch(err => console.log("Retry also failed:", err));
                                        }
                                    }
                                }, 100);
                            });
                    }
                };
                
                // If audio is already loaded, play immediately
                if (this.gameOverAudio.readyState >= 2) { // HAVE_CURRENT_DATA
                    playAudio();
                } else {
                    // Otherwise, wait for the audio to load
                    this.gameOverAudio.addEventListener('loadeddata', playAudio, { once: true });
                }
            } else {
                console.log("Audio context not initialized, attempting to initialize now");
                // Attempt to initialize audio context if not already done
                this.setupAudioContext();
                
                // Set up a retry mechanism
                setTimeout(() => {
                    if (this.audioContext?.state === 'running') {
                        this.gameOverAudio = new Audio();
                        this.gameOverAudio.src = './assets/indian-meme.mp3';
                        this.gameOverAudio.preload = 'auto';
                        this.gameOverAudio.load();
                        
                        this.gameOverAudio.addEventListener('loadeddata', () => {
                            this.gameOverAudio.currentTime = 0;
                            this.gameOverAudio.play().catch(err => console.log("Delayed audio play also failed:", err));
                        }, { once: true });
                    } else {
                        console.log("Audio context still not initialized after retry");
                    }
                }, 100);
            }
        } catch (e) {
            console.log("Error creating audio object:", e);
        }
    }

    showGameOverScreen() {
        document.getElementById('finalScore').textContent = `Final Score: ${this.score}`;
        document.getElementById('finalLength').textContent = `Worm Length: ${this.worm.length}`;
        document.getElementById('gameOverScreen').classList.remove('hidden');
    }

    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('length').textContent = this.worm.length;
        document.getElementById('level').textContent = this.level;
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw grid (optional - for reference)
        this.drawGrid();

        // Draw food
        this.drawFood();

        // Draw bonus food
        if (this.bonusFood) {
            this.drawBonusFood();
        }

        // Draw worm
        this.drawWorm();

        // Draw time slow indicator
        if (this.isTimeSlow) {
            this.drawTimeSlowIndicator();
        }

        // Draw pause indicator
        if (this.state === GameState.PAUSED) {
            this.drawPauseScreen();
        }
    }

    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.lineWidth = 0.5;

        for (let i = 0; i <= GRID_COLS; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * GRID_SIZE, 0);
            this.ctx.lineTo(i * GRID_SIZE, CANVAS_HEIGHT);
            this.ctx.stroke();
        }

        for (let i = 0; i <= GRID_ROWS; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * GRID_SIZE);
            this.ctx.lineTo(CANVAS_WIDTH, i * GRID_SIZE);
            this.ctx.stroke();
        }
    }

    drawWorm() {
        for (let i = 0; i < this.worm.length; i++) {
            const segment = this.worm[i];
            const x = segment.x * GRID_SIZE;
            const y = segment.y * GRID_SIZE;

            if (i === 0) {
                // Head
                this.ctx.fillStyle = '#4ecca3';
                this.ctx.shadowColor = 'rgba(78, 204, 163, 0.8)';
                this.ctx.shadowBlur = 10;
            } else {
                // Body
                const hue = 120 + (i * 5) % 60;
                this.ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
                this.ctx.shadowColor = `hsla(${hue}, 70%, 50%, 0.4)`;
                this.ctx.shadowBlur = 5;
            }

            // Draw rounded rectangle
            this.drawRoundedRect(x + 2, y + 2, GRID_SIZE - 4, GRID_SIZE - 4, 3);
            this.ctx.fill();

            // Draw eyes on head
            if (i === 0) {
                this.ctx.fillStyle = 'white';
                const eyeOffsetX = this.direction.x !== 0 ? (this.direction.x > 0 ? 6 : 2) : 4;
                const eyeOffsetY = this.direction.y !== 0 ? (this.direction.y > 0 ? 6 : 2) : 4;
                this.ctx.fillRect(x + eyeOffsetX, y + eyeOffsetY, 3, 3);
            }
        }

        this.ctx.shadowColor = 'transparent';
    }

    drawFood() {
        const x = this.food.x * GRID_SIZE;
        const y = this.food.y * GRID_SIZE;

        // Draw food with glow
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.shadowColor = 'rgba(255, 107, 107, 0.8)';
        this.ctx.shadowBlur = 15;
        this.ctx.beginPath();
        this.ctx.arc(x + GRID_SIZE / 2, y + GRID_SIZE / 2, GRID_SIZE / 2 - 3, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw shine effect
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.beginPath();
        this.ctx.arc(x + GRID_SIZE / 2 - 3, y + GRID_SIZE / 2 - 3, 3, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.shadowColor = 'transparent';
    }

    drawBonusFood() {
        const x = this.bonusFood.x * GRID_SIZE;
        const y = this.bonusFood.y * GRID_SIZE;

        // Draw bonus food with larger glow and star shape
        const centerX = x + GRID_SIZE / 2;
        const centerY = y + GRID_SIZE / 2;

        // Animate the bonus food
        const pulse = Math.sin(Date.now() / 200) * 0.5 + 0.5;
        const glowSize = 20 + pulse * 5;

        // Draw glowing halo
        this.ctx.fillStyle = `rgba(255, 215, 0, ${0.3 * pulse})`;
        this.ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
        this.ctx.shadowBlur = glowSize;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, GRID_SIZE / 2 + 2, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw star shape for bonus
        this.ctx.fillStyle = '#FFD700';
        this.drawStar(centerX, centerY, 5, GRID_SIZE / 2 - 2, GRID_SIZE / 2 - 6);
        this.ctx.fill();

        // Draw shine effect
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.beginPath();
        this.ctx.arc(centerX - 3, centerY - 3, 2, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.shadowColor = 'transparent';
    }

    drawStar(cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let step = Math.PI / spikes;

        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            this.ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
            rot += step;

            this.ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
            rot += step;
        }
        this.ctx.lineTo(cx, cy - outerRadius);
        this.ctx.closePath();
    }

    drawTimeSlowIndicator() {
        const timeRemaining = Math.max(0, this.timeSlowEndTime - Date.now()) / 1000;
        
        // Draw semi-transparent overlay
        this.ctx.fillStyle = 'rgba(135, 206, 250, 0.1)';
        this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw time slow indicator box
        const boxWidth = 150;
        const boxHeight = 50;
        const boxX = CANVAS_WIDTH - boxWidth - 10;
        const boxY = 10;

        // Background box
        this.ctx.fillStyle = 'rgba(135, 206, 250, 0.8)';
        this.ctx.strokeStyle = '#87CEFA';
        this.ctx.lineWidth = 2;
        this.ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        this.ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // Text
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('⏱️ TIME SLOW', boxX + boxWidth / 2, boxY + 18);
        this.ctx.font = '16px Arial';
        this.ctx.fillText(timeRemaining.toFixed(1) + 's', boxX + boxWidth / 2, boxY + 38);
    }

    drawRoundedRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
    }

    drawPauseScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 40px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

        this.ctx.font = '20px Arial';
        this.ctx.fillText('Press P or Resume to continue', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
    }

    restart() {
        this.score = 0;
        this.level = 1;
        this.gameSpeed = 120;
        this.foodEaten = 0;
        this.worm = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.food = this.generateFood();
        this.bonusFood = null;
        this.isTimeSlow = false;
        this.state = GameState.IDLE;

        console.log("Restart function called - stopping audio");
        
        // Stop game over audio if it exists
        if (this.gameOverAudio) {
            console.log("Stopping audio on restart");
            this.gameOverAudio.pause();
            this.gameOverAudio.currentTime = 0;
            // Set to null to release the resource
            this.gameOverAudio = null;
        }
        // Clear any pending audio
        this.pendingGameOverAudio = false;

        clearInterval(this.gameLoopInterval);
        document.getElementById('gameOverScreen').classList.add('hidden');
        document.getElementById('pauseBtn').textContent = 'Pause';
        document.getElementById('startBtn').style.display = 'inline-block';
        document.getElementById('pauseBtn').style.display = 'none';

        this.updateUI();
        this.render();
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new WormGame();
});
