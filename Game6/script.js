// Rock Paper Scissors Game Logic
let playerScore = 0;
let computerScore = 0;

// Get DOM elements
const playerScoreDisplay = document.getElementById('player-score');
const computerScoreDisplay = document.getElementById('computer-score');
const resultDisplay = document.getElementById('result');
const messageDisplay = document.getElementById('message');
const rockBtn = document.getElementById('rock');
const paperBtn = document.getElementById('paper');
const scissorsBtn = document.getElementById('scissors');

// Function to get computer's choice
function getComputerChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    const randomIndex = Math.floor(Math.random() * 3);
    return choices[randomIndex];
}

// Function to determine the winner
function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        return 'draw';
    }
    
    if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        return 'player';
    } else {
        return 'computer';
    }
}

// Function to update the game state
function playRound(playerChoice) {
    const computerChoice = getComputerChoice();
    const winner = determineWinner(playerChoice, computerChoice);
    
    // Update result display
    resultDisplay.textContent = `You chose ${playerChoice}. Computer chose ${computerChoice}.`;
    
    // Update score and message based on winner
    if (winner === 'draw') {
        messageDisplay.textContent = "It's a draw!";
        messageDisplay.style.color = '#555';
    } else if (winner === 'player') {
        playerScore++;
        playerScoreDisplay.textContent = playerScore;
        messageDisplay.textContent = 'You win this round!';
        messageDisplay.style.color = 'green';
    } else {
        computerScore++;
        computerScoreDisplay.textContent = computerScore;
        messageDisplay.textContent = 'Computer wins this round!';
        messageDisplay.style.color = 'red';
    }
    
    // Check for game winner (first to 5 points)
    if (playerScore === 5) {
        messageDisplay.textContent = 'Congratulations! You won the game!';
        messageDisplay.style.color = 'green';
        resetGame();
    } else if (computerScore === 5) {
        messageDisplay.textContent = 'Computer won the game! Try again!';
        messageDisplay.style.color = 'red';
        resetGame();
    }
}

// Function to reset the game when someone reaches 5 points
function resetGame() {
    setTimeout(() => {
        playerScore = 0;
        computerScore = 0;
        playerScoreDisplay.textContent = '0';
        computerScoreDisplay.textContent = '0';
        resultDisplay.textContent = '';
        messageDisplay.textContent = 'First to 5 points wins! Choose your move.';
        messageDisplay.style.color = '#555';
    }, 3000);
}

// Add event listeners to buttons
rockBtn.addEventListener('click', () => playRound('rock'));
paperBtn.addEventListener('click', () => playRound('paper'));
scissorsBtn.addEventListener('click', () => playRound('scissors'));

// Initialize message
messageDisplay.textContent = 'First to 5 points wins! Choose your move.';