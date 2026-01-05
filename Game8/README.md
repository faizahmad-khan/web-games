# Tetris Game

A classic Tetris game implemented in HTML, CSS, and JavaScript. The game features the traditional gameplay where players arrange falling tetrominoes to complete horizontal lines.

## Features

- Classic Tetris gameplay with 7 different tetromino shapes
- Score tracking with level progression
- Increasing difficulty as the level increases
- Responsive controls for moving, rotating, and dropping pieces
- Visual styling with a retro aesthetic

## Controls

- **Left Arrow** → Move piece left
- **Right Arrow** → Move piece right
- **Down Arrow** → Soft drop (move piece down faster)
- **Up Arrow** → Rotate piece
- **Space** → Hard drop (instantly drop piece)
- **P** → Pause/resume game

## Game Elements

- **Score**: Points earned by completing lines (100 points per line × current level)
- **Level**: Increases every 10 completed lines, making the game faster
- **Lines**: Total number of completed lines

## Implementation

The game uses HTML5 Canvas for rendering and implements the core Tetris mechanics including:
- Piece generation and rotation
- Collision detection
- Line clearing
- Gravity system
- Level progression

## Files

- `index.html`: Main game page structure
- `style.css`: Visual styling and layout
- `script.js`: Game logic and mechanics

## How to Play

1. Click the "Start Game" button to begin
2. Arrange the falling tetrominoes to complete horizontal lines
3. Complete lines to earn points and advance levels
4. The game ends when the stack of tetrominoes reaches the top of the playing field