# Memory Card Game

A polished memory matching game built with HTML5, CSS3, and vanilla JavaScript. Flip cards, find pairs, beat the clock, and set new personal bests!

## 🎮 Features

- **3 difficulty levels** — Easy (4×3, 6 pairs), Medium (4×4, 8 pairs), Hard (5×4, 10 pairs)
- **3D card-flip animation** — smooth CSS perspective transforms
- **Match pop effect** — cards pulse when a pair is found
- **Timer** — starts on first flip, stops on win
- **Best score tracking** — moves & time saved per difficulty in localStorage
- **Win overlay** — animated results screen with new-best indicator
- **Move & match counters** — real-time stats during play
- **Dark neon theme** — purple gradient background with glow accents
- **Responsive design** — works on desktop and mobile

## 🕹️ How to Play

1. Choose a difficulty (Easy / Medium / Hard)
2. Click a card to flip it and reveal its emoji
3. Click a second card — if symbols match, both stay face-up
4. If they don't match, both flip back after a brief delay
5. Find all pairs to win
6. Try to finish with the fewest moves and fastest time!

## 📊 Game Elements

| Element | Description |
|---------|-------------|
| Moves | Number of two-card flip attempts |
| Matches | Pairs found so far / total pairs |
| Timer | Elapsed time since first flip |
| Best | Best moves / time for current difficulty |

## 🏗️ Implementation

- **CSS Grid** layout that adapts columns per difficulty
- **Fisher-Yates shuffle** for fair card randomisation
- **Board lock** prevents extra flips during mismatch delay
- **localStorage** persistence for per-difficulty best scores
- **No external dependencies** — pure HTML, CSS & JS

## 📁 Files

- `index.html` — Game page with difficulty selector, stats bar & win overlay
- `style.css` — Dark theme, card animations, responsive grid
- `script.js` — Game logic, timer, scoring & difficulty management