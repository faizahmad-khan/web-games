// ========== UNO CARD GAME ==========

(() => {
    'use strict';

    // ---- Constants ----
    const COLORS = ['red', 'blue', 'green', 'yellow'];
    const VALUES = ['0','1','2','3','4','5','6','7','8','9','skip','reverse','draw2'];
    const WILD_TYPES = ['wild', 'wild4'];
    const STARTING_HAND = 7;
    const BOT_DELAY = 800;
    const UNO_WINDOW = 3000;

    const DISPLAY = {
        skip: '⊘',
        reverse: '⇄',
        draw2: '+2',
        wild: '🌈',
        wild4: '+4'
    };

    const LABEL = {
        skip: 'SKIP',
        reverse: 'REVERSE',
        draw2: 'DRAW TWO',
        wild: 'WILD',
        wild4: 'WILD +4'
    };

    // ---- DOM refs ----
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const dom = {
        mainMenu: $('#main-menu'),
        rulesScreen: $('#rules-screen'),
        gameScreen: $('#game-screen'),
        numBots: $('#num-bots'),
        btnPlay: $('#btn-play'),
        btnRules: $('#btn-rules'),
        btnBackMenu: $('#btn-back-menu'),
        opponentsArea: $('#opponents-area'),
        drawPile: $('#draw-pile'),
        discardPile: $('#discard-pile'),
        directionIndicator: $('#direction-indicator'),
        currentColor: $('#current-color'),
        gameMessage: $('#game-message'),
        playerHand: $('#player-hand'),
        unoBtn: $('#uno-btn'),
        colorPicker: $('#color-picker'),
        gameOver: $('#game-over'),
        winnerText: $('#winner-text'),
        finalScores: $('#final-scores'),
        btnPlayAgain: $('#btn-play-again'),
        btnMainMenu: $('#btn-main-menu'),
    };

    // ---- Game State ----
    let state = {};

    function initState(numBots) {
        const playerCount = 1 + numBots;
        state = {
            deck: [],
            discardPile: [],
            players: [],
            playerCount,
            currentPlayer: 0,
            direction: 1, // 1 = clockwise, -1 = counter
            currentColor: null,
            currentValue: null,
            gameActive: false,
            unoCalled: Array(playerCount).fill(false),
            pendingWild: null,
            turnLocked: false,
        };

        // Create players
        const botNames = ['Bot Alice', 'Bot Bob', 'Bot Carol'];
        state.players.push({ name: 'You', hand: [], isBot: false });
        for (let i = 0; i < numBots; i++) {
            state.players.push({ name: botNames[i], hand: [], isBot: true });
        }
    }

    // ---- Deck ----
    function createDeck() {
        const deck = [];
        for (const color of COLORS) {
            // One 0 per color
            deck.push({ color, value: '0' });
            // Two of each 1-9, skip, reverse, draw2
            for (const val of VALUES.slice(1)) {
                deck.push({ color, value: val });
                deck.push({ color, value: val });
            }
        }
        // 4 Wilds, 4 Wild Draw Fours
        for (let i = 0; i < 4; i++) {
            deck.push({ color: 'wild', value: 'wild' });
            deck.push({ color: 'wild', value: 'wild4' });
        }
        return deck;
    }

    function shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }

    function drawCard() {
        if (state.deck.length === 0) {
            // Reshuffle discard pile (keep top card)
            const top = state.discardPile.pop();
            state.deck = shuffleDeck(state.discardPile);
            state.discardPile = [top];
        }
        return state.deck.pop();
    }

    function drawCards(count) {
        const cards = [];
        for (let i = 0; i < count; i++) {
            const card = drawCard();
            if (card) cards.push(card);
        }
        return cards;
    }

    // ---- Card logic ----
    function canPlay(card) {
        if (card.color === 'wild') return true;
        if (card.color === state.currentColor) return true;
        if (card.value === state.currentValue) return true;
        return false;
    }

    function getCardDisplay(card) {
        if (DISPLAY[card.value]) return DISPLAY[card.value];
        return card.value;
    }

    function getCardLabel(card) {
        if (LABEL[card.value]) return LABEL[card.value];
        return '';
    }

    function getCardColorClass(card) {
        if (card.color === 'wild') return 'card-wild';
        return `card-${card.color}`;
    }

    function scoreHand(hand) {
        let score = 0;
        for (const card of hand) {
            const v = card.value;
            if (v === 'wild' || v === 'wild4') score += 50;
            else if (v === 'skip' || v === 'reverse' || v === 'draw2') score += 20;
            else score += parseInt(v, 10);
        }
        return score;
    }

    // ---- Next player ----
    function nextPlayerIndex(from) {
        return (from + state.direction + state.playerCount) % state.playerCount;
    }

    function advanceTurn() {
        state.currentPlayer = nextPlayerIndex(state.currentPlayer);
    }

    // ---- Rendering ----
    function createCardElement(card, clickable = false) {
        const el = document.createElement('div');
        el.className = `game-card ${getCardColorClass(card)}`;
        if (clickable && canPlay(card)) el.classList.add('playable');

        const display = getCardDisplay(card);
        const label = getCardLabel(card);
        const corner = DISPLAY[card.value] || card.value;

        el.innerHTML = `
            <span class="card-corner top-left">${corner}</span>
            <span class="card-value">${display}</span>
            ${label ? `<span class="card-label">${label}</span>` : ''}
            <span class="card-corner bottom-right">${corner}</span>
        `;
        return el;
    }

    function renderDiscardPile() {
        const top = state.discardPile[state.discardPile.length - 1];
        if (!top) return;
        dom.discardPile.innerHTML = '';
        const cardEl = createCardElement(top);
        cardEl.style.width = '100%';
        cardEl.style.height = '100%';
        cardEl.style.borderRadius = '12px';
        dom.discardPile.appendChild(cardEl);
    }

    function renderPlayerHand() {
        const player = state.players[0];
        dom.playerHand.innerHTML = '';
        const isMyTurn = state.currentPlayer === 0 && !state.turnLocked;
        player.hand.forEach((card, idx) => {
            const el = createCardElement(card, isMyTurn);
            el.classList.add('deal-anim');
            el.style.animationDelay = `${idx * 0.03}s`;
            if (isMyTurn && canPlay(card)) {
                el.addEventListener('click', () => playerPlayCard(idx));
            }
            dom.playerHand.appendChild(el);
        });
    }

    function renderOpponents() {
        dom.opponentsArea.innerHTML = '';
        for (let i = 1; i < state.playerCount; i++) {
            const p = state.players[i];
            const div = document.createElement('div');
            div.className = 'opponent';
            const isActive = state.currentPlayer === i;
            div.innerHTML = `
                <span class="opponent-name ${isActive ? 'active-turn' : ''}">${p.name}</span>
                <div class="opponent-cards">
                    ${p.hand.slice(0, 15).map(() => '<div class="opponent-card"><span class="opponent-card-text">UNO</span></div>').join('')}
                </div>
                <span class="opponent-card-count">${p.hand.length} card${p.hand.length !== 1 ? 's' : ''}</span>
            `;
            dom.opponentsArea.appendChild(div);
        }
    }

    function renderDirection() {
        dom.directionIndicator.textContent = '↻';
        dom.directionIndicator.classList.toggle('counter-clockwise', state.direction === -1);
    }

    function renderCurrentColor() {
        dom.currentColor.className = 'current-color';
        if (state.currentColor) {
            dom.currentColor.classList.add(`color-${state.currentColor}`);
        }
    }

    function setMessage(msg) {
        dom.gameMessage.textContent = msg;
    }

    function renderAll() {
        renderDiscardPile();
        renderPlayerHand();
        renderOpponents();
        renderDirection();
        renderCurrentColor();
        updateUnoButton();
    }

    // ---- UNO button ----
    function updateUnoButton() {
        const player = state.players[0];
        if (player.hand.length === 1 && !state.unoCalled[0] && state.gameActive) {
            dom.unoBtn.classList.remove('hidden');
        } else {
            dom.unoBtn.classList.add('hidden');
        }
    }

    function callUno(playerIdx) {
        state.unoCalled[playerIdx] = true;
        if (playerIdx === 0) {
            dom.unoBtn.classList.add('hidden');
            setMessage('You called UNO! 🎉');
        }
    }

    function checkUnoPenalty(playerIdx) {
        const p = state.players[playerIdx];
        if (p.hand.length === 1 && !state.unoCalled[playerIdx]) {
            // Penalty: draw 2 cards
            const penalty = drawCards(2);
            p.hand.push(...penalty);
            state.unoCalled[playerIdx] = false;
            if (playerIdx === 0) {
                setMessage('Forgot to call UNO! Draw 2 penalty cards! 😬');
            } else {
                setMessage(`${p.name} forgot to call UNO! +2 penalty!`);
            }
        }
    }

    // ---- Play card logic ----
    function applyCard(card, playerIdx) {
        state.currentValue = card.value;
        if (card.color !== 'wild') {
            state.currentColor = card.color;
        }

        const next = nextPlayerIndex(state.currentPlayer);

        switch (card.value) {
            case 'skip':
                setMessage(`${state.players[next].name} is skipped! ⊘`);
                advanceTurn(); // skip the next player
                break;
            case 'reverse':
                if (state.playerCount === 2) {
                    // In 2-player, reverse acts as skip
                    setMessage('Reverse! ⇄ (acts as skip)');
                    advanceTurn();
                } else {
                    state.direction *= -1;
                    setMessage('Direction reversed! ⇄');
                }
                break;
            case 'draw2': {
                const target = nextPlayerIndex(state.currentPlayer);
                const drawn = drawCards(2);
                state.players[target].hand.push(...drawn);
                setMessage(`${state.players[target].name} draws 2 cards! +2`);
                advanceTurn(); // skip affected player
                break;
            }
            case 'wild4': {
                const target = nextPlayerIndex(state.currentPlayer);
                const drawn = drawCards(4);
                state.players[target].hand.push(...drawn);
                // Color will be chosen via picker/bot logic
                advanceTurn(); // skip affected player
                break;
            }
        }
    }

    function checkWin(playerIdx) {
        if (state.players[playerIdx].hand.length === 0) {
            state.gameActive = false;
            showGameOver(playerIdx);
            return true;
        }
        return false;
    }

    // ---- Player actions ----
    function playerPlayCard(cardIdx) {
        if (!state.gameActive || state.currentPlayer !== 0 || state.turnLocked) return;

        const player = state.players[0];
        const card = player.hand[cardIdx];
        if (!canPlay(card)) return;

        state.turnLocked = true;
        player.hand.splice(cardIdx, 1);
        state.discardPile.push(card);

        // Check UNO status before this play (if they had 2 cards, now have 1)
        if (player.hand.length === 1) {
            state.unoCalled[0] = false; // Reset - they need to press UNO
        }

        if (card.color === 'wild') {
            // Show color picker
            applyCard(card, 0);
            renderAll();
            showColorPicker((color) => {
                state.currentColor = color;
                if (card.value === 'wild4') {
                    setMessage(`You played Wild +4! Color is now ${color}!`);
                } else {
                    setMessage(`Color is now ${color}!`);
                }
                renderAll();
                if (!checkWin(0)) {
                    // Check UNO penalty after a brief delay
                    setTimeout(() => {
                        checkUnoPenalty(0);
                        advanceTurn();
                        renderAll();
                        nextTurn();
                    }, 500);
                }
            });
            return;
        }

        applyCard(card, 0);
        renderAll();

        if (!checkWin(0)) {
            setTimeout(() => {
                checkUnoPenalty(0);
                advanceTurn();
                renderAll();
                nextTurn();
            }, 500);
        }
    }

    function playerDraw() {
        if (!state.gameActive || state.currentPlayer !== 0 || state.turnLocked) return;

        state.turnLocked = true;
        const card = drawCard();
        if (!card) {
            state.turnLocked = false;
            return;
        }

        state.players[0].hand.push(card);
        renderPlayerHand();
        setMessage('You drew a card.');

        // If drawn card can be played, offer it
        if (canPlay(card)) {
            setTimeout(() => {
                state.turnLocked = false;
                setMessage('You drew a playable card! Click it to play or wait.');
                renderPlayerHand();
                // Auto-pass after a timeout if they don't play
                setTimeout(() => {
                    if (state.currentPlayer === 0 && state.gameActive && !state.turnLocked) {
                        // Player chose not to play - pass
                        state.turnLocked = true;
                        advanceTurn();
                        renderAll();
                        nextTurn();
                    }
                }, 5000);
            }, 400);
        } else {
            setTimeout(() => {
                advanceTurn();
                renderAll();
                nextTurn();
            }, 600);
        }
    }

    // ---- Bot AI ----
    function botTurn(playerIdx) {
        if (!state.gameActive) return;

        const bot = state.players[playerIdx];
        setMessage(`${bot.name} is thinking...`);

        setTimeout(() => {
            if (!state.gameActive || state.currentPlayer !== playerIdx) return;

            // Find playable cards
            const playable = [];
            bot.hand.forEach((card, idx) => {
                if (canPlay(card)) playable.push({ card, idx });
            });

            if (playable.length === 0) {
                // Draw a card
                const drawn = drawCard();
                if (drawn) {
                    bot.hand.push(drawn);
                    setMessage(`${bot.name} draws a card.`);
                    if (canPlay(drawn)) {
                        // Play the drawn card
                        setTimeout(() => botPlayCard(playerIdx, bot.hand.length - 1), BOT_DELAY / 2);
                        return;
                    }
                }
                advanceTurn();
                renderAll();
                nextTurn();
                return;
            }

            // Bot strategy: prefer action cards, then color matches, then wilds last
            playable.sort((a, b) => {
                const scoreCard = (c) => {
                    if (c.value === 'wild4') return 0; // Save wild4
                    if (c.value === 'wild') return 1;
                    if (c.value === 'draw2') return 5;
                    if (c.value === 'skip') return 4;
                    if (c.value === 'reverse') return 3;
                    return 2;
                };
                return scoreCard(b.card) - scoreCard(a.card);
            });

            botPlayCard(playerIdx, playable[0].idx);
        }, BOT_DELAY);
    }

    function botPlayCard(playerIdx, cardIdx) {
        if (!state.gameActive) return;

        const bot = state.players[playerIdx];
        const card = bot.hand[cardIdx];
        bot.hand.splice(cardIdx, 1);
        state.discardPile.push(card);

        // Bot calls UNO automatically when it has 1 card
        if (bot.hand.length === 1) {
            // 80% chance bot remembers to call UNO
            if (Math.random() < 0.8) {
                state.unoCalled[playerIdx] = true;
                setMessage(`${bot.name} calls UNO! 🎉`);
            }
        }

        if (card.color === 'wild') {
            applyCard(card, playerIdx);
            // Bot picks color based on most cards of that color
            const colorCount = {};
            COLORS.forEach(c => colorCount[c] = 0);
            bot.hand.forEach(c => {
                if (c.color !== 'wild') colorCount[c.color]++;
            });
            const bestColor = COLORS.reduce((a, b) => colorCount[a] >= colorCount[b] ? a : b);
            state.currentColor = bestColor;

            if (card.value === 'wild4') {
                setMessage(`${bot.name} plays Wild +4! Color → ${bestColor}`);
            } else {
                setMessage(`${bot.name} plays Wild! Color → ${bestColor}`);
            }
        } else {
            applyCard(card, playerIdx);
            setMessage(`${bot.name} plays ${getCardDisplay(card)}`);
        }

        renderAll();

        if (!checkWin(playerIdx)) {
            setTimeout(() => {
                checkUnoPenalty(playerIdx);
                advanceTurn();
                renderAll();
                nextTurn();
            }, 600);
        }
    }

    // ---- Turn management ----
    function nextTurn() {
        if (!state.gameActive) return;

        const current = state.currentPlayer;
        if (state.players[current].isBot) {
            botTurn(current);
        } else {
            state.turnLocked = false;
            setMessage("Your turn! Play a card or draw.");
            renderPlayerHand();
        }
    }

    // ---- Color picker ----
    function showColorPicker(callback) {
        dom.colorPicker.classList.remove('hidden');
        const buttons = dom.colorPicker.querySelectorAll('.color-btn');

        const handler = (e) => {
            const color = e.target.dataset.color;
            if (!color) return;
            dom.colorPicker.classList.add('hidden');
            buttons.forEach(b => b.removeEventListener('click', handler));
            callback(color);
        };

        buttons.forEach(b => b.addEventListener('click', handler));
    }

    // ---- Game over ----
    function showGameOver(winnerIdx) {
        const winner = state.players[winnerIdx];
        dom.winnerText.textContent = winnerIdx === 0 ? '🎉 You Win! 🎉' : `${winner.name} Wins!`;

        let scoresHTML = '<div style="text-align:left;display:inline-block;">';
        state.players.forEach((p, i) => {
            const score = scoreHand(p.hand);
            const marker = i === winnerIdx ? ' 👑' : '';
            scoresHTML += `<div>${p.name}: ${p.hand.length} cards (${score} pts)${marker}</div>`;
        });
        scoresHTML += '</div>';
        dom.finalScores.innerHTML = scoresHTML;

        dom.gameOver.classList.remove('hidden');
    }

    // ---- Start game ----
    function startGame() {
        const numBots = parseInt(dom.numBots.value, 10);
        initState(numBots);

        // Create and shuffle deck
        state.deck = shuffleDeck(createDeck());

        // Deal cards
        for (let i = 0; i < STARTING_HAND; i++) {
            for (let p = 0; p < state.playerCount; p++) {
                state.players[p].hand.push(drawCard());
            }
        }

        // Flip first card (ensure it's not a wild)
        let firstCard = drawCard();
        while (firstCard.color === 'wild') {
            state.deck.unshift(firstCard);
            shuffleDeck(state.deck);
            firstCard = drawCard();
        }
        state.discardPile.push(firstCard);
        state.currentColor = firstCard.color;
        state.currentValue = firstCard.value;

        // Handle first card special effects
        switch (firstCard.value) {
            case 'skip':
                state.currentPlayer = 1 % state.playerCount;
                setMessage(`First card is Skip! ${state.players[0].name} is skipped.`);
                break;
            case 'reverse':
                state.direction = -1;
                setMessage('First card is Reverse! Playing counter-clockwise.');
                break;
            case 'draw2':
                state.players[0].hand.push(...drawCards(2));
                state.currentPlayer = 1 % state.playerCount;
                setMessage('First card is Draw 2! You draw 2 and are skipped.');
                break;
            default:
                setMessage("Your turn! Play a card or draw.");
        }

        state.gameActive = true;
        showScreen('game-screen');
        renderAll();

        // If first player is a bot (due to skip), start bot turn
        if (state.players[state.currentPlayer].isBot) {
            nextTurn();
        }
    }

    // ---- Screen management ----
    function showScreen(id) {
        $$('.screen').forEach(s => s.classList.remove('active'));
        $(`#${id}`).classList.add('active');
    }

    // ---- Event listeners ----
    dom.btnPlay.addEventListener('click', startGame);

    dom.btnRules.addEventListener('click', () => showScreen('rules-screen'));

    dom.btnBackMenu.addEventListener('click', () => showScreen('main-menu'));

    dom.drawPile.addEventListener('click', playerDraw);

    dom.unoBtn.addEventListener('click', () => callUno(0));

    dom.btnPlayAgain.addEventListener('click', () => {
        dom.gameOver.classList.add('hidden');
        startGame();
    });

    dom.btnMainMenu.addEventListener('click', () => {
        dom.gameOver.classList.add('hidden');
        state.gameActive = false;
        showScreen('main-menu');
    });

})();
