# Hangman Game

## Description
A classic Hangman word guessing game built with HTML, CSS, and JavaScript. The player needs to guess a hidden word by selecting letters. Each incorrect guess adds a part to the hangman drawing, and the game ends when either the word is guessed correctly or the hangman is completed.

## Features
- Randomly selected words from a predefined word bank
- Visual hangman drawing that updates with each incorrect guess
- On-screen keyboard with clickable letters
- Display of correctly and incorrectly guessed letters
- Win/lose detection and messaging
- Restart functionality

## How to Play
1. The game selects a random word and displays empty spaces for each letter
2. Click on letters from the on-screen keyboard to guess
3. Correct letters will appear in their correct positions
4. Incorrect letters will be displayed separately and add to the hangman
5. Complete the word before the hangman is drawn to win the game
6. If the hangman is completed, the game ends and the correct word is revealed

## Controls
- Click on letter buttons to make a guess
- Click "Restart Game" to start a new round with a different word

## Technologies Used
- HTML5 for structure
- CSS3 for styling and animations
- JavaScript for game logic
- Canvas API for drawing the hangman

## Files
- `index.html`: Main HTML structure
- `style.css`: Styling and responsive design
- `script.js`: Game logic and interactions
- `README.md`: Project documentation

## Customization
The game includes a word bank in the JavaScript file that can be easily expanded with additional words. Simply add more words to the `wordBank` array in `script.js`.