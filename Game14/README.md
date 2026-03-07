# 🚀 Space Invaders - Classic Arcade Game 👾

<div align="center">

![Space Invaders](https://img.shields.io/badge/Game-Space%20Invaders-brightgreen?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

**Defend Earth from the alien invasion! A classic arcade shooter with modern web technologies.**

[🎮 Play Now](#how-to-play) • [⭐ Features](#features) • [🎯 Game Rules](#game-rules) • [🛠️ Installation](#installation)

</div>

---

## 🎮 Game Preview

Experience the nostalgia of the classic Space Invaders arcade game, reimagined for modern browsers with smooth animations, progressive difficulty, and responsive controls!

---

## ⭐ Features

### 🎮 Classic Gameplay
- **Authentic Space Invaders** mechanics with modern enhancements
- **5 rows of aliens** - Different alien types with varying point values
- **Progressive difficulty** - Game speeds up as you eliminate aliens
- **Level system** - Complete waves to advance through levels
- **Lives system** - 3 lives to defend Earth
- **Mystery Ship** - Bonus 🛸 appears randomly for 100 points!

### 🎨 Visual Excellence
- **Retro aesthetic** with modern CSS gradients and effects
- **Twinkling starfield** background with varied star sizes and brightness
- **Smooth animations** for all game elements
- **Glowing effects** for text, UI elements, and bullets
- **Particle explosion system** with animated debris when enemies are destroyed
- **Floating score text** (+10, +30, +100) rises from destroyed enemies
- **Color-coded aliens** with emoji graphics and subtle wobble animation
- **Pulsing mystery ship** with red glow effect and point label

### 🎯 Game Elements
- **Player Ship** 🚀 - Your defense against the invasion
- **Aliens** 👾🛸👽 - Three types worth 10, 20, and 30 points
- **Mystery Ship** 🛸 - Bonus ship worth 100 points
- **Defensive Barriers** 🛡️ - Four barriers that absorb damage
- **Bullets** - Player fires cyan, aliens fire magenta

### 🏆 Scoring System
| Element | Points |
|---------|--------|
| Bottom Aliens 👾 | 10 pts |
| Middle Aliens 🛸 | 20 pts |
| Top Aliens 👽 | 30 pts |
| Mystery Ship 🛸 | 100 pts |

### 📱 Mobile Optimized
- **Touch controls** - Tap to shoot, swipe to move
- **Responsive design** - Works on all screen sizes
- **Adaptive UI** - Controls scale to device
- **Mobile-friendly** buttons and overlays

### 🎯 Advanced Features
- **High score tracking** - Saved in browser local storage
- **Pause functionality** - Press 'P' to pause/resume
- **Level progression** - Increasing speed and challenge
- **Multiple screens** - Start, pause, game over, level complete
- **Barrier degradation** - Barriers lose health visually (4 hits to destroy)
- **Smart alien AI** - Bottom-row aliens preferentially shoot for realistic attacks
- **Player invulnerability** - Brief 1.5s blink period after losing a life
- **Shoot cooldown** - 200ms between shots prevents bullet spam
- **Mystery ship from both sides** - Randomly spawns from left or right
- **Screen shake & flash CSS** - Visual feedback for hits and level completion

---

## 🎮 How to Play

### 🎯 Objective
Destroy all alien invaders before they reach Earth or eliminate your ship!

### 📋 Controls

#### Desktop
- **← →** Arrow Keys - Move ship left/right
- **SPACE** - Shoot bullets
- **P** - Pause/Resume game

#### Mobile/Tablet
- **Tap screen** - Shoot bullets
- **Swipe left/right** - Move ship
- **Pause button** - Pause game

### 🎲 Game Rules

1. **Eliminate All Aliens**
   - Destroy all aliens to complete the level
   - Each level increases speed and difficulty

2. **Protect Your Ship**
   - You have 3 lives
   - Losing all lives ends the game
   - Getting hit by alien bullets costs a life

3. **Use Barriers Strategically**
   - 4 barriers provide temporary protection
   - Barriers degrade with each hit (4 hits to destroy)
   - Both player and alien bullets damage barriers

4. **Watch for Mystery Ships**
   - Bonus ships appear randomly at the top from either side
   - Worth 100 points when destroyed (shown with a "100" label)
   - They fly across the screen with a pulsing red glow

5. **Survive the Invasion**
   - Aliens move side-to-side and descend
   - They speed up as their numbers decrease
   - Game over if aliens reach your ship's level

---

## 🛠️ Installation

### Quick Start

1. **Clone or Download**
   ```bash
   git clone <repository-url>
   cd Game14
   ```

2. **Open in Browser**
   - Simply double-click `index.html`
   - Or drag the file into your browser

3. **Start Playing!**
   - Click "START GAME" button
   - Use arrow keys and spacebar to play

### Run with Local Server

```bash
cd Game14
python -m http.server 8000
```

Then visit `http://localhost:8000` in your browser.

---

## 📁 Files Structure

```
Game14/
├── index.html      # Main game page
├── style.css       # Styling and animations
├── script.js       # Game logic and mechanics
├── README.md       # This file
└── LICENSE         # MIT License
```

---

## 🎯 Game Mechanics

### Alien Movement
- Aliens move horizontally across the screen
- When reaching the edge, they drop down and reverse direction
- Speed increases as aliens are eliminated
- Each level starts 20% faster than the previous

### Shooting Mechanics
- Player can have up to 3 bullets on screen simultaneously
- 200ms cooldown between shots for balanced gameplay
- Bottom-row aliens preferentially shoot (smarter AI)
- Shooting frequency increases with level difficulty

### Barrier System
- 4 destructible barriers protect the player
- Each barrier can take 4 hits before being destroyed
- Stable pre-generated block pattern (no visual flickering)
- Glowing border shows remaining health
- Both player and alien bullets damage barriers

### Level Progression
- Complete a level by destroying all aliens
- Score is preserved between levels
- Each level increases:
  - Alien movement speed
  - Alien shooting frequency
  - Overall difficulty

---

## 💡 Strategy Tips

1. **Stay Mobile** - Constant movement makes you harder to hit
2. **Use Barriers** - Hide behind them when overwhelmed
3. **Shoot Continuously** - Maximum of 3 bullets keeps pressure on aliens
4. **Prioritize Threats** - Target aliens closest to you first
5. **Hunt Mystery Ships** - Easy 100 points when they appear from either side
6. **Save Barriers** - They last 4 hits and become more valuable in later levels
7. **Watch Patterns** - Bottom-row aliens shoot more often
8. **Use Invulnerability** - After losing a life, reposition during the 1.5s blink window

---

## 🎨 Customization

The game can be easily customized by modifying:

### JavaScript (`script.js`)
- Alien formation (rows, columns, spacing)
- Point values for each alien type
- Player speed and bullet speed
- Number of lives
- Level difficulty progression

### CSS (`style.css`)
- Color schemes and themes
- Animation speeds and effects
- UI styling and layout
- Responsive breakpoints

---

## 🔧 Technical Details

### Technologies Used
- **HTML5 Canvas** - For game rendering
- **CSS3** - Modern styling with gradients and animations
- **Vanilla JavaScript** - No frameworks, pure ES6+
- **LocalStorage API** - High score persistence
- **RequestAnimationFrame** - Smooth 60fps gameplay

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Performance
- Optimized canvas rendering with pre-generated barrier patterns
- Efficient Set-based collision detection (no index-shifting bugs)
- Proper `cancelAnimationFrame` cleanup prevents stacking game loops
- Twinkling star positions generated once, reused every frame
- Smooth 60 FPS on modern devices

---

## 🐛 Known Issues & Solutions

**Issue**: Game runs too fast on high refresh rate monitors  
**Solution**: Animation is capped at 60 FPS using requestAnimationFrame

**Issue**: Touch controls delayed on some mobile devices  
**Solution**: Passive event listeners disabled for better response

**Fixed**: Barrier blocks flickered every frame due to per-frame `Math.random()` calls  
**Solution**: Block patterns are now pre-generated once at barrier creation

**Fixed**: Bullets sometimes passed through aliens (collision missed)  
**Solution**: Replaced `splice()` inside `forEach` with Set-based marking for clean removal

**Fixed**: Multiple game loops stacking on restart/level transitions  
**Solution**: `cancelAnimationFrame()` called before each new loop starts

**Fixed**: Alien jitter at screen edges  
**Solution**: Boundary check now uses leftmost/rightmost alive alien before moving

**Fixed**: Game over could trigger multiple times  
**Solution**: Guard check prevents duplicate `gameOver()` calls

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🎮 Credits

Inspired by the classic **Space Invaders** arcade game by Tomohiro Nishikado (1978)

Reimagined with modern web technologies for educational purposes.

---

## 🌟 Acknowledgments

- Classic arcade game design principles
- Modern web development best practices
- Responsive design patterns
- HTML5 Canvas API documentation

---

<div align="center">

**Made with ❤️ for retro gaming enthusiasts**

🚀 **Defend Earth! Save Humanity! Achieve High Scores!** 👾

[⬆ Back to Top](#-space-invaders---classic-arcade-game-)

</div>
