// Hangman game variables
let word;
let guessedLetters = [];
let incorrectGuesses = 0;
const maxIncorrectGuesses = 6;
let gameActive = true;

// Word bank for the game
const wordBank = [
    'JAVASCRIPT', 'PYTHON', 'COMPUTER', 'PROGRAMMING', 'ALGORITHM',
    'FUNCTION', 'VARIABLE', 'STRING', 'ARRAY', 'OBJECT',
    'HANGMAN', 'GUESS', 'LETTER', 'WORD', 'GAME',
    'DEVELOPER', 'CODE', 'SYNTAX', 'DEBUG', 'LOOP',
    'CONDITIONAL', 'OPERATOR', 'METHOD', 'CLASS', 'FRAMEWORK'
];

// DOM elements
const wordPlaceholder = document.getElementById('wordPlaceholder');
const incorrectLettersDisplay = document.getElementById('incorrectLettersDisplay');
const alphabetContainer = document.querySelector('.alphabet-container');
const restartButton = document.getElementById('restartButton');
const gameMessage = document.getElementById('gameMessage');
const canvas = document.getElementById('hangmanCanvas');
const ctx = canvas.getContext('2d');

// Initialize the game
function initGame() {
    // Select a random word from the word bank
    word = wordBank[Math.floor(Math.random() * wordBank.length)];
    guessedLetters = [];
    incorrectGuesses = 0;
    gameActive = true;
    
    // Clear the game message
    gameMessage.textContent = '';
    gameMessage.className = 'message';
    
    // Draw the initial hangman state
    drawHangman();
    
    // Display the word placeholder
    updateWordDisplay();
    
    // Display incorrect letters
    updateIncorrectLettersDisplay();
    
    // Generate alphabet buttons
    generateAlphabetButtons();
}

// Update the word display with correct guesses and underscores
function updateWordDisplay() {
    const display = word.split('').map(letter => 
        guessedLetters.includes(letter) ? letter : '_'
    ).join(' ');
    
    wordPlaceholder.textContent = display;
    
    // Check if the player has won
    if (!display.includes('_')) {
        gameActive = false;
        gameMessage.textContent = 'Congratulations! You won!';
        gameMessage.classList.add('winner');
        
        // Disable all alphabet buttons
        disableAllAlphabetButtons();
    }
}

// Update the incorrect letters display
function updateIncorrectLettersDisplay() {
    incorrectLettersDisplay.textContent = guessedLetters.filter(letter => 
        !word.includes(letter)
    ).join(', ');
}

// Generate alphabet buttons
function generateAlphabetButtons() {
    // Clear the alphabet container
    alphabetContainer.innerHTML = '';
    
    // Create buttons for each letter of the alphabet
    for (let i = 65; i <= 90; i++) {
        const letter = String.fromCharCode(i);
        const button = document.createElement('button');
        button.classList.add('alphabet-btn');
        button.textContent = letter;
        button.addEventListener('click', () => handleLetterGuess(letter));
        alphabetContainer.appendChild(button);
    }
}

// Handle a letter guess
function handleLetterGuess(letter) {
    if (!gameActive || guessedLetters.includes(letter)) {
        return;
    }
    
    // Add the letter to guessed letters
    guessedLetters.push(letter);
    
    // Get the button element and disable it
    const button = Array.from(alphabetContainer.children).find(btn => btn.textContent === letter);
    button.disabled = true;
    
    // Check if the letter is in the word
    if (word.includes(letter)) {
        // Update the word display
        updateWordDisplay();
    } else {
        // Increment incorrect guesses
        incorrectGuesses++;
        
        // Draw the updated hangman
        drawHangman();
        
        // Update incorrect letters display
        updateIncorrectLettersDisplay();
        
        // Check if the player has lost
        if (incorrectGuesses >= maxIncorrectGuesses) {
            gameActive = false;
            gameMessage.textContent = `Game Over! The word was: ${word}`;
            gameMessage.classList.add('loser');
            
            // Disable all alphabet buttons
            disableAllAlphabetButtons();
        }
    }
}

// Disable all alphabet buttons
function disableAllAlphabetButtons() {
    const buttons = document.querySelectorAll('.alphabet-btn');
    buttons.forEach(button => {
        button.disabled = true;
    });
}

// Draw the hangman based on incorrect guesses
function drawHangman() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw stand
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    
    // Base
    ctx.beginPath();
    ctx.moveTo(50, 250);
    ctx.lineTo(250, 250);
    ctx.stroke();
    
    // Pole
    ctx.beginPath();
    ctx.moveTo(100, 250);
    ctx.lineTo(100, 50);
    ctx.stroke();
    
    // Top bar
    ctx.beginPath();
    ctx.moveTo(100, 50);
    ctx.lineTo(200, 50);
    ctx.stroke();
    
    // Rope
    ctx.beginPath();
    ctx.moveTo(200, 50);
    ctx.lineTo(200, 80);
    ctx.stroke();
    
    // Draw hangman parts based on incorrect guesses
    if (incorrectGuesses >= 1) {
        // Head
        ctx.beginPath();
        ctx.arc(200, 100, 20, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    if (incorrectGuesses >= 2) {
        // Body
        ctx.beginPath();
        ctx.moveTo(200, 120);
        ctx.lineTo(200, 180);
        ctx.stroke();
    }
    
    if (incorrectGuesses >= 3) {
        // Left arm
        ctx.beginPath();
        ctx.moveTo(200, 140);
        ctx.lineTo(170, 160);
        ctx.stroke();
    }
    
    if (incorrectGuesses >= 4) {
        // Right arm
        ctx.beginPath();
        ctx.moveTo(200, 140);
        ctx.lineTo(230, 160);
        ctx.stroke();
    }
    
    if (incorrectGuesses >= 5) {
        // Left leg
        ctx.beginPath();
        ctx.moveTo(200, 180);
        ctx.lineTo(170, 220);
        ctx.stroke();
    }
    
    if (incorrectGuesses >= 6) {
        // Right leg
        ctx.beginPath();
        ctx.moveTo(200, 180);
        ctx.lineTo(230, 220);
        ctx.stroke();
    }
}

// Event listener for the restart button
restartButton.addEventListener('click', initGame);

// Initialize the game when the page loads
window.onload = initGame;