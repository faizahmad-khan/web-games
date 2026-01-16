# Tic Tac Toe Game

A classic Tic Tac Toe game implemented in HTML, CSS, and JavaScript. Two players take turns placing X's and O's on a 3x3 grid, with the goal of getting three of their marks in a row.

## Features

- Classic Tic Tac Toe gameplay
- Visual indication of the current player
- Score tracking for both players and draws
- Responsive design that works on different screen sizes
- Smooth animations and transitions
- Win detection and draw detection
- Reset and New Game functionality

## How to Play

1. The game starts with Player X's turn
2. Players take turns clicking on empty squares to place their mark (X or O)
3. The first player to get 3 of their marks in a row (horizontally, vertically, or diagonally) wins
4. If all squares are filled with no winner, the game ends in a draw
5. Use the "Reset Game" button to clear the board and start a new round
6. Use the "Another Round" button after a game ends to continue playing without resetting scores
7. Use the "New Game" button to reset scores and start completely fresh

## Controls

- Click on any empty cell to place your mark
- Use "Reset Game" to clear the current board
- Use "New Game" to reset scores and start over

## Technologies Used

- HTML5
- CSS3 (with Flexbox, Grid, and animations)
- JavaScript (ES6)

## Files

- `index.html`: Main HTML structure
- `style.css`: Styling and animations
- `script.js`: Game logic and interactions

## Game Elements

- **Game Board**: 3x3 grid where players place their marks
- **Current Player Indicator**: Shows whose turn it is
- **Score Tracker**: Keeps track of wins for both players and draws
- **Message Display**: Shows win/draw messages
- **Control Buttons**: Reset, Another Round, and New Game buttons

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