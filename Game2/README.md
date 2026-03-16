# 🎲 Ludo Game - Classic Board Game in Browser

<div align="center">

![Ludo Game](https://img.shields.io/badge/Game-Ludo-brightgreen?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

**A fully functional, browser-based Ludo game with beautiful animations, dark mode support, and multiplayer gameplay!**

[🎮 Play Now](#how-to-run ) • [📖 Features](#features) • [🎯 How to Play](#how-to-play) • [🛠️ Installation](#installation)

</div>

---

## 🌙 Dark Mode & Accessibility

This game now includes:
- **🌙 Automatic Dark Mode** - Respects your system's theme preferences
- **♿ Full Accessibility Support** - Keyboard navigation, ARIA labels, and focus indicators
- **⌨️ Accessible Buttons** - Enhanced focus states for keyboard users
- **⚡ Motion-Friendly** - Respects `prefers-reduced-motion` for users who prefer minimal animations

---

## 🌟 Features

### ✨ Core Gameplay
- 🎲 **Classic Ludo Rules** - Authentic Ludo experience with all traditional rules
- 👥 **2-4 Players** - Play with 2, 3, or 4 players
- 🎨 **Color Selection** - Choose your favorite color before starting
- 🔒 **Unlock Mechanic** - Roll a 6 to unlock your pieces from home
- ⚡ **Extra Turn on 6** - Get another roll when you hit a 6!
- 🎯 **Safe Zones** - Strategic star positions where pieces can't be captured
- 💥 **Capture System** - Land on opponents to send them back home
- 🏠 **Home Stretch** - Colored paths leading to victory
- 🏆 **Win Detection** - First player to get all 4 pieces home wins!

### 🎨 Visual Excellence
- ✨ **Smooth Animations** - Jumping pieces with step-by-step movement
- 🌈 **Beautiful Gradients** - Eye-catching color schemes
- ⭐ **Twinkling Stars** - Animated safe zones
- 🎭 **Dice Animation** - Realistic rolling dice effect
- 📱 **Responsive Design** - Perfect on desktop, tablet, and mobile
- 🎯 **Clear Indicators** - Highlighted playable pieces
- 🔄 **Rotating Center Star** - Animated victory zone

### 📱 Mobile Optimized
- 👆 **Touch Controls** - Full touch support for mobile devices
- 📐 **Adaptive Layout** - Scales perfectly to any screen size
- 🔍 **No Zoom Issues** - Optimized viewport settings
- 💫 **Smooth Touch Animations** - Responsive feedback on every tap

---

## 🎮 How to Play

### 🎯 Game Objective
Be the first player to move all 4 of your pieces from home, around the board, through the home stretch, and into the center finish area!

### 📋 Game Rules

#### **Starting the Game**
1. Select the number of players (2, 3, or 4)
2. Each player chooses their color (Red, Green, Yellow, or Blue)
3. Click "Start Game" to begin
4. Players take turns rolling the dice

#### **Moving Pieces**

🔒 **Unlocking Pieces**
- All pieces start in their home area (colored corners)
- You must roll a **6** to unlock your first piece
- Rolling a 6 allows you to move a piece from home to your starting position
- After at least one piece is on the board, any number works

⚡ **Special Rule: Roll Again on 6**
- Whenever you roll a 6, you get an extra turn!
- This works throughout the entire game, not just at the start
- Use this strategically to move faster or unlock more pieces

🎯 **Moving Around the Board**
- Click/tap your dice to roll
- Clickable pieces will be highlighted with a golden glow
- Select which piece to move
- Pieces move step-by-step with jumping animation
- Each color follows a specific path around the board

⭐ **Safe Zones**
- Star-marked positions are safe zones
- Pieces on stars cannot be captured
- Use these for strategic positioning

💥 **Capturing Opponents**
- Landing on an opponent's piece (not on a star) captures it
- Captured pieces return to their home area
- They must roll a 6 again to re-enter

🏠 **Home Stretch**
- After completing a full circuit, enter your colored path
- This leads directly to the center
- You must move exactly into the center (no overshoot)

🏆 **Winning**
- First player to get all 4 pieces into the center wins!
- The game announces the winner with a victory message

---

## 🚀 Installation

### Method 1: Quick Start (No Installation Required)

1. **Download the files**
   ```bash
   # Download or clone this repository
   git clone https://github.com/faizahmad-khan/ludo-game.git
   cd ludo-game
   ```

2. **Open in Browser**
   - Simply double-click `ludo.html`
   - OR right-click → Open with → Your favorite browser
   - That's it! Start playing! 🎮

### Method 2: Using a Local Server (Recommended for Development)

```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000/ludo.html` in your browser.

---

## 🛠️ How to Run

### **For Windows:**
1. Download all files (ludo.html, ludo.css, ludo.js)
2. Keep them in the same folder
3. Double-click `ludo.html`
4. Your default browser will open with the game

### **For Mac:**
1. Download all files
2. Keep them in the same folder
3. Right-click `ludo.html` → Open With → Safari/Chrome/Firefox
4. Game will load in your browser

### **For Linux:**
```bash
# Navigate to the game folder
cd /path/to/ludo-game

# Open with default browser
xdg-open ludo.html

# Or use a specific browser
firefox ludo.html
google-chrome ludo.html
```

### **For Mobile Devices:**
1. Transfer files to your phone
2. Use any file manager to navigate to the folder
3. Tap on `ludo.html`
4. Choose "Open with Browser"

---

## 📁 File Structure

```
ludo-game/
├── 📄 ludo.html          # Main HTML file
├── 🎨 ludo.css           # Styles and animations
├── ⚙️ ludo.js            # Game logic and mechanics
└── 📖 README.md          # This file
```

---

## 🎯 Game Controls

| Action | Desktop | Mobile |
|--------|---------|--------|
| Roll Dice | Click "Roll Dice" button | Tap "Roll Dice" button |
| Select Piece | Click on highlighted piece | Tap on highlighted piece |
| Reset Game | Click "Reset Game" button | Tap "Reset Game" button |

---

## 🎨 Color Guide

| Color | Starting Position | Arrow Direction |
|-------|------------------|-----------------|
| 🟢 **Green** | Left side of middle cross | ← (Left) |
| 🟡 **Yellow** | Top side of middle cross | ↑ (Up) |
| 🔴 **Red** | Bottom side of middle cross | ↑ (Up) |
| 🔵 **Blue** | Right side of middle cross | ← (Left) |

---

## 💡 Pro Tips & Strategies

1. **Spread Your Pieces** - Don't keep all pieces together, spread them for better chances
2. **Use Safe Zones** - Plan moves to land on star positions when opponents are nearby
3. **Capture Wisely** - Sometimes it's better to advance than to capture
4. **Block Opponents** - Position pieces strategically to block opponent movements
5. **Home Stretch Timing** - Enter home stretch when you have pieces trailing for support
6. **Save a Piece** - Keep one piece near opponents' starting area for capturing
7. **6 Strategy** - Use extra turns from rolling 6 to unlock multiple pieces or advance one piece rapidly

---

## 🐛 Troubleshooting

### Game doesn't load?
- Make sure all three files (HTML, CSS, JS) are in the same folder
- Check browser console for errors (F12)
- Try a different browser

### Animations not working?
- Update your browser to the latest version
- Clear browser cache
- Disable browser extensions that might interfere

### Mobile layout issues?
- Rotate device to landscape mode for better experience
- Zoom out if needed
- Try different mobile browser

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

## 📱 Responsive Breakpoints

- **Desktop**: 1200px and above - Full size board
- **Tablet**: 768px - 1199px - Medium board
- **Mobile**: Below 768px - Compact board with touch controls

---

## 🎓 Learning Resources

Want to understand the code? Here's what you'll learn:

- **HTML5**: Semantic markup, data attributes
- **CSS3**: Grid layout, flexbox, animations, gradients, responsive design
- **JavaScript**: ES6+, DOM manipulation, event handling, game state management

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

## 🎮 Screenshots

### Player Selection Screen
Choose your number of players and colors before starting the game.

### Game Board
Beautiful, responsive board with clear path indicators and animations.

### Mobile View
Fully responsive design that works perfectly on all devices.

---

## 🔮 Future Enhancements

- [ ] AI opponents for single-player mode
- [ ] Online multiplayer support
- [ ] Game statistics and leaderboard
- [ ] Sound effects and background music
- [ ] Different board themes
- [ ] Save/load game feature
- [ ] Replay last move feature
- [ ] Tournament mode

---

## ⭐ Show Your Support

If you found this project helpful or fun, please consider:
- ⭐ Starring this repository
- 🍴 Forking it for your own modifications
- 📢 Sharing it with friends

---

<div align="center">

### 🎲 Ready to Play? Let's Roll! 🎲

**Made with 💖 using HTML, CSS, and JavaScript**

[⬆ Back to Top](#-ludo-game---classic-board-game-in-browser)

</div>
