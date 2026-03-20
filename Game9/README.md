# PAC-MAN

A feature-rich Pac-Man game built with HTML5 Canvas, CSS, and vanilla JavaScript. Navigate the maze, eat dots, hunt frightened ghosts, and chase high scores!

## What's New

- Accessibility upgrades with ARIA labels for key controls
- Improved keyboard focus visibility for action buttons
- Reduced motion support using `prefers-reduced-motion`
- Better browser metadata and theme-color support
- Footer branding consistency with other upgraded games

## 🎮 Features

- **Classic Pac-Man gameplay** — fully connected maze with dot and pellet collection
- **Ghost AI with personalities** — Blinky chases directly, Pinky targets ahead, Inky is unpredictable, Clyde scatters when close
- **Frightened mode** — eat a power pellet to turn ghosts blue and hunt them for escalating points (200 → 400 → 800 → 1600)
- **Bonus cherry** — appears after 70 dots are eaten, worth 500 points
- **Score popups** — floating "+points" text when eating ghosts or fruit
- **High score** — persisted in localStorage across sessions
- **Level progression** — speed increases each level, bonus points awarded on completion, level transition screen
- **Lives system** — displayed as Pac-Man icons below the canvas
- **Neon glow visuals** — pulsing power pellets, glowing dots, ghost aura, animated title
- **Mobile support** — on-screen D-pad and touch-swipe controls
- **Pause/Resume** — via spacebar or on-screen button

## 🕹️ Controls

| Input | Action |
|-------|--------|
| **Arrow Keys** | Move Pac-Man |
| **W / A / S / D** | Move Pac-Man (alternative) |
| **Space** | Pause / Resume |
| **D-pad buttons** | Move (mobile) |
| **Swipe on canvas** | Move (touch devices) |

## 👾 Game Elements

| Element | Description | Points |
|---------|-------------|--------|
| Dot | Small pellet on every path cell | 10 |
| Power Pellet | Large pulsing pellet in maze corners | 50 |
| Frightened Ghost | Blue ghost after power pellet | 200–1600 |
| Cherry | Bonus fruit at mid-level | 500 |
| Level Bonus | Awarded on level completion | level × 100 |

## 🏗️ Implementation

Built entirely with **HTML5 Canvas** rendering and vanilla JS:

- **Grid-aligned movement** with axis-snapping for smooth turning at intersections
- **Bounding-box collision detection** against maze walls
- **Per-ghost AI** — target-cell pathfinding with distinct chase/scatter/fright behaviours
- **Tunnel wrapping** — Pac-Man and ghosts wrap horizontally through open edges
- **Ghost house** — ghosts spawn in the central pen and exit through corridors
- **Responsive layout** — canvas scales on smaller screens

## 📁 Files

| File | Purpose |
|------|---------|
| `index.html` | Game page structure, overlays, and D-pad |
| `style.css` | Neon-themed styling, overlays, responsive layout |
| `script.js` | All game logic — maze, movement, AI, rendering, controls |

## 🚀 How to Play

1. Open `index.html` in any modern browser
2. Click **Start Game**
3. Use arrow keys or WASD to navigate Pac-Man through the maze
4. Collect all dots and power pellets to advance to the next level
5. Eat a power pellet, then chase the blue ghosts for big points
6. Grab the cherry when it appears for 500 bonus points
7. Game ends when all lives are lost — try to beat your high score!

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
