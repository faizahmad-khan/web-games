# 🪱 Worm Game - Classic Snake-Style Gameplay

<div align="center">

![Worm Game](https://img.shields.io/badge/Game-Worm-brightgreen?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

**A fun and addictive browser-based Worm game with smooth animations!**

[🎮 Play Now](#how-to-run) • [⭐ Features](#features) • [📖 How to Play](#how-to-play) • [🛠️ Installation](#installation)

</div>

---

## 🎮 Live Preview

<div align="center">

> 📌 **Try the game directly or [open in fullscreen](https://htmlpreview.github.io/?https://github.com/faizahmad-khan/web-games/blob/main/Game4/worm.html)**

</div>

---

## ⭐ Features

- 🎮 Classic worm/snake gameplay
- 🎯 Progressive difficulty levels
- 🎨 Colorful, vibrant graphics with animations
- 🌟 Bonus food with time-slow power-up
- ⏱️ Time manipulation mechanics
- 📱 Mobile-friendly controls
- 🏆 Score tracking and level system
- ⌨️ Keyboard controls (Arrow Keys / WASD)
- 🎭 Smooth animations and visual effects
- 🎮 Play/Pause functionality

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
   - **⭐ Bonus Food (Golden Star)** - Activates time-slow mode
   - When collected, the game slows down 2x for 5 seconds
   - Appears randomly (15% chance) after eating regular food
   - Perfect for dodging tight situations!

4. **Collision**
   - Avoid hitting the walls of the game area
   - Don't collide with your own body
   - Game ends on collision

5. **Difficulty**
   - Game speed increases as you level up (every 5 foods eaten)
   - Longer worms are harder to control
   - Challenge yourself for high scores!

### 🎮 Controls

| Action | Key |
|--------|-----|
| Move Up | ↑ or W |
| Move Down | ↓ or S |
| Move Left | ← or A |
| Move Right | → or D |
| Pause/Resume | P |
| Start Game | Click "Start Game" button |
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
   - Simply double-click `worm.html`
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

Then open `http://localhost:8000/worm.html` in your browser.

---

## 🛠️ How to Run

### **For Windows:**
1. Download `worm.html`
2. Double-click the file
3. Your default browser will open with the game

### **For Mac:**
1. Download `worm.html`
2. Right-click → Open With → Safari/Chrome/Firefox
3. Game will load in your browser

### **For Linux:**
```bash
# Open with default browser
xdg-open worm.html

# Or use a specific browser
firefox worm.html
google-chrome worm.html
```

### **For Mobile Devices:**
1. Transfer `worm.html` to your phone
2. Use any file manager to navigate to the file
3. Tap on `worm.html`
4. Choose "Open with Browser"

---

## 📁 File Structure

```
Game4.py/
├── 📄 worm.html          # Main HTML file with UI
├── 🎨 worm.css           # Styling and animations
├── 🔧 worm.js            # Game logic and mechanics
└── 📖 README.md          # This file
```

---

## 🎨 Game Elements

| Element | Description | Points |
|---------|-------------|--------|
| 🐛 Worm | Your player character that grows with each food | - |
| 🍎 Red Food | Regular food to collect and grow | 10 × Level |
| ⭐ Golden Food | Bonus food that slows time for 5 seconds | 50 × Level |
| ⬜ Walls | Game boundaries - don't touch! | Game Over |
| 📊 Score | Track your current score | Increases per food |
| 🎚️ Level | Current difficulty level (increases every 5 foods) | - |
| 🐛 Length | Current worm length | - |

---

## 💡 Pro Tips & Strategies

1. **Plan Ahead** - Think about your next moves before making them
2. **Keep Distance** - Maintain space between your head and body
3. **Catch Bonus Food** - Look for golden stars ⭐ to get a time-slow boost
4. **Use Time Slow Wisely** - Use the 5-second slow mode to escape tight situations
5. **Eat Efficiently** - Plan routes to collect food with minimal backtracking
6. **Use Walls** - Sometimes walls can help you navigate safely
7. **Slow and Steady** - In early levels, take your time to master controls
8. **Corner Control** - Practice turning in tight spaces
9. **Score Multiplier** - Longer worms and higher levels = higher scores per food!
10. **Bonus Hunting** - Collect bonus food for a 5x score multiplier advantage!

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

- [ ] Additional power-ups (speed boost, shield, etc.)
- [ ] Multiple game modes (Classic, Endless, Timed)
- [ ] Obstacle-filled levels
- [ ] Sound effects and background music
- [ ] Leaderboard system with local storage
- [ ] Different worm skins and themes
- [ ] Level progression with unique challenges
- [ ] Difficulty settings (Easy, Normal, Hard)
- [ ] Multiplayer mode
- [ ] Mobile app version

---

<div align="center">

### 🪱 Ready to Slither? Let's Go! 🪱

**Made with 💖 using HTML, CSS, and JavaScript**

[⬆ Back to Top](#-worm-game---classic-snake-style-gameplay)

</div>
