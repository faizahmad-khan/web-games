# Flappy Bird Plus

An upgraded and visually polished implementation of the classic Flappy Bird game using HTML, CSS, and JavaScript.

## Play Now

🎮 **[Play Online](https://web-games-3r9f.onrender.com)** |

<div align="center">
  <iframe src="./index.html" width="450" height="700" frameborder="0" style="border: 2px solid #333; border-radius: 8px;"></iframe>
</div>

## Features

- Simple and intuitive core gameplay
- Dynamic difficulty that ramps every 5 points
- Pause and resume support (`P`, `Esc`, or Pause button)
- Achievement unlock system with toast notifications
- Medal rewards (`Bronze`, `Silver`, `Gold`, `Platinum`)
- Particle effects, score pop animation, and collision impact feedback
- Persistent progress via `localStorage`:
  - Best score
  - Total runs
  - Total flaps
  - Unlocked medals
  - Unlocked achievements
- Responsive layout and touch-friendly controls

## How to Play

1. Click the "Start Game" button to begin
2. Press SPACEBAR or tap/click to make the bird flap and avoid pipes
3. Navigate through the gaps in the pipes to earn points
4. Difficulty increases every 5 points as pipes move faster and gaps narrow
5. The game ends when the bird collides with a pipe or the ground
6. Earn medals and unlock achievements based on your performance
7. Click "Play Again" to restart after game over

## Files

- `index.html` - Main HTML structure
- `flappybird.css` - Styling and layout
- `flappybird.js` - Game logic and mechanics

## Controls

- **Desktop**:
  - `Space` to flap
  - `P` or `Esc` to pause/resume
  - Mouse click to flap
- **Mobile**:
  - Tap to flap
  - Pause button for pause/resume

## Progression Rules

- Every 5 points:
  - Pipe speed increases slightly
  - Pipe gap decreases slightly
- Difficulty tiers shown in HUD:
  - Easy
  - Medium
  - Hard

## Medals

- Bronze: score `>= 10`
- Silver: score `>= 20`
- Gold: score `>= 35`
- Platinum: score `>= 50`

## Achievements

- First Flight: play 1 game
- Getting Warm: score 10
- Sky Master: score 25
- Persistent: play 10 games

## Requirements

- Modern web browser with JavaScript support
- Canvas element support

## Customization

The game can be easily customized by modifying:
- Colors in the CSS file
- Game parameters (gravity, speed, pipe gaps) in the JavaScript file
- Visual elements and styling
