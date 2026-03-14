# 🪱 Worm Game - Classic Snake-Style Gameplay

<div align="center">

![Worm Game](https://img.shields.io/badge/Game-Worm-brightgreen?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

**A fun and addictive browser-based Worm game with smooth animations, power-ups, and multiplayer support!**

[🎮 Play Now](#how-to-run) • [⭐ Features](#features) • [📖 How to Play](#how-to-play) • [🛠️ Installation](#installation)

</div>

---

## 🌙 Dark Mode Support

This game now supports **system dark mode preferences**! Your game will automatically adapt to your device's theme settings for a comfortable gaming experience.

---

## ⭐ Features

### Core Features
- 🎮 Classic worm/snake gameplay
- 🎯 Progressive difficulty levels
- 🎨 Colorful, vibrant graphics with animations
- 🌟 Bonus food with time-slow power-up
- ⏱️ Time manipulation mechanics
- 📱 Mobile-friendly controls
- 🏆 Score tracking and level system
- ⌨️ Keyboard controls (Arrow Keys / WASD / IJKL)
- 🎭 Smooth animations and visual effects
- 🎮 Play/Pause functionality

### 🆕 NEW Features!
- 💾 **High Score Saving** - Your best score is saved automatically (localStorage)
- 💎 **4 New Power-ups** - Speed Boost, Shield, Double Points, Invincibility
- ◼️ **Dynamic Obstacles** - Obstacles appear every 3 levels for added challenge
- 👥 **Local Multiplayer** - Play with a friend on the same keyboard!
- 🎯 **Enhanced UI** - Power-up timers, shield indicator, and multiplayer stats

---

## 🎮 How to Play

### 🎯 Game Objective
Guide your worm to eat food and grow longer without colliding with the walls or yourself!

### 📋 Game Rules

1. **Movement**
   - Use arrow keys or WASD to control the worm
   - The worm continuously moves in the current direction
   - Change direction using keyboard controls

2. **Eating Food**
   - Worms grow when they eat red food (🍎)
   - Each red food increases your score by 10 × Level
   - Bonus golden food (⭐) grants time-slow ability for 5 seconds
   - Bonus food awards 50 × Level points
   - New food appears randomly after being eaten

3. **Power-ups**
   
   **Original Power-up:**
   - **⭐ Bonus Food (Golden Star)** - Activates time-slow mode
   - When collected, the game slows down 2x for 5 seconds
   - Appears randomly (15% chance) after eating regular food
   - Perfect for dodging tight situations!
   
   **🆕 NEW Power-ups (12% spawn chance):**
   - **⚡ Speed Boost** (Orange) - Move 2x faster for 5 seconds
   - **🛡️ Shield** (Blue) - Survive one collision (shows in header)
   - **💰 Double Points** (Green) - Earn 2x score for 5 seconds
   - **⭐ Invincibility** (Gold) - Pass through walls & obstacles for 5 seconds
   - Active power-ups show countdown timers on screen

4. **Obstacles**
   - **◼️ Gray Blocks** appear starting at level 3
   - 2 new obstacles spawn every 3 levels (max 15)
   - Hitting obstacles causes game over (unless invincible or shielded)
   - Adds strategic navigation challenge

5. **Multiplayer Mode** 🆕
   - Toggle 2-player mode before starting
   - Player 1 (Green worm): Arrow Keys or WASD
   - Player 2 (Pink worm): IJKL keys
   - Player 2 scores based on worm length
   - Collision with each other ends the game
   - Winner declared when one player loses

6. **Collision**
   - Avoid hitting the walls of the game area
   - Don't collide with your own body
   - Game ends on collision

7. **Difficulty**
   - Game speed increases as you level up (every 5 foods eaten)
   - Longer worms are harder to control
   - Obstacles increase difficulty progressively
   - Challenge yourself to beat your high score!

8. **High Score System** 🆕
   - Your best score is automatically saved
   - High score persists between sessions
   - "NEW HIGH SCORE" message when you break your record

### 🎮 Controls

#### Player 1 Controls
| Action | Key |
|--------|-----|
| Move Up | ↑ or W |
| Move Down | ↓ or S |
| Move Left | ← or A |
| Move Right | → or D |
| Pause/Resume | P |

#### Player 2 Controls (Multiplayer Mode) 🆕
| Action | Key |
|--------|-----|
| Move Up | I |
| Move Down | K |
| Move Left | J |
| Move Right | L |

#### Game Controls
| Action | Method |
|--------|--------|
| Start Game | Click "Start Game" button or press any movement key |
| Enable Multiplayer | Check "2-Player Mode" before starting |
| Restart | Click "Restart Game" button |

---

## 🛠️ Installation

### Method 1: Quick Start (No Installation Required)

1. **Download the files**
   ```bash
   git clone https://github.com/faizahmad-khan/worm-game.git
   cd worm-game
   ```

2. **Open in Browser**
   - Simply double-click `index.html`
   - OR right-click → Open with → Your favorite browser
   - That's it! Start playing! 🎮

### Method 2: Using a Local Server

```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js
npx http-server
```

Then open `http://localhost:8000/index.html` in your browser.

---

## 🛠️ How to Run

### **For Windows:**
1. Download `index.html`
2. Double-click the file
3. Your default browser will open with the game

### **For Mac:**
1. Download `index.html`
2. Right-click → Open With → Safari/Chrome/Firefox
3. Game will load in your browser

### **For Linux:**
```bash
# Open with default browser
xdg-open index.html

# Or use a specific browser
firefox index.html
google-chrome index.html
```

### **For Mobile Devices:**
1. Transfer `index.html` to your phone
2. Use any file manager to navigate to the file
3. Tap on `index.html`
4. Choose "Open with Browser"

---

## 📁 File Structure

```
Game4/
├── 📄 index.html          # Main HTML file with UI
├── 🎨 worm.css           # Styling and animations
├── 🔧 worm.js            # Game logic and mechanics
└── 📖 README.md          # This file
```

---

## 🎨 Game Elements

| Element | Description | Points/Effect |
|---------|-------------|---------------|
| 🐛 Green Worm | Player 1 character that grows with each food | - |
| 🐛 Pink Worm | Player 2 character (multiplayer mode only) 🆕 | - |
| 🍎 Red Food | Regular food to collect and grow | 10 × Level × Multiplier |
| ⭐ Golden Food | Bonus food that slows time for 5 seconds | 50 × Level × Multiplier |
| ⚡ Speed Boost | Orange power-up - Move faster 🆕 | 5 seconds |
| 🛡️ Shield | Blue power-up - Block one collision 🆕 | One-time use |
| 💰 Double Points | Green power-up - 2x score 🆕 | 5 seconds |
| ⭐ Invincibility | Gold power-up - Pass through obstacles 🆕 | 5 seconds |
| ◼️ Obstacles | Gray blocks to avoid 🆕 | Game Over |
| ⬜ Walls | Game boundaries - don't touch! | Game Over |
| 📊 Score | Track your current score | Increases per food |
| 🏆 High Score | Your best score ever 🆕 | Saved automatically |
| 🎚️ Level | Current difficulty level (every 5 foods) | - |
| 🐛 Length | Current worm length | Display only |

---

## 💡 Pro Tips & Strategies

### Basic Strategies
1. **Plan Ahead** - Think about your next moves before making them
2. **Keep Distance** - Maintain space between your head and body
3. **Slow and Steady** - In early levels, take your time to master controls
4. **Corner Control** - Practice turning in tight spaces

### Food & Scoring
5. **Eat Efficiently** - Plan routes to collect food with minimal backtracking
6. **Bonus Hunting** - Collect bonus food for a 5x score multiplier advantage!
7. **Score Multiplier** - Longer worms and higher levels = higher scores per food!
8. **Double Points Combo** 🆕 - Get Double Points power-up before eating bonus food for 100 × Level points!

### Power-up Mastery 🆕
9. **Shield First** - Grab Shield power-ups early for insurance
10. **Time Slow Escape** - Use golden stars ⭐ to escape tight situations
11. **Invincibility Rush** - Use Invincibility to navigate through obstacles safely
12. **Speed Boost Timing** - Use Speed Boost in open areas to quickly collect food
13. **Power-up Stacking** - Collect multiple power-ups for powerful combinations

### Obstacle Navigation 🆕
14. **Map Awareness** - Remember obstacle positions as they spawn
15. **Safe Zones** - Keep track of open areas to retreat when needed
16. **Invincible Override** - Save Invincibility power-ups for dense obstacle areas

### Multiplayer Tips 👥 🆕
17. **Territory Control** - Claim your side of the board early
18. **Trap Opponent** - Use your body to limit opponent's movement
19. **Food Competition** - Race to food spawns for growth advantage
20. **Defensive Play** - Focus on survival over aggression in late game

---

## 🐛 Troubleshooting

### Game doesn't load?
- Make sure you're using a modern browser
- Check browser console for errors (F12)
- Try a different browser

### Controls not working?
- Make sure the game window is focused (click on it)
- Try different keyboard inputs
- Check if your keyboard has gaming mode enabled

### Performance issues?
- Close other browser tabs
- Update your browser
- Try a different browser

---

## 🌐 Browser Compatibility

| Browser | Supported | Version |
|---------|-----------|---------|
| Chrome | ✅ | 90+ |
| Firefox | ✅ | 88+ |
| Safari | ✅ | 14+ |
| Edge | ✅ | 90+ |
| Opera | ✅ | 76+ |

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- 🐛 Report bugs
- 💡 Suggest new features
- 🔧 Submit pull requests
- ⭐ Star this repository if you like it!

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Developer

Created with ❤️ by **Faiz Ahmad Khan**

---

## 🔮 Future Enhancements

### ✅ Completed (New in Latest Update!)
- [x] Additional power-ups (speed boost, shield, double points, invincibility)
- [x] Obstacle-filled levels (progressive obstacles every 3 levels)
- [x] Leaderboard system with local storage (high score saving)
- [x] Multiplayer mode (local 2-player)

### 🚀 Planned Features
- [ ] Multiple game modes (Classic, Endless, Timed, Arcade)
- [ ] Sound effects and background music toggle
- [ ] Different worm skins and themes
- [ ] Level progression with unique challenges
- [ ] Difficulty settings (Easy, Normal, Hard, Extreme)
- [ ] Online multiplayer with WebSockets
- [ ] Mobile touch controls
- [ ] Customizable keybindings
- [ ] Achievement system
- [ ] Replay/playback feature

---

<div align="center">

### 🪱 Ready to Slither? Let's Go! 🪱

**Made with 💖 using HTML, CSS, and JavaScript**

[⬆ Back to Top](#-worm-game---classic-snake-style-gameplay)

</div>
