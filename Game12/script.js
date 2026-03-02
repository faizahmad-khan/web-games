/* ============================================================
   Maze Game — Enhanced Edition
   Features: difficulty levels, timer, best scores, hint system,
   fog of war, collectible stars, trail, minimap, confetti,
   mobile D-pad, smooth animation, sound FX, scoring.
   ============================================================ */

// ─── Configuration per difficulty ──────────────────────
const DIFFICULTY = {
    easy:   { cols: 11, rows: 9,  stars: 3, fogRadius: 0, hintDuration: 3000 },
    medium: { cols: 17, rows: 13, stars: 5, fogRadius: 3, hintDuration: 2000 },
    hard:   { cols: 25, rows: 17, stars: 8, fogRadius: 2, hintDuration: 1200 },
};

const CELL_SIZE       = 28;
const MINIMAP_SCALE   = 4;
const PLAYER_RADIUS   = CELL_SIZE * 0.34;
const ANIM_SPEED      = 0.18;          // lerp factor for smooth movement
const FPS             = 60;

// ─── Colours ───────────────────────────────────────────
const COL = {
    wall:        '#1b1b3a',
    wallStroke:  '#2d2d5e',
    path:        '#16162b',
    pathStroke:  'rgba(255,255,255,0.02)',
    player:      '#00c6ff',
    playerGlow:  'rgba(0,198,255,0.35)',
    start:       '#ffd200',
    end:         '#00e676',
    endGlow:     'rgba(0,230,118,0.45)',
    star:        '#ffe066',
    starGlow:    'rgba(255,224,102,0.5)',
    trail:       'rgba(123,47,247,0.25)',
    hint:        'rgba(255,210,0,0.35)',
    fog:         '#0b0b1e',
};

// ─── DOM refs ──────────────────────────────────────────
const canvas          = document.getElementById('maze-canvas');
const ctx             = canvas.getContext('2d');
const minimapCanvas   = document.getElementById('minimap-canvas');
const mctx            = minimapCanvas.getContext('2d');
const confettiCanvas  = document.getElementById('confetti-canvas');
const cctx            = confettiCanvas.getContext('2d');

const moveCountEl     = document.getElementById('move-count');
const timerEl         = document.getElementById('timer');
const starCountEl     = document.getElementById('star-count');
const starTotalEl     = document.getElementById('star-total');
const scoreEl         = document.getElementById('score');
const hintCountEl     = document.getElementById('hint-count');

const difficultyEl    = document.getElementById('difficulty');
const fogToggle       = document.getElementById('fog-toggle');
const trailToggle     = document.getElementById('trail-toggle');
const hintBtn         = document.getElementById('hint-btn');
const resetBtn        = document.getElementById('reset-btn');

const victoryModal    = document.getElementById('victory-modal');
const modalMoves      = document.getElementById('modal-moves');
const modalTime       = document.getElementById('modal-time');
const modalStars      = document.getElementById('modal-stars');
const modalScore      = document.getElementById('modal-score');
const modalBestRow    = document.getElementById('modal-best-row');
const modalBest       = document.getElementById('modal-best');
const modalNextBtn    = document.getElementById('modal-next-btn');

const bestEasyEl      = document.getElementById('best-easy');
const bestMediumEl    = document.getElementById('best-medium');
const bestHardEl      = document.getElementById('best-hard');

const dpad            = document.getElementById('dpad');

// ─── Game state ────────────────────────────────────────
let maze, cols, rows, cellSize;
let playerPos, destination;
let displayPos;                // smooth animated position
let moves, starsCollected, totalStars, hintsLeft;
let timerInterval, startTime, elapsedSeconds;
let trail;                     // Set of "x,y" strings
let starPositions;             // [{x,y}, ...]
let solutionPath;              // [{x,y}, ...] for hint
let showingHint = false;
let gameWon = false;

// ─── Audio (Web Audio API — no files needed) ──────────
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function ensureAudio() { if (!audioCtx) audioCtx = new AudioCtx(); }

function playTone(freq, dur, type = 'sine', vol = 0.12) {
    try {
        ensureAudio();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(vol, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + dur);
    } catch (_) { /* audio unsupported */ }
}

function sfxMove()  { playTone(300, 0.06, 'square', 0.06); }
function sfxStar()  { playTone(880, 0.15, 'sine', 0.15); setTimeout(() => playTone(1100, 0.15, 'sine', 0.13), 100); }
function sfxHint()  { playTone(520, 0.2, 'triangle', 0.1); }
function sfxWallBump() { playTone(100, 0.08, 'sawtooth', 0.04); }
function sfxWin()   {
    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playTone(f, 0.25, 'sine', 0.14), i * 120));
}

// ─── Maze generation (recursive backtracker) ──────────
function generateMaze(cols, rows) {
    const grid = Array.from({ length: rows }, () => new Uint8Array(cols).fill(1));

    function carve(x, y) {
        grid[y][x] = 0;
        const dirs = [[2,0],[0,2],[-2,0],[0,-2]];
        shuffle(dirs);
        for (const [dx, dy] of dirs) {
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && grid[ny][nx] === 1) {
                grid[y + dy / 2][x + dx / 2] = 0;
                carve(nx, ny);
            }
        }
    }

    carve(0, 0);
    grid[0][0] = 0;
    grid[rows - 1][cols - 1] = 0;
    // ensure exit neighbor open
    if (grid[rows - 2] && grid[rows - 2][cols - 1] === 1 && grid[rows - 1][cols - 2] === 1) {
        grid[rows - 2][cols - 1] = 0;
    }
    return grid;
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

// ─── BFS solver (for hint + validation) ───────────────
function solveMaze(grid, sx, sy, ex, ey) {
    const R = grid.length, C = grid[0].length;
    const visited = Array.from({ length: R }, () => new Uint8Array(C));
    const parent = Array.from({ length: R }, () => Array(C).fill(null));
    const queue = [[sx, sy]];
    visited[sy][sx] = 1;

    while (queue.length) {
        const [cx, cy] = queue.shift();
        if (cx === ex && cy === ey) {
            const path = [];
            let px = ex, py = ey;
            while (px !== null) {
                path.push({ x: px, y: py });
                const p = parent[py][px];
                if (!p) break;
                px = p[0]; py = p[1];
            }
            return path.reverse();
        }
        for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
            const nx = cx + dx, ny = cy + dy;
            if (nx >= 0 && nx < C && ny >= 0 && ny < R && !visited[ny][nx] && grid[ny][nx] === 0) {
                visited[ny][nx] = 1;
                parent[ny][nx] = [cx, cy];
                queue.push([nx, ny]);
            }
        }
    }
    return [];   // no path
}

// ─── Place stars on random path cells (NOT on solution) ─
function placeStars(grid, count, solutionPath) {
    // Build a set of solution-path coordinates to avoid them
    const solSet = new Set(solutionPath.map(p => `${p.x},${p.y}`));

    // Collect all open cells that are NOT on the solution path
    const candidates = [];
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            if (grid[y][x] === 0
                && !solSet.has(`${x},${y}`)
                && !(x === 0 && y === 0)
                && !(x === grid[0].length - 1 && y === grid.length - 1)) {
                candidates.push({ x, y });
            }
        }
    }

    shuffle(candidates);

    // If not enough off-path cells, fall back to any open cell
    if (candidates.length < count) {
        const fallback = [];
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[0].length; x++) {
                if (grid[y][x] === 0
                    && !(x === 0 && y === 0)
                    && !(x === grid[0].length - 1 && y === grid.length - 1)) {
                    fallback.push({ x, y });
                }
            }
        }
        shuffle(fallback);
        return fallback.slice(0, Math.min(count, fallback.length));
    }

    return candidates.slice(0, count);
}

// ─── Timer helpers ────────────────────────────────────
function startTimer() {
    clearInterval(timerInterval);
    startTime = Date.now();
    elapsedSeconds = 0;
    timerInterval = setInterval(() => {
        elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        timerEl.textContent = formatTime(elapsedSeconds);
    }, 250);
}

function stopTimer() { clearInterval(timerInterval); }

function formatTime(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
}

// ─── Score calculation ────────────────────────────────
function calculateScore() {
    const cfg = DIFFICULTY[difficultyEl.value];
    const diffMultiplier = difficultyEl.value === 'easy' ? 1 : difficultyEl.value === 'medium' ? 2 : 3;
    const baseScore = 1000 * diffMultiplier;
    const movePenalty = moves * 2;
    const timePenalty = elapsedSeconds * 1;
    const starBonus = starsCollected * 150 * diffMultiplier;
    const fogBonus = fogToggle.checked ? 500 * diffMultiplier : 0;
    return Math.max(0, baseScore - movePenalty - timePenalty + starBonus + fogBonus);
}

// ─── Best scores (localStorage) ───────────────────────
function loadBestScores() {
    ['easy', 'medium', 'hard'].forEach(d => {
        const val = localStorage.getItem(`maze_best_${d}`);
        document.getElementById(`best-${d}`).textContent = val ? val : '--';
    });
}

function saveBestScore(score) {
    const d = difficultyEl.value;
    const prev = parseInt(localStorage.getItem(`maze_best_${d}`)) || 0;
    if (score > prev) {
        localStorage.setItem(`maze_best_${d}`, score);
        loadBestScores();
        return true;  // new best
    }
    return false;
}

// ─── Drawing helpers ──────────────────────────────────
function drawRoundedRect(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
}

function drawStar5(c, cx, cy, outerR, innerR) {
    c.beginPath();
    for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const a = (Math.PI / 2) * -1 + (Math.PI / 5) * i;
        const method = i === 0 ? 'moveTo' : 'lineTo';
        c[method](cx + r * Math.cos(a), cy + r * Math.sin(a));
    }
    c.closePath();
}

// ─── Main draw ────────────────────────────────────────
function draw() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const fogOn = fogToggle.checked;
    const fogR = DIFFICULTY[difficultyEl.value].fogRadius || 3;
    const showTrail = trailToggle.checked;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const px = x * cellSize, py = y * cellSize;

            // Fog of war check
            if (fogOn) {
                const dist = Math.abs(x - playerPos.x) + Math.abs(y - playerPos.y);
                if (dist > fogR) {
                    ctx.fillStyle = COL.fog;
                    ctx.fillRect(px, py, cellSize, cellSize);
                    continue;
                }
            }

            if (maze[y][x] === 1) {
                // Wall
                drawRoundedRect(ctx, px + 1, py + 1, cellSize - 2, cellSize - 2, 3);
                ctx.fillStyle = COL.wall;
                ctx.fill();
                ctx.strokeStyle = COL.wallStroke;
                ctx.lineWidth = 1;
                ctx.stroke();
            } else {
                // Path
                ctx.fillStyle = COL.path;
                ctx.fillRect(px, py, cellSize, cellSize);
                ctx.strokeStyle = COL.pathStroke;
                ctx.lineWidth = 0.5;
                ctx.strokeRect(px, py, cellSize, cellSize);

                // Trail
                if (showTrail && trail.has(`${x},${y}`)) {
                    ctx.fillStyle = COL.trail;
                    ctx.beginPath();
                    ctx.arc(px + cellSize / 2, py + cellSize / 2, cellSize * 0.22, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
    }

    // Hint overlay
    if (showingHint && solutionPath.length) {
        ctx.save();
        for (const p of solutionPath) {
            if (fogOn) {
                const dist = Math.abs(p.x - playerPos.x) + Math.abs(p.y - playerPos.y);
                const fogR2 = DIFFICULTY[difficultyEl.value].fogRadius || 3;
                if (dist > fogR2 + 2) continue;
            }
            ctx.fillStyle = COL.hint;
            ctx.fillRect(p.x * cellSize + 4, p.y * cellSize + 4, cellSize - 8, cellSize - 8);
        }
        ctx.restore();
    }

    // Stars
    const now = Date.now();
    for (const s of starPositions) {
        if (s.collected) continue;
        if (fogOn) {
            const dist = Math.abs(s.x - playerPos.x) + Math.abs(s.y - playerPos.y);
            if (dist > fogR) continue;
        }
        const cx = s.x * cellSize + cellSize / 2;
        const cy = s.y * cellSize + cellSize / 2;
        const pulse = 1 + 0.12 * Math.sin(now / 300 + s.x + s.y);
        ctx.save();
        ctx.shadowColor = COL.starGlow;
        ctx.shadowBlur = 10;
        ctx.fillStyle = COL.star;
        drawStar5(ctx, cx, cy, cellSize * 0.3 * pulse, cellSize * 0.14 * pulse);
        ctx.fill();
        ctx.restore();
    }

    // Start cell highlight
    if (!(fogOn && Math.abs(playerPos.x) + Math.abs(playerPos.y) > fogR)) {
        ctx.fillStyle = COL.start;
        ctx.globalAlpha = 0.3;
        ctx.fillRect(0, 0, cellSize, cellSize);
        ctx.globalAlpha = 1;
    }

    // End cell glow
    const ex = (cols - 1) * cellSize, ey = (rows - 1) * cellSize;
    if (!(fogOn && Math.abs(cols - 1 - playerPos.x) + Math.abs(rows - 1 - playerPos.y) > fogR)) {
        const gPulse = 0.35 + 0.15 * Math.sin(now / 400);
        ctx.fillStyle = COL.end;
        ctx.globalAlpha = gPulse;
        ctx.fillRect(ex, ey, cellSize, cellSize);
        ctx.globalAlpha = 1;
        // flag icon
        ctx.fillStyle = '#fff';
        ctx.font = `${cellSize * 0.6}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🏁', ex + cellSize / 2, ey + cellSize / 2);
    }

    // Player (smooth interpolated)
    const dpx = displayPos.x * cellSize + cellSize / 2;
    const dpy = displayPos.y * cellSize + cellSize / 2;

    // Glow
    ctx.save();
    ctx.shadowColor = COL.playerGlow;
    ctx.shadowBlur = 14;
    ctx.fillStyle = COL.player;
    ctx.beginPath();
    ctx.arc(dpx, dpy, PLAYER_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Shine highlight
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath();
    ctx.arc(dpx - PLAYER_RADIUS * 0.3, dpy - PLAYER_RADIUS * 0.3, PLAYER_RADIUS * 0.28, 0, Math.PI * 2);
    ctx.fill();
}

// ─── Minimap draw ─────────────────────────────────────
function drawMinimap() {
    const mw = cols * MINIMAP_SCALE, mh = rows * MINIMAP_SCALE;
    minimapCanvas.width = mw;
    minimapCanvas.height = mh;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            mctx.fillStyle = maze[y][x] === 1 ? '#222244' : '#333366';
            mctx.fillRect(x * MINIMAP_SCALE, y * MINIMAP_SCALE, MINIMAP_SCALE, MINIMAP_SCALE);
        }
    }
    // Player
    mctx.fillStyle = COL.player;
    mctx.fillRect(playerPos.x * MINIMAP_SCALE, playerPos.y * MINIMAP_SCALE, MINIMAP_SCALE, MINIMAP_SCALE);
    // End
    mctx.fillStyle = COL.end;
    mctx.fillRect((cols - 1) * MINIMAP_SCALE, (rows - 1) * MINIMAP_SCALE, MINIMAP_SCALE, MINIMAP_SCALE);
}

// ─── Animation loop ───────────────────────────────────
let animFrameId;
function loop() {
    // Lerp display position toward actual
    displayPos.x += (playerPos.x - displayPos.x) * ANIM_SPEED;
    displayPos.y += (playerPos.y - displayPos.y) * ANIM_SPEED;
    if (Math.abs(displayPos.x - playerPos.x) < 0.01) displayPos.x = playerPos.x;
    if (Math.abs(displayPos.y - playerPos.y) < 0.01) displayPos.y = playerPos.y;

    draw();
    drawMinimap();
    animFrameId = requestAnimationFrame(loop);
}

// ─── Player movement ──────────────────────────────────
function movePlayer(dx, dy) {
    if (gameWon) return;
    const nx = playerPos.x + dx, ny = playerPos.y + dy;
    if (nx < 0 || nx >= cols || ny < 0 || ny >= rows || maze[ny][nx] === 1) {
        sfxWallBump();
        return;
    }
    playerPos.x = nx;
    playerPos.y = ny;
    moves++;
    moveCountEl.textContent = moves;
    trail.add(`${nx},${ny}`);
    sfxMove();

    // Check stars
    for (const s of starPositions) {
        if (!s.collected && s.x === nx && s.y === ny) {
            s.collected = true;
            starsCollected++;
            starCountEl.textContent = starsCollected;
            sfxStar();
        }
    }

    // Update live score
    scoreEl.textContent = calculateScore();

    // Win?
    if (nx === destination.x && ny === destination.y) {
        winGame();
    }
}

// ─── Win logic ────────────────────────────────────────
function winGame() {
    gameWon = true;
    stopTimer();
    sfxWin();

    const score = calculateScore();
    const isNew = saveBestScore(score);

    modalMoves.textContent = moves;
    modalTime.textContent = formatTime(elapsedSeconds);
    modalStars.textContent = `${starsCollected}/${totalStars}`;
    modalScore.textContent = score;

    if (isNew) {
        modalBestRow.style.display = 'flex';
        modalBest.textContent = score;
    } else {
        modalBestRow.style.display = 'none';
    }

    victoryModal.classList.add('active');
    launchConfetti();
}

// ─── Hint system ──────────────────────────────────────
function showHint() {
    if (hintsLeft <= 0 || gameWon || showingHint) return;
    hintsLeft--;
    hintCountEl.textContent = hintsLeft;
    if (hintsLeft === 0) hintBtn.disabled = true;

    solutionPath = solveMaze(maze, playerPos.x, playerPos.y, destination.x, destination.y);
    showingHint = true;
    sfxHint();

    const dur = DIFFICULTY[difficultyEl.value].hintDuration;
    setTimeout(() => { showingHint = false; }, dur);
}

// ─── Confetti ─────────────────────────────────────────
let confettiPieces = [];
let confettiAnimId;

function launchConfetti() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    confettiPieces = [];
    const colors = ['#ff595e','#ffca3a','#8ac926','#1982c4','#6a4c93','#ff6b6b','#00c6ff'];
    for (let i = 0; i < 200; i++) {
        confettiPieces.push({
            x: Math.random() * confettiCanvas.width,
            y: Math.random() * confettiCanvas.height - confettiCanvas.height,
            w: Math.random() * 8 + 4,
            h: Math.random() * 6 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 4,
            vy: Math.random() * 4 + 2,
            rot: Math.random() * 360,
            rotV: (Math.random() - 0.5) * 10,
        });
    }
    cancelAnimationFrame(confettiAnimId);
    animConfetti();
}

function animConfetti() {
    cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    let alive = false;
    for (const p of confettiPieces) {
        p.x += p.vx; p.y += p.vy; p.vy += 0.06; p.rot += p.rotV;
        if (p.y < confettiCanvas.height + 20) alive = true;
        cctx.save();
        cctx.translate(p.x, p.y);
        cctx.rotate(p.rot * Math.PI / 180);
        cctx.fillStyle = p.color;
        cctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        cctx.restore();
    }
    if (alive) confettiAnimId = requestAnimationFrame(animConfetti);
    else cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
}

// ─── Reset / init ─────────────────────────────────────
function resetGame() {
    cancelAnimationFrame(animFrameId);
    stopTimer();
    gameWon = false;
    showingHint = false;
    victoryModal.classList.remove('active');
    cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    const cfg = DIFFICULTY[difficultyEl.value];
    cols = cfg.cols;
    rows = cfg.rows;
    cellSize = CELL_SIZE;

    canvas.width = cols * cellSize;
    canvas.height = rows * cellSize;

    maze = generateMaze(cols, rows);
    playerPos = { x: 0, y: 0 };
    destination = { x: cols - 1, y: rows - 1 };
    displayPos = { x: 0, y: 0 };

    moves = 0;
    starsCollected = 0;
    hintsLeft = 3;
    elapsedSeconds = 0;
    trail = new Set(['0,0']);

    solutionPath = solveMaze(maze, 0, 0, cols - 1, rows - 1);
    totalStars = cfg.stars;
    starPositions = placeStars(maze, totalStars, solutionPath);

    moveCountEl.textContent = 0;
    timerEl.textContent = '00:00';
    starCountEl.textContent = 0;
    starTotalEl.textContent = totalStars;
    scoreEl.textContent = 0;
    hintCountEl.textContent = hintsLeft;
    hintBtn.disabled = false;

    loadBestScores();
    startTimer();
    loop();
}

// ─── Keyboard input ───────────────────────────────────
document.addEventListener('keydown', (e) => {
    const map = {
        ArrowUp: [0, -1], w: [0, -1], W: [0, -1],
        ArrowDown: [0, 1], s: [0, 1], S: [0, 1],
        ArrowLeft: [-1, 0], a: [-1, 0], A: [-1, 0],
        ArrowRight: [1, 0], d: [1, 0], D: [1, 0],
    };
    if (map[e.key]) {
        e.preventDefault();
        movePlayer(...map[e.key]);
    }
    if (e.key === 'h' || e.key === 'H') showHint();
});

// ─── Touch swipe on canvas ────────────────────────────
let touchStart = null;

canvas.addEventListener('touchstart', (e) => {
    touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    e.preventDefault();
}, { passive: false });

canvas.addEventListener('touchend', (e) => {
    if (!touchStart) return;
    const dx = e.changedTouches[0].clientX - touchStart.x;
    const dy = e.changedTouches[0].clientY - touchStart.y;
    const threshold = 30;
    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > threshold) movePlayer(1, 0);
        else if (dx < -threshold) movePlayer(-1, 0);
    } else {
        if (dy > threshold) movePlayer(0, 1);
        else if (dy < -threshold) movePlayer(0, -1);
    }
    touchStart = null;
    e.preventDefault();
}, { passive: false });

// ─── D-Pad (mobile) ──────────────────────────────────
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    dpad.style.display = 'grid';
}
dpad.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-dir]');
    if (!btn) return;
    const dirMap = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
    movePlayer(...dirMap[btn.dataset.dir]);
});

// ─── Button listeners ─────────────────────────────────
resetBtn.addEventListener('click', resetGame);
hintBtn.addEventListener('click', showHint);
modalNextBtn.addEventListener('click', resetGame);
difficultyEl.addEventListener('change', resetGame);

// ─── Resize confetti canvas ───────────────────────────
window.addEventListener('resize', () => {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
});

// ─── Start ────────────────────────────────────────────
loadBestScores();
resetGame();