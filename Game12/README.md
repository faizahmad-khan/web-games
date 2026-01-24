# Maze Game

A classic maze navigation game where you need to find the path from the start to the destination.

## How to Play

- Use the **arrow keys** or **WASD** to navigate through the maze
- Find the path from the yellow start point to the green destination
- Try to solve the maze in as few moves as possible
- Click the "Reset Maze" button to generate a new random maze

## Features

- Randomly generated mazes using depth-first search algorithm
- Move counter to track your progress
- Responsive design that works on both desktop and mobile devices
- Touch controls for mobile (swipe to move)
- Colorful visuals with distinct start, path, wall, and destination areas

## Controls

- **Arrow Keys**: Move up, down, left, right
- **WASD**: Alternative movement keys
- **Swipe** (on mobile): Swipe in the direction you want to move
- **Reset Button**: Generate a new maze

## Technical Details

The maze is generated using a recursive backtracking algorithm which creates a perfect maze (one without loops) with exactly one solution. The player is represented by a blue circle that moves through the green pathways while avoiding red walls.

## Files

- `index.html`: Main HTML structure
- `style.css`: Styling and layout
- `script.js`: Game logic and maze generation