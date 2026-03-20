# Tetris Game

A feature-rich Tetris game built with HTML5 Canvas, CSS, and vanilla JavaScript. Arrange falling tetrominoes, clear lines, and chase high scores!

## What's New

- Accessibility upgrades with ARIA labels for key controls
- Improved keyboard focus visibility for buttons
- Reduced motion support using `prefers-reduced-motion`
- Better browser metadata and theme-color support
- Footer branding consistency with other upgraded games

## 🎮 Features

- **Classic Tetris gameplay** — 7 tetromino shapes (I, J, L, O, S, T, Z) with wall-kick rotation
- **Next piece preview** — see the upcoming piece in the side panel
- **Hold piece** — press C to stash a piece for later use
- **Ghost piece** — translucent shadow shows exactly where the piece will land
- **Hard drop bonus** — earn 2 extra points per row dropped instantly
- **Line-clear particles** — colourful particle burst effect when rows are cleared
- **Scoring system** — single (100), double (300), triple (500), Tetris (800), multiplied by level
- **Level progression** — speed increases every 10 lines; drop interval scales from 1000 ms down to 100 ms
- **High score** — persisted in localStorage across sessions
- **Start / Pause / Game Over overlays** — clean in-game screens (no alert popups)
- **Neon retro aesthetic** — cyan glow theme with grid lines and block highlights
- **Mobile support** — on-screen D-pad and touch-swipe controls
- **Responsive layout** — side panels collapse on smaller screens

## 🕹️ Controls

| Input | Action |
|-------|--------|
| **← / A** | Move piece left |
| **→ / D** | Move piece right |
| **↓ / S** | Soft drop |
| **↑ / W** | Rotate piece |
| **Space** | Hard drop (instant) |
| **C** | Hold piece |
| **P** | Pause / Resume |
| **D-pad** | Move (mobile) |
| **Swipe** | Move / rotate / drop (touch) |

## 📊 Game Elements

| Element | Description |
|---------|-------------|
| Score | Points from line clears & hard drops |
| Level | Increases every 10 lines, speeds up drops |
| Lines | Total completed lines |
| High Score | Best score saved to localStorage |
| Next | Preview of the upcoming piece |
| Hold | Stashed piece you can swap in |

## 🏗️ Implementation

Built entirely with **HTML5 Canvas** and vanilla JS:

- `requestAnimationFrame` delta-time game loop
- Wall-kick rotation with collision offset
- Ghost piece calculated by projecting downward until collision
- Particle system for line-clear effects
- Preview canvases for Next and Hold pieces
- localStorage for high score persistence

## 📁 Files

- `index.html` — Game page with overlays, side panels & D-pad
- `style.css` — Neon retro theme, responsive layout
- `script.js` — Game engine, controls & rendering

## 🚀 How to Play

1. Click **Start Game**
2. Arrange falling tetrominoes to complete horizontal lines
3. Use **Hold** (C) to save a tricky piece for later
4. Clear multiple lines at once for bonus points
5. Game ends when pieces stack to the top