# 🔨 Whack-a-Mole - Classic Arcade Game 🐹

A fun and engaging Whack-a-Mole arcade game built with HTML, CSS, and JavaScript. Test your reflexes as you whack moles that pop up from their holes!

## 🎮 Game Preview

Experience the classic arcade game with modern web technologies! Featuring smooth animations, progressive difficulty levels, and special moles for bonus points.

---

## ⭐ Features

### 🎯 Classic Gameplay
- **Authentic Whack-a-Mole** mechanics with modern enhancements
- **9 holes** with randomly appearing moles
- **Progressive difficulty** - Game speeds up as you level up
- **60-second timer** - Score as many points as possible before time runs out

### 🏆 Scoring System
- **Regular Moles** 🐹 - 10 points each
- **Golden Moles** ✨ - 50 points for rare golden moles (10% chance)
- **Bombs** 💣 - Watch out! Hitting bombs costs you 20 points (15% chance)

### 📊 Game Features
- **Score Tracking** - Keep track of your current score
- **High Score** - Persistent high score saved in browser
- **Level System** - Advance to next level every 100 points
- **Timer** - 60-second countdown with visual alerts
- **Pause Function** - Pause and resume gameplay anytime

### 🎨 Visual Design
- Smooth pop-up animations
- Score popup effects on hits
- Gradient backgrounds and modern UI
- Responsive design for all screen sizes
- Level-up notifications
- Color-coded mole types

### 🎮 Controls
- **Mouse Click** - Click on moles to whack them
- **P Key** - Pause/Resume game
- **ESC Key** - Pause game

---

## 🎯 How to Play

1. **Start the Game**
   - Click the "START GAME" button on the welcome screen
   - The timer will begin counting down from 60 seconds

2. **Whack the Moles**
   - Click on moles as they pop up from the holes
   - Regular moles (🐹) give you 10 points
   - Golden moles (✨) give you 50 bonus points
   - Avoid hitting bombs (💣) as they deduct 20 points

3. **Level Up**
   - Score 100 points to advance to Level 2
   - Every 100 points takes you to the next level
   - Higher levels increase game difficulty and speed

4. **Game Controls**
   - Press **P** to pause the game
   - Press **ESC** to pause
   - Click **PAUSE** button to pause manually

5. **End Game**
   - Game ends when the timer reaches 0
   - Your final score and level are displayed
   - High scores are automatically saved
   - Click "PLAY AGAIN" to start a new game

---

## 🎲 Game Mechanics

### Mole Types
- **Regular Mole** (80% chance): Standard mole worth 10 points
- **Golden Mole** (10% chance): Rare mole worth 50 points
- **Bomb** (15% chance): Penalty item that deducts 20 points

### Difficulty Progression
- **Level 1**: Moles appear slowly, stay up longer
- **Level 2+**: Moles appear faster, disappear quicker
- Each level increases spawn rate and decreases mole visibility time
- Maximum difficulty caps at higher levels for playability

### Scoring
- Level advancement: Every 100 points = +1 level
- Negative scores are prevented (minimum 0)
- High score is saved locally in the browser

---

## 🛠️ Technologies Used

- **HTML5** - Structure and semantic markup
- **CSS3** - Styling, animations, and responsive design
  - CSS Grid for game board layout
  - CSS Gradients for visual effects
  - CSS Animations for mole pop-ups and level notifications
  - Media queries for responsive design
- **JavaScript (ES6)** - Game logic and interactivity
  - DOM manipulation
  - Event handling
  - Local storage for high scores
  - Timeout and interval management

---

## 📁 File Structure

```
Game16/
├── index.html      # Main HTML structure
├── style.css       # Styling and animations
├── script.js       # Game logic and mechanics
├── README.md       # Documentation
└── LICENSE         # MIT License
```

---

## 🚀 How to Run

1. **Clone or download** this repository
2. **Open** `index.html` in a modern web browser
3. **Start playing!** No installation or setup required

### Alternative Methods
- Use a local web server:
  ```bash
  # Using Python 3
  python -m http.server 8000
  
  # Using Node.js http-server
  npx http-server
  ```
- Deploy to any static hosting service (GitHub Pages, Netlify, Vercel, etc.)

---

## 🎯 Game Tips & Strategy

1. **Focus on Golden Moles** - They're worth 5x regular moles!
2. **Watch for Bombs** - Take your time to avoid clicking bombs
3. **Position Your Mouse** - Keep it hovering over the center for faster reactions
4. **Learn the Pattern** - Moles can't appear in the same hole consecutively
5. **Stay Calm** - Rushing leads to bomb hits and missed moles
6. **Use Peripheral Vision** - Try to see multiple holes at once

---

## 🌟 Advanced Features

### Local Storage
- High scores are saved in browser's local storage
- Persists between sessions
- Clear browser data to reset high score

### Keyboard Shortcuts
- **P** - Pause/Resume
- **ESC** - Pause

### Responsive Design
```css
/* Adapts to different screen sizes */
- Desktop: 3x3 grid with large moles
- Tablet: Optimized spacing and controls
- Mobile: Touch-friendly with adjusted layouts
```

---

## 🎨 Customization

### Modify Difficulty
Edit in `script.js`:
```javascript
// Line ~73: Adjust mole appearance timing
const minTime = Math.max(500, 1500 - (level * 100));
const maxTime = Math.max(1000, 2500 - (level * 150));

// Line ~111: Adjust mole visibility duration
const duration = Math.max(600, 1200 - (level * 50));
```

### Change Mole Types
Edit in `script.js`:
```javascript
// Line ~95: Adjust spawn rates
if (rand < 0.1) { // Golden mole chance (10%)
    mole.classList.add('golden');
} else if (rand > 0.85) { // Bomb chance (15%)
    mole.classList.add('bomb');
}
```

### Modify Scoring
Edit in `script.js`:
```javascript
// Lines ~131-138: Point values
if (mole.classList.contains('golden')) {
    points = 50; // Golden mole points
} else if (mole.classList.contains('bomb')) {
    points = -20; // Bomb penalty
} else {
    points = 10; // Regular mole points
}
```

---

## 🐛 Known Issues

None currently reported. If you find any bugs, please report them!

---

## 📝 Future Enhancements

Potential features for future versions:
- [ ] Sound effects for whacking and level ups
- [ ] Different game modes (endless, challenge, etc.)
- [ ] Power-ups (freeze time, double points, etc.)
- [ ] Multiplayer mode
- [ ] Leaderboard system
- [ ] Different themes and skins
- [ ] Achievement system
- [ ] Combo multipliers

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

## 👨‍💻 Author

Part of the **Web Games Collection**

---

## 🎮 Other Games in Collection

Check out other games in this collection:
- Game 1 - Python Game
- Game 2 - Ludo
- Game 3 - Snake and Ladder
- Game 4 - Worm
- Game 5 - Flappy Bird
- Game 6 - Rock Paper Scissors
- Game 10 - Memory Card Game
- Game 11 - Tic Tac Toe
- Game 12 - Maze Game
- Game 13 - Hangman
- Game 14 - Space Invaders
- Game 15 - Brick Breaker
- **Game 16 - Whack-a-Mole** ⭐ (You are here!)

---

## 🌟 Acknowledgments

- Inspired by the classic arcade game
- Built with modern web technologies
- Designed for fun and learning

---

**Enjoy whacking those moles! 🔨🐹**
