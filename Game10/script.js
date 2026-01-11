document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const movesDisplay = document.getElementById('moves');
    const matchesDisplay = document.getElementById('matches');
    const resetBtn = document.getElementById('reset-btn');
    const totalMatchesDisplay = document.getElementById('total-matches');

    // Card symbols
    const symbols = ['🍎', '🍌', '🍒', '🍇', '🍊', '🍓', '🍑', '🥝'];
    
    // Game state
    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let lockBoard = false;

    // Initialize game
    function initGame() {
        // Reset game state
        cards = [];
        flippedCards = [];
        matchedPairs = 0;
        moves = 0;
        lockBoard = false;
        
        // Update displays
        movesDisplay.textContent = moves;
        matchesDisplay.textContent = matchedPairs;
        totalMatchesDisplay.textContent = symbols.length;
        
        // Clear game board
        gameBoard.innerHTML = '';
        
        // Create card pairs
        let gameSymbols = [...symbols, ...symbols];
        shuffleArray(gameSymbols);
        
        // Create cards
        gameSymbols.forEach((symbol, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.index = index;
            
            const front = document.createElement('div');
            front.classList.add('front');
            front.textContent = symbol;
            
            const back = document.createElement('div');
            back.classList.add('back');
            back.textContent = '?';
            
            card.appendChild(front);
            card.appendChild(back);
            
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
            cards.push(card);
        });
    }

    // Shuffle array using Fisher-Yates algorithm
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Flip card function
    function flipCard() {
        if (lockBoard) return;
        if (this === flippedCards[0]) return;
        
        this.classList.add('flipped');
        flippedCards.push(this);
        
        if (flippedCards.length === 2) {
            moves++;
            movesDisplay.textContent = moves;
            
            checkForMatch();
        }
    }

    // Check for matching cards
    function checkForMatch() {
        const [firstCard, secondCard] = flippedCards;
        const isMatch = 
            firstCard.querySelector('.front').textContent === 
            secondCard.querySelector('.front').textContent;
        
        if (isMatch) {
            disableCards();
            matchedPairs++;
            matchesDisplay.textContent = matchedPairs;
            
            // Check for win
            if (matchedPairs === symbols.length) {
                setTimeout(() => {
                    alert(`Congratulations! You won in ${moves} moves!`);
                }, 500);
            }
        } else {
            unflipCards();
        }
    }

    // Disable matched cards
    function disableCards() {
        flippedCards.forEach(card => {
            card.classList.add('matched');
            card.removeEventListener('click', flipCard);
        });
        
        flippedCards = [];
        lockBoard = false;
    }

    // Unflip non-matching cards
    function unflipCards() {
        lockBoard = true;
        
        setTimeout(() => {
            flippedCards.forEach(card => {
                card.classList.remove('flipped');
            });
            
            flippedCards = [];
            lockBoard = false;
        }, 1000);
    }

    // Reset button event listener
    resetBtn.addEventListener('click', initGame);

    // Initialize the game
    initGame();
});