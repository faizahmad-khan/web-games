# Hangman Game

## Description
A feature-packed Hangman word guessing game built with HTML, CSS, and JavaScript. Choose a difficulty and category, then race against the clock to guess the hidden word before the hangman is completed. Includes sound effects, confetti celebrations, streak tracking, and full keyboard support.

## Features
- **Difficulty levels** — Easy (short words, no timer), Medium (all words, 90s timer), Hard (long words, 45s countdown)
- **Word categories** — Filter by Tech, Lifestyle, Gaming, or All
- **Countdown timer** — Timed challenge on Medium and Hard difficulties
- **Score & streak tracking** — Level counter and win streak persisted to localStorage
- **Lives display** — Real-time remaining guesses shown in the stats bar
- **Colored hangman** — Each body part drawn in a different color with facial expressions
- **Confetti celebration** — Particle effect on every win
- **Sound effects** — Web Audio API tones for correct/wrong guesses, win, and lose
- **Physical keyboard support** — Type letters to guess, press Enter to restart
- **Correct/wrong button styling** — Green highlight for correct, red for wrong
- **50 words** with detailed hints across three categories
- **Next Level** button to continue your streak after winning
- Modern dark glassmorphism UI with gradient accents
- Fully responsive design for mobile and desktop

## How to Play
1. Choose a **Difficulty** and **Category** from the dropdowns
2. The game picks a random matching word and shows blank spaces
3. Click on-screen letter buttons or type on your keyboard to guess
4. Correct letters appear in their positions (button turns green)
5. Wrong letters add a colored body part to the hangman (button turns red)
6. On Medium/Hard, a countdown timer adds extra pressure
7. Guess the full word to win and advance to the next level
8. If the hangman is completed or time runs out, the word is revealed
9. Click **Next Level** to continue your streak, or **Restart Game** to start fresh

## Controls

| Input | Action |
|-------|--------|
| Click letter button | Guess that letter |
| Type A–Z on keyboard | Guess that letter |
| Enter | Restart the game |
| Difficulty dropdown | Switch Easy / Medium / Hard |
| Category dropdown | Filter words by Tech / Lifestyle / Gaming / All |

## Technologies Used
- HTML5 for structure
- CSS3 for dark theme styling, animations, and responsive layout
- JavaScript ES6 for game logic and state management
- Canvas API for colored hangman drawing with facial details
- Web Audio API for sound effects
- localStorage for persisting score and streak

## Files
- `index.html` — Game structure and layout
- `style.css` — Dark theme styling, animations, and responsive breakpoints
- `script.js` — Game logic, timer, audio, confetti, and keyboard handling
- `README.md` — Project documentation

## Customization
The word bank is defined in `script.js` as an array of objects with `word` and `cat` (category) properties. To add new words:
1. Add an entry to the `wordBank` array: `{ word: 'YOURWORD', cat: 'tech' }`
2. Add a matching hint in the `wordHints` object
3. Words are automatically filtered by difficulty (length) and category