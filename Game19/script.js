(() => {
    "use strict";

    const WIDTH = 360;
    const HEIGHT = 600;
    const PLAYER_SIZE = 34;
    const DIFFICULTY_PRESETS = {
        easy: {
            label: "Easy",
            spawnBase: 0.95,
            speedScale: 0.85,
            scoreStep: 1,
        },
        normal: {
            label: "Normal",
            spawnBase: 0.78,
            speedScale: 1,
            scoreStep: 1,
        },
        hard: {
            label: "Hard",
            spawnBase: 0.64,
            speedScale: 1.15,
            scoreStep: 1,
        },
    };

    const canvas = document.getElementById("game-canvas");
    const ctx = canvas.getContext("2d");

    const scoreEl = document.getElementById("score");
    const bestEl = document.getElementById("best");
    const levelEl = document.getElementById("level");
    const statusEl = document.getElementById("status");
    const overlayEl = document.getElementById("overlay");
    const overlayTitleEl = document.getElementById("overlay-title");
    const overlayTextEl = document.getElementById("overlay-text");
    const startBtn = document.getElementById("start-btn");
    const pauseBtn = document.getElementById("pause-btn");
    const difficultySelect = document.getElementById("difficulty-select");
    const leftBtn = document.getElementById("left-btn");
    const rightBtn = document.getElementById("right-btn");

    const bestKey = "skylineSprintBest";
    let rafId = null;

    function readStoredBest() {
        try {
            const score = Number(localStorage.getItem(bestKey));
            if (!Number.isFinite(score) || score < 0) {
                return 0;
            }
            return Math.floor(score);
        } catch {
            return 0;
        }
    }

    function saveBestScore(score) {
        try {
            localStorage.setItem(bestKey, String(score));
        } catch {
            // Ignore storage errors so gameplay still works in restricted environments.
        }
    }

    let bestScore = readStoredBest();

    const input = {
        left: false,
        right: false,
    };

    const state = {
        running: false,
        paused: false,
        score: 0,
        level: 1,
        difficulty: "normal",
        spawnTimer: 0,
        obstacles: [],
        lastFrame: 0,
        player: {
            x: WIDTH / 2 - PLAYER_SIZE / 2,
            y: HEIGHT - 64,
            w: PLAYER_SIZE,
            h: PLAYER_SIZE,
            speed: 275,
        },
    };

    function setupCanvas() {
        const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
        canvas.width = WIDTH * dpr;
        canvas.height = HEIGHT * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function resetRun() {
        state.score = 0;
        state.level = 1;
        state.spawnTimer = 0;
        state.obstacles = [];
        state.player.x = WIDTH / 2 - PLAYER_SIZE / 2;
        state.player.y = HEIGHT - 64;
        state.paused = false;
        updateHud();
    }

    function setOverlay(title, text) {
        overlayTitleEl.textContent = title;
        overlayTextEl.textContent = text;
        overlayEl.classList.remove("hidden");
    }

    function hideOverlay() {
        overlayEl.classList.add("hidden");
    }

    function updateHud() {
        scoreEl.textContent = String(state.score);
        bestEl.textContent = String(bestScore);
        levelEl.textContent = String(state.level);
    }

    function setStatus(value, tone = "ok") {
        statusEl.textContent = value;
        statusEl.dataset.tone = tone;
    }

    function spawnObstacle(speedScale) {
        const width = 30 + Math.random() * 70;
        const height = 14 + Math.random() * 20;
        const x = Math.random() * (WIDTH - width);
        const baseSpeed = (160 + Math.random() * 70) * speedScale;
        const hue = 18 + Math.random() * 35;

        state.obstacles.push({
            x,
            y: -height - 10,
            w: width,
            h: height,
            speed: baseSpeed,
            hue,
        });
    }

    function collides(a, b) {
        return (
            a.x < b.x + b.w &&
            a.x + a.w > b.x &&
            a.y < b.y + b.h &&
            a.y + a.h > b.y
        );
    }

    function update(dt) {
        const preset = DIFFICULTY_PRESETS[state.difficulty] || DIFFICULTY_PRESETS.normal;

        if (input.left) {
            state.player.x -= state.player.speed * dt;
        }
        if (input.right) {
            state.player.x += state.player.speed * dt;
        }

        state.player.x = Math.max(10, Math.min(WIDTH - state.player.w - 10, state.player.x));

        state.level = Math.min(12, 1 + Math.floor(state.score / 12));
        const levelBoost = 1 + (state.level - 1) * 0.06;
        const intensity = Math.min(3.8, (1 + state.score / 36) * preset.speedScale * levelBoost);
        const spawnEvery = Math.max(0.2, preset.spawnBase - state.score / 260 - (state.level - 1) * 0.012);

        state.spawnTimer += dt;
        while (state.spawnTimer >= spawnEvery) {
            spawnObstacle(preset.speedScale * levelBoost * (0.95 + Math.random() * 0.1));
            state.spawnTimer -= spawnEvery;
        }

        for (let i = state.obstacles.length - 1; i >= 0; i -= 1) {
            const obstacle = state.obstacles[i];
            obstacle.y += obstacle.speed * intensity * dt;

            if (collides(state.player, obstacle)) {
                finishRun();
                return;
            }

            if (obstacle.y > HEIGHT + obstacle.h) {
                state.obstacles.splice(i, 1);
                state.score += preset.scoreStep;
                updateHud();
            }
        }
    }

    function drawBackground() {
        const g = ctx.createLinearGradient(0, 0, 0, HEIGHT);
        g.addColorStop(0, "#0f2638");
        g.addColorStop(1, "#16354a");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        ctx.strokeStyle = "rgba(216, 236, 255, 0.22)";
        ctx.lineWidth = 2;
        ctx.setLineDash([16, 14]);
        ctx.beginPath();
        ctx.moveTo(WIDTH / 2, 0);
        ctx.lineTo(WIDTH / 2, HEIGHT);
        ctx.stroke();

        ctx.setLineDash([]);
    }

    function roundedRect(x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
    }

    function drawPlayer() {
        ctx.save();
        ctx.shadowColor = "rgba(24, 240, 184, 0.7)";
        ctx.shadowBlur = 20;
        ctx.fillStyle = "#1df3bc";
        roundedRect(state.player.x, state.player.y, state.player.w, state.player.h, 8);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.fillStyle = "#123640";
        roundedRect(state.player.x + 7, state.player.y + 7, state.player.w - 14, state.player.h - 14, 4);
        ctx.fill();
        ctx.restore();
    }

    function drawObstacles() {
        state.obstacles.forEach((obstacle) => {
            ctx.save();
            const glow = `hsla(${obstacle.hue}, 96%, 62%, 0.55)`;
            const fill = `hsl(${obstacle.hue}, 95%, 58%)`;
            ctx.shadowColor = glow;
            ctx.shadowBlur = 18;
            ctx.fillStyle = fill;
            roundedRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h, 6);
            ctx.fill();
            ctx.restore();
        });
    }

    function draw() {
        drawBackground();
        drawObstacles();
        drawPlayer();
    }

    function tick(ts) {
        if (!state.running) {
            rafId = null;
            return;
        }

        const dt = Math.min(0.032, (ts - state.lastFrame) / 1000 || 0);
        state.lastFrame = ts;

        if (!state.paused) {
            update(dt);
            draw();
        }

        rafId = requestAnimationFrame(tick);
    }

    function stopLoop() {
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    }

    function syncPauseButton() {
        pauseBtn.disabled = !state.running;
        pauseBtn.textContent = state.paused ? "Resume" : "Pause";
    }

    function beginRun() {
        stopLoop();
        resetRun();
        state.running = true;
        state.lastFrame = performance.now();
        setStatus("Running", "ok");
        startBtn.textContent = "Restart Run";
        hideOverlay();
        syncPauseButton();
        draw();
        rafId = requestAnimationFrame(tick);
    }

    function finishRun() {
        state.running = false;
        state.paused = false;
        stopLoop();
        syncPauseButton();
        setStatus("Crashed", "danger");

        if (state.score > bestScore) {
            bestScore = state.score;
            saveBestScore(bestScore);
            updateHud();
        }

        setOverlay("Run Over", `You dodged ${state.score} obstacles. Press Start Run to try again.`);
    }

    function togglePause() {
        if (!state.running) {
            return;
        }

        state.paused = !state.paused;
        if (state.paused) {
            setStatus("Paused", "warn");
            setOverlay("Paused", "Press P to continue your run.");
        } else {
            setStatus("Running", "ok");
            state.lastFrame = performance.now();
            hideOverlay();
        }

        syncPauseButton();
    }

    function setDifficulty(nextDifficulty) {
        if (!DIFFICULTY_PRESETS[nextDifficulty]) {
            return;
        }

        state.difficulty = nextDifficulty;

        if (!state.running) {
            const label = DIFFICULTY_PRESETS[nextDifficulty].label;
            setOverlay("Ready?", `${label} mode selected. Move left and right. Dodge every incoming block.`);
        }
    }

    function onPointerMove(direction, active) {
        if (direction === "left") {
            input.left = active;
        }
        if (direction === "right") {
            input.right = active;
        }
    }

    function bindControls() {
        startBtn.addEventListener("click", beginRun);
        pauseBtn.addEventListener("click", togglePause);

        difficultySelect.addEventListener("change", (event) => {
            setDifficulty(event.target.value);
        });

        window.addEventListener("keydown", (event) => {
            const key = event.key.toLowerCase();

            if (event.key === "ArrowLeft" || key === "a") {
                input.left = true;
                event.preventDefault();
            }
            if (event.key === "ArrowRight" || key === "d") {
                input.right = true;
                event.preventDefault();
            }

            if (key === "p" && !event.repeat) {
                togglePause();
                event.preventDefault();
            }

            if (key === "r" && !event.repeat) {
                beginRun();
                event.preventDefault();
            }
        });

        window.addEventListener("keyup", (event) => {
            const key = event.key.toLowerCase();

            if (event.key === "ArrowLeft" || key === "a") {
                input.left = false;
            }
            if (event.key === "ArrowRight" || key === "d") {
                input.right = false;
            }
        });

        [
            [leftBtn, "left"],
            [rightBtn, "right"],
        ].forEach(([button, direction]) => {
            button.addEventListener("pointerdown", (event) => {
                event.preventDefault();
                onPointerMove(direction, true);
            });
            button.addEventListener("pointerup", () => onPointerMove(direction, false));
            button.addEventListener("pointerleave", () => onPointerMove(direction, false));
            button.addEventListener("pointercancel", () => onPointerMove(direction, false));
        });

        window.addEventListener("blur", () => {
            input.left = false;
            input.right = false;
            if (state.running && !state.paused) {
                togglePause();
            }
        });
    }

    function init() {
        setupCanvas();
        bindControls();
        difficultySelect.value = state.difficulty;
        updateHud();
        setStatus("Idle", "idle");
        syncPauseButton();
        draw();
        setOverlay("Ready?", "Choose a difficulty, then press Start Run.");
    }

    window.addEventListener("resize", () => {
        setupCanvas();
        draw();
    });
    init();
})();
