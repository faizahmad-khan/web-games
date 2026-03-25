# 🧱 Brick Breaker Game

A classic arcade-style brick breaker game built with HTML5 Canvas, CSS3, and vanilla JavaScript. Break all the bricks to advance through levels while managing your lives, collecting power-ups, and chasing high scores!

## What's New

- Better accessibility with ARIA labels for key actions
- Improved keyboard focus visibility for interactive buttons
- Reduced motion support via `prefers-reduced-motion`
- Enhanced browser metadata and theme color support
- Footer branding consistency with other upgraded games

## 🎮 Game Features

- **Classic Gameplay**: Break bricks by bouncing a ball off a paddle
- **Multiple Levels**: Progress through increasingly challenging levels with unique brick patterns
- **Score System**: Different colored bricks award different points
  - 🟥 Red Bricks: 50 points
  - 🟧 Orange Bricks: 40 points
  - 🟨 Yellow Bricks: 30 points
  - 🟩 Green Bricks: 20 points
  - 🟦 Blue Bricks: 10 points
- **Combo System**: Chain brick hits for score multipliers (x2, x3, x4)
- **Power-Up System**: Collect falling power-ups to gain advantages
  - ↔ **Wide Paddle** — expands paddle width
  - ❤ **Extra Life** — gain a life (max 5)
  - ⊕ **Multi Ball** — spawns 2 extra balls
  - ⏳ **Slow Ball** — reduces ball speed
  - 🔥 **Fire Ball** — ball smashes through bricks without bouncing
- **Lives System**: Start with 3 lives - don't let the ball fall!
- **High Score Tracking**: Your best score is saved locally
- **Progressive Difficulty**: Ball speed increases with each level
- **Multi-HP Bricks**: From level 5+, top-row bricks take 2 hits to break
- **6 Brick Patterns**: Full grid, checkerboard, diamond, rows with gaps, pyramid, and stripes
- **Sound Effects**: Synthesized sounds for all game events (Web Audio API)
- **Particle Effects**: Bricks explode into colored particles on destruction
- **Ball Trail**: Glowing trail follows each ball
- **Screen Shake**: Camera shake feedback when losing a life
- **Responsive Controls**: Play with keyboard or mouse
- **Pause Feature**: Take a break anytime with the 'P' key

## 🎯 How to Play

### Controls
- **Arrow Keys (← →)** or **Mouse**: Move the paddle left and right
- **SPACE**: Launch the ball
- **P**: Pause/Resume the game

### Objective
1. Break all the bricks on the screen to complete a level
2. Keep the ball from falling below the paddle
3. Catch falling power-ups with your paddle for bonuses
4. Build combos by hitting bricks in quick succession
5. Progress through levels with increasing difficulty
6. Try to beat your high score!

### Gameplay Tips
- The angle at which the ball bounces off the paddle depends on where it hits
- Hit the ball with the edges of the paddle for sharper angles
- Build combos by hitting bricks quickly — 3+ hits = x2, 5+ = x3, 10+ = x4 multiplier
- Catch the Multi Ball power-up to cover more area
- Fire Ball lets you smash through entire columns of bricks
- Higher rows of bricks (red, orange) award more points
- From level 5, top-row bricks require 2 hits — look for crack marks
- Each level has a different brick pattern, so adapt your strategy!

## 🚀 Getting Started

### Playing the Game

1. Simply open `index.html` in a modern web browser
2. Click "START GAME" button
3. Use arrow keys or mouse to position your paddle
4. Press SPACE to launch the ball
5. Break all the bricks to win!

### Browser Compatibility

This game works best in modern browsers:
- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

## 📁 File Structure

```
Game15/
├── index.html      # Main HTML structure
├── style.css       # Styling and animations
├── script.js       # Game logic and mechanics
├── README.md       # This file
└── LICENSE         # MIT License
```

## 🎨 Features Breakdown

### Visual Features
- Modern gradient design with vibrant colors
- Particle explosions when bricks are destroyed
- Floating score text with combo indicators
- Glowing ball with color trail effect
- Screen shake on life loss
- Active power-up timer bars on the canvas
- Cracked brick overlay for multi-HP bricks
- Responsive layout for different screen sizes
- Professional UI with combo and game statistics display

### Game Mechanics
- Physics-based ball movement
- Dynamic paddle collision with angle-based rebounds
- Brick collision detection
- Combo scoring system with time-based multipliers
- Power-up drop system with 5 unique types
- Multi-ball support
- Multi-HP bricks in higher levels
- 6 unique brick layout patterns per level cycle
- Lives management system
- Level progression system
- High score persistence using localStorage

### Audio
- Synthesized sound effects using the Web Audio API (no external files needed)
- Distinct sounds for paddle hits, wall bounces, brick breaks, power-up pickups, level completion, and game over

### User Experience
- Intuitive controls (keyboard + mouse)
- Clear game instructions with power-up legend
- Pause functionality
- Level completion celebrations
- Detailed game over screen with stats (score, level, best combo, bricks destroyed)

## 🛠️ Technical Details

### Technologies Used
- **HTML5 Canvas**: For game rendering
- **CSS3**: Modern styling with gradients and animations
- **Vanilla JavaScript**: Pure JS, no frameworks
- **Web Audio API**: Synthesized sound effects
- **LocalStorage**: For high score persistence

### Key Game Parameters
- Canvas Size: 800x600
- Paddle Size: 120x15 (expandable to 200 with power-up)
- Ball Radius: 8px
- Brick Rows: 6
- Brick Columns: 10
- Starting Lives: 3
- Base Ball Speed: 4 (increases per level)
- Power-Up Drop Chance: 18%
- Power-Up Duration: 8 seconds
- Combo Window: 1.5 seconds

## 🎓 Learning Outcomes

This game demonstrates:
- HTML5 Canvas API usage
- Game loop implementation
- Collision detection algorithms
- State management in games
- Event handling (keyboard & mouse)
- Web Audio API for sound synthesis
- Particle system design
- Power-up and combo mechanics
- LocalStorage for data persistence
- Responsive design principles

## 🔧 Customization

Want to modify the game? Here are some easy tweaks:

### In `script.js`:
```javascript
// Change starting lives
let lives = 3; // Increase for easier gameplay

// Adjust ball speed
speed: 4, // Lower for easier, higher for harder

// Modify brick layout
const brickRowCount = 6; // Change number of rows
const brickColumnCount = 10; // Change number of columns

// Adjust paddle size
width: 120, // Make wider for easier gameplay
```

### In `style.css`:
- Change color schemes by modifying the gradient values
- Adjust animations and effects
- Modify responsive breakpoints

## 📱 Mobile Support

While primarily designed for desktop play with keyboard/mouse, the game includes:
- Responsive layout that adapts to smaller screens
- Touch-friendly buttons
- Mobile-optimized controls

## 🐛 Known Issues

None currently! If you find a bug, please report it.

## 🤝 Contributing

Feel free to fork this project and add your own features! Some ideas:
- Power-ups (multi-ball, larger paddle, etc.)
- Different brick patterns per level
- Sound effects and background music
- Particle effects on brick destruction
- Leaderboard system
- More brick types with special properties

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎉 Enjoy!

Have fun breaking bricks! Try to beat your high score and reach the highest level possible!

---

**Created with ❤️ as part of the Web Games Collection**
