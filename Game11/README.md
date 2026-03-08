# Tic Tac Toe Game

A feature-rich Tic Tac Toe game built with HTML, CSS, and JavaScript. Play against a friend or challenge the AI across three difficulty levels, complete with sound effects, confetti celebrations, and keyboard controls.

## Features

- **Player vs Player** and **Player vs AI** game modes
- **AI difficulty levels**: Easy (random moves), Medium (mixed strategy), Hard (unbeatable minimax algorithm)
- Score tracking for X, O, and draws
- Winning cells highlight with a pulsing glow animation
- Confetti celebration effect on win
- Sound effects via Web Audio API (place, win, draw)
- Keyboard support — keys 1–9 (numpad layout) to place marks, R to reset
- Modern dark glassmorphism UI with gradient accents
- Fully responsive design for mobile and desktop
- Smooth cell pop and overlay fade-in animations

## How to Play

1. Select a game mode: **Player vs Player** or **Player vs AI**
2. If playing vs AI, choose a difficulty: Easy, Medium, or Hard
3. Player X always goes first — click a cell or press a number key (1–9)
4. Get three marks in a row (horizontally, vertically, or diagonally) to win
5. If all cells are filled with no winner, the game ends in a draw
6. Click **Another Round** to keep scores and play again
7. Click **Reset Game** (or press R) to clear the board
8. Click **New Game** to reset all scores

## Keyboard Controls

| Key | Action |
|-----|--------|
| 1–9 | Place mark (numpad layout: 7=top-left, 9=top-right, 1=bottom-left) |
| R   | Reset the current board |

## Technologies Used

- HTML5
- CSS3 (Flexbox, Grid, animations, backdrop-filter)
- JavaScript ES6 (minimax AI, Web Audio API, Canvas confetti)

## Files

- `index.html` — Game structure and layout
- `style.css` — Dark theme styling, animations, and responsive breakpoints
- `script.js` — Game logic, AI engine, sound, confetti, and keyboard handling

## Game Elements

- **Game Board** — 3×3 grid with hover effects and placement animations
- **Mode & Difficulty Selectors** — Switch between PvP and AI modes on the fly
- **Current Player Indicator** — Gradient badge showing whose turn it is
- **Score Tracker** — Persistent win/draw counters
- **Win Overlay** — Full-panel message with Another Round button
- **Confetti Canvas** — Particle celebration on victory
- **Sound Effects** — Tonal feedback for every action

## Implementation Details

The game uses:
- Array to represent the game board state
- Event listeners for cell clicks
- Algorithm to check for winning combinations
- Score tracking with persistent counters
- Responsive design for different screen sizes

## Customization

The game can be easily customized by modifying:
- Colors in the CSS file
- Animation speeds and styles
- Game board size (would require code changes)
- Visual elements and styling