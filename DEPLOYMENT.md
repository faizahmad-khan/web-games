# 🚀 Deployment Guide — Web Games Collection

This guide explains how all the games in this repository are deployed on **[Render](https://render.com)** and how you can deploy your own copy.

---

## 📋 Deployed Games

| # | Game | Folder | Live URL |
|---|------|--------|----------|
| 🎮 | **Web Games Collection** (Hub) | `Web_Games_Collection/` | [web-games-collection.onrender.com](https://web-games-collection.onrender.com) |
| 1 | Number Guessing Game | `Game1/` | _Python CLI — not deployed_ |
| 2 | Ludo Game | `Game2/` | [web-games-zpyo.onrender.com](https://web-games-zpyo.onrender.com) |
| 3 | Snake & Ladder | `Game3/` | [snake-ladder-wxc8.onrender.com](https://snake-ladder-wxc8.onrender.com) |
| 4 | Worm Game | `Game4/` | [worm-game-ie4k.onrender.com](https://worm-game-ie4k.onrender.com) |
| 5 | Flappy Bird | `Game5/` | [web-games-3r9f.onrender.com](https://web-games-3r9f.onrender.com) |
| 6 | Rock Paper Scissors | `Game6/` | [rock-paper-scissor-ig3c.onrender.com](https://rock-paper-scissor-ig3c.onrender.com) |
| 7 | Image Playground | `Game7/` | _Not yet deployed_ |
| 8 | Tetris | `Game8/` | [web-games-m9l1.onrender.com](https://web-games-m9l1.onrender.com) |
| 9 | Pac-Man | `Game9/` | [pacman-l3jl.onrender.com](https://pacman-l3jl.onrender.com) |
| 10 | Memory Card Game | `Game10/` | [memory-card-game-xnji.onrender.com](https://memory-card-game-xnji.onrender.com) |
| 11 | Tic Tac Toe | `Game11/` | [tic-tac-toe-7vic.onrender.com](https://tic-tac-toe-7vic.onrender.com) |
| 12 | Maze Game | `Game12/` | [maze-game-j1a0.onrender.com](https://maze-game-j1a0.onrender.com) |
| 13 | Hangman | `Game13/` | [hangman-game-1dbk.onrender.com](https://hangman-game-1dbk.onrender.com) |
| 14 | Space Invaders | `Game14/` | [space-invaders-r7vl.onrender.com](https://space-invaders-r7vl.onrender.com) |
| 15 | Brick Breaker | `Game15/` | _Not yet deployed_ |
| 16 | Whack-a-Mole | `Game16/` | _Not yet deployed_ |
| 17 | Castle Defenders | `Game17/` | _Not yet deployed_ |
| 18 | UNO Card Game | `Game18/` | _Not yet deployed_ |

---

## 🛠️ How to Deploy a Game on Render

Each browser game (HTML/CSS/JS) is deployed as a **Static Site** on Render. Follow these steps to deploy any game yourself.

### Prerequisites

- A free [Render](https://render.com) account
- This repository pushed to a GitHub (or GitLab) account

### Step-by-Step Deployment

#### 1. Create a New Static Site

1. Log in to your Render dashboard at [dashboard.render.com](https://dashboard.render.com).
2. Click **New** → **Static Site**.

#### 2. Connect Your Repository

1. Select **Build and deploy from a Git repository** → **Next**.
2. Connect your GitHub/GitLab account if you haven't already.
3. Find and select the **web-games** repository.

#### 3. Configure Build Settings

Fill in the following settings:

| Setting | Value | Example |
|---------|-------|---------|
| **Name** | A unique name for the service | `worm-game` |
| **Branch** | `main` | `main` |
| **Root Directory** | The folder of the game you want to deploy | `Game4` |
| **Build Command** | Leave **empty** (no build step needed) | _(blank)_ |
| **Publish Directory** | `.` (current directory) | `.` |

> **Key point:** Set the **Root Directory** to the specific game folder (e.g., `Game4`, `Game10`, `Web_Games_Collection`). Set the **Publish Directory** to `.` since the `index.html` is at the root of each game folder.

#### 4. Deploy

1. Click **Create Static Site**.
2. Render will automatically pull the code and deploy it.
3. Once the deploy completes, you'll get a live URL like `https://your-game-name.onrender.com`.

---

## 🔄 Automatic Deployments

Once connected, Render will **automatically redeploy** your site every time you push changes to the `main` branch. No manual action needed.

---

## 📂 Deploying the Game Collection Hub

The hub page (`Web_Games_Collection/index.html`) that links to all games is deployed the same way:

| Setting | Value |
|---------|-------|
| **Name** | `web-games-collection` |
| **Root Directory** | `Web_Games_Collection` |
| **Build Command** | _(blank)_ |
| **Publish Directory** | `.` |

---

## 📝 Notes

- **Free tier:** Render's free static site tier is sufficient for all these games. Static sites on Render are free with unlimited bandwidth.
- **Spin-down:** Free tier static sites do **not** spin down (unlike web services), so games are always available.
- **Custom domains:** You can optionally add a custom domain from the Render dashboard under your site's **Settings** → **Custom Domains**.
- **Game1 (Python CLI):** This is a command-line Python game and cannot be deployed as a static site. Run it locally with `python Game1/main.py`.
- **No server required:** All browser games are static HTML/CSS/JS with no backend, making Render's Static Site the ideal deployment type.

---

## 🤝 Contributing a New Game

If you add a new game to the repository:

1. Create a new folder (e.g., `Game19/`) with an `index.html` at its root.
2. Deploy it on Render following the steps above.
3. Add the game's live URL to the collection hub in `Web_Games_Collection/index.html`.
4. Update the table in this file with the new game's details.

---

## 📬 Questions?

Open an [issue](https://github.com/faizahmad-khan/web-games/issues) if you run into any problems with deployment.
