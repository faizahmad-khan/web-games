# Flappy Bird Plus ✨

<div align="center">

An upgraded and visually polished implementation of the classic Flappy Bird game using HTML5, CSS3, and JavaScript.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

**A challenging bird game with achievements, medals, and dynamic difficulty!**

[Play](#how-to-play) • [Features](#features) • [Controls](#controls) • [Medals & Achievements](#medals)

</div>

## 🌙 Dark Mode Support

This game automatically adapts to your system's dark mode preference for a comfortable gaming experience in any lighting condition!

## Features

- 🎮 Simple and intuitive core gameplay with responsive controls
- 📈 Dynamic difficulty that ramps up every 5 points
- ⏸️ Pause and resume support (`P`, `Esc`, or Pause button)
- 🏆 Achievement unlock system with beautiful toast notifications
- 🥇 Medal rewards system (`Bronze`, `Silver`, `Gold`, `Platinum`)
- ✨ Particle effects, score animations, and collision impact feedback
- 💾 Persistent progress via `localStorage`:
  - Best score
  - Total runs
  - Total flaps
  - Unlocked medals
  - Unlocked achievements
- 📱 Responsive layout and touch-friendly controls
- 🌓 **Dark mode support** matching your system preferences
- ⌨️ Multiple control methods (Space, Mouse, Touch)

---

## 🎮 How to Play

1. Click the **"Start Game"** button to begin
2. Press **SPACEBAR** or **tap/click** to make the bird flap and avoid pipes
3. Navigate through the gaps in the pipes to earn points
4. Difficulty increases every 5 points:
   - Pipes move faster
   - Gaps between pipes narrow
5. The game ends when the bird collides with a pipe or the ground
6. Earn medals and unlock achievements based on your performance
7. Click **"Play Again"** to restart after game over

---

## ⌨️ Controls

### Desktop
- **Spacebar** - Flap the bird
- **Mouse Click** - Flap the bird
- **P** or **Esc** - Pause/Resume

### Mobile & Tablet
- **Tap Screen** - Flap the bird
- **Pause Button** - Pause/Resume

---

## Progression Rules

The game becomes progressively harder:
- **Every 5 points:**
  - Pipe speed increases slightly
  - Pipe gap decreases slightly
  
- **Difficulty Tiers:**
  - 🟢 Easy (0-4 points)
  - 🟡 Medium (5-9 points)
  - 🔴 Hard (10+ points)

## 🏅 Medals & Achievements

### 🥇 Medal System

Unlock beautiful medals based on your score:

| Medal | Score Requirement |
|-------|-------------------|
| 🥇 Platinum | Score ≥ 50 |
| 🥇 Gold | Score ≥ 35 |
| 🥈 Silver | Score ≥ 20 |
| 🥉 Bronze | Score ≥ 10 |

### 🎖️ Achievements

Unlock achievements as you progress:

| Achievement | Requirement |
|-------------|-------------|
| ✈️ First Flight | Play 1 game |
| 🔥 Getting Warm | Score ≥ 10 |
| 🌟 Sky Master | Score ≥ 25 |
| 💪 Persistent | Play 10 games |

---

## 📁 Project Files

- `index.html` - Game structure and UI with dark mode meta tags
- `flappybird.css` - Styling with dark mode support
- `flappybird.js` - Game logic, mechanics, and achievements
- `README.md` - This file

---

## 💡 Tips for Success

1. **Timing is Key** - Flap at the right moment to smooth your flight
2. **Stay Centered** - Try to keep the bird in the middle of pipes
3. **Anticipate Gaps** - Look ahead to plan your moves
4. **Control Momentum** - Don't flap too much or too little
5. **Practice** - The Persistent achievement rewards dedication!
