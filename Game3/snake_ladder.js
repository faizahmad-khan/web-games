// Game State
let gameState = {
    players: [],
    currentPlayerIndex: 0,
    gameStarted: false,
    boardSize: 100,
    cellSize: 60,
    canvas: null,
    ctx: null,
    soundEnabled: true,
    darkMode: false,
    stats: {
        totalRolls: 0,
        snakeBites: 0,
        ladderClimbs: 0,
        powerUpsCollected: 0
    }
};

// Snake and Ladder positions
const snakes = {
    16: 6,
    47: 26,
    49: 11,
    56: 53,
    62: 19,
    64: 60,
    87: 24,
    93: 73,
    95: 75,
    98: 78
};

const ladders = {
    1: 38,
    4: 14,
    9: 31,
    21: 42,
    28: 84,
    36: 44,
    51: 67,
    71: 91,
    80: 100
};

// Power-up positions (randomized each game)
let powerUps = {};

const powerUpTypes = {
    extraTurn: { emoji: '⭐', name: 'Extra Turn', color: '#ffd700' },
    shield: { emoji: '🛡️', name: 'Shield', color: '#4169e1' },
    speedBoost: { emoji: '⚡', name: 'Speed Boost', color: '#ff4500' }
};

const availableColors = [
    { name: 'Red', color: '#ff4757' },
    { name: 'Blue', color: '#3742fa' },
    { name: 'Green', color: '#2ed573' },
    { name: 'Yellow', color: '#ffa502' },
    { name: 'Purple', color: '#a55eea' },
    { name: 'Pink', color: '#ff6b81' },
    { name: 'Orange', color: '#ff7f50' },
    { name: 'Cyan', color: '#1e90ff' }
];

// Sound effects (using Web Audio API)
const soundEffects = {
    diceRoll: () => playTone(200, 50),
    move: () => playTone(400, 30),
    snake: () => playTone(100, 200, 'sawtooth'),
    ladder: () => playTone(600, 200, 'sine'),
    powerUp: () => playTone(800, 100, 'square'),
    win: () => {
        [523, 659, 784, 1047].forEach((freq, i) => {
            setTimeout(() => playTone(freq, 100), i * 100);
        });
    }
};

function playTone(frequency, duration, type = 'sine') {
    if (!gameState.soundEnabled) return;
    
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = type;
        oscillator.frequency.value = frequency;
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (e) {
        console.log('Audio not supported');
    }
}

// Dark Mode Toggle
function toggleDarkMode() {
    gameState.darkMode = !gameState.darkMode;
    document.body.classList.toggle('dark-mode');
    const btn = document.getElementById('darkModeToggle');
    btn.textContent = gameState.darkMode ? '☀️' : '🌙';
    
    if (gameState.gameStarted) {
        drawBoard();
    }
}

// Sound Toggle
function toggleSound() {
    gameState.soundEnabled = !gameState.soundEnabled;
    const btn = document.getElementById('soundToggle');
    btn.textContent = gameState.soundEnabled ? '🔊' : '🔇';
}

// Initialize power-ups
function initializePowerUps() {
    powerUps = {};
    const powerUpPositions = [13, 27, 45, 68, 82];
    const types = Object.keys(powerUpTypes);
    
    powerUpPositions.forEach(pos => {
        const type = types[Math.floor(Math.random() * types.length)];
        powerUps[pos] = type;
    });
}

// Setup Functions
function setupPlayers() {
    const playerCount = parseInt(document.getElementById('playerCount').value);
    
    if (playerCount < 2 || playerCount > 4) {
        alert('Please select between 2 and 4 players!');
        return;
    }
    
    // Initialize players with power-ups
    gameState.players = [];
    for (let i = 0; i < playerCount; i++) {
        gameState.players.push({
            id: i + 1,
            name: `Player ${i + 1}`,
            position: 0,
            color: null,
            unlocked: false,
            powerUps: [],
            totalRolls: 0,
            snakesHit: 0,
            laddersClimbed: 0
        });
    }
    
    // Show color selection screen
    document.getElementById('setupScreen').classList.add('hidden');
    document.getElementById('colorScreen').classList.remove('hidden');
    
    renderColorSelection();
}

function renderColorSelection() {
    const container = document.getElementById('playerColorSelection');
    container.innerHTML = '';
    
    gameState.players.forEach((player, index) => {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player-color-item';
        
        const label = document.createElement('label');
        label.textContent = `Player ${index + 1}:`;
        playerDiv.appendChild(label);
        
        // Player name input
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.placeholder = `Enter name for Player ${index + 1}`;
        nameInput.value = player.name;
        nameInput.onchange = (e) => {
            gameState.players[index].name = e.target.value || `Player ${index + 1}`;
        };
        playerDiv.appendChild(nameInput);
        
        // Color options
        const colorLabel = document.createElement('label');
        colorLabel.textContent = 'Choose color:';
        colorLabel.style.marginTop = '10px';
        playerDiv.appendChild(colorLabel);
        
        const colorOptions = document.createElement('div');
        colorOptions.className = 'color-options';
        
        availableColors.forEach((colorObj, colorIndex) => {
            const colorBtn = document.createElement('div');
            colorBtn.className = 'color-option';
            colorBtn.style.backgroundColor = colorObj.color;
            colorBtn.title = colorObj.name;
            colorBtn.onclick = () => selectColor(index, colorObj.color, colorBtn);
            
            // Pre-select first available color for each player
            if (index === colorIndex) {
                colorBtn.classList.add('selected');
                gameState.players[index].color = colorObj.color;
            }
            
            colorOptions.appendChild(colorBtn);
        });
        
        playerDiv.appendChild(colorOptions);
        container.appendChild(playerDiv);
    });
}

function selectColor(playerIndex, color, element) {
    // Remove selection from all colors in this player's row
    const parent = element.parentElement;
    parent.querySelectorAll('.color-option').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Add selection to clicked color
    element.classList.add('selected');
    
    // Update player color
    gameState.players[playerIndex].color = color;
}

function startGame() {
    // Check if all players have selected colors
    const allColorsSelected = gameState.players.every(player => player.color !== null);
    
    if (!allColorsSelected) {
        alert('Please select a color for each player!');
        return;
    }
    
    // Initialize game
    gameState.gameStarted = true;
    gameState.currentPlayerIndex = 0;
    
    // Initialize power-ups
    initializePowerUps();
    
    // Reset stats
    gameState.stats = {
        totalRolls: 0,
        snakeBites: 0,
        ladderClimbs: 0,
        powerUpsCollected: 0
    };
    
    // Setup canvas
    gameState.canvas = document.getElementById('gameBoard');
    gameState.ctx = gameState.canvas.getContext('2d');
    
    // Show game screen
    document.getElementById('colorScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');
    
    // Render game
    renderPlayersInfo();
    drawBoard();
    updateCurrentTurn();
    updateStats();
    addLog('🎮 Game started! Each player must roll 1 to unlock and start playing.');
}

// Rendering Functions
function renderPlayersInfo() {
    const container = document.getElementById('playersInfo');
    container.innerHTML = '';
    
    gameState.players.forEach((player, index) => {
        const playerCard = document.createElement('div');
        playerCard.className = 'player-card';
        playerCard.id = `player-${index}`;
        
        if (index === gameState.currentPlayerIndex) {
            playerCard.classList.add('active');
        }
        
        const powerUpsHtml = player.powerUps.length > 0 
            ? `<div class="power-ups">${player.powerUps.map(p => powerUpTypes[p].emoji).join(' ')}</div>`
            : '';
        
        playerCard.innerHTML = `
            <h4>
                <span class="player-token" style="background-color: ${player.color}"></span>
                ${player.name}
            </h4>
            <p>Position: ${player.position}${!player.unlocked ? ' (🔒 Locked)' : ''}</p>
            ${powerUpsHtml}
        `;
        
        container.appendChild(playerCard);
    });
}

function updateStats() {
    const statsContent = document.getElementById('statsContent');
    statsContent.innerHTML = `
        <div class="stat-item">
            <span>Total Rolls:</span>
            <span>${gameState.stats.totalRolls}</span>
        </div>
        <div class="stat-item">
            <span>🐍 Snake Bites:</span>
            <span>${gameState.stats.snakeBites}</span>
        </div>
        <div class="stat-item">
            <span>🪜 Ladders Climbed:</span>
            <span>${gameState.stats.ladderClimbs}</span>
        </div>
        <div class="stat-item">
            <span>⭐ Power-ups:</span>
            <span>${gameState.stats.powerUpsCollected}</span>
        </div>
    `;
}

function updateCurrentTurn() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    document.getElementById('currentTurn').textContent = currentPlayer.name;
    document.getElementById('currentTurn').style.color = currentPlayer.color;
    
    // Update active player card
    document.querySelectorAll('.player-card').forEach((card, index) => {
        if (index === gameState.currentPlayerIndex) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });
}

function drawBoard() {
    const ctx = gameState.ctx;
    const canvas = gameState.canvas;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw cells
    for (let i = 1; i <= 100; i++) {
        const pos = getCellPosition(i);
        
        // Alternate colors for cells (adapt to dark mode)
        const row = Math.floor((i - 1) / 10);
        const col = (i - 1) % 10;
        const isEven = (row + col) % 2 === 0;
        
        if (gameState.darkMode) {
            ctx.fillStyle = isEven ? '#2d5016' : '#4a4016';
        } else {
            ctx.fillStyle = isEven ? '#e8f5e9' : '#fff9c4';
        }
        
        ctx.fillRect(pos.x, pos.y, gameState.cellSize, gameState.cellSize);
        ctx.strokeStyle = gameState.darkMode ? '#555' : '#333';
        ctx.lineWidth = 1;
        ctx.strokeRect(pos.x, pos.y, gameState.cellSize, gameState.cellSize);
        
        // Draw cell number
        ctx.fillStyle = gameState.darkMode ? '#ccc' : '#333';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(i, pos.x + gameState.cellSize / 2, pos.y + 5);
        
        // Draw power-ups
        if (powerUps[i]) {
            const powerUpType = powerUpTypes[powerUps[i]];
            ctx.font = '24px Arial';
            ctx.fillText(powerUpType.emoji, pos.x + gameState.cellSize / 2, pos.y + gameState.cellSize / 2);
        }
    }
    
    // Draw snakes
    ctx.strokeStyle = '#ff4757';
    ctx.lineWidth = 4;
    for (const [start, end] of Object.entries(snakes)) {
        drawSnake(parseInt(start), parseInt(end));
    }
    
    // Draw ladders
    ctx.strokeStyle = '#2ed573';
    ctx.lineWidth = 4;
    for (const [start, end] of Object.entries(ladders)) {
        drawLadder(parseInt(start), parseInt(end));
    }
    
    // Draw players
    drawPlayers();
}


function getCellPosition(cellNumber) {
    const row = Math.floor((cellNumber - 1) / 10);
    const col = (cellNumber - 1) % 10;
    
    // Snake pattern: odd rows go right to left
    const actualCol = row % 2 === 0 ? col : 9 - col;
    
    return {
        x: actualCol * gameState.cellSize,
        y: (9 - row) * gameState.cellSize
    };
}

function drawSnake(start, end) {
    const ctx = gameState.ctx;
    const startPos = getCellPosition(start);
    const endPos = getCellPosition(end);
    
    const startX = startPos.x + gameState.cellSize / 2;
    const startY = startPos.y + gameState.cellSize / 2;
    const endX = endPos.x + gameState.cellSize / 2;
    const endY = endPos.y + gameState.cellSize / 2;
    
    // Calculate control points for curved snake body
    const dx = endX - startX;
    const dy = endY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Create smooth curved snake path
    const segments = 25;
    const points = [];
    
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const x = startX + dx * t;
        const y = startY + dy * t;
        
        // Add wave effect for snake body
        const wave = Math.sin(t * Math.PI * 2.5) * 20;
        const perpX = -dy / distance * wave;
        const perpY = dx / distance * wave;
        
        points.push({ x: x + perpX, y: y + perpY });
    }
    
    // Draw snake outline (red border like reference)
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 18;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    
    // Draw snake body (yellow/orange like reference)
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 14;
    ctx.stroke();
    
    // Draw snake head
    const angle = Math.atan2(dy, dx);
    const headSize = 14;
    
    // Head circle (yellow)
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(startX, startY, headSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Head outline (red)
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Eyes
    const eyeOffset = 5;
    const eyeSize = 3;
    
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(startX + Math.cos(angle + 0.4) * eyeOffset, 
            startY + Math.sin(angle + 0.4) * eyeOffset, 
            eyeSize, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(startX + Math.cos(angle - 0.4) * eyeOffset, 
            startY + Math.sin(angle - 0.4) * eyeOffset, 
            eyeSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Tongue
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const tongueX = startX + Math.cos(angle) * headSize;
    const tongueY = startY + Math.sin(angle) * headSize;
    ctx.moveTo(tongueX, tongueY);
    ctx.lineTo(tongueX + Math.cos(angle) * 10, tongueY + Math.sin(angle) * 10);
    ctx.stroke();
}

function drawLadder(start, end) {
    const ctx = gameState.ctx;
    const startPos = getCellPosition(start);
    const endPos = getCellPosition(end);
    
    const startX = startPos.x + gameState.cellSize / 2;
    const startY = startPos.y + gameState.cellSize / 2;
    const endX = endPos.x + gameState.cellSize / 2;
    const endY = endPos.y + gameState.cellSize / 2;
    
    const ladderWidth = 8;
    
    // Calculate angle for rotation
    const angle = Math.atan2(endY - startY, endX - startX);
    const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    
    ctx.save();
    ctx.translate(startX, startY);
    ctx.rotate(angle);
    
    // Draw ladder rails (black borders)
    ctx.fillStyle = '#000000';
    ctx.fillRect(-ladderWidth, 0, 6, length);
    ctx.fillRect(ladderWidth - 6, 0, 6, length);
    
    // Draw yellow/black striped rungs like reference image
    const numRungs = Math.floor(length / 25) + 1;
    const stripeWidth = (ladderWidth * 2) / 8; // 8 stripes per rung
    
    for (let i = 0; i <= numRungs; i++) {
        const y = (length / numRungs) * i;
        
        // Draw black background for rung
        ctx.fillStyle = '#000000';
        ctx.fillRect(-ladderWidth, y - 4, ladderWidth * 2, 8);
        
        // Draw yellow stripes
        for (let s = 0; s < 8; s++) {
            if (s % 2 === 0) {
                ctx.fillStyle = '#FFFF00';
                ctx.fillRect(-ladderWidth + s * stripeWidth, y - 4, stripeWidth, 8);
            }
        }
    }
    
    ctx.restore();
}

function drawPlayers() {
    const ctx = gameState.ctx;
    
    gameState.players.forEach((player, index) => {
        if (player.position > 0) {
            const pos = getCellPosition(player.position);
            const offsetX = (index % 2) * 15 - 7.5;
            const offsetY = Math.floor(index / 2) * 15 - 7.5;
            
            const x = pos.x + gameState.cellSize / 2 + offsetX;
            const y = pos.y + gameState.cellSize / 2 + offsetY + 20;
            
            // Draw player token
            ctx.fillStyle = player.color;
            ctx.beginPath();
            ctx.arc(x, y, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw player number
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(player.id, x, y);
        }
    });
}

// Game Logic
function rollDice() {
    if (!gameState.gameStarted) return;
    
    const diceBtn = document.getElementById('rollDiceBtn');
    diceBtn.disabled = true;
    
    const diceDisplay = document.getElementById('diceDisplay');
    diceDisplay.classList.add('rolling');
    
    soundEffects.diceRoll();
    
    // Animate dice roll
    let counter = 0;
    const rollInterval = setInterval(() => {
        const randomNum = Math.floor(Math.random() * 6) + 1;
        showDiceFace(randomNum);
        counter++;
        
        if (counter > 10) {
            clearInterval(rollInterval);
            const finalRoll = Math.floor(Math.random() * 6) + 1;
            showDiceFace(finalRoll);
            diceDisplay.classList.remove('rolling');
            
            gameState.stats.totalRolls++;
            updateStats();
            
            movePlayer(finalRoll);
            
            setTimeout(() => {
                diceBtn.disabled = false;
            }, 1000);
        }
    }, 100);
}

function showDiceFace(number) {
    const diceFace = document.querySelector('.dice-face');
    diceFace.innerHTML = '';
    
    const positions = {
        1: [4],
        2: [0, 8],
        3: [0, 4, 8],
        4: [0, 2, 6, 8],
        5: [0, 2, 4, 6, 8],
        6: [0, 2, 3, 5, 6, 8]
    };
    
    positions[number].forEach(pos => {
        const dot = document.createElement('div');
        dot.className = 'dot';
        dot.style.gridArea = `${Math.floor(pos / 3) + 1} / ${(pos % 3) + 1}`;
        diceFace.appendChild(dot);
    });
}

function movePlayer(steps) {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    // Check if player is locked (needs to roll 1 to start)
    if (!currentPlayer.unlocked) {
        if (steps === 1) {
            currentPlayer.unlocked = true;
            document.getElementById('diceMessage').textContent = 
                `${currentPlayer.name} rolled 1! 🎉 Unlocked! Roll again!`;
            addLog(`${currentPlayer.name} rolled 1 and is now unlocked! Gets another turn!`);
            renderPlayersInfo();
            drawBoard();
            // Don't move to next turn - player gets another chance
            setTimeout(() => {
                document.getElementById('diceMessage').textContent = 
                    `${currentPlayer.name}'s turn again! Roll the dice!`;
            }, 2000);
        } else {
            document.getElementById('diceMessage').textContent = 
                `${currentPlayer.name} rolled ${steps}. Need to roll 1 to unlock! 🔒`;
            addLog(`${currentPlayer.name} rolled ${steps} but needs to roll 1 to start playing.`);
            nextTurn();
        }
        return;
    }
    
    const oldPosition = currentPlayer.position;
    let newPosition = oldPosition + steps;
    
    // Check if player can move
    if (newPosition > 100) {
        document.getElementById('diceMessage').textContent = 
            `${currentPlayer.name} rolled ${steps}. Need exact number to win!`;
        addLog(`${currentPlayer.name} rolled ${steps} but needs exact number to reach 100.`);
        nextTurn();
        return;
    }
    
    currentPlayer.position = newPosition;
    currentPlayer.totalRolls++;
    soundEffects.move();
    
    document.getElementById('diceMessage').textContent = 
        `${currentPlayer.name} rolled ${steps} and moved to ${newPosition}`;
    addLog(`${currentPlayer.name} rolled ${steps} and moved from ${oldPosition} to ${newPosition}.`);
    
    // Check for power-ups
    if (powerUps[newPosition]) {
        const powerUpType = powerUps[newPosition];
        currentPlayer.powerUps.push(powerUpType);
        delete powerUps[newPosition];
        gameState.stats.powerUpsCollected++;
        
        soundEffects.powerUp();
        showPowerUpNotification(powerUpTypes[powerUpType].emoji + ' ' + powerUpTypes[powerUpType].name);
        addLog(`✨ ${currentPlayer.name} collected a ${powerUpTypes[powerUpType].name} power-up!`, 'power-up');
        
        updateStats();
    }
    
    drawBoard();
    renderPlayersInfo();
    
    // Check for snake (can be blocked by shield)
    if (snakes[newPosition]) {
        const shieldIndex = currentPlayer.powerUps.indexOf('shield');
        if (shieldIndex !== -1) {
            // Shield protects from snake
            currentPlayer.powerUps.splice(shieldIndex, 1);
            setTimeout(() => {
                soundEffects.powerUp();
                document.getElementById('diceMessage').textContent += 
                    ` 🛡️ Shield protected you from the snake!`;
                addLog(`🛡️ ${currentPlayer.name}'s shield blocked the snake!`, 'power-up');
                renderPlayersInfo();
                checkWinner();
            }, 1000);
        } else {
            const snakeEnd = snakes[newPosition];
            setTimeout(() => {
                currentPlayer.position = snakeEnd;
                currentPlayer.snakesHit++;
                gameState.stats.snakeBites++;
                soundEffects.snake();
                document.getElementById('diceMessage').textContent += 
                    ` 🐍 Snake! Slid down to ${snakeEnd}`;
                addLog(`Oh no! ${currentPlayer.name} was bitten by a snake and slid down to ${snakeEnd}!`, 'snake');
                drawBoard();
                renderPlayersInfo();
                updateStats();
                checkWinner();
            }, 1000);
        }
    }
    // Check for ladder
    else if (ladders[newPosition]) {
        const ladderEnd = ladders[newPosition];
        setTimeout(() => {
            currentPlayer.position = ladderEnd;
            currentPlayer.laddersClimbed++;
            gameState.stats.ladderClimbs++;
            soundEffects.ladder();
            document.getElementById('diceMessage').textContent += 
                ` 🪜 Ladder! Climbed up to ${ladderEnd}`;
            addLog(`Awesome! ${currentPlayer.name} found a ladder and climbed to ${ladderEnd}!`, 'ladder');
            drawBoard();
            renderPlayersInfo();
            updateStats();
            checkWinner();
        }, 1000);
    } else {
        setTimeout(() => {
            checkWinner();
        }, 500);
    }
}

function checkWinner() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    if (currentPlayer.position === 100) {
        setTimeout(() => {
            showWinner(currentPlayer);
        }, 500);
    } else {
        // Check for extra turn power-up
        const extraTurnIndex = currentPlayer.powerUps.indexOf('extraTurn');
        if (extraTurnIndex !== -1) {
            currentPlayer.powerUps.splice(extraTurnIndex, 1);
            setTimeout(() => {
                soundEffects.powerUp();
                document.getElementById('diceMessage').textContent = 
                    `⭐ ${currentPlayer.name} gets an extra turn!`;
                addLog(`⭐ ${currentPlayer.name} used Extra Turn power-up!`, 'power-up');
                renderPlayersInfo();
            }, 1500);
        } else {
            setTimeout(() => {
                nextTurn();
            }, 1500);
        }
    }
}

function nextTurn() {
    gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    updateCurrentTurn();
    document.getElementById('diceMessage').textContent = '';
}

function showPowerUpNotification(message) {
    const notification = document.getElementById('powerUpNotification');
    notification.textContent = message;
    notification.classList.remove('hidden');
    
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 2000);
}

function showWinner(player) {
    const modal = document.getElementById('winnerModal');
    const winnerText = document.getElementById('winnerText');
    const winnerStats = document.getElementById('winnerStats');
    
    soundEffects.win();
    
    winnerText.innerHTML = `<strong style="color: ${player.color}">${player.name}</strong> wins the game!`;
    
    winnerStats.innerHTML = `
        <p>🎲 Rolls: ${player.totalRolls}</p>
        <p>🐍 Snake Bites: ${player.snakesHit}</p>
        <p>🪜 Ladders Climbed: ${player.laddersClimbed}</p>
    `;
    
    modal.classList.remove('hidden');
    
    // Create confetti
    createConfetti();
    
    addLog(`🎉 ${player.name} has won the game! 🎉`);
}

function createConfetti() {
    const container = document.getElementById('confettiContainer');
    container.innerHTML = '';
    
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        container.appendChild(confetti);
    }
}

function addLog(message, type = '') {
    const logContainer = document.getElementById('gameLog');
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${type}`;
    logEntry.textContent = message;
    
    logContainer.insertBefore(logEntry, logContainer.firstChild);
    
    // Keep only last 20 entries
    while (logContainer.children.length > 20) {
        logContainer.removeChild(logContainer.lastChild);
    }
}

// Control Functions
function resetGame() {
    // Reset game state
    gameState.players.forEach(player => {
        player.position = 0;
        player.unlocked = false;
        player.powerUps = [];
        player.totalRolls = 0;
        player.snakesHit = 0;
        player.laddersClimbed = 0;
    });
    gameState.currentPlayerIndex = 0;
    
    // Reset stats
    gameState.stats = {
        totalRolls: 0,
        snakeBites: 0,
        ladderClimbs: 0,
        powerUpsCollected: 0
    };
    
    // Reinitialize power-ups
    initializePowerUps();
    
    // Hide winner modal if visible
    document.getElementById('winnerModal').classList.add('hidden');
    
    // Clear log
    document.getElementById('gameLog').innerHTML = '';
    
    // Reset dice
    showDiceFace(1);
    document.getElementById('diceMessage').textContent = '';
    
    // Redraw board
    drawBoard();
    renderPlayersInfo();
    updateCurrentTurn();
    updateStats();
    
    addLog('🔄 Game reset! Each player needs to roll 1 to start. Good luck everyone!');
}

function exitGame() {
    if (confirm('Are you sure you want to exit the game?')) {
        // Reset everything
        gameState = {
            players: [],
            currentPlayerIndex: 0,
            gameStarted: false,
            boardSize: 100,
            cellSize: 60,
            canvas: null,
            ctx: null,
            soundEnabled: gameState.soundEnabled,
            darkMode: gameState.darkMode,
            stats: {
                totalRolls: 0,
                snakeBites: 0,
                ladderClimbs: 0,
                powerUpsCollected: 0
            }
        };
        
        // Show setup screen
        document.getElementById('gameScreen').classList.add('hidden');
        document.getElementById('winnerModal').classList.add('hidden');
        document.getElementById('colorScreen').classList.add('hidden');
        document.getElementById('setupScreen').classList.remove('hidden');
        
        // Reset input
        document.getElementById('playerCount').value = 2;
    }
}

// Initialize on load
window.addEventListener('load', () => {
    console.log('🎮 Snake & Ladder Game - Enhanced Edition loaded successfully!');
    showDiceFace(1);
});
