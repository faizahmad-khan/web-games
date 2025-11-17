# 🤝 Contributing Guide

Thank you for your interest in contributing to the Worm Game project! This guide will help you get started.

## Code of Conduct

Be respectful, inclusive, and professional. We welcome all skill levels!

## How to Contribute

### 1. Report Bugs 🐛

Found a bug? Help us fix it!

**How to Report:**
1. Go to [GitHub Issues](https://github.com/faizahmad-khan/web-games/issues)
2. Click "New Issue"
3. Select "Bug Report" template
4. Provide:
   - Browser and version
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots (if helpful)

**Example:**
```
Title: Worm doesn't move after pause

Description:
After pressing P to pause, when resuming the game (P again), 
the worm doesn't move until I press a direction key.

Steps:
1. Start game
2. Move worm a few squares
3. Press P to pause
4. Press P to resume
5. Observe: Worm is frozen

Expected: Worm should continue from where it paused
Actual: Worm is frozen, needs direction key to move

Browser: Chrome 120 on macOS 14
```

### 2. Suggest Features 💡

Have an idea? We'd love to hear it!

**How to Suggest:**
1. Go to [GitHub Issues](https://github.com/faizahmad-khan/web-games/issues)
2. Click "New Issue"
3. Select "Feature Request" template
4. Provide:
   - Clear feature title
   - Detailed description
   - Why it would be useful
   - Potential implementation ideas

**Example:**
```
Title: Add sound effects for food collection

Description:
Currently the game is silent. Adding satisfying sound effects 
would enhance player experience.

Implementation Ideas:
- Use Web Audio API or simple sound files
- Option to toggle sound on/off in settings
- Different sounds for regular food vs bonus food

Why Useful:
- Better user engagement
- More satisfying feedback
- Increased replay value
```

### 3. Improve Documentation 📚

Good docs help everyone!

**How to Contribute:**
1. Fork the repository
2. Create branch: `git checkout -b docs/improve-readme`
3. Edit documentation files
4. Test for clarity and accuracy
5. Submit Pull Request

**Documentation Files:**
- `README.md` - Main guide
- `FEATURES.md` - Feature details
- `INSTALLATION.md` - Setup guide
- `STRATEGIES.md` - Tips and tricks

### 4. Submit Code Changes 🔧

Want to add features or fix bugs? Follow this process:

#### Setup Development Environment

```bash
# Fork repository on GitHub
# Clone your fork
git clone https://github.com/YOUR-USERNAME/web-games.git
cd web-games/Game4.py

# Create feature branch
git checkout -b feature/your-feature-name

# OR for bug fixes
git checkout -b bugfix/issue-description
```

#### Make Your Changes

1. **For Bug Fixes:**
   - Identify the issue in the code
   - Make minimal changes
   - Test thoroughly
   - Document fix in commit message

2. **For Features:**
   - Plan implementation first
   - Write clean, documented code
   - Follow existing code style
   - Add comments for complex logic
   - Test thoroughly

#### Code Style Guidelines

```javascript
// ✅ DO: Clear, descriptive names
function calculateBonusScore(level, multiplier) {
    return 50 * level * multiplier;
}

// ✅ DO: Add comments for complex logic
// Time-slow duration decreases with level difficulty
const timeSlowDuration = 5000 - (this.level * 100);

// ❌ DON'T: Vague names
function calc(x, y) {
    return x * y;
}

// ❌ DON'T: No documentation
const tsd = 5000 - (l * 100);
```

#### CSS Guidelines

```css
/* ✅ DO: Organized, meaningful class names */
.game-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.bonus-food {
    background: #FFD700;
    animation: pulse 0.5s infinite;
}

/* ❌ DON'T: Generic names */
.box { }
.item { }
```

#### Testing Your Changes

```bash
# 1. Open in multiple browsers
- Chrome
- Firefox
- Safari
- Edge

# 2. Test on mobile
- Use browser DevTools responsive mode
- Test on actual mobile device if possible

# 3. Performance testing
- Check frame rate (should be 60+ FPS)
- Monitor memory usage
- Test on low-end devices if possible
```

#### Commit Your Changes

```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: Add sound effects for food collection

- Implement Web Audio API for sound playback
- Add toggle in settings menu
- Different sounds for regular vs bonus food
- Maintains audio volume preference in localStorage

Fixes #42"
```

**Commit Message Format:**
```
[type]: [subject]

[body - optional]

[footer - optional]
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation change
- `style:` - Code formatting
- `refactor:` - Code reorganization
- `perf:` - Performance improvement
- `test:` - Add/modify tests
- `chore:` - Maintenance

#### Push and Create Pull Request

```bash
# Push your branch
git push origin feature/your-feature-name

# Go to GitHub and create Pull Request
# Provide:
# - Description of changes
# - Why this change is needed
# - How to test the changes
# - Related issue numbers
```

### 5. Review Process

Every contribution goes through review:

1. **Automated Checks:**
   - Code style validation
   - No syntax errors
   - Cross-browser compatibility check

2. **Manual Review:**
   - Code quality and maintainability
   - Documentation completeness
   - Functionality testing
   - Performance impact

3. **Feedback:**
   - Suggestions for improvement
   - Questions about implementation
   - Requests for additional testing

4. **Approval & Merge:**
   - Two approvals required
   - All feedback addressed
   - Ready for production

## Areas for Contribution

### High Priority 🔥
- [ ] Bug fixes (review open issues)
- [ ] Performance improvements
- [ ] Mobile responsiveness fixes
- [ ] Documentation improvements
- [ ] Browser compatibility fixes

### Medium Priority 📌
- [ ] New game modes
- [ ] Additional power-ups
- [ ] Visual enhancements
- [ ] Sound effects implementation
- [ ] Leaderboard system

### Nice to Have 💫
- [ ] Themes and skins
- [ ] Difficulty settings
- [ ] Statistics tracking
- [ ] Achievement system
- [ ] Multiplayer mode

## Development Tips

### Useful Tools
- **VS Code**: Great code editor with extensions
- **Live Server**: Local development server
- **Browser DevTools**: F12 for debugging
- **Git Bash**: Command line for Git

### Debugging
```javascript
// Add console logs for debugging
console.log('Current level:', this.level);
console.log('Worm position:', this.worm[0]);

// Use debugger in browser
debugger; // Execution pauses here

// Check game state
console.table(this.worm); // Pretty print array
```

### Performance Profiling
```bash
# Chrome DevTools
1. Open DevTools (F12)
2. Go to Performance tab
3. Start recording
4. Play game
5. Stop recording
6. Analyze results
```

## Community

### Getting Help
- 💬 GitHub Discussions: Ask questions
- 📧 Email: faizahmad.khan@example.com
- 🤝 Discussions tab: Community support

### Sharing Your Work
- Show off your improvements!
- Tag `@faizahmad-khan` in comments
- Share screenshots/GIFs of changes
- Celebrate with the community

## Legal

By contributing, you agree that:
- Your contribution is your original work
- You grant rights to include in project
- License remains MIT
- Respect all licenses used

## Recognition

Contributors will be listed in:
- `CONTRIBUTORS.md` file
- GitHub Contributors page
- Release notes

## Questions?

Have questions about contributing?
- 📖 Check documentation
- 💬 Open GitHub Discussion
- 📧 Email: faizahmad.khan@example.com

---

**Thank you for contributing to make Worm Game even better! 🙏**
