// ============================================================
//  TETRIS — Enhanced
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const canvas  = document.getElementById('tetris');
    const ctx     = canvas.getContext('2d');
    const nextC   = document.getElementById('nextCanvas');
    const nextCtx = nextC.getContext('2d');
    const holdC   = document.getElementById('holdCanvas');
    const holdCtx = holdC.getContext('2d');

    const $score  = document.getElementById('score');
    const $level  = document.getElementById('level');
    const $lines  = document.getElementById('lines');
    const $hi     = document.getElementById('highScore');
    const $final  = document.getElementById('finalScore');
    const $hiMsg  = document.getElementById('highScoreMsg');

    const $start    = document.getElementById('overlayStart');
    const $pause    = document.getElementById('overlayPause');
    const $over     = document.getElementById('overlayGameOver');
    const $startBtn = document.getElementById('start-button');
    const $resume   = document.getElementById('resume-button');
    const $restart  = document.getElementById('restart-button');

    const COLS = 10, ROWS = 20, B = 24;
    canvas.width = COLS * B;
    canvas.height = ROWS * B;

    const COLORS = [
        null,
        '#FF0D72', // I
        '#0DC2FF', // J
        '#0DFF72', // L
        '#F538FF', // O
        '#FF8E0D', // S
        '#FFE138', // T
        '#3877FF'  // Z
    ];

    const SHAPES = [
        [],
        [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
        [[2,0,0],[2,2,2],[0,0,0]],
        [[0,0,3],[3,3,3],[0,0,0]],
        [[4,4],[4,4]],
        [[0,5,5],[5,5,0],[0,0,0]],
        [[0,6,0],[6,6,6],[0,0,0]],
        [[7,7,0],[0,7,7],[0,0,0]]
    ];

    let board, player, nextPiece, holdPiece, canHold;
    let score, level, lines, hi;
    let running = false, paused = false;
    let lastTime = 0, dropCounter = 0, dropInterval;
    let animId = null;
    let particles = [];

    hi = +(localStorage.getItem('tetris_hs') || 0);
    $hi.textContent = hi;

    function createMatrix(w, h) {
        const m = [];
        while (h--) m.push(new Array(w).fill(0));
        return m;
    }

    function createPiece(type) {
        return SHAPES[type].map(r => [...r]);
    }

    function randomType() { return (Math.random() * 7 | 0) + 1; }

    function init() {
        board = createMatrix(COLS, ROWS);
        score = 0; level = 1; lines = 0;
        dropInterval = 1000;
        nextPiece = randomType();
        holdPiece = null;
        canHold = true;
        particles = [];
        playerReset();
        updateUI();
        drawPreview(nextCtx, nextC, nextPiece);
        drawPreview(holdCtx, holdC, null);
    }

    function playerReset() {
        const type = nextPiece;
        nextPiece = randomType();
        player = {
            matrix: createPiece(type),
            pos: { x: 0, y: 0 }
        };
        player.pos.x = Math.floor((COLS - player.matrix[0].length) / 2);
        player.pos.y = 0;
        canHold = true;
        drawPreview(nextCtx, nextC, nextPiece);
        if (collide(board, player)) {
            gameOver();
        }
    }

    function collide(b, p) {
        for (let y = 0; y < p.matrix.length; y++) {
            for (let x = 0; x < p.matrix[y].length; x++) {
                if (p.matrix[y][x] !== 0) {
                    const bx = x + p.pos.x, by = y + p.pos.y;
                    if (bx < 0 || bx >= COLS || by >= ROWS) return true;
                    if (by >= 0 && b[by][bx] !== 0) return true;
                }
            }
        }
        return false;
    }

    function merge() {
        player.matrix.forEach((row, y) => {
            row.forEach((v, x) => {
                if (v !== 0) board[y + player.pos.y][x + player.pos.x] = v;
            });
        });
    }

    function rotate(matrix, dir) {
        for (let y = 0; y < matrix.length; y++)
            for (let x = 0; x < y; x++)
                [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        if (dir > 0) matrix.forEach(r => r.reverse());
        else matrix.reverse();
    }

    function playerRotate(dir) {
        const px = player.pos.x;
        let off = 1;
        rotate(player.matrix, dir);
        while (collide(board, player)) {
            player.pos.x += off;
            off = -(off + (off > 0 ? 1 : -1));
            if (Math.abs(off) > player.matrix[0].length + 1) {
                rotate(player.matrix, -dir);
                player.pos.x = px;
                return;
            }
        }
    }

    function playerMove(dir) {
        player.pos.x += dir;
        if (collide(board, player)) player.pos.x -= dir;
    }

    function playerDrop() {
        player.pos.y++;
        if (collide(board, player)) {
            player.pos.y--;
            merge();
            sweep();
            playerReset();
        }
        dropCounter = 0;
    }

    function playerHardDrop() {
        let dropped = 0;
        while (!collide(board, player)) { player.pos.y++; dropped++; }
        player.pos.y--;
        score += dropped * 2;
        merge();
        sweep();
        playerReset();
        dropCounter = 0;
        updateUI();
    }

    function playerHold() {
        if (!canHold) return;
        canHold = false;
        const curType = player.matrix[0].find(v => v !== 0) || player.matrix[1].find(v => v !== 0);
        if (holdPiece === null) {
            holdPiece = curType;
            playerReset();
        } else {
            const tmp = holdPiece;
            holdPiece = curType;
            player.matrix = createPiece(tmp);
            player.pos.x = Math.floor((COLS - player.matrix[0].length) / 2);
            player.pos.y = 0;
        }
        drawPreview(holdCtx, holdC, holdPiece);
    }

    function sweep() {
        let rowCount = 0;
        for (let y = board.length - 1; y >= 0; y--) {
            if (board[y].every(c => c !== 0)) {
                spawnLineParticles(y);
                board.splice(y, 1);
                board.unshift(new Array(COLS).fill(0));
                y++;
                rowCount++;
            }
        }
        if (rowCount > 0) {
            const pts = [0, 100, 300, 500, 800][rowCount] || rowCount * 200;
            score += pts * level;
            lines += rowCount;
            level = Math.floor(lines / 10) + 1;
            dropInterval = Math.max(100, 1000 - (level - 1) * 80);
            updateUI();
        }
    }

    function ghostY() {
        let gy = player.pos.y;
        while (true) {
            gy++;
            for (let y = 0; y < player.matrix.length; y++) {
                for (let x = 0; x < player.matrix[y].length; x++) {
                    if (player.matrix[y][x] !== 0) {
                        const bx = x + player.pos.x, by = y + gy;
                        if (by >= ROWS || (by >= 0 && board[by][bx] !== 0)) return gy - 1;
                    }
                }
            }
        }
    }

    // particles
    function spawnLineParticles(row) {
        for (let x = 0; x < COLS; x++) {
            const col = COLORS[board[row][x]] || '#fff';
            for (let i = 0; i < 3; i++) {
                particles.push({
                    x: x * B + B / 2,
                    y: row * B + B / 2,
                    vx: (Math.random() - 0.5) * 4,
                    vy: (Math.random() - 1) * 3,
                    life: 30 + Math.random() * 20,
                    col
                });
            }
        }
    }

    function tickParticles() {
        particles = particles.filter(p => p.life > 0);
        particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.1; p.life--; });
    }

    function drawParticles() {
        particles.forEach(p => {
            ctx.globalAlpha = p.life / 50;
            ctx.fillStyle = p.col;
            ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
        });
        ctx.globalAlpha = 1;
    }

    // draw
    function drawBlock(c, x, y, alpha) {
        if (!c) return;
        ctx.globalAlpha = alpha || 1;
        ctx.fillStyle = c;
        ctx.fillRect(x * B, y * B, B, B);
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x * B, y * B, B, B);
        // highlight
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fillRect(x * B + 1, y * B + 1, B - 2, B / 3);
        ctx.globalAlpha = 1;
    }

    function draw() {
        // background grid
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'rgba(0,255,255,0.04)';
        ctx.lineWidth = 0.5;
        for (let x = 0; x <= COLS; x++) { ctx.beginPath(); ctx.moveTo(x * B, 0); ctx.lineTo(x * B, ROWS * B); ctx.stroke(); }
        for (let y = 0; y <= ROWS; y++) { ctx.beginPath(); ctx.moveTo(0, y * B); ctx.lineTo(COLS * B, y * B); ctx.stroke(); }

        // board
        board.forEach((row, y) => row.forEach((v, x) => { if (v) drawBlock(COLORS[v], x, y); }));

        // ghost piece
        if (running && !paused) {
            const gy = ghostY();
            player.matrix.forEach((row, y) => row.forEach((v, x) => {
                if (v) drawBlock(COLORS[v], x + player.pos.x, y + gy, 0.2);
            }));
        }

        // active piece
        player.matrix.forEach((row, y) => row.forEach((v, x) => {
            if (v) drawBlock(COLORS[v], x + player.pos.x, y + player.pos.y);
        }));

        drawParticles();
    }

    function drawPreview(pCtx, pCanvas, type) {
        pCtx.fillStyle = 'rgba(0,0,0,0.5)';
        pCtx.fillRect(0, 0, pCanvas.width, pCanvas.height);
        if (type === null) return;
        const m = SHAPES[type];
        const s = 16;
        const ox = (pCanvas.width - m[0].length * s) / 2;
        const oy = (pCanvas.height - m.length * s) / 2;
        m.forEach((row, y) => row.forEach((v, x) => {
            if (v) {
                pCtx.fillStyle = COLORS[v];
                pCtx.fillRect(ox + x * s, oy + y * s, s, s);
                pCtx.strokeStyle = 'rgba(0,0,0,0.3)';
                pCtx.lineWidth = 0.5;
                pCtx.strokeRect(ox + x * s, oy + y * s, s, s);
            }
        }));
    }

    function updateUI() {
        $score.textContent = score;
        $level.textContent = level;
        $lines.textContent = lines;
        if (score > hi) { hi = score; localStorage.setItem('tetris_hs', hi); }
        $hi.textContent = hi;
    }

    function gameOver() {
        running = false;
        $final.textContent = score;
        $hiMsg.textContent = score >= hi ? '★ New High Score!' : 'High Score: ' + hi;
        $over.classList.remove('hidden');
        draw();
    }

    function togglePause() {
        if (!running) return;
        paused = !paused;
        $pause.classList.toggle('hidden', !paused);
        if (!paused) { lastTime = performance.now(); animId = requestAnimationFrame(loop); }
    }

    function loop(time) {
        if (!running || paused) { animId = null; return; }
        const dt = time - lastTime;
        lastTime = time;
        dropCounter += dt;
        if (dropCounter > dropInterval) playerDrop();
        tickParticles();
        draw();
        animId = requestAnimationFrame(loop);
    }

    function startGame() {
        init();
        running = true;
        paused = false;
        lastTime = performance.now();
        if (animId) cancelAnimationFrame(animId);
        animId = requestAnimationFrame(loop);
    }

    // controls
    document.addEventListener('keydown', e => {
        if (!running) return;
        if (paused && e.key !== 'p' && e.key !== 'P') return;
        switch (e.key) {
            case 'ArrowLeft':  case 'a': case 'A': playerMove(-1); e.preventDefault(); break;
            case 'ArrowRight': case 'd': case 'D': playerMove(1);  e.preventDefault(); break;
            case 'ArrowDown':  case 's': case 'S': playerDrop();   e.preventDefault(); break;
            case 'ArrowUp':    case 'w': case 'W': playerRotate(1); e.preventDefault(); break;
            case ' ': playerHardDrop(); e.preventDefault(); break;
            case 'c': case 'C': playerHold(); break;
            case 'p': case 'P': togglePause(); break;
        }
    });

    // mobile d-pad
    document.getElementById('btnLeft').addEventListener('pointerdown', e => { if(running&&!paused) playerMove(-1); e.preventDefault(); });
    document.getElementById('btnRight').addEventListener('pointerdown', e => { if(running&&!paused) playerMove(1); e.preventDefault(); });
    document.getElementById('btnDown').addEventListener('pointerdown', e => { if(running&&!paused) playerDrop(); e.preventDefault(); });
    document.getElementById('btnRotate').addEventListener('pointerdown', e => { if(running&&!paused) playerRotate(1); e.preventDefault(); });
    document.getElementById('btnDrop').addEventListener('pointerdown', e => { if(running&&!paused) playerHardDrop(); e.preventDefault(); });

    // touch swipe
    let ts = null;
    canvas.addEventListener('touchstart', e => { ts = { x: e.touches[0].clientX, y: e.touches[0].clientY }; e.preventDefault(); }, { passive: false });
    canvas.addEventListener('touchend', e => {
        if (!ts || !running || paused) return;
        const dx = e.changedTouches[0].clientX - ts.x;
        const dy = e.changedTouches[0].clientY - ts.y;
        if (Math.abs(dx) < 10 && Math.abs(dy) < 10) { playerRotate(1); }
        else if (Math.abs(dx) > Math.abs(dy)) { playerMove(dx > 0 ? 1 : -1); }
        else if (dy > 0) playerDrop();
        else playerHardDrop();
        ts = null;
        e.preventDefault();
    }, { passive: false });

    // buttons
    $startBtn.addEventListener('click', () => { $start.classList.add('hidden'); startGame(); });
    $restart.addEventListener('click', () => { $over.classList.add('hidden'); startGame(); });
    $resume.addEventListener('click', togglePause);

    // initial draw
    init();
    draw();
});
});