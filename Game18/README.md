# 🃏 UNO Card Game

A fully playable browser-based UNO card game built with vanilla HTML, CSS, and JavaScript. Play against 1–3 AI opponents with classic UNO rules.

## 🎮 Game Features

### Core Gameplay
- **1–3 AI Opponents** with adjustable player count
- **Full UNO Deck** — 108 cards including number cards, action cards, and wilds
- **Classic Rules** — Skip, Reverse, Draw Two, Wild, and Wild Draw Four
- **UNO Call Mechanic** — Call UNO when you have 1 card or face a penalty!
- **Smart Bot AI** — Bots use strategy to pick the best card to play

### Card Types
| Card | Count | Effect |
|------|-------|--------|
| 0–9 (4 colors) | 76 | Match by color or number |
| Skip ⊘ | 8 | Next player loses their turn |
| Reverse ⇄ | 8 | Reverses play direction |
| Draw Two +2 | 8 | Next player draws 2 and is skipped |
| Wild 🌈 | 4 | Choose the next color |
| Wild Draw Four +4 | 4 | Next player draws 4; choose color |

### Game Mechanics
- **Color Matching** — Play a card matching the current color, number, or symbol
- **Draw Pile** — Click to draw when you have no playable cards
- **Auto-Reshuffle** — Discard pile reshuffles into draw pile when empty
- **Penalty System** — Forget to call UNO? Draw 2 penalty cards!
- **Score Tracking** — End-game scoring based on remaining cards

## 🕹️ How to Play

1. **Start** — Select number of opponents and click Play
2. **Your Turn** — Click a highlighted card to play it, or click the draw pile
3. **Wild Cards** — Choose a color when playing Wild or Wild +4
4. **UNO!** — When you have 1 card left, click the UNO button before your next turn
5. **Win** — First player to empty their hand wins!

## 🖥️ Controls

| Action | How |
|--------|-----|
| Play a card | Click a highlighted card in your hand |
| Draw a card | Click the draw pile (UNO card back) |
| Call UNO | Click the red UNO button (appears with 1 card) |
| Choose color | Click a color in the picker (after playing Wild) |

## 🚀 Getting Started

1. Open `index.html` in any modern browser
2. Select the number of opponents (1–3)
3. Click **Play Game** and enjoy!

No build tools, dependencies, or server required.

## 🛠️ Tech Stack

- **HTML5** — Semantic markup and modals
- **CSS3** — Gradients, animations, responsive grid layout
- **Vanilla JavaScript** — Game engine, AI logic, DOM rendering

## 📱 Responsive Design

Fully playable on desktop, tablet, and mobile devices with adaptive card sizing and layout.

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
