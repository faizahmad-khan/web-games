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

// Power-up Types
const PowerUpType = {
    TIME_SLOW: 'timeSlow',
    SPEED_BOOST: 'speedBoost',
    SHIELD: 'shield',
    DOUBLE_POINTS: 'doublePoints',
    INVINCIBILITY: 'invincibility'
};

// Worm Game Class
class WormGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) {
            console.error('Canvas element not found!');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            console.error('Could not get canvas context!');
            return;
        }
        
        this.state = GameState.IDLE;
        this.score = 0;
        this.level = 1;
        this.gameSpeed = 120; // milliseconds

        // High Score (from localStorage)
        this.highScore = this.loadHighScore();

        // Worm segments - each segment is {x, y}
        this.worm = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ];

        this.direction = { x: 1, y: 0 }; // Initial direction: right
        this.nextDirection = { x: 1, y: 0 };

        // Multiplayer mode (new feature) - Initialize BEFORE food generation
        this.multiplayerMode = false;
        this.worm2 = null;
        this.direction2 = null;
        this.nextDirection2 = null;
        this.score2 = 0;
        this.worm2Active = true;

        // Obstacles (new feature) - Initialize BEFORE food generation
        this.obstacles = [];
        this.maxObstacles = 0;

        // Food - Initialize AFTER obstacles and multiplayer
        this.food = this.generateFood();
        this.bonusFood = null;
        this.bonusSpawnChance = 0.15; // 15% chance to spawn bonus after eating
        this.foodEaten = 0;

        // Power-ups (new feature)
        this.activePowerUps = [];
        this.powerUpSpawnChance = 0.12; // 12% chance
        this.currentPowerUp = null;

        // Time Slow Power-up (original)
        this.isTimeSlow = false;
        this.timeSlowEndTime = 0;
        this.timeSlowDuration = 5000; // 5 seconds in milliseconds
        this.originalGameSpeed = this.gameSpeed;
        this.timeSlowMultiplier = 2; // Game runs 2x slower

        // New Power-up states
        this.hasShield = false;
        this.isInvincible = false;
        this.invincibilityEndTime = 0;
        this.doublePointsActive = false;
        this.doublePointsEndTime = 0;
        this.speedBoostActive = false;
        this.speedBoostEndTime = 0;

        // Initialize audio object reference but don't create it yet
        this.gameOverAudio = null;
        this.audioInitialized = false;

        // Game loop variables
        this.lastRenderTime = 0;
        this.gameLoopInterval = null;

        this.setupEventListeners();
        this.setupAudioContext(); // Initialize audio context on user interaction
        this.updateHighScoreUI();
        this.render();
    }

    // High Score Management
    loadHighScore() {
        const saved = localStorage.getItem('wormGameHighScore');
        return saved ? parseInt(saved) : 0;
    }

    saveHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('wormGameHighScore', this.highScore.toString());
            this.updateHighScoreUI();
            return true;
        }
        return false;
    }

    updateHighScoreUI() {
        const highScoreElement = document.getElementById('highScore');
        if (highScoreElement) {
            highScoreElement.textContent = this.highScore;
        }
    }

    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));

        // Button controls
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('restartBtn').addEventListener('click', () => this.restart());
        
        // Multiplayer mode toggle
        const multiplayerToggle = document.getElementById('multiplayerToggle');
        if (multiplayerToggle) {
            multiplayerToggle.addEventListener('change', (e) => {
                this.toggleMultiplayer(e.target.checked);
            });
        }
        
        // Canvas click for audio context
        this.canvas.addEventListener('click', () => this.setupAudioContext());
    }

    toggleMultiplayer(enabled) {
        if (this.state === GameState.IDLE) {
            this.multiplayerMode = enabled;
            if (enabled) {
                this.initializePlayer2();
                const player2Info = document.getElementById('player2Info');
                if (player2Info) {
                    player2Info.style.display = 'flex';
                }
            } else {
                this.worm2 = null;
                const player2Info = document.getElementById('player2Info');
                if (player2Info) {
                    player2Info.style.display = 'none';
                }
            }
            this.render();
        }
    }

    initializePlayer2() {
        this.worm2 = [
            { x: 20, y: 10 },
            { x: 21, y: 10 },
            { x: 22, y: 10 }
        ];
        this.direction2 = { x: -1, y: 0 };
        this.nextDirection2 = { x: -1, y: 0 };
        this.score2 = 0;
        this.worm2Active = true;
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
        if (this.state === GameState.IDLE && ['arrowup', 'w', 'arrowdown', 's', 'arrowleft', 'a', 'arrowright', 'd', 'i', 'j', 'k', 'l'].includes(e.key.toLowerCase())) {
            this.startGame();
        }
        
        // Player 1 controls (Arrow keys and WASD)
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

        // Player 2 controls (IJKL) - only in multiplayer mode
        if (this.multiplayerMode && this.worm2Active) {
            switch (e.key.toLowerCase()) {
                case 'i':
                    e.preventDefault();
                    if (this.direction2.y === 0) {
                        this.nextDirection2 = { x: 0, y: -1 };
                    }
                    break;
                case 'k':
                    e.preventDefault();
                    if (this.direction2.y === 0) {
                        this.nextDirection2 = { x: 0, y: 1 };
                    }
                    break;
                case 'j':
                    e.preventDefault();
                    if (this.direction2.x === 0) {
                        this.nextDirection2 = { x: -1, y: 0 };
                    }
                    break;
                case 'l':
                    e.preventDefault();
                    if (this.direction2.x === 0) {
                        this.nextDirection2 = { x: 1, y: 0 };
                    }
                    break;
            }
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
            // Check worm2 in multiplayer
            if (!collision && this.multiplayerMode && this.worm2) {
                for (let segment of this.worm2) {
                    if (segment.x === food.x && segment.y === food.y) {
                        collision = true;
                        break;
                    }
                }
            }
            // Check obstacles
            if (!collision) {
                for (let obstacle of this.obstacles) {
                    if (obstacle.x === food.x && obstacle.y === food.y) {
                        collision = true;
                        break;
                    }
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
            // Check worm2 in multiplayer
            if (!collision && this.multiplayerMode && this.worm2) {
                for (let segment of this.worm2) {
                    if (segment.x === bonus.x && segment.y === bonus.y) {
                        collision = true;
                        break;
                    }
                }
            }
            if (!collision && bonus.x === this.food.x && bonus.y === this.food.y) {
                collision = true;
            }
            // Check obstacles
            if (!collision) {
                for (let obstacle of this.obstacles) {
                    if (obstacle.x === bonus.x && obstacle.y === bonus.y) {
                        collision = true;
                        break;
                    }
                }
            }
        } while (collision);
        return bonus;
    }

    generatePowerUp() {
        const types = [PowerUpType.SPEED_BOOST, PowerUpType.SHIELD, PowerUpType.DOUBLE_POINTS, PowerUpType.INVINCIBILITY];
        const type = types[Math.floor(Math.random() * types.length)];
        
        let powerUp;
        let collision = false;
        do {
            collision = false;
            powerUp = {
                x: Math.floor(Math.random() * GRID_COLS),
                y: Math.floor(Math.random() * GRID_ROWS),
                type: type,
                spawnTime: Date.now()
            };
            
            // Check all collision possibilities
            for (let segment of this.worm) {
                if (segment.x === powerUp.x && segment.y === powerUp.y) {
                    collision = true;
                    break;
                }
            }
            if (!collision && this.multiplayerMode && this.worm2) {
                for (let segment of this.worm2) {
                    if (segment.x === powerUp.x && segment.y === powerUp.y) {
                        collision = true;
                        break;
                    }
                }
            }
            if (!collision && (powerUp.x === this.food.x && powerUp.y === this.food.y)) {
                collision = true;
            }
            if (!collision && this.bonusFood && (powerUp.x === this.bonusFood.x && powerUp.y === this.bonusFood.y)) {
                collision = true;
            }
            if (!collision) {
                for (let obstacle of this.obstacles) {
                    if (obstacle.x === powerUp.x && obstacle.y === powerUp.y) {
                        collision = true;
                        break;
                    }
                }
            }
        } while (collision);
        
        return powerUp;
    }

    generateObstacles(count) {
        const newObstacles = [];
        for (let i = 0; i < count; i++) {
            let obstacle;
            let collision = false;
            let attempts = 0;
            do {
                collision = false;
                attempts++;
                if (attempts > 100) break; // Prevent infinite loop
                
                obstacle = {
                    x: Math.floor(Math.random() * GRID_COLS),
                    y: Math.floor(Math.random() * GRID_ROWS)
                };
                
                // Don't spawn near starting positions
                if ((obstacle.x >= 8 && obstacle.x <= 12 && obstacle.y >= 8 && obstacle.y <= 12) ||
                    (obstacle.x >= 18 && obstacle.x <= 24 && obstacle.y >= 8 && obstacle.y <= 12)) {
                    collision = true;
                    continue;
                }
                
                // Check all existing obstacles
                for (let existing of [...this.obstacles, ...newObstacles]) {
                    if (obstacle.x === existing.x && obstacle.y === existing.y) {
                        collision = true;
                        break;
                    }
                }
                
                // Check food and worms
                if (!collision && (obstacle.x === this.food.x && obstacle.y === this.food.y)) {
                    collision = true;
                }
                
                for (let segment of this.worm) {
                    if (obstacle.x === segment.x && obstacle.y === segment.y) {
                        collision = true;
                        break;
                    }
                }
            } while (collision);
            
            if (attempts <= 100) {
                newObstacles.push(obstacle);
            }
        }
        return newObstacles;
    }

    startGame() {
        if (this.state === GameState.IDLE) {
            this.state = GameState.PLAYING;
            const startBtn = document.getElementById('startBtn');
            const pauseBtn = document.getElementById('pauseBtn');
            
            if (startBtn) startBtn.style.display = 'none';
            if (pauseBtn) pauseBtn.style.display = 'inline-block';
            
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

        // Update power-up timers
        this.updatePowerUpTimers();

        // Update Player 1
        this.updateWorm(true);

        // Update Player 2 in multiplayer mode
        if (this.multiplayerMode && this.worm2Active) {
            this.updateWorm(false);
        }

        this.render();
    }

    updateWorm(isPlayer1) {
        const worm = isPlayer1 ? this.worm : this.worm2;
        const direction = isPlayer1 ? this.direction : this.direction2;
        const nextDirection = isPlayer1 ? this.nextDirection : this.nextDirection2;

        // Update direction
        if (isPlayer1) {
            this.direction = this.nextDirection;
        } else {
            this.direction2 = this.nextDirection2;
        }

        // Calculate new head position
        const head = worm[0];
        const newHead = {
            x: head.x + (isPlayer1 ? this.direction.x : this.direction2.x),
            y: head.y + (isPlayer1 ? this.direction.y : this.direction2.y)
        };

        // Check wall collision (unless invincible)
        if (this.checkWallCollision(newHead)) {
            if (isPlayer1 && this.isInvincible) {
                // Wrap around when invincible
                if (newHead.x < 0) newHead.x = GRID_COLS - 1;
                if (newHead.x >= GRID_COLS) newHead.x = 0;
                if (newHead.y < 0) newHead.y = GRID_ROWS - 1;
                if (newHead.y >= GRID_ROWS) newHead.y = 0;
            } else if (isPlayer1 && this.hasShield) {
                this.hasShield = false;
                this.updateUI();
                return; // Shield absorbed the hit
            } else {
                if (isPlayer1) {
                    this.endGame();
                } else {
                    this.worm2Active = false;
                    this.checkMultiplayerWinner();
                }
                return;
            }
        }

        // Check self collision
        if (this.checkSelfCollision(newHead, worm)) {
            if (isPlayer1 && (this.isInvincible || this.hasShield)) {
                if (this.hasShield) {
                    this.hasShield = false;
                    this.updateUI();
                }
                return;
            } else {
                if (isPlayer1) {
                    this.endGame();
                } else {
                    this.worm2Active = false;
                    this.checkMultiplayerWinner();
                }
                return;
            }
        }

        // Check obstacle collision
        if (this.checkObstacleCollision(newHead)) {
            if (isPlayer1 && (this.isInvincible || this.hasShield)) {
                if (this.hasShield) {
                    this.hasShield = false;
                    this.updateUI();
                }
                return;
            } else {
                if (isPlayer1) {
                    this.endGame();
                } else {
                    this.worm2Active = false;
                    this.checkMultiplayerWinner();
                }
                return;
            }
        }

        // Check collision with other worm in multiplayer
        if (this.multiplayerMode) {
            const otherWorm = isPlayer1 ? this.worm2 : this.worm;
            if (otherWorm && this.checkSelfCollision(newHead, otherWorm)) {
                if (isPlayer1 && (this.isInvincible || this.hasShield)) {
                    if (this.hasShield) {
                        this.hasShield = false;
                        this.updateUI();
                    }
                    return;
                } else {
                    if (isPlayer1) {
                        this.endGame();
                    } else {
                        this.worm2Active = false;
                        this.checkMultiplayerWinner();
                    }
                    return;
                }
            }
        }

        // Add new head
        worm.unshift(newHead);

        // Check regular food collision (only player 1 can eat food)
        if (isPlayer1 && newHead.x === this.food.x && newHead.y === this.food.y) {
            this.foodEaten++;
            const pointsEarned = 10 * this.level * (this.doublePointsActive ? 2 : 1);
            this.score += pointsEarned;
            this.food = this.generateFood();

            // Randomly spawn bonus food after eating regular food
            if (Math.random() < this.bonusSpawnChance && !this.bonusFood) {
                this.bonusFood = this.generateBonusFood();
            }

            // Randomly spawn new power-up
            if (Math.random() < this.powerUpSpawnChance && !this.currentPowerUp) {
                this.currentPowerUp = this.generatePowerUp();
            }

            // Level up every 5 food eaten
            if (this.foodEaten % 5 === 0) {
                this.levelUp();
            }

            this.updateUI();
        } 
        // Check bonus food collision (only player 1)
        else if (isPlayer1 && this.bonusFood && newHead.x === this.bonusFood.x && newHead.y === this.bonusFood.y) {
            const pointsEarned = 50 * this.level * (this.doublePointsActive ? 2 : 1);
            this.score += pointsEarned;
            this.activateTimeSlow();
            this.bonusFood = null;
            this.updateUI();
        }
        // Check power-up collision (only player 1)
        else if (isPlayer1 && this.currentPowerUp && newHead.x === this.currentPowerUp.x && newHead.y === this.currentPowerUp.y) {
            this.activatePowerUp(this.currentPowerUp.type);
            this.currentPowerUp = null;
        }
        else {
            // Remove tail if no food eaten
            worm.pop();
        }

        // Update player 2 score based on length in multiplayer
        if (!isPlayer1) {
            this.score2 = (worm.length - 3) * 10;
        }
    }

    checkMultiplayerWinner() {
        if (!this.worm2Active) {
            // Player 1 wins
            setTimeout(() => {
                alert('Player 1 Wins! 🎉');
                this.endGame();
            }, 100);
        }
    }

    updatePowerUpTimers() {
        // Invincibility
        if (this.isInvincible && Date.now() >= this.invincibilityEndTime) {
            this.isInvincible = false;
        }

        // Double Points
        if (this.doublePointsActive && Date.now() >= this.doublePointsEndTime) {
            this.doublePointsActive = false;
        }

        // Speed Boost
        if (this.speedBoostActive && Date.now() >= this.speedBoostEndTime) {
            this.deactivateSpeedBoost();
        }
    }

    activatePowerUp(type) {
        const duration = 5000; // 5 seconds for most power-ups

        switch (type) {
            case PowerUpType.SPEED_BOOST:
                if (!this.speedBoostActive) {
                    this.speedBoostActive = true;
                    this.speedBoostEndTime = Date.now() + duration;
                    this.originalGameSpeed = this.gameSpeed;
                    this.gameSpeed = Math.max(30, this.gameSpeed / 2); // 2x faster
                    
                    clearInterval(this.gameLoopInterval);
                    if (this.state === GameState.PLAYING) {
                        this.gameLoopInterval = setInterval(() => this.update(), this.gameSpeed);
                    }
                }
                break;

            case PowerUpType.SHIELD:
                this.hasShield = true;
                break;

            case PowerUpType.DOUBLE_POINTS:
                this.doublePointsActive = true;
                this.doublePointsEndTime = Date.now() + duration;
                break;

            case PowerUpType.INVINCIBILITY:
                this.isInvincible = true;
                this.invincibilityEndTime = Date.now() + duration;
                break;
        }
        
        this.updateUI();
    }

    deactivateSpeedBoost() {
        this.speedBoostActive = false;
        this.gameSpeed = this.originalGameSpeed;
        clearInterval(this.gameLoopInterval);
        if (this.state === GameState.PLAYING) {
            this.gameLoopInterval = setInterval(() => this.update(), this.gameSpeed);
        }
    }

    checkObstacleCollision(head) {
        for (let obstacle of this.obstacles) {
            if (head.x === obstacle.x && head.y === obstacle.y) {
                return true;
            }
        }
        return false;
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

    checkSelfCollision(head, worm = this.worm) {
        for (let segment of worm) {
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

        // Add obstacles every few levels
        if (this.level % 3 === 0 && this.obstacles.length < 15) {
            const newObstacles = this.generateObstacles(2);
            this.obstacles.push(...newObstacles);
            this.maxObstacles = this.obstacles.length;
        }
    }

    endGame() {
        this.state = GameState.GAME_OVER;
        clearInterval(this.gameLoopInterval);
        
        // Save high score
        const isNewHighScore = this.saveHighScore();
        
        this.showGameOverScreen(isNewHighScore);
        
        console.log("Game Over triggered - attempting to play audio");
        
        // Create and play audio object only when needed
        try {
            // Check if audio context is initialized before playing audio
            if (this.audioInitialized || this.audioContext?.state === 'running') {
                // Create audio element with the correct path for GitHub Pages
                this.gameOverAudio = new Audio();
                this.gameOverAudio.src = './assets/audio.mp3'; // Use relative path with './'
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
                        this.gameOverAudio.src = './assets/audio.mp3';
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

    showGameOverScreen(isNewHighScore) {
        document.getElementById('finalScore').textContent = `Final Score: ${this.score}`;
        document.getElementById('finalLength').textContent = `Worm Length: ${this.worm.length}`;
        
        const newHighScoreMsg = document.getElementById('newHighScoreMsg');
        if (newHighScoreMsg) {
            newHighScoreMsg.style.display = isNewHighScore ? 'block' : 'none';
        }
        
        document.getElementById('gameOverScreen').classList.remove('hidden');
    }

    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('length').textContent = this.worm.length;
        document.getElementById('level').textContent = this.level;
        
        // Update Player 2 UI in multiplayer mode
        if (this.multiplayerMode && this.worm2) {
            const score2Element = document.getElementById('score2');
            const length2Element = document.getElementById('length2');
            if (score2Element) score2Element.textContent = this.score2;
            if (length2Element) length2Element.textContent = this.worm2.length;
        }
        
        // Update power-up indicators
        const shieldIndicator = document.getElementById('shieldIndicator');
        if (shieldIndicator) {
            shieldIndicator.style.display = this.hasShield ? 'inline-block' : 'none';
        }
    }

    render() {
        if (!this.ctx) {
            console.error('Canvas context not available');
            return;
        }
        
        try {
            // Clear canvas
            this.ctx.fillStyle = '#1a1a2e';
            this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            // Draw grid (optional - for reference)
            this.drawGrid();

            // Draw obstacles
            this.drawObstacles();

        // Draw food
        this.drawFood();

        // Draw bonus food
        if (this.bonusFood) {
            this.drawBonusFood();
        }

        // Draw power-up
        if (this.currentPowerUp) {
            this.drawPowerUp(this.currentPowerUp);
        }

        // Draw worm (Player 1)
        this.drawWorm();

        // Draw worm 2 (Player 2) in multiplayer mode
        if (this.multiplayerMode && this.worm2 && this.worm2Active) {
            this.drawWorm2();
        }

        // Draw time slow indicator
        if (this.isTimeSlow) {
            this.drawTimeSlowIndicator();
        }

        // Draw active power-up indicators
        this.drawActivePowerUpIndicators();

        // Draw pause indicator
        if (this.state === GameState.PAUSED) {
            this.drawPauseScreen();
        }
        } catch (error) {
            console.error('Render error:', error);
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
        if (!this.ctx || !this.worm) return;
        
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
                this.ctx.shadowBlur = 0;
                this.ctx.fillStyle = 'white';
                const eyeOffsetX = this.direction.x !== 0 ? (this.direction.x > 0 ? 6 : 2) : 4;
                const eyeOffsetY = this.direction.y !== 0 ? (this.direction.y > 0 ? 6 : 2) : 4;
                this.ctx.fillRect(x + eyeOffsetX, y + eyeOffsetY, 3, 3);
            }
        }

        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
    }

    drawFood() {
        if (!this.ctx || !this.food) return;
        
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
        this.ctx.shadowBlur = 0;
        this.ctx.beginPath();
        this.ctx.arc(x + GRID_SIZE / 2 - 3, y + GRID_SIZE / 2 - 3, 3, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
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

    drawActivePowerUpIndicators() {
        const indicators = [];
        let yOffset = 70;

        if (this.isInvincible) {
            const timeRemaining = Math.max(0, this.invincibilityEndTime - Date.now()) / 1000;
            indicators.push({ text: '⭐ INVINCIBLE', time: timeRemaining, color: 'rgba(255, 215, 0, 0.9)' });
        }

        if (this.doublePointsActive) {
            const timeRemaining = Math.max(0, this.doublePointsEndTime - Date.now()) / 1000;
            indicators.push({ text: '💰 DOUBLE PTS', time: timeRemaining, color: 'rgba(76, 175, 80, 0.9)' });
        }

        if (this.speedBoostActive) {
            const timeRemaining = Math.max(0, this.speedBoostEndTime - Date.now()) / 1000;
            indicators.push({ text: '⚡ SPEED UP', time: timeRemaining, color: 'rgba(255, 152, 0, 0.9)' });
        }

        indicators.forEach((indicator, idx) => {
            const boxWidth = 150;
            const boxHeight = 50;
            const boxX = CANVAS_WIDTH - boxWidth - 10;
            const boxY = yOffset + (idx * 60);

            this.ctx.fillStyle = indicator.color;
            this.ctx.strokeStyle = indicator.color.replace('0.9', '1');
            this.ctx.lineWidth = 2;
            this.ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
            this.ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(indicator.text, boxX + boxWidth / 2, boxY + 18);
            this.ctx.font = '16px Arial';
            this.ctx.fillText(indicator.time.toFixed(1) + 's', boxX + boxWidth / 2, boxY + 38);
        });
    }

    drawObstacles() {
        if (!this.ctx || !this.obstacles) return;
        
        for (let obstacle of this.obstacles) {
            const x = obstacle.x * GRID_SIZE;
            const y = obstacle.y * GRID_SIZE;

            // Draw obstacle as gray blocks
            this.ctx.fillStyle = '#555';
            this.ctx.shadowColor = 'rgba(85, 85, 85, 0.6)';
            this.ctx.shadowBlur = 8;
            this.drawRoundedRect(x + 1, y + 1, GRID_SIZE - 2, GRID_SIZE - 2, 2);
            this.ctx.fill();

            // Add highlight
            this.ctx.fillStyle = '#777';
            this.ctx.shadowBlur = 0;
            this.drawRoundedRect(x + 3, y + 3, GRID_SIZE - 10, GRID_SIZE - 10, 1);
            this.ctx.fill();
        }
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
    }

    drawPowerUp(powerUp) {
        const x = powerUp.x * GRID_SIZE;
        const y = powerUp.y * GRID_SIZE;
        const centerX = x + GRID_SIZE / 2;
        const centerY = y + GRID_SIZE / 2;

        // Pulse animation
        const pulse = Math.sin(Date.now() / 150) * 0.3 + 0.7;

        let color, symbol;
        switch (powerUp.type) {
            case PowerUpType.SPEED_BOOST:
                color = '#FF9800';
                symbol = '⚡';
                break;
            case PowerUpType.SHIELD:
                color = '#2196F3';
                symbol = '🛡️';
                break;
            case PowerUpType.DOUBLE_POINTS:
                color = '#4CAF50';
                symbol = '💰';
                break;
            case PowerUpType.INVINCIBILITY:
                color = '#FFD700';
                symbol = '⭐';
                break;
        }

        // Glow effect
        this.ctx.fillStyle = color;
        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = 15 * pulse;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, (GRID_SIZE / 2 - 2) * pulse, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw symbol
        this.ctx.shadowBlur = 0;
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(symbol, centerX, centerY);

        this.ctx.shadowColor = 'transparent';
    }

    drawWorm2() {
        for (let i = 0; i < this.worm2.length; i++) {
            const segment = this.worm2[i];
            const x = segment.x * GRID_SIZE;
            const y = segment.y * GRID_SIZE;

            if (i === 0) {
                // Head
                this.ctx.fillStyle = '#ff6b9d';
                this.ctx.shadowColor = 'rgba(255, 107, 157, 0.8)';
                this.ctx.shadowBlur = 10;
            } else {
                // Body
                const hue = 330 + (i * 5) % 60;
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
                const eyeOffsetX = this.direction2.x !== 0 ? (this.direction2.x > 0 ? 6 : 2) : 4;
                const eyeOffsetY = this.direction2.y !== 0 ? (this.direction2.y > 0 ? 6 : 2) : 4;
                this.ctx.fillRect(x + eyeOffsetX, y + eyeOffsetY, 3, 3);
            }
        }

        this.ctx.shadowColor = 'transparent';
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
        
        // Reset new features
        this.currentPowerUp = null;
        this.hasShield = false;
        this.isInvincible = false;
        this.invincibilityEndTime = 0;
        this.doublePointsActive = false;
        this.doublePointsEndTime = 0;
        this.speedBoostActive = false;
        this.speedBoostEndTime = 0;
        this.obstacles = [];
        this.maxObstacles = 0;
        
        // Reset multiplayer
        if (this.multiplayerMode) {
            this.initializePlayer2();
        }
        
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
let game; // Global variable to access the game instance
document.addEventListener('DOMContentLoaded', () => {
    game = new WormGame();
});
