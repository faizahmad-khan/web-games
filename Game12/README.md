# Maze Game — Enhanced Edition

An advanced maze navigation game with multiple difficulty levels, scoring system, and strategic gameplay elements. Navigate through dynamic mazes, collect bonus stars, and compete for the best score!

## What's New

- Better accessibility with ARIA labels for key controls
- Improved keyboard focus visibility for interactive elements
- Reduced motion support via `prefers-reduced-motion`
- Enhanced browser metadata and theme color support
- Footer branding consistency with other upgraded games

## 🎮 How to Play

1. Choose your difficulty level: **Easy**, **Medium**, or **Hard**
2. Navigate from the yellow start position to the green exit (🏁)
3. **Collect ⭐ stars** for bonus points (optional but rewarding)
4. Use hints sparingly to reveal the solution path
5. Enable **Fog of War** for extra challenge — you can only see nearby cells
6. Try to solve in minimum moves and time for the highest score

## ✨ Features

### Gameplay
- **3 Difficulty Levels**: Easy (11×9), Medium (17×13), Hard (25×17)
- **Randomly Generated Mazes**: Unique maze each game using recursive backtracking
- **Collectible Stars**: Scattered on non-solution paths for bonus points (not on the main route!)
- **Hint System**: Reveal the solution path for 3 seconds (3 hints per game, press `H`)
- **Fog of War**: Toggle to see only nearby cells — adds stealth challenge & score bonus
- **Trail Breadcrumbs**: Optional visual trail showing visited cells

### Scoring & Progression
- **Dynamic Scoring**: Base score × difficulty multiplier, minus move/time penalties, plus star & fog bonuses
- **Best Scores**: Personal high scores stored per difficulty in localStorage
- **Live Stats**: Move counter, timer, star progress, current score all displayed in real-time

### User Interface
- **Victory Modal**: Beautiful popup showing final stats, achievement badges, and "New Best!" notification
- **Minimap**: Bird's eye view of the entire maze in the corner
- **Mobile D-Pad**: On-screen directional buttons (auto-shown on touch devices)
- **Modern Design**: Glassmorphism UI, gradient effects, smooth animations
- **Confetti Celebration**: Animated confetti burst on maze completion

### Audio & Polish
- **Web Audio SFX**: Procedurally generated sound effects
  - Move footstep
  - Wall bump
  - Star collection (dual-tone)
  - Hint activation
  - Victory fanfare
- **Smooth Animation**: Lerp-based player movement at 60fps
- **Responsive Design**: Optimized for desktop, tablet, and mobile

## 🎮 Controls

### Keyboard
| Key | Action |
|-----|--------|
| **Arrow Keys** | Navigate (Up/Down/Left/Right) |
| **WASD** | Navigate (alternative) |
| **H** | Show hint |

### Mobile
| Control | Action |
|---------|--------|
| **D-Pad** | Directional buttons (tap) |
| **Swipe** | Swipe on canvas to move |

### UI Buttons
- 💡 **Hint**: Reveal solution path for 3 seconds (limited per game)
- 🔄 **New Maze**: Generate a new maze and reset progress
- 📡 **Fog of War Toggle**: Restrict vision radius for extra challenge
- 📍 **Trail Toggle**: Show/hide visited cell breadcrumbs

## 📊 Scoring Formula

```
Score = (Base × Difficulty) - (Moves × 2) - (Time × 1) + (Stars × 150 × Difficulty) + (Fog Bonus × Difficulty)
```

- **Easy**: 1× multiplier
- **Medium**: 2× multiplier
- **Hard**: 3× multiplier
- **Fog of War Bonus**: +500 points × difficulty multiplier

## 🏆 Best Scores

Your best score for each difficulty is automatically saved to your browser's localStorage:
- View your best scores in the **Best Scores** section below the game
- Best Easy, Medium, and Hard are tracked separately

## 🛠️ Technical Architecture

### Algorithm & Generation
- **Maze Generation**: Recursive backtracking with depth-first search
- **Pathfinding**: Breadth-first search (BFS) for hint system and validation
- **Star Placement**: Random algorithm ensuring stars avoid solution path

### Technologies
- **Canvas 2D**: Hardware-accelerated rendering
- **Web Audio API**: Procedurally generated sound (no external files)
- **localStorage**: Persistent best scores
- **RequestAnimationFrame**: 60fps smooth animation loop
- **Touch Events**: Mobile-friendly swipe & tap controls

### Performance
- Optimized rendering with early fog-of-war culling
- Efficient maze representation (Uint8Array)
- Minimal DOM updates — game logic runs on canvas

## 📁 Files

- **index.html**: Complete game structure with modal, controls, stats
- **style.css**: Modern glassmorphism design, responsive layout, animations
- **script.js**: Full game logic (2,000+ lines)
  - Maze generation & solving
  - Input handling (keyboard, touch, D-pad)
  - Game state management
  - Scoring & persistence
  - Sound synthesis
  - Confetti animation

## 🎨 Visual Guidelines

- **Walls**: Dark blue with subtle borders
- **Paths**: Charcoal with faint grid
- **Player**: Cyan circle with glow and shine
- **Start**: Yellow overlay
- **Exit**: Green with pulsing glow + flag emoji (🏁)
- **Stars**: Gold 5-pointed with sparkle glow
- **Trail**: Semi-transparent purple dots
- **Hint**: Yellow overlay on solution cells
- **Fog**: Opaque dark overlay beyond vision radius

## 🚀 Future Enhancements

- Leaderboard (online multiplayer scores)
- Power-ups (speed boost, extended hint, vision expand)
- Competitive modes (race against AI)
- Custom maze dimensions
- Level progression
- Achievements system

## 📝 License

Open source. Feel free to modify and play!

---

**Enjoy the challenge!** 🎯