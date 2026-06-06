# 🎮 Web Games Collection

<div align="center">

![Web Games](https://img.shields.io/badge/Web-Games-brightgreen?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)

**A collection of fun and interactive games built with modern web technologies and Python! 🎯**

## 🌐 Live Demo
**Play all games together on our live website: [https://web-games-collection.onrender.com](https://web-games-collection.onrender.com) 🚀**

[🎮 Games Overview](#-games-overview) • [📖 Quick Start](#-quick-start) • [🎯 Game Details](#-game-details) • [🛠️ Installation](#-installation) • [🤝 Contributing](#-contributing)

</div>

---

## 🎮 Games Overview

This repository contains **20 exciting games** that you can play right in your browser or on desktop:

| Game | Type | Tech | Players | Status |
|------|------|------|---------|--------|
| 🎲 **Number Guessing** | Python CLI | Python 3 | 1 | ✅ Ready |
| 🎲 **Ludo Game** | Browser Game | HTML/CSS/JS | 2-4 | ✅ Ready |
| 🐍 **Snake & Ladder** | Browser Game | HTML/CSS/JS | 1-4 | ✅ Ready |
| 🪱 **Worm Game** | Browser Game | HTML/CSS/JS | 1 | ✅ Ready |
| 🐦 **Flappy Bird** | Browser Game | HTML/CSS/JS | 1 | ✅ Ready |
| ✂️ **Rock Paper Scissors** | Browser Game | HTML/CSS/JS | 1 | ✅ Ready |
| 🎨 **Image Playground** | Browser Game | HTML/CSS/JS | 1 | ✅ Ready |
| 🧱 **Tetris** | Browser Game | HTML/CSS/JS | 1 | ✅ Ready |
| 👻 **Pac-Man** | Browser Game | HTML/CSS/JS | 1 | ✅ Ready |
| 🃏 **Memory Card** | Browser Game | HTML/CSS/JS | 1 | ✅ Ready |
| ❌ **Tic Tac Toe** | Browser Game | HTML/CSS/JS | 2 | ✅ Ready |
| 🌀 **Maze Game** | Browser Game | HTML/CSS/JS | 1 | ✅ Ready |
| 📝 **Hangman** | Browser Game | HTML/CSS/JS | 1 | ✅ Ready |
| 🚀 **Space Invaders** | Browser Game | HTML/CSS/JS | 1 | ✅ Ready |
| 🧱 **Brick Breaker** | Browser Game | HTML/CSS/JS | 1 | ✅ Ready |
| 🔨 **Whack-a-Mole** | Browser Game | HTML/CSS/JS | 1 | ✅ Ready |
| 🏰 **Castle Defenders** | Browser Game | HTML/CSS/JS | 1 | ✅ Ready |
| 🃏 **UNO Card Game** | Browser Game | HTML/CSS/JS | 2-4 | ✅ Ready |
| 🏙️ **Skyline Sprint** | Browser Game | HTML/CSS/JS | 1 | ✅ Ready |

---

## 🎯 Quick Start

### For Web Games (Ludo, Snake & Ladder, Worm)
1. Navigate to the game folder
2. Double-click the `.html` file
3. Start playing! 🎮

### For Python Games (Number Guessing)
1. Navigate to `Game1/`
2. Run: `python main.py`
3. Start guessing! 🎯

---

## 🎲 Game Details

---

### 🎲 Game 1: Number Guessing Game

**📍 Location**: `Game1/`

#### 🎮 Game Overview
A simple and fun Python game where you try to guess a randomly generated number between 1 and 100!

#### 📋 How to Play
1. Run the game:
   ```bash
   python main.py
   ```
2. The computer will generate a random number between 1 and 100
3. Enter your guess when prompted
4. The game will tell you if your guess is:
   - Too high ⬆️
   - Too low ⬇️
   - Correct! 🎯
5. Keep guessing until you find the right number

#### ✨ Features
- 🔢 Random number generation
- 🤔 Interactive gameplay
- 🛡️ Input validation (checks for valid integers)
- 💡 Helpful hints after each guess
- 🔄 Continuous play until correct guess

#### 🛠️ Requirements
- Python 3.x
- `random` module (included in Python standard library)

#### 🚀 Quick Start
1. Make sure Python is installed on your system
2. Navigate to the game directory:
   ```bash
   cd Game1
   ```
3. Run the game:
   ```bash
   python main.py
   ```

#### 🎯 Game Logic
1. The game generates a random number between 1 and 100
2. Player inputs their guess
3. Game provides feedback:
   - "Too high!" if the guess is above the target
   - "Too low!" if the guess is below the target
   - "Congratulations!" when the correct number is guessed

#### 💻 Code Example
```python
import random

number_to_guess = random.randint(1, 100)
# Game continues until correct guess
```

#### 🔧 Error Handling
- ✅ Validates numeric input
- ❌ Gracefully handles non-integer inputs
- 🔄 Allows continuous attempts after invalid inputs

#### 💡 Tips to Win
1. Start with 50 as your first guess
2. Use the feedback to narrow down the range
3. Keep track of your previous guesses
4. Use binary search strategy for optimal guessing

---

### 🎲 Game 2: Ludo Game - Classic Board Game

**📍 Location**: `Game2/`

#### 🎮 Game Overview
A fully functional, browser-based Ludo game with beautiful animations and multiplayer support! Experience the classic board game with stunning visuals and smooth gameplay.

#### 🌟 Features

##### ✨ Core Gameplay
- 🎲 **Classic Ludo Rules** - Authentic Ludo experience with all traditional rules
- 👥 **2-4 Players** - Play with 2, 3, or 4 players
- 🎨 **Color Selection** - Choose your favorite color before starting
- 🔒 **Unlock Mechanic** - Roll a 6 to unlock your pieces from home
- ⚡ **Extra Turn on 6** - Get another roll when you hit a 6!
- 🎯 **Safe Zones** - Strategic star positions where pieces can't be captured
- 💥 **Capture System** - Land on opponents to send them back home
- 🏠 **Home Stretch** - Colored paths leading to victory
- 🏆 **Win Detection** - First player to get all 4 pieces home wins!

##### 🎨 Visual Excellence
- ✨ **Smooth Animations** - Jumping pieces with step-by-step movement
- 🌈 **Beautiful Gradients** - Eye-catching color schemes
- ⭐ **Twinkling Stars** - Animated safe zones
- 🎭 **Dice Animation** - Realistic rolling dice effect
- 📱 **Responsive Design** - Perfect on desktop, tablet, and mobile
- 🎯 **Clear Indicators** - Highlighted playable pieces
- 🔄 **Rotating Center Star** - Animated victory zone

##### 📱 Mobile Optimized
- 👆 **Touch Controls** - Full touch support for mobile devices
- 📐 **Adaptive Layout** - Scales perfectly to any screen size
- 🔍 **No Zoom Issues** - Optimized viewport settings
- 💫 **Smooth Touch Animations** - Responsive feedback on every tap

#### 🎮 How to Play

##### 🎯 Game Objective
Be the first player to move all 4 of your pieces from home, around the board, through the home stretch, and into the center finish area!

##### 📋 Game Rules

**Starting the Game**
1. Select the number of players (2, 3, or 4)
2. Each player chooses their color (Red, Green, Yellow, or Blue)
3. Click "Start Game" to begin
4. Players take turns rolling the dice

**Moving Pieces**

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

#### 🚀 Installation

**Method 1: Quick Start (No Installation Required)**
1. Download or clone this repository
2. Navigate to `Game2/`
3. Double-click `ludo.html`
4. Start playing! 🎮

**Method 2: Using a Local Server (Recommended for Development)**
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server
```
Then open `http://localhost:8000/ludo.html` in your browser.

#### 🎯 Game Controls

| Action | Desktop | Mobile |
|--------|---------|--------|
| Roll Dice | Click "Roll Dice" button | Tap "Roll Dice" button |
| Select Piece | Click on highlighted piece | Tap on highlighted piece |
| Reset Game | Click "Reset Game" button | Tap "Reset Game" button |

#### 🎨 Color Guide

| Color | Starting Position | Arrow Direction |
|-------|------------------|-----------------|
| 🟢 **Green** | Left side of middle cross | ← (Left) |
| 🟡 **Yellow** | Top side of middle cross | ↑ (Up) |
| 🔴 **Red** | Bottom side of middle cross | ↑ (Up) |
| 🔵 **Blue** | Right side of middle cross | ← (Left) |

#### 💡 Pro Tips & Strategies
1. **Spread Your Pieces** - Don't keep all pieces together, spread them for better chances
2. **Use Safe Zones** - Plan moves to land on star positions when opponents are nearby
3. **Capture Wisely** - Sometimes it's better to advance than to capture
4. **Block Opponents** - Position pieces strategically to block opponent movements
5. **Home Stretch Timing** - Enter home stretch when you have pieces trailing for support
6. **Save a Piece** - Keep one piece near opponents' starting area for capturing
7. **6 Strategy** - Use extra turns from rolling 6 to unlock multiple pieces or advance one piece rapidly

#### 🌐 Browser Compatibility

| Browser | Supported | Version |
|---------|-----------|---------|
| Chrome | ✅ | 90+ |
| Firefox | ✅ | 88+ |
| Safari | ✅ | 14+ |
| Edge | ✅ | 90+ |
| Opera | ✅ | 76+ |

#### 📁 File Structure
```
Game2/
├── 📄 ludo.html          # Main HTML file
├── 🎨 ludo.css           # Styles and animations
├── ⚙️ ludo.js            # Game logic and mechanics
└── 📖 README.md          # Game documentation
```

---

### 🐍 Game 3: Snake & Ladder Game

**📍 Location**: `Game3/`

#### 🎮 Game Overview
A classic Snake and Ladder game built with modern web technologies! Experience the beloved board game with beautiful design and smooth animations.

#### ⭐ Features
- 🎲 Classic Snake and Ladder gameplay
- 🎯 Interactive dice rolling
- 🚶 Smooth piece movement animations
- 🎨 Beautiful board design with numbered squares
- 🐍 Animated snakes that slide players down
- 🪜 Ladders to climb up for quick advancement
- 🎮 Easy-to-use controls
- 📱 Mobile-friendly design
- 🎯 Win detection and celebration
- 🔄 Restart game option

#### 🎮 How to Play

##### 🎯 Game Objective
Be the first player to reach square 100 by rolling the dice and using ladders to climb up while avoiding snakes!

##### 📋 Game Rules
1. **Start the Game**
   - Open `snake_ladder.html` in your web browser
   - Choose the number of players
   - Click "Start Game" to begin

2. **Game Rules**
   - Players take turns rolling the dice
   - Move your piece according to the dice number
   - Land on a ladder to climb up ⬆️
   - Land on a snake head to slide down ⬇️
   - First player to reach square 100 wins! 🏆

3. **Controls**
   - Click/Tap the dice to roll
   - Pieces move automatically based on dice value
   - Follow on-screen instructions for your turn

#### 🎯 Board Features

##### 🎲 Board Layout
- 10×10 grid (100 squares)
- Numbered squares for easy tracking
- Colorful design for better visibility
- Strategic snake and ladder placements

##### 🎮 Gameplay Elements
- Random dice rolls (1-6)
- Automatic piece movement
- Turn-based gameplay
- Clear player indicators
- Win condition detection

##### 🎨 Visual Elements
- Smooth animations
- Responsive design
- Clear visual feedback
- Easy-to-read numbers
- Player position indicators

#### 🛠️ Setup

1. **Download the Files**
   - Download all three files:
     - `snake_ladder.html`
     - `snake_ladder.css`
     - `snake_ladder.js`

2. **Run Locally**
   - Keep all files in the same folder
   - Double-click `snake_ladder.html` to open in browser
   - No server required - runs offline!

3. **Host Online**
   - Upload files to any web hosting
   - Or use GitHub Pages for free hosting

#### 📱 Compatibility

- ✅ Desktop Chrome, Firefox, Safari, Edge
- ✅ Mobile browsers
- ✅ Tablets
- ✅ Touch-screen devices
- ✅ Responsive design adapts to screen size

#### 💻 Technical Details

- Pure HTML5/CSS3/JavaScript
- No external dependencies
- Lightweight and fast-loading
- Cross-browser compatible
- Mobile-responsive design

#### 🔧 Customization

You can customize the game by modifying:
- Board colors in CSS
- Snake and ladder positions in JavaScript
- Number of players
- Board size
- Animation speeds

#### 📁 File Structure
```
Game3/
├── 📄 snake_ladder.html  # Main HTML file
├── 🎨 snake_ladder.css   # Styles and animations
├── ⚙️ snake_ladder.js    # Game logic and mechanics
└── 📖 README.md          # Game documentation
```

---

### 🪱 Game 4: Worm Game - Classic Snake-Style Gameplay

**📍 Location**: `Game4/`

#### 🎮 Game Overview
A fun and addictive browser-based Worm game with smooth animations! Guide your worm to eat food and grow longer without colliding with walls or yourself.

#### ⭐ Features

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

#### 🎮 How to Play

##### 🎯 Game Objective
Guide your worm to eat food and grow longer without colliding with the walls or yourself!

##### 📋 Game Rules

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

#### 🎮 Controls

| Action | Key |
|--------|-----|
| Move Up | ↑ or W |
| Move Down | ↓ or S |
| Move Left | ← or A |
| Move Right | → or D |
| Pause/Resume | P |
| Start Game | Click "Start Game" button |
| Restart | Click "Restart Game" button |

#### 🛠️ Installation

**Method 1: Quick Start (No Installation Required)**
1. Download the files
2. Navigate to `Game4/`
3. Double-click `index.html`
4. Start playing! 🎮

**Method 2: Using a Local Server**
```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js
npx http-server
```
Then open `http://localhost:8000/index.html` in your browser.

#### 🎨 Game Elements

| Element | Description | Points |
|---------|-------------|--------|
| 🐛 Worm | Your player character that grows with each food | - |
| 🍎 Red Food | Regular food to collect and grow | 10 × Level |
| ⭐ Golden Food | Bonus food that slows time for 5 seconds | 50 × Level |
| ⬜ Walls | Game boundaries - don't touch! | Game Over |
| 📊 Score | Track your current score | Increases per food |
| 🎚️ Level | Current difficulty level (increases every 5 foods) | - |
| 🐛 Length | Current worm length | - |

#### 💡 Pro Tips & Strategies

**Beginner Tips (Score: 50-150)**
1. Start with slow, deliberate movements
2. Plan your routes before moving
3. Keep the worm in the middle of the board
4. Learn basic turning mechanics
5. Focus on survival first, scoring second

**Intermediate Tips (Score: 150-500)**
1. Create efficient paths to collect food
2. Maintain 3-4 segments distance from walls
3. Adapt to speed increases at each level
4. Start collecting bonus foods
5. Use time-slow strategically

**Advanced Tips (Score: 500+)**
1. Master the spiral technique for maneuvering
2. Hunt bonus foods efficiently
3. Optimize time-slow usage
4. React within 100-150ms at high speeds
5. Plan 3-4 moves ahead

**Bonus Food Strategy**
- Hunt when worm is short (3-8 segments)
- Skip when worm is long (15+ segments)
- Collect before entering dangerous areas
- Use time-slow to escape tight situations

**Time-Slow Power-Up Optimization**
- Collect before danger appears
- Chain collection of 2-3 foods during slow
- Navigate tight corners safely
- Create separation from your body
- Reposition for better angles

#### 🐛 Troubleshooting

**Game doesn't load?**
- Make sure all files are in the same directory
- Check browser console for errors (F12)
- Try a different browser

**Controls not working?**
- Make sure the game window is focused
- Try arrow keys or WASD alternatively
- Restart browser if needed

**Performance issues?**
- Close other browser tabs
- Update your browser
- Try a different browser

#### 🌐 Browser Compatibility

| Browser | Supported | Version |
|---------|-----------|---------|
| Chrome | ✅ | 90+ |
| Firefox | ✅ | 88+ |
| Safari | ✅ | 14+ |
| Edge | ✅ | 90+ |
| Opera | ✅ | 76+ |

#### 📁 File Structure
```
Game4/
├── 📄 index.html          # Main HTML file with UI
├── 🎨 worm.css           # Styling and animations
├── 🔧 worm.js            # Game logic and mechanics
└── 📖 README.md          # Game documentation
```

#### 🔮 Future Enhancements

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

### 🚀 Game 14: Space Invaders

**📍 Location**: `Game14/`

#### 🎮 Game Overview
A classic arcade shooter where you defend Earth from waves of alien invaders! Experience the nostalgia of one of gaming's most iconic titles, reimagined with modern web technologies.

#### 📋 How to Play
1. Open `index.html` in your browser
2. Click "START GAME" button
3. Use arrow keys to move your ship left and right
4. Press SPACEBAR to shoot bullets at the aliens
5. Destroy all aliens to advance to the next level
6. Protect your ship and don't let aliens reach the bottom!

#### ✨ Features

**🎮 Classic Arcade Gameplay**
- 🛸 **5 rows of aliens** - Different types worth 10, 20, and 30 points
- 👾 **Progressive difficulty** - Game speeds up as you eliminate aliens
- 🎯 **Level system** - Complete waves to advance through levels
- ❤️ **Lives system** - 3 lives to defend Earth
- 🛸 **Mystery ship** - Bonus ship worth 100 points appears randomly
- 🛡️ **Defensive barriers** - 4 barriers that absorb damage

**🎨 Visual Excellence**
- Retro aesthetic with modern CSS effects
- Animated starfield background
- Smooth animations for all elements
- Glowing effects and explosions
- Color-coded aliens with emoji graphics

**🏆 Scoring System**
- Bottom Aliens 👾: 10 points
- Middle Aliens 🛸: 20 points
- Top Aliens 👽: 30 points
- Mystery Ship 🛸: 100 points

**📱 Mobile Support**
- Touch controls - Tap to shoot
- Swipe to move ship
- Responsive design for all devices

#### 🎮 Controls

**Desktop:**
- `←` `→` Arrow Keys - Move ship left/right
- `SPACE` - Shoot bullets
- `P` - Pause/Resume game

**Mobile:**
- Tap screen - Shoot
- Swipe left/right - Move ship

#### 🎯 Game Elements

| Element | Description | Effect |
|---------|-------------|--------|
| 🚀 Player Ship | Your defense against invasion | Control with arrows |
| 👾🛸👽 Aliens | Three types of invaders | 10-30 points each |
| 🛸 Mystery Ship | Bonus ship at top | 100 points |
| 🛡️ Barriers | Defensive shields | Absorb 3 hits |
| 💥 Bullets | Player shoots cyan, aliens shoot magenta | Destroy enemies |

#### 💡 Strategy Tips

**Survival Tactics:**
1. **Stay Mobile** - Constant movement avoids alien bullets
2. **Use Barriers** - Hide behind them when overwhelmed
3. **Shoot Continuously** - Keep pressure with 3-bullet maximum
4. **Prioritize Threats** - Target closest aliens first
5. **Hunt Mystery Ships** - Easy 100 points bonus
6. **Save Barriers** - More valuable in later levels
7. **Watch Patterns** - Learn alien bullet trajectories

**Scoring Strategies:**
- Focus on top aliens (30 pts) when possible
- Time mystery ship appearances
- Clear bottom rows to slow alien descent
- Maintain all 3 lives for maximum attempts

#### 🎚️ Difficulty Progression

**Level 1-3:** Learn the basics
- Standard alien speed
- 1000ms between alien shots
- 3 lives to practice

**Level 4-7:** Intermediate challenge
- Aliens move 20% faster per level
- Shooting frequency increases
- Barriers become critical

**Level 8+:** Expert gameplay
- Significantly faster aliens
- Rapid alien fire rate
- Requires mastery of controls

#### 🛠️ Technical Details

- **Built with:** HTML5 Canvas, CSS3, Vanilla JavaScript
- **Performance:** Optimized 60 FPS gameplay
- **Storage:** High scores saved in localStorage
- **Compatibility:** All modern browsers
- **Responsive:** Works on desktop, tablet, mobile

#### 🐛 Troubleshooting

**Game running too fast?**
- Animation is capped at 60 FPS automatically
- Try a different browser if issues persist

**Touch controls delayed?**
- Ensure you're using a modern mobile browser
- Clear browser cache and reload

**High score not saving?**
- Check if localStorage is enabled
- Private/Incognito mode may prevent saving

#### 📁 File Structure
```
Game14/
├── 📄 index.html          # Main HTML with game UI
├── 🎨 style.css          # Retro arcade styling
├── 🔧 script.js          # Complete game logic
├── 📖 README.md          # Comprehensive documentation
└── 📜 LICENSE            # MIT License
```

#### 🌟 Highlights

- ✅ **Authentic classic** - True to original Space Invaders
- ✅ **Modern polish** - Smooth animations and effects
- ✅ **Progressive challenge** - Gets harder as you advance
- ✅ **Mobile-friendly** - Play anywhere, anytime
- ✅ **No dependencies** - Pure vanilla JavaScript
- ✅ **Saves progress** - High score tracking
- ✅ **Polished UI** - Professional overlays and screens

---

### 🧱 Game 15: Brick Breaker

**📍 Location**: `Game15/`

#### 🎮 Game Overview
A classic arcade-style brick breaker game where you control a paddle to bounce a ball and destroy all the bricks! Break through colorful layers of bricks, advance through challenging levels, and set high scores in this timeless arcade experience.

#### 📋 How to Play
1. Open `index.html` in your browser
2. Click "START GAME" button
3. Use arrow keys or mouse to move your paddle left and right
4. Press SPACEBAR to launch the ball
5. Break all bricks to complete the level
6. Don't let the ball fall below your paddle!

#### ✨ Features

**🎮 Classic Arcade Gameplay**
- 🧱 **6 rows of colorful bricks** - Different colors worth different points
- 🎯 **Progressive difficulty** - Ball speed increases each level
- ❤️ **Lives system** - 3 lives to master each level
- 🏆 **High score tracking** - Saved in browser localStorage
- ⚡ **Physics-based rebounds** - Angle changes based on paddle hit position
- 🎚️ **Level progression** - Infinite levels with increasing challenge

**🎨 Visual Excellence**
- Modern gradient design with vibrant colors
- Smooth animations and transitions
- Glowing ball effects with shadows
- Glossy brick appearance with shine effects
- Professional UI with game statistics
- Responsive layout for all screen sizes

**🏆 Scoring System**
- 🟥 Red Bricks: 50 points
- 🟧 Orange Bricks: 40 points
- 🟨 Yellow Bricks: 30 points
- 🟩 Green Bricks: 20 points
- 🟦 Blue Bricks: 10 points

**📱 Multiple Control Options**
- Keyboard arrow keys
- Mouse movement
- Responsive touch support

#### 🎮 Controls

**Desktop:**
- `←` `→` Arrow Keys - Move paddle left/right
- Mouse Movement - Direct paddle control
- `SPACE` - Launch ball
- `P` - Pause/Resume game

#### 🎯 Game Elements

| Element | Description | Points |
|---------|-------------|--------|
| 🟥 Red Brick | Top row | 50 pts |
| 🟧 Orange Brick | Second row | 40 pts |
| 🟨 Yellow Brick | Third row | 30 pts |
| 🟩 Green Brick | Fourth row | 20 pts |
| 🟦 Blue Brick | Fifth & sixth rows | 10 pts |
| 🎯 Paddle | Player-controlled | Hit position matters |
| ⚪ Ball | Destroys bricks | Speed increases per level |

#### 💡 Strategy Tips

**Mastering the Paddle:**
1. **Angle Control** - Hit ball with paddle edges for sharper angles
2. **Center Hits** - Paddle center gives more vertical bounces
3. **Positioning** - Stay near ball's trajectory path
4. **Combo Shots** - Aim for brick clusters for multiple hits
5. **Top Rows First** - Red/orange bricks worth more points
6. **Ball Speed** - Anticipate faster speeds in later levels
7. **Corner Shots** - Use walls to reach difficult bricks

**Scoring Strategies:**
- Prioritize high-value bricks (red, orange)
- Clear top rows early for maximum points
- Create ball paths through brick columns
- Maintain lives for bonus opportunities
- Master paddle angles for precision shots

#### 🎚️ Difficulty Progression

**Level 1-3:** Learning phase
- Base ball speed (4 units)
- Clear brick patterns
- Practice paddle control

**Level 4-7:** Intermediate challenge
- Ball speed increases by 0.5 per level
- Faster reflexes required
- Strategic positioning matters

**Level 8+:** Expert gameplay
- High ball speeds
- Precision paddle control essential
- Quick reaction times critical

#### 🛠️ Technical Details

- **Built with:** HTML5 Canvas, CSS3, Vanilla JavaScript
- **Performance:** Optimized 60 FPS gameplay with requestAnimationFrame
- **Storage:** High scores saved in localStorage
- **Compatibility:** All modern browsers (Chrome, Firefox, Safari, Edge)
- **Responsive:** Adapts to different screen sizes
- **No Dependencies:** Pure vanilla JavaScript

#### 🐛 Troubleshooting

**Ball moving too fast?**
- This is intentional progression - it speeds up each level
- Practice paddle positioning and anticipation

**Paddle not responding to mouse?**
- Ensure cursor is over the game canvas
- Try keyboard controls instead

**High score not saving?**
- Check if localStorage is enabled in browser
- Private/Incognito mode may prevent saving
- Clear browser cache and try again

#### 📁 File Structure
```
Game15/
├── 📄 index.html          # Main HTML with game UI
├── 🎨 style.css          # Modern gradient styling
├── 🔧 script.js          # Game physics and logic
├── 📖 README.md          # Complete documentation
└── 📜 LICENSE            # MIT License
```

#### 🌟 Highlights

- ✅ **Authentic arcade** - Classic brick breaker gameplay
- ✅ **Modern design** - Beautiful gradients and effects
- ✅ **Physics-based** - Realistic ball mechanics
- ✅ **Progressive** - Difficulty increases naturally
- ✅ **Dual controls** - Keyboard or mouse
- ✅ **Score tracking** - LocalStorage high scores
- ✅ **No dependencies** - Pure vanilla JavaScript
- ✅ **Responsive UI** - Works on all screen sizes

---

## 🛠️ Installation

### For Web Games (Games 2, 3, 4)

#### Quick Start
Simply download the game files and open the `.html` file in your browser. No installation required!

#### For Local Development Server

**Using Python 3:**
```bash
cd /path/to/web-games
python -m http.server 8000
# Open http://localhost:8000 in your browser
```

**Using Python 2:**
```bash
cd /path/to/web-games
python -m SimpleHTTPServer 8000
```

**Using Node.js:**
```bash
cd /path/to/web-games
npx http-server
```

**Using PHP:**
```bash
cd /path/to/web-games
php -S localhost:8000
```

### For Python Games (Game 1)

**Requirements:**
- Python 3.x installed on your system

**Installation:**
1. Navigate to `Game1/` directory
2. Run: `python main.py`

---

## 📁 Repository Structure

```
web-games/
├── Game1/
│   ├── main.py                    # Number Guessing Game
│   └── README.md                  # Game documentation
├── Game2/
│   ├── index.html                 # Ludo Game
│   ├── ludo.css                   # Ludo Game (Styles)
│   ├── ludo.js                    # Ludo Game (Logic)
│   ├── README.md                  # Game documentation
│   ├── LICENSE                    # License file
│   └── CONTRIBUTING.md            # Contribution guidelines
├── Game3/
│   ├── index.html                 # Snake & Ladder
│   ├── snake_ladder.css           # Snake & Ladder (Styles)
│   ├── snake_ladder.js            # Snake & Ladder (Logic)
│   ├── README.md                  # Game documentation
│   ├── LICENSE                    # License file
│   └── CONTRIBUTING.md            # Contribution guidelines
├── Game4/
│   ├── index.html                 # Worm Game
│   ├── worm.css                   # Worm Game (Styles)
│   ├── worm.js                    # Worm Game (Logic)
│   ├── README.md                  # Game documentation
│   ├── FEATURES.md                # Detailed features
│   ├── INSTALLATION.md            # Installation guide
│   ├── STRATEGIES.md              # Strategy guide
│   └── assets/                    # Game assets
├── Game5/
│   ├── index.html                 # Flappy Bird
│   ├── flappybird.css             # Flappy Bird (Styles)
│   ├── flappybird.js              # Flappy Bird (Logic)
│   ├── README.md                  # Game documentation
│   ├── LICENSE                    # License file
│   └── assets/                    # Game assets
├── Game6/
│   ├── index.html                 # Rock Paper Scissors
│   ├── style.css                  # Styles
│   ├── script.js                  # Game Logic
│   ├── README.md                  # Game documentation
│   ├── LICENSE                    # License file
│   └── CONTRIBUTING.md            # Contribution guidelines
├── Game7/
│   ├── index.html                 # Image Playground
│   ├── style.css                  # Styles
│   ├── script.js                  # Game Logic
│   ├── config.js                  # Configuration
│   ├── README.md                  # Game documentation
│   └── LICENSE                    # License file
├── Game8/
│   ├── index.html                 # Tetris
│   ├── style.css                  # Styles
│   ├── script.js                  # Game Logic
│   ├── README.md                  # Game documentation
│   └── LICENSE                    # License file
├── Game9/
│   ├── index.html                 # Pac-Man
│   ├── style.css                  # Styles
│   ├── script.js                  # Game Logic
│   ├── README.md                  # Game documentation
│   └── LICENSE                    # License file
├── Game10/
│   ├── index.html                 # Memory Card Game
│   ├── style.css                  # Styles
│   ├── script.js                  # Game Logic
│   ├── README.md                  # Game documentation
│   └── LICENSE                    # License file
├── Game11/
│   ├── index.html                 # Tic Tac Toe
│   ├── style.css                  # Styles
│   ├── script.js                  # Game Logic
│   ├── README.md                  # Game documentation
│   └── LICENSE                    # License file
├── Game12/
│   ├── index.html                 # Maze Game
│   ├── style.css                  # Styles
│   ├── script.js                  # Game Logic
│   ├── README.md                  # Game documentation
│   └── LICENSE                    # License file
├── Game13/
│   ├── index.html                 # Hangman
│   ├── style.css                  # Styles
│   ├── script.js                  # Game Logic
│   ├── README.md                  # Game documentation
│   └── LICENSE                    # License file
├── Game14/
│   ├── index.html                 # Space Invaders
│   ├── style.css                  # Styles
│   ├── script.js                  # Game Logic
│   ├── README.md                  # Game documentation
│   └── LICENSE                    # License file
├── Game15/
│   ├── index.html                 # Brick Breaker
│   ├── style.css                  # Styles
│   ├── script.js                  # Game Logic
│   ├── README.md                  # Game documentation
│   └── LICENSE                    # License file
├── Game16/
│   ├── index.html                 # Whack-a-Mole
│   ├── style.css                  # Styles
│   ├── script.js                  # Game Logic
│   ├── README.md                  # Game documentation
│   └── LICENSE                    # License file
├── Game17/
│   ├── index.html                 # Castle Defenders
│   ├── style.css                  # Styles
│   ├── script.js                  # Game Logic
│   ├── README.md                  # Game documentation
│   └── LICENSE                    # License file
├── Game18/
│   ├── index.html                 # UNO Card Game
│   ├── style.css                  # Styles
│   ├── script.js                  # Game Logic
│   ├── README.md                  # Game documentation
│   └── LICENSE                    # License file
├── Game19/
│   ├── index.html                 # Skyline Sprint
│   ├── style.css                  # Styles
│   ├── script.js                  # Game Logic
│   ├── README.md                  # Game documentation
│   └── LICENSE                    # License file
├── Game20/
│   ├── index.html                 # Whack-a-Mole (All-in-one file)
│   ├── README.md                  # Game documentation
│   └── LICENSE                    # License file
├── Web_Games_Collection/
│   └── index.html                 # Collection portal
├── LICENSE                        # MIT License
└── README.md                      # This file
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### 🐛 Reporting Issues
- Use the GitHub Issues tab to report bugs
- Include browser and device information
- Describe the steps to reproduce the issue
- Add screenshots if possible

### 💡 Suggesting Enhancements
- Check existing issues/suggestions first
- Describe your feature idea in detail
- Explain why it would be useful
- Include mockups/sketches if relevant

### 🔨 Contributing Code
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Make your changes:
   - Follow the existing code style
   - Add comments for complex logic
   - Test thoroughly on different devices
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to your branch (`git push origin feature/YourFeature`)
6. Open a Pull Request

### 📋 Pull Request Guidelines
- One feature/fix per PR
- Update README if needed
- Test your changes thoroughly
- Include before/after screenshots for UI changes

### 🎨 Style Guidelines

**JavaScript**
- Use `const` and `let` instead of `var`
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

**CSS**
- Use meaningful class names
- Group related styles together
- Use CSS variables for repeated values
- Add comments for complex layouts

**HTML**
- Use semantic HTML5 elements
- Include proper ARIA labels
- Keep structure clean and organized

### ⭐ Areas for Contribution
- Mobile responsiveness
- New game features
- Performance improvements
- Accessibility enhancements
- Documentation improvements
- Bug fixes
- UI/UX enhancements

---

## 📝 License

This project is open source and available under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```plaintext
MIT License

Copyright (c) 2025 Faiz Ahmad Khan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 👨‍💻 Author

Created with ❤️ by **Faiz Ahmad Khan**

---

## 🙋‍♂️ FAQ

### Q: Can I play these games on mobile devices?
**A:** Yes! Games 2, 3, and 4 are fully responsive and work great on tablets and smartphones.

### Q: Do I need an internet connection?
**A:** No! All games work offline once downloaded. They're pure HTML/CSS/JavaScript or Python.

### Q: Can I modify the games?
**A:** Absolutely! The code is open source. Feel free to fork, modify, and create your own versions.

### Q: How do I report bugs?
**A:** Please use the GitHub Issues page to report any bugs with detailed information.

### Q: Can I contribute new games?
**A:** Yes! We'd love contributions. Please open an issue first to discuss your idea.

### Q: Which Python version do I need for Game 1?
**A:** Python 3.x is recommended. Python 2 is deprecated but might still work.

### Q: How do I host these games online?
**A:** You can use GitHub Pages, Netlify, Vercel, or any traditional web hosting service.

---

## 📞 Support

For questions, issues, or feedback:
- 📧 Create an issue on GitHub
- 💬 Start a discussion
- 🔗 Check existing documentation

---

## 🔮 Future Roadmap

- [ ] Online multiplayer support for web games
- [ ] AI opponents for single-player modes
- [ ] Sound effects and background music
- [ ] Leaderboard system with cloud storage
- [ ] Mobile app versions
- [ ] Additional game themes
- [ ] Difficulty settings
- [ ] Achievement system
- [ ] Statistics and analytics
- [ ] More games added to collection

---

<div align="center">

### 🎮 Ready to Play? Let's Begin! 🎮
**Choose Your Game:**
- 🎲 [Number Guessing](Game1/) - Quick Python game
- 🎲 [Ludo](Game2/) - Classic board game
- 🐍 [Snake & Ladder](Game3/) - Board game adventure
- 🪱 [Worm](Game4/) - Action-packed gameplay
- 🐦 [Flappy Bird](Game5/) - Flying challenge
- ✂️ [Rock Paper Scissors](Game6/) - Quick battle
- 🎨 [Image Playground](Game7/) - Creative fun
- 🧱 [Tetris](Game8/) - Puzzle classic
- 👻 [Pac-Man](Game9/) - Maze arcade
- 🃏 [Memory Card](Game10/) - Memory challenge
- ❌ [Tic Tac Toe](Game11/) - Strategy game
- 🌀 [Maze Game](Game12/) - Pathfinding puzzle
- 📝 [Hangman](Game13/) - Word guessing
- 🚀 [Space Invaders](Game14/) - Arcade shooter
- 🧱 [Brick Breaker](Game15/) - Classic arcade game
- 🔨 [Whack-a-Mole](Game16/) - Reflex arcade challenge
- 🏰 [Castle Defenders](Game17/) - Tower defense RPG
- 🃏 [UNO Card Game](Game18/) - Classic card strategy game
- 🏙️ [Skyline Sprint](Game19/) - High-speed dodge runner
- 🔨 [Whack-a-Mole](Game20/) - Retro arcade reflex game


**Made with 💖 using HTML5, CSS3, JavaScript, and Python**

[⬆ Back to Top](#-web-games-collection)

</div>
