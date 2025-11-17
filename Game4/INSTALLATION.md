# 🚀 Installation & Setup Guide

## Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge, or Opera)
- No installation required! It's pure HTML5/CSS3/JavaScript

## Quick Start (30 seconds)

### Option 1: Direct File Opening (Easiest)

**Windows:**
1. Navigate to the `Game4.py` folder
2. Double-click `worm.html`
3. Game opens in your default browser - Play! 🎮

**Mac:**
1. Navigate to the `Game4.py` folder
2. Right-click `worm.html`
3. Select "Open With" → Choose your browser
4. Game starts immediately

**Linux:**
```bash
# Using xdg-open (default browser)
xdg-open /path/to/worm.html

# Or with specific browser
firefox /path/to/worm.html
google-chrome /path/to/worm.html
chromium /path/to/worm.html
```

### Option 2: Using Git (For Developers)

```bash
# Clone the repository
git clone https://github.com/faizahmad-khan/web-games.git
cd web-games/Game4.py

# Open in browser
open worm.html          # Mac
xdg-open worm.html      # Linux
start worm.html         # Windows (PowerShell)
```

### Option 3: Local Development Server

**Using Python 3:**
```bash
cd /path/to/Game4.py
python -m http.server 8000
# Then open: http://localhost:8000/worm.html
```

**Using Python 2:**
```bash
cd /path/to/Game4.py
python -m SimpleHTTPServer 8000
# Then open: http://localhost:8000/worm.html
```

**Using Node.js (npm):**
```bash
cd /path/to/Game4.py
npx http-server
# Then open: http://127.0.0.1:8080/worm.html
```

**Using PHP:**
```bash
cd /path/to/Game4.py
php -S localhost:8000
# Then open: http://localhost:8000/worm.html
```

**Using Live Server (VS Code Extension):**
1. Install "Live Server" extension in VS Code
2. Right-click on `worm.html`
3. Click "Open with Live Server"
4. Browser opens automatically

## File Structure

```
Game4.py/
├── 📄 worm.html           # Main game HTML (2.2 KB)
├── 🎨 worm.css            # Styling & animations (4.5 KB)
├── 🔧 worm.js             # Game logic (17.6 KB)
├── 📖 README.md           # Main documentation
├── 📚 FEATURES.md         # Features guide
└── 🚀 INSTALLATION.md     # This file
```

## System Requirements

### Minimum
- Browser: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- RAM: 100 MB
- Storage: 30 KB (for local files)
- Network: None required

### Recommended
- Browser: Latest version (Chrome 120+, Firefox 121+, Safari 17+)
- RAM: 500 MB
- Screen: 1024×768 or higher (for optimal experience)
- Network: None required

## Browser Compatibility

| Browser | Support | Version | Test Status |
|---------|---------|---------|-------------|
| Chrome | ✅ Full | 90+ | ✅ Tested |
| Firefox | ✅ Full | 88+ | ✅ Tested |
| Safari | ✅ Full | 14+ | ✅ Tested |
| Edge | ✅ Full | 90+ | ✅ Tested |
| Opera | ✅ Full | 76+ | ✅ Tested |
| IE 11 | ❌ No | - | Canvas API required |

## Mobile Installation

### iOS (iPhone/iPad)
1. Download the file or access via GitHub Pages
2. Tap "Share" → "Add to Home Screen"
3. Name it and tap "Add"
4. App appears on home screen
5. Tap to play!

### Android
1. Download `worm.html` or access via GitHub Pages
2. Open with any browser
3. Tap menu → "Add to Home Screen"
4. Choose a name
5. App shortcut created on home screen

## Troubleshooting

### Game Won't Load

**Problem**: Blank screen or "Cannot find file"
**Solutions**:
- Ensure file path is correct
- Try a different browser
- Check browser console (F12 → Console tab)
- Disable browser extensions
- Clear browser cache

### Game Runs Slowly

**Problem**: Low FPS or stuttering
**Solutions**:
- Close other browser tabs
- Disable browser extensions
- Update your browser
- Lower screen resolution
- Use a more powerful device
- Try a different browser (Chrome typically fastest)

### Controls Not Working

**Problem**: Keyboard input not responding
**Solutions**:
- Click on the game canvas to focus it
- Check if Caps Lock or Num Lock interferes
- Disable keyboard shortcuts in browser
- Try different keys (arrows vs WASD)
- Restart browser

### Audio Issues (Future Feature)

**Problem**: No sound effects
**Solutions**:
- Ensure browser audio permission granted
- Check system volume
- Verify sound settings in browser
- Disable other audio sources
- Try different browser

## Performance Optimization

### For Faster Loading
```bash
# Minify CSS and JS (optional)
# Using terser (npm install terser)
terser worm.js -o worm.min.js
```

### Browser Optimization
1. Disable browser extensions
2. Close unnecessary tabs
3. Update browser to latest version
4. Clear browser cache
5. Use hardware acceleration (Chrome settings)

## Development Setup

### For Developers/Contributors

**Requirements**:
- Git
- Code editor (VS Code, Sublime, etc.)
- Browser developer tools (F12)
- Node.js (optional, for local server)

**Setup Steps**:
```bash
# Clone repository
git clone https://github.com/faizahmad-khan/web-games.git
cd web-games/Game4.py

# Open in editor
code .              # VS Code
sublime .           # Sublime Text

# Start local server
python -m http.server 8000

# Open in browser
open http://localhost:8000/worm.html
```

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: Add new feature"

# Push to GitHub
git push origin feature/new-feature

# Create Pull Request on GitHub
```

## Deployment Options

### 1. GitHub Pages (Free)
```bash
# Push to gh-pages branch
git push origin main:gh-pages

# Access at: https://faizahmad-khan.github.io/web-games/Game4.py/worm.html
```

### 2. Netlify (Free)
- Connect GitHub repository
- Set build command: (none needed)
- Set publish directory: ./Game4.py
- Deploy!

### 3. Vercel (Free)
- Connect GitHub repository
- Auto-deploying on push
- Access via Vercel URL

### 4. Self-Hosted
- Upload files via FTP/SFTP
- Place in web server directory
- Access via domain

## Uninstallation

### From Desktop
- Simply delete the folder
- Or move to trash/recycle bin

### From Mobile (Home Screen Shortcut)
- Long-press the app
- Select "Remove from Home Screen"
- App remains in browser history if saved

### Complete Removal
```bash
# If cloned from Git
rm -rf web-games
```

## Getting Help

### Documentation
- 📖 [README.md](README.md) - Main guide
- 📚 [FEATURES.md](FEATURES.md) - Feature details
- 🚀 [INSTALLATION.md](INSTALLATION.md) - This file

### Resources
- 🔗 GitHub Issues: Report bugs
- 💬 GitHub Discussions: Ask questions
- 📧 Email: faizahmad.khan@example.com

---

**Ready to play? Enjoy! 🎮**
