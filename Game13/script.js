// Hangman game variables
let word;
let guessedLetters = [];
let incorrectGuesses = 0;
const maxIncorrectGuesses = 6;
let gameActive = true;
let gamesWon = 0; // Track number of games won for level progression

// Word bank for the game
const wordBank = [
    'JAVASCRIPT', 'PYTHON', 'COMPUTER', 'PROGRAMMING', 'ALGORITHM',
    'FUNCTION', 'VARIABLE', 'STRING', 'ARRAY', 'OBJECT',
    'HANGMAN', 'GUESS', 'LETTER', 'WORD', 'GAME',
    'DEVELOPER', 'CODE', 'SYNTAX', 'DEBUG', 'LOOP',
    'CONDITIONAL', 'OPERATOR', 'METHOD', 'CLASS', 'FRAMEWORK',
    'BLOCKCHAIN', 'CHATBOT', 'METAVERSE', 'CRYPTOCURRENCY', 'ARTIFICIAL',
    'MACHINE', 'NEURAL', 'QUANTUM', 'STARTUP', 'INNOVATION',
    'VIRAL', 'INFLUENCER', 'PODCAST', 'STREAMING', 'SUSTAINABLE',
    'ELECTRIC', 'AUTONOMOUS', 'BIOMETRIC', 'CYBERSECURITY', 'WELLNESS',
    'MINDFULNESS', 'VEGAN', 'CROWDFUNDING', 'DISRUPTIVE', 'ANALYTICS'
];

// Hints for each word
const wordHints = {
    'JAVASCRIPT': 'A popular high-level programming language commonly used for web development, enabling interactive features on websites and running on both client and server sides.',
    'PYTHON': 'A versatile and beginner-friendly programming language known for its clean syntax, widely used in data science, artificial intelligence, web development, and automation.',
    'COMPUTER': 'An electronic device that processes data and performs calculations at high speeds, capable of storing information and executing programmed instructions.',
    'PROGRAMMING': 'The process of creating instructions for computers to follow, involving writing code in various languages to build software applications and solve problems.',
    'ALGORITHM': 'A step-by-step procedure or formula for solving a problem or completing a task, essential in computer science for efficient data processing and decision making.',
    'FUNCTION': 'A reusable block of code designed to perform a specific task, which can accept input parameters and return output values in programming.',
    'VARIABLE': 'A named storage location in programming that holds data which can be modified during program execution, with different types like numbers, strings, or booleans.',
    'STRING': 'A data type representing a sequence of characters or text in programming, commonly used for storing and manipulating textual information.',
    'ARRAY': 'A data structure that stores multiple elements of the same type in a contiguous memory location, accessible through index positions starting from zero.',
    'OBJECT': 'A fundamental data structure in programming that groups related data and functions together, containing properties and methods that define its characteristics and behaviors.',
    'HANGMAN': 'A classic word-guessing game where players try to figure out a hidden word by suggesting letters, with limited wrong guesses before losing.',
    'GUESS': 'The act of estimating or attempting to identify something without complete information, often used in games and problem-solving scenarios.',
    'LETTER': 'A character from an alphabet used in written language, serving as the basic unit for forming words and communicating ideas.',
    'WORD': 'A unit of language consisting of one or more letters that conveys meaning, functioning as the building block of sentences and communication.',
    'GAME': 'A structured activity or competition involving rules, challenges, and objectives, played for entertainment, education, or skill development.',
    'DEVELOPER': 'A professional who designs, creates, and maintains software applications using programming languages and development tools to solve real-world problems.',
    'CODE': 'Written instructions in a programming language that computers can interpret and execute to perform specific tasks or create applications.',
    'SYNTAX': 'The set of rules that define how programs must be written in a specific programming language, including proper structure, punctuation, and keyword usage.',
    'DEBUG': 'The process of identifying, analyzing, and removing errors or bugs from software code to ensure it runs correctly and efficiently.',
    'LOOP': 'A programming construct that repeatedly executes a block of code until a specified condition is met, essential for automating repetitive tasks.',
    'CONDITIONAL': 'A programming statement that executes different code blocks based on whether certain conditions are true or false, enabling decision-making in programs.',
    'OPERATOR': 'A symbol or keyword in programming that performs operations on values or variables, such as arithmetic, comparison, or logical operations.',
    'METHOD': 'A function associated with an object or class in programming that defines behaviors or actions that can be performed on that object.',
    'CLASS': 'A blueprint or template in object-oriented programming that defines the structure and behavior of objects, including their properties and methods.',
    'FRAMEWORK': 'A pre-built software platform providing structure and tools for developing applications more efficiently, offering reusable components and standardized patterns.',
    'BLOCKCHAIN': 'A distributed digital ledger technology that records transactions across multiple computers in a secure, transparent, and immutable way, powering cryptocurrencies.',
    'CHATBOT': 'An artificial intelligence program designed to simulate human conversation through text or voice, used for customer service, information retrieval, and automated assistance.',
    'METAVERSE': 'A collective virtual shared space combining augmented reality, virtual reality, and the internet, where users interact through digital avatars in immersive environments.',
    'CRYPTOCURRENCY': 'A digital or virtual currency secured by cryptography, operating independently of central banks and enabling decentralized peer-to-peer transactions.',
    'ARTIFICIAL': 'Created by humans rather than occurring naturally, often used in the context of artificial intelligence which mimics human cognitive functions.',
    'MACHINE': 'A device or system that performs tasks automatically or with mechanical power, in computing often refers to machine learning algorithms.',
    'NEURAL': 'Related to nerve cells or neurons, commonly used in neural networks which are computing systems inspired by biological brain structures for pattern recognition.',
    'QUANTUM': 'Related to the smallest units of energy and matter, in computing refers to quantum computers that use quantum mechanics for unprecedented processing power.',
    'STARTUP': 'A newly established business venture typically focused on developing innovative products or services, often in the technology sector with high growth potential.',
    'INNOVATION': 'The process of creating new ideas, methods, or products that bring positive change and improvement, driving progress in technology and society.',
    'VIRAL': 'Content that spreads rapidly and widely across the internet through social sharing, capturing massive attention and engagement in a short time.',
    'INFLUENCER': 'A person with significant social media following who shapes opinions and purchasing decisions of their audience through content creation and recommendations.',
    'PODCAST': 'A digital audio series available for streaming or download, covering various topics through episodic content that listeners can enjoy on-demand.',
    'STREAMING': 'The continuous transmission of audio or video content over the internet, allowing real-time consumption without downloading the entire file first.',
    'SUSTAINABLE': 'Practices or products designed to meet present needs without compromising future generations, focusing on environmental protection and resource conservation.',
    'ELECTRIC': 'Powered by electricity rather than fossil fuels, commonly referring to vehicles and devices that are more environmentally friendly and efficient.',
    'AUTONOMOUS': 'Operating independently without human intervention, often describing self-driving vehicles and automated systems that make decisions using artificial intelligence.',
    'BIOMETRIC': 'Biological measurements and characteristics used for identification and access control, including fingerprints, facial recognition, and iris scans.',
    'CYBERSECURITY': 'The practice of protecting computer systems, networks, and data from digital attacks, unauthorized access, and security breaches.',
    'WELLNESS': 'A holistic approach to health focusing on physical, mental, and emotional well-being through healthy lifestyle choices and self-care practices.',
    'MINDFULNESS': 'The practice of being fully present and engaged in the current moment, paying attention to thoughts and feelings without judgment for mental clarity.',
    'VEGAN': 'A lifestyle and diet that excludes all animal products, including meat, dairy, and eggs, often adopted for ethical, environmental, or health reasons.',
    'CROWDFUNDING': 'A method of raising money for projects or ventures by collecting small contributions from a large number of people, typically through online platforms.',
    'DISRUPTIVE': 'Innovation that significantly alters or replaces existing industries, technologies, or business models, creating new markets and value networks.',
    'ANALYTICS': 'The systematic analysis of data using statistical and computational methods to discover patterns, trends, and insights for informed decision-making.'
};

// DOM elements
const wordPlaceholder = document.getElementById('wordPlaceholder');
const incorrectLettersDisplay = document.getElementById('incorrectLettersDisplay');
const alphabetContainer = document.querySelector('.alphabet-container');
const restartButton = document.getElementById('restartButton');
const gameMessage = document.getElementById('gameMessage');
const canvas = document.getElementById('hangmanCanvas');
const ctx = canvas.getContext('2d');
const hintDisplay = document.getElementById('hintDisplay');

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
    
    // Display the hint for the current word
    updateHintDisplay();
    
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
        gamesWon++; // Increment the games won counter
        gameMessage.textContent = `Congratulations! You won Level ${gamesWon}!`;
        gameMessage.classList.add('winner');
        
        // Disable all alphabet buttons
        disableAllAlphabetButtons();
        
        // Add next level button if not already added
        addNextLevelButton();
    }
}

// Add next level button after winning
function addNextLevelButton() {
    // Remove any existing next level button
    const existingNextBtn = document.getElementById('nextLevelButton');
    if (existingNextBtn) {
        existingNextBtn.remove();
    }
    
    // Create next level button
    const nextLevelButton = document.createElement('button');
    nextLevelButton.id = 'nextLevelButton';
    nextLevelButton.classList.add('next-level-btn');
    nextLevelButton.textContent = 'Next Level';
    nextLevelButton.addEventListener('click', startNextLevel);
    
    // Insert after the restart button
    restartButton.insertAdjacentElement('afterend', nextLevelButton);
}

// Start next level
function startNextLevel() {
    // Remove the next level button
    const nextLevelButton = document.getElementById('nextLevelButton');
    if (nextLevelButton) {
        nextLevelButton.remove();
    }
    // Keep the gamesWon counter and start a new game
    initGame();
}

// Update the incorrect letters display
function updateIncorrectLettersDisplay() {
    incorrectLettersDisplay.textContent = guessedLetters.filter(letter =>
        !word.includes(letter)
    ).join(', ');
}

// Update the hint display
function updateHintDisplay() {
    if (hintDisplay && wordHints[word]) {
        hintDisplay.textContent = wordHints[word];
    }
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
            
            // Add next level button after losing too
            addNextLevelButton();
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
restartButton.addEventListener('click', () => {
    gamesWon = 0; // Reset the level counter when manually restarting
    initGame();
});

// Initialize the game when the page loads
window.onload = initGame;