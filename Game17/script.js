/* ============================================================
   Castle Defenders - Tower Defense RPG
   Full Game Engine
   ============================================================ */

// ============================================================
// SECTION 1: CONFIGURATION & DATA
// ============================================================

const CONFIG = {
    GRID_SIZE: 40,
    CANVAS_MIN_WIDTH: 800,
    CANVAS_MIN_HEIGHT: 600,
    STARTING_GOLD: 500,
    STARTING_LIVES: 20,
    WAVE_BONUS_GOLD: 50,
    WAVE_BONUS_GOLD_SCALING: 10,
    SELL_REFUND_RATIO: 0.6,
    ENEMY_GOLD_MIN: 5,
    ENEMY_GOLD_MAX: 15,
    XP_PER_KILL: 5,
    XP_LEVEL_BASE: 50,
    XP_LEVEL_SCALING: 1.4,
    MAX_HERO_LEVEL: 20,
    ENDLESS_SCALING: 1.12,
    TOTAL_CAMPAIGN_WAVES: 30,
    PARTICLE_LIMIT: 200,
    PROJECTILE_SPEED: 280,
    PATH_COLOR: '#2a1a0a',
    PATH_BORDER_COLOR: '#4a3520',
    GRASS_COLORS: ['#1a2e1a', '#1e331e', '#172b17', '#1b301b'],
    CASTLE_COLOR: '#6a6a8a',
};

// Tower definitions
const TOWER_DATA = {
    archer: {
        name: 'Archer Tower', icon: '🏹', cost: 50,
        damage: 12, speed: 0.8, range: 130, type: 'physical',
        projectileColor: '#d4a040', projectileSize: 3,
        upgrades: [
            { damage: 18, speed: 0.7, range: 140, cost: 40 },
            { damage: 26, speed: 0.6, range: 155, cost: 70 },
        ],
        evolutions: {
            sniper: { name: 'Sniper Tower', icon: '🎯', damage: 60, speed: 1.5, range: 250, cost: 200, special: 'Critical hits deal 3x damage (25% chance)' },
            rapid: { name: 'Rapid Tower', icon: '🏹', damage: 14, speed: 0.25, range: 130, cost: 180, special: 'Extremely fast attack speed' },
        }
    },
    mage: {
        name: 'Mage Tower', icon: '🔮', cost: 80,
        damage: 20, speed: 1.2, range: 110, type: 'magic', splash: 50,
        projectileColor: '#8040ff', projectileSize: 5,
        upgrades: [
            { damage: 30, speed: 1.1, range: 120, cost: 60 },
            { damage: 45, speed: 1.0, range: 130, cost: 100 },
        ],
        evolutions: {
            archmage: { name: 'Archmage Tower', icon: '🔮', damage: 80, speed: 1.5, range: 150, splash: 80, cost: 250, special: 'Massive AoE explosions' },
            enchanter: { name: 'Enchanter Tower', icon: '✨', damage: 25, speed: 0.8, range: 140, cost: 220, special: 'Attacks weaken enemies (-30% armor for 3s)' },
        }
    },
    cannon: {
        name: 'Cannon Tower', icon: '💣', cost: 100,
        damage: 45, speed: 2.0, range: 100, type: 'physical', splash: 60,
        projectileColor: '#555555', projectileSize: 6,
        upgrades: [
            { damage: 70, speed: 1.8, range: 110, cost: 75 },
            { damage: 100, speed: 1.6, range: 120, cost: 120 },
        ],
        evolutions: {
            mortar: { name: 'Mortar Tower', icon: '💣', damage: 160, speed: 2.5, range: 180, splash: 100, cost: 300, special: 'Long range, huge AoE' },
            gatling: { name: 'Gatling Tower', icon: '🔫', damage: 30, speed: 0.3, range: 100, cost: 280, special: 'Ramps up speed the longer it fires' },
        }
    },
    frost: {
        name: 'Frost Tower', icon: '❄️', cost: 70,
        damage: 8, speed: 1.0, range: 120, type: 'magic', slow: 0.4, slowDuration: 2,
        projectileColor: '#7ae4ff', projectileSize: 4,
        upgrades: [
            { damage: 12, speed: 0.9, range: 130, slow: 0.5, cost: 50 },
            { damage: 18, speed: 0.8, range: 140, slow: 0.6, cost: 85 },
        ],
        evolutions: {
            blizzard: { name: 'Blizzard Tower', icon: '🌨️', damage: 10, speed: 0.5, range: 160, slow: 0.7, splash: 90, cost: 200, special: 'AoE freeze field' },
            cryomancer: { name: 'Cryomancer Tower', icon: '🧊', damage: 30, speed: 1.2, range: 130, slow: 0.5, cost: 220, special: 'Chance to freeze enemies solid (2s stun)' },
        }
    },
    lightning: {
        name: 'Lightning Tower', icon: '⚡', cost: 120,
        damage: 25, speed: 1.4, range: 140, type: 'magic', chain: 3,
        projectileColor: '#ffee44', projectileSize: 3,
        upgrades: [
            { damage: 38, speed: 1.3, range: 150, chain: 4, cost: 80 },
            { damage: 55, speed: 1.2, range: 160, chain: 5, cost: 130 },
        ],
        evolutions: {
            storm: { name: 'Storm Tower', icon: '🌩️', damage: 40, speed: 1.0, range: 180, chain: 8, cost: 300, special: 'Lightning chains to 8 enemies' },
            tesla: { name: 'Tesla Tower', icon: '⚡', damage: 70, speed: 0.8, range: 120, cost: 280, special: 'Overcharges nearby towers (+20% speed)' },
        }
    },
    poison: {
        name: 'Poison Tower', icon: '☠️', cost: 90,
        damage: 5, speed: 1.0, range: 110, type: 'magic', dot: 15, dotDuration: 4,
        projectileColor: '#44ff44', projectileSize: 4,
        upgrades: [
            { damage: 8, dot: 22, dotDuration: 5, range: 120, cost: 60 },
            { damage: 12, dot: 35, dotDuration: 5, range: 130, cost: 100 },
        ],
        evolutions: {
            plague: { name: 'Plague Tower', icon: '🦠', damage: 8, dot: 50, dotDuration: 6, range: 140, splash: 70, cost: 250, special: 'Poison spreads to nearby enemies' },
            venom: { name: 'Venom Tower', icon: '🐍', damage: 20, dot: 40, dotDuration: 4, range: 130, cost: 230, special: 'Venom reduces enemy healing by 80%' },
        }
    },
    holy: {
        name: 'Holy Tower', icon: '✝️', cost: 150,
        damage: 15, speed: 1.5, range: 130, type: 'holy', healNearby: 0.1,
        projectileColor: '#ffffaa', projectileSize: 5,
        upgrades: [
            { damage: 25, range: 140, healNearby: 0.15, cost: 100 },
            { damage: 40, range: 155, healNearby: 0.2, cost: 160 },
        ],
        evolutions: {
            paladin: { name: 'Paladin Tower', icon: '⚜️', damage: 60, range: 160, cost: 350, special: '2x damage to undead and demon enemies' },
            temple: { name: 'Temple Tower', icon: '🏛️', damage: 20, range: 180, cost: 320, special: 'Aura: all towers in range +15% damage' },
        }
    },
    necro: {
        name: 'Necro Tower', icon: '💀', cost: 200,
        damage: 30, speed: 2.0, range: 120, type: 'dark', summon: true,
        projectileColor: '#aa44ff', projectileSize: 5,
        upgrades: [
            { damage: 45, range: 130, speed: 1.8, cost: 130 },
            { damage: 65, range: 140, speed: 1.6, cost: 200 },
        ],
        evolutions: {
            lich: { name: 'Lich Tower', icon: '👻', damage: 90, range: 160, speed: 1.2, cost: 400, special: 'Drain: heals castle for 10% damage dealt' },
            graveyard: { name: 'Graveyard', icon: '🪦', damage: 40, range: 150, cost: 380, special: 'Spawns skeleton warriors that block enemies' },
        }
    }
};

// Hero definitions
const HERO_DATA = {
    knight: {
        name: 'Knight', icon: '🛡️',
        passive: { type: 'towerHp', value: 0.2, desc: '+20% Tower HP' },
        abilities: [
            { name: 'Rally', icon: '⚔️', cooldown: 15, duration: 5, desc: 'All towers +30% attack speed for 5s', type: 'buff_speed', value: 0.3 },
            { name: 'Shield Wall', icon: '🛡️', cooldown: 25, duration: 8, desc: 'Reduce all incoming damage by 50% for 8s', type: 'shield', value: 0.5 },
            { name: 'Heroic Strike', icon: '💥', cooldown: 35, desc: 'Deal 500 damage to all enemies on screen', type: 'damage_all', value: 500 },
        ]
    },
    mage: {
        name: 'Mage', icon: '🧙',
        passive: { type: 'magicDmg', value: 0.15, desc: '+15% Magic Damage' },
        abilities: [
            { name: 'Meteor', icon: '☄️', cooldown: 20, desc: 'Drop a meteor dealing 300 AoE damage', type: 'aoe_damage', value: 300, radius: 80 },
            { name: 'Mana Shield', icon: '🔵', cooldown: 30, duration: 6, desc: 'Absorb next 5 enemy passes for 6s', type: 'absorb', value: 5 },
            { name: 'Arcane Storm', icon: '🌀', cooldown: 40, duration: 8, desc: 'Random lightning strikes for 8s', type: 'storm', value: 100 },
        ]
    },
    ranger: {
        name: 'Ranger', icon: '🏹',
        passive: { type: 'range', value: 0.25, desc: '+25% Tower Range' },
        abilities: [
            { name: 'Arrow Rain', icon: '🏹', cooldown: 18, desc: 'Rain arrows in an area for 200 total damage', type: 'aoe_damage', value: 200, radius: 100 },
            { name: 'Eagle Eye', icon: '🦅', cooldown: 25, duration: 10, desc: 'Reveal all enemies + 20% crit for 10s', type: 'buff_crit', value: 0.2 },
            { name: 'Trap', icon: '🪤', cooldown: 30, desc: 'Place a trap that stuns enemies for 3s', type: 'trap', value: 3 },
        ]
    },
    engineer: {
        name: 'Engineer', icon: '⚒️',
        passive: { type: 'buildCost', value: -0.15, desc: '-15% Build Cost' },
        abilities: [
            { name: 'Overclock', icon: '⚙️', cooldown: 15, duration: 6, desc: 'Selected tower attacks 2x faster for 6s', type: 'overclock', value: 2 },
            { name: 'Gold Mine', icon: '💰', cooldown: 30, desc: 'Instantly gain 150 gold', type: 'gold', value: 150 },
            { name: 'Bomb', icon: '💣', cooldown: 25, desc: 'Deploy a massive bomb for 400 damage', type: 'aoe_damage', value: 400, radius: 90 },
        ]
    }
};

// Enemy definitions
const ENEMY_TYPES = {
    goblin: { name: 'Goblin', icon: '👺', hp: 40, speed: 60, armor: 0, reward: 5, color: '#44aa44', size: 8 },
    skeleton: { name: 'Skeleton', icon: '💀', hp: 60, speed: 50, armor: 2, reward: 7, color: '#cccccc', size: 9, subtype: 'undead' },
    orc: { name: 'Orc', icon: '👹', hp: 120, speed: 40, armor: 5, reward: 12, color: '#668844', size: 11 },
    wolf: { name: 'Wolf', icon: '🐺', hp: 50, speed: 90, armor: 0, reward: 8, color: '#888888', size: 8 },
    darkKnight: { name: 'Dark Knight', icon: '🖤', hp: 200, speed: 35, armor: 10, reward: 18, color: '#333355', size: 12 },
    mageEnemy: { name: 'Dark Mage', icon: '🧙‍♂️', hp: 80, speed: 45, armor: 0, magicResist: 0.5, reward: 15, color: '#664488', size: 10 },
    troll: { name: 'Troll', icon: '🧌', hp: 350, speed: 30, armor: 8, reward: 25, color: '#447744', size: 14, regen: 3 },
    demon: { name: 'Demon', icon: '😈', hp: 250, speed: 55, armor: 5, magicResist: 0.3, reward: 22, color: '#aa2222', size: 12, subtype: 'demon' },
    dragon: { name: 'Dragon', icon: '🐉', hp: 600, speed: 25, armor: 15, magicResist: 0.4, reward: 50, color: '#dd4400', size: 18, flying: false },
    boss_ogre: { name: 'Ogre King', icon: '👑', hp: 1500, speed: 20, armor: 20, reward: 100, color: '#886622', size: 22, boss: true },
    boss_lich: { name: 'Lich Lord', icon: '👻', hp: 1200, speed: 30, armor: 5, magicResist: 0.6, reward: 120, color: '#6644aa', size: 20, boss: true, subtype: 'undead', summon: true },
    boss_dragon: { name: 'Elder Dragon', icon: '🐲', hp: 3000, speed: 18, armor: 25, magicResist: 0.5, reward: 200, color: '#ff4400', size: 26, boss: true },
};

// Wave definitions (30 campaign waves)
const WAVE_DEFS = [
    { enemies: [{ type: 'goblin', count: 8 }], delay: 1.0 },
    { enemies: [{ type: 'goblin', count: 12 }], delay: 0.9 },
    { enemies: [{ type: 'goblin', count: 8 }, { type: 'skeleton', count: 4 }], delay: 0.9 },
    { enemies: [{ type: 'skeleton', count: 10 }, { type: 'wolf', count: 3 }], delay: 0.8 },
    { enemies: [{ type: 'orc', count: 6 }, { type: 'goblin', count: 8 }], delay: 0.8, boss: 'boss_ogre', bossHpMul: 0.3 },
    { enemies: [{ type: 'wolf', count: 12 }], delay: 0.6 },
    { enemies: [{ type: 'orc', count: 10 }, { type: 'skeleton', count: 6 }], delay: 0.7 },
    { enemies: [{ type: 'darkKnight', count: 5 }, { type: 'goblin', count: 10 }], delay: 0.8 },
    { enemies: [{ type: 'mageEnemy', count: 8 }, { type: 'orc', count: 5 }], delay: 0.7 },
    { enemies: [{ type: 'troll', count: 3 }, { type: 'darkKnight', count: 5 }], delay: 0.9, boss: 'boss_ogre', bossHpMul: 0.6 },
    { enemies: [{ type: 'wolf', count: 15 }, { type: 'goblin', count: 15 }], delay: 0.5 },
    { enemies: [{ type: 'demon', count: 5 }, { type: 'skeleton', count: 10 }], delay: 0.7 },
    { enemies: [{ type: 'mageEnemy', count: 10 }, { type: 'darkKnight', count: 5 }], delay: 0.6 },
    { enemies: [{ type: 'troll', count: 5 }, { type: 'orc', count: 8 }], delay: 0.7 },
    { enemies: [{ type: 'demon', count: 8 }, { type: 'darkKnight', count: 6 }], delay: 0.6, boss: 'boss_lich', bossHpMul: 0.5 },
    { enemies: [{ type: 'dragon', count: 2 }, { type: 'demon', count: 8 }], delay: 0.8 },
    { enemies: [{ type: 'wolf', count: 20 }, { type: 'troll', count: 4 }], delay: 0.4 },
    { enemies: [{ type: 'darkKnight', count: 10 }, { type: 'mageEnemy', count: 8 }], delay: 0.5 },
    { enemies: [{ type: 'dragon', count: 4 }, { type: 'orc', count: 10 }], delay: 0.7 },
    { enemies: [{ type: 'demon', count: 10 }, { type: 'troll', count: 5 }], delay: 0.5, boss: 'boss_dragon', bossHpMul: 0.4 },
    { enemies: [{ type: 'dragon', count: 5 }, { type: 'darkKnight', count: 10 }], delay: 0.6 },
    { enemies: [{ type: 'troll', count: 8 }, { type: 'demon', count: 8 }], delay: 0.5 },
    { enemies: [{ type: 'mageEnemy', count: 12 }, { type: 'dragon', count: 3 }], delay: 0.5 },
    { enemies: [{ type: 'darkKnight', count: 15 }, { type: 'troll', count: 6 }], delay: 0.4 },
    { enemies: [{ type: 'demon', count: 12 }, { type: 'dragon', count: 5 }], delay: 0.5, boss: 'boss_lich', bossHpMul: 1.0 },
    { enemies: [{ type: 'dragon', count: 8 }, { type: 'troll', count: 8 }], delay: 0.5 },
    { enemies: [{ type: 'demon', count: 15 }, { type: 'darkKnight', count: 12 }], delay: 0.4 },
    { enemies: [{ type: 'dragon', count: 10 }, { type: 'demon', count: 10 }], delay: 0.4 },
    { enemies: [{ type: 'troll', count: 10 }, { type: 'dragon', count: 8 }, { type: 'demon', count: 8 }], delay: 0.35 },
    { enemies: [{ type: 'dragon', count: 12 }, { type: 'demon', count: 12 }], delay: 0.3, boss: 'boss_dragon', bossHpMul: 1.5 },
];


// ============================================================
// SECTION 2: MAP GENERATION
// ============================================================

class GameMap {
    constructor(cols, rows) {
        this.cols = cols;
        this.rows = rows;
        this.grid = []; // 0 = buildable, 1 = path, 2 = castle, 3 = spawn
        this.path = []; // Array of {x, y} in pixel coords (center of path tiles)
        this.generate();
    }

    generate() {
        // Initialize grid
        this.grid = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));

        // Generate a winding path from left to right
        const pathTiles = [];
        let y = Math.floor(this.rows / 2);
        const gs = CONFIG.GRID_SIZE;

        // Spawn point on left
        this.grid[y][0] = 3;
        pathTiles.push({ col: 0, row: y });

        let col = 1;
        while (col < this.cols - 1) {
            this.grid[y][col] = 1;
            pathTiles.push({ col, row: y });

            // Decide direction: go right, or turn up/down
            const rand = Math.random();
            if (rand < 0.35 && y > 2) {
                // Go up for 2-4 tiles
                const steps = Math.min(2 + Math.floor(Math.random() * 3), y - 1);
                for (let s = 0; s < steps; s++) {
                    y--;
                    this.grid[y][col] = 1;
                    pathTiles.push({ col, row: y });
                }
            } else if (rand < 0.7 && y < this.rows - 3) {
                // Go down for 2-4 tiles
                const steps = Math.min(2 + Math.floor(Math.random() * 3), this.rows - 2 - y);
                for (let s = 0; s < steps; s++) {
                    y++;
                    this.grid[y][col] = 1;
                    pathTiles.push({ col, row: y });
                }
            }
            col++;
        }

        // Castle at the right-most column
        this.grid[y][this.cols - 1] = 2;
        pathTiles.push({ col: this.cols - 1, row: y });

        // Convert to pixel coordinates (center of each tile)
        this.path = pathTiles.map(t => ({
            x: t.col * gs + gs / 2,
            y: t.row * gs + gs / 2
        }));
    }

    isBuildable(col, row) {
        if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) return false;
        return this.grid[row][col] === 0;
    }

    getSpawnPoint() {
        return { ...this.path[0] };
    }
    getCastlePoint() {
        return { ...this.path[this.path.length - 1] };
    }
}


// ============================================================
// SECTION 3: ENTITY CLASSES
// ============================================================

class Enemy {
    constructor(type, waveNum, endlessScaling = 1) {
        const data = ENEMY_TYPES[type];
        this.type = type;
        this.name = data.name;
        this.icon = data.icon;
        this.maxHp = Math.floor(data.hp * (1 + waveNum * 0.08) * endlessScaling);
        this.hp = this.maxHp;
        this.speed = data.speed;
        this.baseSpeed = data.speed;
        this.armor = data.armor || 0;
        this.magicResist = data.magicResist || 0;
        this.reward = Math.floor(data.reward * (1 + waveNum * 0.03));
        this.color = data.color;
        this.size = data.size;
        this.boss = data.boss || false;
        this.subtype = data.subtype || null;
        this.regen = data.regen || 0;
        this.flying = data.flying || false;

        this.x = 0;
        this.y = 0;
        this.pathIndex = 0;
        this.alive = true;
        this.reachedEnd = false;

        // Status effects
        this.slowTimer = 0;
        this.slowFactor = 1;
        this.stunTimer = 0;
        this.dotDamage = 0;
        this.dotTimer = 0;
        this.armorDebuff = 0;
        this.armorDebuffTimer = 0;
        this.healReduction = 0;
        this.healReductionTimer = 0;

        // Animation
        this.flashTimer = 0;
        this.deathTimer = 0;
    }

    takeDamage(amount, type = 'physical', game) {
        let finalDmg = amount;

        // Armor reduction for physical
        if (type === 'physical') {
            const effectiveArmor = Math.max(0, this.armor - this.armorDebuff);
            finalDmg = Math.max(1, amount - effectiveArmor);
        }
        // Magic resistance
        if (type === 'magic') {
            finalDmg = Math.max(1, amount * (1 - this.magicResist));
        }
        // Holy does double to undead/demon
        if (type === 'holy' && (this.subtype === 'undead' || this.subtype === 'demon')) {
            finalDmg *= 2;
        }

        // Hero passive: magic damage boost
        if (type === 'magic' && game && game.hero && game.hero.passive.type === 'magicDmg') {
            finalDmg *= (1 + game.hero.passive.value);
        }

        // Global shield buff
        if (game && game.activeBuffs.shield > 0) {
            finalDmg *= (1 - game.activeBuffs.shieldValue);
        }

        // Crit chance from eagle eye
        let crit = false;
        if (game && game.activeBuffs.crit > 0 && Math.random() < game.activeBuffs.critValue) {
            finalDmg *= 2;
            crit = true;
        }

        this.hp -= finalDmg;
        this.flashTimer = 0.1;

        if (game) {
            game.spawnFloatNumber(this.x, this.y, Math.floor(finalDmg), crit ? 'crit' : 'damage');
        }

        if (this.hp <= 0) {
            this.hp = 0;
            this.alive = false;
        }

        return finalDmg;
    }

    applySlow(factor, duration) {
        if (factor > (1 - this.slowFactor) || this.slowTimer <= 0) {
            this.slowFactor = 1 - factor;
            this.slowTimer = duration;
        }
    }

    applyStun(duration) {
        this.stunTimer = Math.max(this.stunTimer, duration);
    }

    applyDot(dps, duration) {
        this.dotDamage = Math.max(this.dotDamage, dps);
        this.dotTimer = Math.max(this.dotTimer, duration);
    }

    applyArmorDebuff(amount, duration) {
        this.armorDebuff = Math.max(this.armorDebuff, amount);
        this.armorDebuffTimer = Math.max(this.armorDebuffTimer, duration);
    }

    update(dt, path) {
        if (!this.alive) return;

        // Regen
        if (this.regen > 0) {
            const healMul = this.healReduction > 0 ? (1 - this.healReduction) : 1;
            this.hp = Math.min(this.maxHp, this.hp + this.regen * healMul * dt);
        }

        // Status timers
        if (this.slowTimer > 0) {
            this.slowTimer -= dt;
            if (this.slowTimer <= 0) this.slowFactor = 1;
        }
        if (this.stunTimer > 0) {
            this.stunTimer -= dt;
        }
        if (this.dotTimer > 0) {
            this.hp -= this.dotDamage * dt;
            this.dotTimer -= dt;
            if (this.dotTimer <= 0) this.dotDamage = 0;
            if (this.hp <= 0) {
                this.hp = 0;
                this.alive = false;
                return;
            }
        }
        if (this.armorDebuffTimer > 0) {
            this.armorDebuffTimer -= dt;
            if (this.armorDebuffTimer <= 0) this.armorDebuff = 0;
        }
        if (this.healReductionTimer > 0) {
            this.healReductionTimer -= dt;
            if (this.healReductionTimer <= 0) this.healReduction = 0;
        }
        if (this.flashTimer > 0) this.flashTimer -= dt;

        // Movement
        if (this.stunTimer > 0) return; // Stunned, can't move

        if (this.pathIndex >= path.length - 1) {
            this.reachedEnd = true;
            this.alive = false;
            return;
        }

        const target = path[this.pathIndex + 1];
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const currentSpeed = this.speed * this.slowFactor;
        const move = currentSpeed * dt;

        if (move >= dist) {
            this.x = target.x;
            this.y = target.y;
            this.pathIndex++;
        } else {
            this.x += (dx / dist) * move;
            this.y += (dy / dist) * move;
        }
    }

    getProgressRatio(path) {
        if (path.length <= 1) return 0;
        let totalDist = 0;
        for (let i = 1; i < path.length; i++) {
            const dx = path[i].x - path[i - 1].x;
            const dy = path[i].y - path[i - 1].y;
            totalDist += Math.sqrt(dx * dx + dy * dy);
        }
        let traveled = 0;
        for (let i = 1; i <= this.pathIndex && i < path.length; i++) {
            const dx = path[i].x - path[i - 1].x;
            const dy = path[i].y - path[i - 1].y;
            traveled += Math.sqrt(dx * dx + dy * dy);
        }
        if (this.pathIndex < path.length - 1) {
            const next = path[this.pathIndex + 1];
            const dx2 = this.x - path[this.pathIndex].x;
            const dy2 = this.y - path[this.pathIndex].y;
            traveled += Math.sqrt(dx2 * dx2 + dy2 * dy2);
        }
        return traveled / totalDist;
    }

    draw(ctx) {
        if (!this.alive) return;
        const x = this.x, y = this.y, s = this.size;

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(x, y + s * 0.7, s * 0.7, s * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Body
        ctx.fillStyle = this.flashTimer > 0 ? '#ffffff' : this.color;
        ctx.beginPath();
        ctx.arc(x, y, s, 0, Math.PI * 2);
        ctx.fill();

        // Boss glow
        if (this.boss) {
            ctx.strokeStyle = '#ff4400';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x, y, s + 3, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Stun indicator
        if (this.stunTimer > 0) {
            ctx.fillStyle = '#ffee44';
            ctx.font = `${s}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('⭐', x, y - s - 4);
        }

        // Health bar
        if (this.hp < this.maxHp) {
            const barW = s * 2.5;
            const barH = 3;
            const barX = x - barW / 2;
            const barY = y - s - 6;

            ctx.fillStyle = '#333';
            ctx.fillRect(barX, barY, barW, barH);

            const ratio = this.hp / this.maxHp;
            const hpColor = ratio > 0.6 ? '#44ff44' : ratio > 0.3 ? '#ffaa22' : '#ff2222';
            ctx.fillStyle = hpColor;
            ctx.fillRect(barX, barY, barW * ratio, barH);
        }

        // Slow indicator
        if (this.slowTimer > 0) {
            ctx.fillStyle = 'rgba(100,200,255,0.3)';
            ctx.beginPath();
            ctx.arc(x, y, s + 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}


class Tower {
    constructor(type, col, row, heroPassive = null) {
        const data = TOWER_DATA[type];
        this.type = type;
        this.baseType = type;
        this.name = data.name;
        this.icon = data.icon;
        this.level = 1;
        this.maxLevel = 3;
        this.evolved = false;
        this.evolutionType = null;

        this.col = col;
        this.row = row;
        const gs = CONFIG.GRID_SIZE;
        this.x = col * gs + gs / 2;
        this.y = row * gs + gs / 2;

        this.damage = data.damage;
        this.speed = data.speed;
        this.range = data.range;
        this.damageType = data.type;
        this.splash = data.splash || 0;
        this.chain = data.chain || 0;
        this.slow = data.slow || 0;
        this.slowDuration = data.slowDuration || 0;
        this.dot = data.dot || 0;
        this.dotDuration = data.dotDuration || 0;
        this.healNearby = data.healNearby || 0;
        this.summon = data.summon || false;
        this.special = null;

        this.projectileColor = data.projectileColor;
        this.projectileSize = data.projectileSize;

        this.attackTimer = 0;
        this.target = null;
        this.kills = 0;
        this.totalSpent = data.cost;

        // Apply hero passive
        if (heroPassive) {
            if (heroPassive.type === 'range') {
                this.range *= (1 + heroPassive.value);
            }
            if (heroPassive.type === 'buildCost') {
                // Cost handled at purchase time
            }
        }

        // Tower buff tracking
        this.speedBuff = 0;
        this.damageBuff = 0;

        // Gatling ramp-up
        this.gatlingStacks = 0;
        this.gatlingTarget = null;

        // Animation
        this.shootAnimTimer = 0;
    }

    getUpgradeCost() {
        if (this.level >= this.maxLevel) return null;
        const data = TOWER_DATA[this.baseType];
        return data.upgrades[this.level - 1].cost;
    }

    upgrade() {
        if (this.level >= this.maxLevel) return;
        const data = TOWER_DATA[this.baseType];
        const upg = data.upgrades[this.level - 1];

        this.level++;
        this.damage = upg.damage || this.damage;
        this.speed = upg.speed || this.speed;
        this.range = upg.range || this.range;
        if (upg.slow) this.slow = upg.slow;
        if (upg.chain) this.chain = upg.chain;
        if (upg.dot) this.dot = upg.dot;
        if (upg.dotDuration) this.dotDuration = upg.dotDuration;
        if (upg.healNearby) this.healNearby = upg.healNearby;
        if (upg.splash) this.splash = upg.splash;
        this.totalSpent += upg.cost;
    }

    canEvolve() {
        return this.level >= this.maxLevel && !this.evolved;
    }

    getEvolutions() {
        if (!this.canEvolve()) return [];
        const data = TOWER_DATA[this.baseType];
        return Object.entries(data.evolutions).map(([key, evo]) => ({
            key, ...evo
        }));
    }

    evolve(evolutionKey) {
        const data = TOWER_DATA[this.baseType];
        const evo = data.evolutions[evolutionKey];
        if (!evo) return;

        this.evolved = true;
        this.evolutionType = evolutionKey;
        this.name = evo.name;
        this.icon = evo.icon;
        this.damage = evo.damage;
        this.range = evo.range || this.range;
        if (evo.speed) this.speed = evo.speed;
        if (evo.splash) this.splash = evo.splash;
        if (evo.chain) this.chain = evo.chain;
        if (evo.slow) this.slow = evo.slow;
        this.special = evo.special;
        this.totalSpent += evo.cost;
        this.level = 4;
    }

    getSellValue() {
        return Math.floor(this.totalSpent * CONFIG.SELL_REFUND_RATIO);
    }

    findTarget(enemies, path) {
        let best = null;
        let bestProgress = -1;

        for (const e of enemies) {
            if (!e.alive) continue;
            const dx = e.x - this.x;
            const dy = e.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist <= this.range) {
                // Target furthest along the path (closest to castle)
                const progress = e.getProgressRatio(path);
                if (progress > bestProgress) {
                    bestProgress = progress;
                    best = e;
                }
            }
        }
        return best;
    }

    update(dt, enemies, path, game) {
        this.attackTimer -= dt;
        if (this.shootAnimTimer > 0) this.shootAnimTimer -= dt;

        // Speed buffs
        let effectiveSpeed = this.speed;
        if (game.activeBuffs.towerSpeed > 0) {
            effectiveSpeed /= (1 + game.activeBuffs.towerSpeedValue);
        }
        if (this.speedBuff > 0) {
            effectiveSpeed /= this.speedBuff;
        }

        // Tesla buff aura
        if (this.evolutionType === 'tesla') {
            // Buff nearby towers
            for (const t of game.towers) {
                if (t === this) continue;
                const dx = t.x - this.x;
                const dy = t.y - this.y;
                if (Math.sqrt(dx * dx + dy * dy) <= this.range) {
                    t.speedBuff = Math.max(t.speedBuff, 1.2);
                }
            }
        }

        // Temple aura buff
        if (this.evolutionType === 'temple') {
            for (const t of game.towers) {
                if (t === this) continue;
                const dx = t.x - this.x;
                const dy = t.y - this.y;
                if (Math.sqrt(dx * dx + dy * dy) <= this.range) {
                    t.damageBuff = Math.max(t.damageBuff, 0.15);
                }
            }
        }

        if (this.attackTimer > 0) return;

        const target = this.findTarget(enemies, path);
        if (!target) {
            this.gatlingStacks = 0;
            this.gatlingTarget = null;
            return;
        }

        this.target = target;
        this.attackTimer = effectiveSpeed;
        this.shootAnimTimer = 0.15;

        // Gatling ramp
        if (this.evolutionType === 'gatling') {
            if (this.gatlingTarget === target) {
                this.gatlingStacks = Math.min(this.gatlingStacks + 1, 10);
            } else {
                this.gatlingStacks = 0;
                this.gatlingTarget = target;
            }
            this.attackTimer = Math.max(0.1, effectiveSpeed - this.gatlingStacks * 0.02);
        }

        // Create projectile
        game.projectiles.push(new Projectile(this, target));
    }

    draw(ctx, showRange, game) {
        const gs = CONFIG.GRID_SIZE;
        const x = this.x, y = this.y;
        const s = gs * 0.4;

        // Range circle (if selected or setting on)
        if (showRange) {
            ctx.strokeStyle = 'rgba(240,192,64,0.25)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(x, y, this.range, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = 'rgba(240,192,64,0.05)';
            ctx.fill();
        }

        // Base platform
        const gradient = ctx.createRadialGradient(x, y, 2, x, y, s);
        gradient.addColorStop(0, '#4a4a6a');
        gradient.addColorStop(1, '#2a2a3a');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, s, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = this.evolved ? '#b04aff' : '#5a5a7a';
        ctx.lineWidth = this.evolved ? 2 : 1;
        ctx.stroke();

        // Tower icon
        ctx.font = `${gs * 0.45}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.icon, x, y);

        // Level indicator
        if (this.level > 1) {
            const stars = this.evolved ? '✦' : '★'.repeat(this.level - 1);
            ctx.font = `${8}px sans-serif`;
            ctx.fillStyle = this.evolved ? '#b04aff' : '#f0c040';
            ctx.fillText(stars, x, y + s + 6);
        }

        // Shoot animation flash
        if (this.shootAnimTimer > 0) {
            ctx.fillStyle = `rgba(255,255,200,${this.shootAnimTimer * 3})`;
            ctx.beginPath();
            ctx.arc(x, y, s + 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}


class Projectile {
    constructor(tower, target) {
        this.x = tower.x;
        this.y = tower.y;
        this.tower = tower;
        this.target = target;
        this.speed = CONFIG.PROJECTILE_SPEED;
        this.alive = true;
        this.color = tower.projectileColor;
        this.size = tower.projectileSize;
        this.trail = [];
    }

    update(dt, game) {
        if (!this.alive) return;

        // Track position for trail
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 5) this.trail.shift();

        if (!this.target.alive) {
            this.alive = false;
            return;
        }

        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.size + this.target.size) {
            this.hit(game);
            return;
        }

        const move = this.speed * dt;
        this.x += (dx / dist) * move;
        this.y += (dy / dist) * move;
    }

    hit(game) {
        this.alive = false;
        const tower = this.tower;
        let damage = tower.damage * (1 + tower.damageBuff);

        // Sniper crit
        if (tower.evolutionType === 'sniper' && Math.random() < 0.25) {
            damage *= 3;
        }

        const actualDmg = this.target.takeDamage(damage, tower.damageType, game);

        // Lich drain
        if (tower.evolutionType === 'lich') {
            game.lives = Math.min(CONFIG.STARTING_LIVES, game.lives + actualDmg * 0.1);
        }

        if (!this.target.alive) {
            tower.kills++;
        }

        // Splash
        if (tower.splash > 0) {
            for (const e of game.enemies) {
                if (e === this.target || !e.alive) continue;
                const dx = e.x - this.target.x;
                const dy = e.y - this.target.y;
                if (Math.sqrt(dx * dx + dy * dy) <= tower.splash) {
                    const splashDmg = damage * 0.5;
                    e.takeDamage(splashDmg, tower.damageType, game);
                    if (!e.alive) tower.kills++;
                }
            }
            // Splash particle
            game.particles.push(new Particle(this.target.x, this.target.y, tower.splash, this.color, 'explosion'));
        }

        // Chain lightning
        if (tower.chain > 0) {
            let chainTarget = this.target;
            let chainsLeft = tower.chain;
            let chainDmg = damage * 0.6;
            const hit = new Set([this.target]);

            while (chainsLeft > 0) {
                let nearest = null;
                let nearestDist = 150;
                for (const e of game.enemies) {
                    if (!e.alive || hit.has(e)) continue;
                    const dx = e.x - chainTarget.x;
                    const dy = e.y - chainTarget.y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < nearestDist) {
                        nearestDist = d;
                        nearest = e;
                    }
                }
                if (!nearest) break;
                hit.add(nearest);
                nearest.takeDamage(chainDmg, 'magic', game);
                game.particles.push(new Particle(nearest.x, nearest.y, 20, '#ffee44', 'spark'));
                if (!nearest.alive) tower.kills++;
                chainTarget = nearest;
                chainDmg *= 0.8;
                chainsLeft--;
            }
        }

        // Slow
        if (tower.slow > 0 && this.target.alive) {
            this.target.applySlow(tower.slow, tower.slowDuration || 2);
            // Cryomancer freeze chance
            if (tower.evolutionType === 'cryomancer' && Math.random() < 0.2) {
                this.target.applyStun(2);
            }
        }

        // DoT
        if (tower.dot > 0 && this.target.alive) {
            this.target.applyDot(tower.dot / (tower.dotDuration || 4), tower.dotDuration || 4);
            // Venom heal reduction
            if (tower.evolutionType === 'venom') {
                this.target.healReduction = 0.8;
                this.target.healReductionTimer = tower.dotDuration || 4;
            }
            // Plague spread
            if (tower.evolutionType === 'plague' && tower.splash > 0) {
                for (const e of game.enemies) {
                    if (e === this.target || !e.alive) continue;
                    const dx = e.x - this.target.x;
                    const dy = e.y - this.target.y;
                    if (Math.sqrt(dx * dx + dy * dy) <= tower.splash) {
                        e.applyDot(tower.dot / (tower.dotDuration || 4) * 0.5, tower.dotDuration || 4);
                    }
                }
            }
        }

        // Enchanter armor debuff
        if (tower.evolutionType === 'enchanter' && this.target.alive) {
            this.target.applyArmorDebuff(this.target.armor * 0.3, 3);
        }

        // Hit particle
        game.particles.push(new Particle(this.target.x, this.target.y, 12, this.color, 'hit'));
    }

    draw(ctx) {
        if (!this.alive) return;

        // Trail
        for (let i = 0; i < this.trail.length; i++) {
            const t = this.trail[i];
            const alpha = (i + 1) / this.trail.length * 0.4;
            ctx.fillStyle = this.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
            ctx.beginPath();
            ctx.arc(t.x, t.y, this.size * 0.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // Main projectile
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Glow
        ctx.fillStyle = this.color + '44';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fill();
    }
}


class Particle {
    constructor(x, y, size, color, type) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.type = type;
        this.life = 0.4;
        this.maxLife = 0.4;
        this.alive = true;

        if (type === 'explosion') {
            this.life = 0.5;
            this.maxLife = 0.5;
        }
    }

    update(dt) {
        this.life -= dt;
        if (this.life <= 0) {
            this.alive = false;
        }
    }

    draw(ctx) {
        if (!this.alive) return;
        const ratio = this.life / this.maxLife;

        if (this.type === 'explosion') {
            ctx.strokeStyle = this.color + Math.floor(ratio * 200).toString(16).padStart(2, '0');
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * (1 - ratio), 0, Math.PI * 2);
            ctx.stroke();
        } else if (this.type === 'hit') {
            ctx.fillStyle = this.color + Math.floor(ratio * 200).toString(16).padStart(2, '0');
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * ratio, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 'spark') {
            ctx.fillStyle = this.color + Math.floor(ratio * 255).toString(16).padStart(2, '0');
            const s = this.size * ratio;
            ctx.fillRect(this.x - s / 2, this.y - s / 2, s, s);
        }
    }
}


// ============================================================
// SECTION 4: AUDIO SYSTEM (Web Audio API procedural)
// ============================================================

class AudioSystem {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.sfxGain = null;
        this.masterVolume = 0.7;
        this.sfxVolume = 0.8;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = this.masterVolume;
            this.masterGain.connect(this.ctx.destination);

            this.sfxGain = this.ctx.createGain();
            this.sfxGain.gain.value = this.sfxVolume;
            this.sfxGain.connect(this.masterGain);

            this.initialized = true;
        } catch (e) {
            console.warn('Audio not available');
        }
    }

    setMasterVolume(v) {
        this.masterVolume = v;
        if (this.masterGain) this.masterGain.gain.value = v;
    }

    setSfxVolume(v) {
        this.sfxVolume = v;
        if (this.sfxGain) this.sfxGain.gain.value = v;
    }

    playTone(freq, duration, type = 'sine', volume = 0.3) {
        if (!this.initialized) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(volume * this.sfxVolume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playBuild() { this.playTone(440, 0.15, 'square', 0.2); setTimeout(() => this.playTone(660, 0.1, 'square', 0.15), 80); }
    playSell() { this.playTone(330, 0.15, 'sawtooth', 0.15); this.playTone(220, 0.2, 'sawtooth', 0.1); }
    playShoot() { this.playTone(800 + Math.random() * 400, 0.05, 'square', 0.08); }
    playHit() { this.playTone(200, 0.08, 'sawtooth', 0.1); }
    playEnemyDeath() { this.playTone(300, 0.1, 'square', 0.1); this.playTone(200, 0.15, 'sawtooth', 0.08); }
    playWaveStart() { this.playTone(330, 0.2, 'sine', 0.2); setTimeout(() => this.playTone(440, 0.2, 'sine', 0.2), 150); setTimeout(() => this.playTone(550, 0.3, 'sine', 0.25), 300); }
    playWaveComplete() { this.playTone(440, 0.15, 'sine', 0.25); setTimeout(() => this.playTone(550, 0.15, 'sine', 0.25), 100); setTimeout(() => this.playTone(660, 0.15, 'sine', 0.25), 200); setTimeout(() => this.playTone(880, 0.4, 'sine', 0.3), 300); }
    playGameOver() { this.playTone(440, 0.3, 'sawtooth', 0.3); setTimeout(() => this.playTone(330, 0.3, 'sawtooth', 0.25), 200); setTimeout(() => this.playTone(220, 0.5, 'sawtooth', 0.2), 400); }
    playVictory() { [440,550,660,880,1100].forEach((f,i) => setTimeout(() => this.playTone(f, 0.3, 'sine', 0.25), i*120)); }
    playAbility() { this.playTone(660, 0.1, 'sine', 0.25); this.playTone(880, 0.2, 'sine', 0.2); }
    playUpgrade() { this.playTone(550, 0.1, 'triangle', 0.2); setTimeout(() => this.playTone(770, 0.15, 'triangle', 0.2), 100); }
    playCastleDamage() { this.playTone(150, 0.2, 'sawtooth', 0.3); }
}


// ============================================================
// SECTION 5: MAIN GAME CLASS
// ============================================================

class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.audio = new AudioSystem();

        // State
        this.state = 'menu'; // menu, playing, paused, gameOver, victory
        this.mode = 'campaign'; // campaign, endless
        this.gold = CONFIG.STARTING_GOLD;
        this.lives = CONFIG.STARTING_LIVES;
        this.score = 0;
        this.wave = 0;
        this.totalWaves = CONFIG.TOTAL_CAMPAIGN_WAVES;
        this.gameSpeed = 1;
        this.baseSpeed = 1;

        // Map
        this.map = null;
        this.mapCols = 0;
        this.mapRows = 0;

        // Entities
        this.towers = [];
        this.enemies = [];
        this.projectiles = [];
        this.particles = [];

        // Wave spawning
        this.waveActive = false;
        this.waveEnemyQueue = [];
        this.waveSpawnTimer = 0;
        this.waveSpawnDelay = 1;
        this.totalWaveEnemies = 0;
        this.killedThisWave = 0;
        this.passedThisWave = 0;

        // Hero
        this.selectedHero = 'knight';
        this.hero = null;
        this.heroLevel = 1;
        this.heroXp = 0;
        this.heroXpToNext = CONFIG.XP_LEVEL_BASE;
        this.abilityCooldowns = [0, 0, 0];
        this.abilityTargetMode = -1; // -1 = none, 0/1/2 = which ability

        // Active buffs (from abilities)
        this.activeBuffs = {
            towerSpeed: 0, towerSpeedValue: 0,
            shield: 0, shieldValue: 0,
            crit: 0, critValue: 0,
            absorb: 0, absorbCharges: 0,
            storm: 0, stormValue: 0, stormTimer: 0,
        };

        // Building
        this.selectedTowerType = null;
        this.selectedTower = null; // existing tower
        this.hoveredCell = null;

        // Settings
        this.showGrid = true;
        this.showRanges = false;
        this.particlesEnabled = true;

        // Stats tracking
        this.stats = { towersBuilt: 0, totalKills: 0 };

        // Timing
        this.lastTime = 0;
        this.animFrame = null;

        // Endless mode
        this.endlessWaveNum = 0;

        this.init();
    }

    init() {
        this.setupMenuEvents();
        this.setupGameEvents();
        this.setupHotkeys();
        this.setupTutorial();
        this.setupSettings();
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    // ---- MENU ----

    setupMenuEvents() {
        document.getElementById('btn-new-game').addEventListener('click', () => {
            this.audio.init();
            this.mode = 'campaign';
            this.startGame();
        });
        document.getElementById('btn-endless').addEventListener('click', () => {
            this.audio.init();
            this.mode = 'endless';
            this.startGame();
        });
        document.getElementById('btn-tutorial').addEventListener('click', () => {
            this.showScreen('tutorial-screen');
        });
        document.getElementById('btn-settings').addEventListener('click', () => {
            this.showScreen('settings-screen');
        });

        // Hero selection
        document.getElementById('hero-roster').addEventListener('click', (e) => {
            const card = e.target.closest('.hero-card');
            if (!card) return;
            document.querySelectorAll('.hero-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            this.selectedHero = card.dataset.hero;
        });
    }

    showScreen(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    }

    // ---- TUTORIAL ----

    setupTutorial() {
        let page = 0;
        const pages = document.querySelectorAll('.tutorial-page');
        const total = pages.length;
        const dotsContainer = document.getElementById('tutorial-dots');

        // Create dots
        for (let i = 0; i < total; i++) {
            const dot = document.createElement('div');
            dot.className = 'tutorial-dot' + (i === 0 ? ' active' : '');
            dotsContainer.appendChild(dot);
        }
        const dots = dotsContainer.querySelectorAll('.tutorial-dot');

        const updatePage = () => {
            pages.forEach((p, i) => {
                p.classList.toggle('active', i === page);
            });
            dots.forEach((d, i) => {
                d.classList.toggle('active', i === page);
            });
            document.getElementById('tutorial-prev').disabled = page === 0;
            document.getElementById('tutorial-next').textContent = page === total - 1 ? 'Finish →' : 'Next →';
        };

        document.getElementById('tutorial-prev').addEventListener('click', () => {
            if (page > 0) { page--; updatePage(); }
        });
        document.getElementById('tutorial-next').addEventListener('click', () => {
            if (page < total - 1) { page++; updatePage(); }
            else { page = 0; updatePage(); this.showScreen('main-menu'); }
        });
        document.getElementById('tutorial-close').addEventListener('click', () => {
            page = 0; updatePage();
            this.showScreen('main-menu');
        });
    }

    // ---- SETTINGS ----

    setupSettings() {
        const volSlider = document.getElementById('setting-volume');
        const sfxSlider = document.getElementById('setting-sfx');
        const volVal = document.getElementById('volume-val');
        const sfxVal = document.getElementById('sfx-val');

        volSlider.addEventListener('input', () => {
            volVal.textContent = volSlider.value + '%';
            this.audio.setMasterVolume(volSlider.value / 100);
        });
        sfxSlider.addEventListener('input', () => {
            sfxVal.textContent = sfxSlider.value + '%';
            this.audio.setSfxVolume(sfxSlider.value / 100);
        });

        document.querySelectorAll('.speed-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.baseSpeed = parseInt(btn.dataset.speed);
                this.gameSpeed = this.baseSpeed;
            });
        });

        document.getElementById('setting-grid').addEventListener('change', (e) => {
            this.showGrid = e.target.checked;
        });
        document.getElementById('setting-ranges').addEventListener('change', (e) => {
            this.showRanges = e.target.checked;
        });
        document.getElementById('setting-particles').addEventListener('change', (e) => {
            this.particlesEnabled = e.target.checked;
        });

        document.getElementById('settings-close').addEventListener('click', () => {
            this.showScreen('main-menu');
        });
    }

    // ---- GAME START ----

    startGame() {
        this.gold = CONFIG.STARTING_GOLD;
        this.lives = CONFIG.STARTING_LIVES;
        this.score = 0;
        this.wave = 0;
        this.towers = [];
        this.enemies = [];
        this.projectiles = [];
        this.particles = [];
        this.waveActive = false;
        this.waveEnemyQueue = [];
        this.selectedTowerType = null;
        this.selectedTower = null;
        this.hoveredCell = null;
        this.stats = { towersBuilt: 0, totalKills: 0 };
        this.endlessWaveNum = 0;
        this.abilityTargetMode = -1;

        // Hero setup
        this.hero = HERO_DATA[this.selectedHero];
        this.heroLevel = 1;
        this.heroXp = 0;
        this.heroXpToNext = CONFIG.XP_LEVEL_BASE;
        this.abilityCooldowns = [0, 0, 0];
        this.activeBuffs = {
            towerSpeed: 0, towerSpeedValue: 0,
            shield: 0, shieldValue: 0,
            crit: 0, critValue: 0,
            absorb: 0, absorbCharges: 0,
            storm: 0, stormValue: 0, stormTimer: 0,
        };

        // Update hero HUD
        document.getElementById('hero-portrait-hud').textContent = this.hero.icon;
        this.hero.abilities.forEach((ab, i) => {
            document.getElementById(`ability-icon-${i}`).textContent = ab.icon;
        });

        this.totalWaves = this.mode === 'campaign' ? CONFIG.TOTAL_CAMPAIGN_WAVES : 999;

        this.resizeCanvas();
        this.generateMap();
        this.updateHUD();
        this.showScreen('game-screen');
        this.state = 'playing';

        // Start game loop
        this.lastTime = performance.now();
        if (this.animFrame) cancelAnimationFrame(this.animFrame);
        this.gameLoop();
    }

    generateMap() {
        const gs = CONFIG.GRID_SIZE;
        this.mapCols = Math.floor(this.canvas.width / gs);
        this.mapRows = Math.floor(this.canvas.height / gs);
        this.mapCols = Math.max(15, this.mapCols);
        this.mapRows = Math.max(10, this.mapRows);
        this.map = new GameMap(this.mapCols, this.mapRows);
    }

    resizeCanvas() {
        const area = document.querySelector('.game-area');
        if (!area) return;
        const rect = area.getBoundingClientRect();
        this.canvas.width = Math.max(CONFIG.CANVAS_MIN_WIDTH, rect.width);
        this.canvas.height = Math.max(CONFIG.CANVAS_MIN_HEIGHT, rect.height);
    }

    // ---- GAME EVENTS ----

    setupGameEvents() {
        // Canvas click
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleCanvasMove(e));
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.cancelSelection();
        });

        // Tower build slots
        document.getElementById('tower-build-bar').addEventListener('click', (e) => {
            const slot = e.target.closest('.tower-slot');
            if (!slot) return;
            this.selectTowerType(slot.dataset.tower);
        });

        // Ability slots
        document.getElementById('hero-abilities-bar').addEventListener('click', (e) => {
            const slot = e.target.closest('.ability-slot');
            if (!slot) return;
            this.activateAbility(parseInt(slot.dataset.ability));
        });

        // Top HUD buttons
        document.getElementById('btn-pause').addEventListener('click', () => this.togglePause());
        document.getElementById('btn-fast').addEventListener('click', () => this.toggleSpeed());
        document.getElementById('btn-next-wave').addEventListener('click', () => this.startNextWave());

        // Tower info panel buttons
        document.getElementById('tower-info-close').addEventListener('click', () => this.closeTowerInfo());
        document.getElementById('btn-upgrade-tower').addEventListener('click', () => this.upgradeSelectedTower());
        document.getElementById('btn-sell-tower').addEventListener('click', () => this.sellSelectedTower());
        document.getElementById('btn-evolve-tower').addEventListener('click', () => this.showEvolveOptions());

        // Pause overlay
        document.getElementById('btn-resume').addEventListener('click', () => this.togglePause());
        document.getElementById('btn-restart').addEventListener('click', () => this.startGame());
        document.getElementById('btn-quit').addEventListener('click', () => this.quitToMenu());

        // Wave complete
        document.getElementById('btn-wave-continue').addEventListener('click', () => {
            document.getElementById('wave-complete-overlay').classList.add('hidden');
        });

        // Game over
        document.getElementById('btn-retry').addEventListener('click', () => this.startGame());
        document.getElementById('btn-back-menu').addEventListener('click', () => this.quitToMenu());

        // Victory
        document.getElementById('btn-victory-menu').addEventListener('click', () => this.quitToMenu());
    }

    setupHotkeys() {
        document.addEventListener('keydown', (e) => {
            if (this.state !== 'playing') {
                if (e.key === 'Escape') {
                    if (this.state === 'paused') this.togglePause();
                }
                return;
            }

            switch (e.key) {
                case '1': case '2': case '3': case '4':
                case '5': case '6': case '7': case '8': {
                    const types = ['archer', 'mage', 'cannon', 'frost', 'lightning', 'poison', 'holy', 'necro'];
                    this.selectTowerType(types[parseInt(e.key) - 1]);
                    break;
                }
                case 'q': case 'Q': this.activateAbility(0); break;
                case 'w': case 'W': this.activateAbility(1); break;
                case 'e': case 'E': this.activateAbility(2); break;
                case ' ': e.preventDefault(); this.togglePause(); break;
                case 'f': case 'F': this.toggleSpeed(); break;
                case 'n': case 'N': this.startNextWave(); break;
                case 'Escape': this.cancelSelection(); break;
                case 'u': case 'U':
                    if (this.selectedTower) this.upgradeSelectedTower();
                    break;
                case 's': case 'S':
                    if (this.selectedTower) this.sellSelectedTower();
                    break;
            }
        });
    }

    // ---- INPUT HANDLING ----

    getCanvasPos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) * (this.canvas.width / rect.width),
            y: (e.clientY - rect.top) * (this.canvas.height / rect.height),
        };
    }

    handleCanvasClick(e) {
        if (this.state !== 'playing') return;
        const pos = this.getCanvasPos(e);
        const gs = CONFIG.GRID_SIZE;
        const col = Math.floor(pos.x / gs);
        const row = Math.floor(pos.y / gs);

        // Ability target mode (AoE targeting)
        if (this.abilityTargetMode >= 0) {
            this.executeAbility(this.abilityTargetMode, pos.x, pos.y);
            this.abilityTargetMode = -1;
            this.canvas.style.cursor = 'crosshair';
            return;
        }

        // Check if clicking existing tower
        const clickedTower = this.towers.find(t => t.col === col && t.row === row);
        if (clickedTower) {
            this.selectExistingTower(clickedTower);
            return;
        }

        // Try to build
        if (this.selectedTowerType && this.map.isBuildable(col, row)) {
            this.buildTower(col, row);
            return;
        }

        // Deselect
        this.cancelSelection();
    }

    handleCanvasMove(e) {
        if (this.state !== 'playing') return;
        const pos = this.getCanvasPos(e);
        const gs = CONFIG.GRID_SIZE;
        this.hoveredCell = {
            col: Math.floor(pos.x / gs),
            row: Math.floor(pos.y / gs),
            x: pos.x,
            y: pos.y
        };
    }

    cancelSelection() {
        this.selectedTowerType = null;
        this.selectedTower = null;
        this.abilityTargetMode = -1;
        document.querySelectorAll('.tower-slot').forEach(s => s.classList.remove('selected'));
        document.querySelectorAll('.ability-slot').forEach(s => s.classList.remove('active-ability'));
        document.getElementById('tower-info-panel').classList.add('hidden');
        this.canvas.style.cursor = 'crosshair';
    }

    selectTowerType(type) {
        this.selectedTower = null;
        document.getElementById('tower-info-panel').classList.add('hidden');

        const data = TOWER_DATA[type];
        let cost = data.cost;
        if (this.hero && this.hero.passive.type === 'buildCost') {
            cost = Math.floor(cost * (1 + this.hero.passive.value));
        }

        if (this.gold < cost) {
            // Can't afford
            this.selectedTowerType = null;
            document.querySelectorAll('.tower-slot').forEach(s => s.classList.remove('selected'));
            return;
        }

        if (this.selectedTowerType === type) {
            // Deselect
            this.selectedTowerType = null;
            document.querySelectorAll('.tower-slot').forEach(s => s.classList.remove('selected'));
            return;
        }

        this.selectedTowerType = type;
        document.querySelectorAll('.tower-slot').forEach(s => {
            s.classList.toggle('selected', s.dataset.tower === type);
        });
        this.canvas.style.cursor = 'cell';
    }

    selectExistingTower(tower) {
        this.selectedTowerType = null;
        document.querySelectorAll('.tower-slot').forEach(s => s.classList.remove('selected'));
        this.selectedTower = tower;
        this.updateTowerInfoPanel(tower);
        this.canvas.style.cursor = 'pointer';
    }

    // ---- BUILDING ----

    buildTower(col, row) {
        const type = this.selectedTowerType;
        const data = TOWER_DATA[type];
        let cost = data.cost;
        if (this.hero && this.hero.passive.type === 'buildCost') {
            cost = Math.floor(cost * (1 + this.hero.passive.value));
        }

        if (this.gold < cost) return;

        this.gold -= cost;
        const tower = new Tower(type, col, row, this.hero ? this.hero.passive : null);
        // Adjust totalSpent if discounted
        tower.totalSpent = cost;
        this.towers.push(tower);
        this.map.grid[row][col] = 4; // Mark as occupied by tower
        this.stats.towersBuilt++;

        this.audio.playBuild();
        this.updateHUD();
        this.updateBuildBar();
    }

    upgradeSelectedTower() {
        if (!this.selectedTower) return;
        const tower = this.selectedTower;
        const cost = tower.getUpgradeCost();
        if (cost === null || this.gold < cost) return;

        this.gold -= cost;
        tower.upgrade();
        this.audio.playUpgrade();
        this.updateTowerInfoPanel(tower);
        this.updateHUD();
    }

    sellSelectedTower() {
        if (!this.selectedTower) return;
        const tower = this.selectedTower;
        const refund = tower.getSellValue();
        this.gold += refund;
        this.map.grid[tower.row][tower.col] = 0;
        this.towers = this.towers.filter(t => t !== tower);
        this.audio.playSell();
        this.spawnFloatNumber(tower.x, tower.y, refund, 'gold');
        this.cancelSelection();
        this.updateHUD();
        this.updateBuildBar();
    }

    showEvolveOptions() {
        if (!this.selectedTower || !this.selectedTower.canEvolve()) return;
        const evolutions = this.selectedTower.getEvolutions();
        const container = document.getElementById('evolve-choices');
        container.innerHTML = '';

        evolutions.forEach(evo => {
            const btn = document.createElement('button');
            btn.className = 'evolve-choice-btn';
            btn.innerHTML = `${evo.icon} <strong>${evo.name}</strong> (${evo.cost}g)<br><small>${evo.special}</small>`;
            btn.addEventListener('click', () => {
                if (this.gold < evo.cost) return;
                this.gold -= evo.cost;
                this.selectedTower.evolve(evo.key);
                this.audio.playUpgrade();
                document.getElementById('evolve-options').classList.add('hidden');
                this.updateTowerInfoPanel(this.selectedTower);
                this.updateHUD();
            });
            container.appendChild(btn);
        });

        document.getElementById('evolve-options').classList.remove('hidden');
    }

    // ---- TOWER INFO PANEL ----

    updateTowerInfoPanel(tower) {
        const panel = document.getElementById('tower-info-panel');
        panel.classList.remove('hidden');

        document.getElementById('tower-info-icon').textContent = tower.icon;
        document.getElementById('tower-info-name').textContent = tower.name;
        document.getElementById('tower-info-level').textContent = tower.evolved ? 'Evolved' : `Lv ${tower.level}`;

        document.getElementById('tower-stat-dmg').textContent = Math.floor(tower.damage);
        document.getElementById('tower-stat-spd').textContent = tower.speed.toFixed(2) + 's';
        document.getElementById('tower-stat-rng').textContent = Math.floor(tower.range);
        document.getElementById('tower-stat-kills').textContent = tower.kills;
        document.getElementById('tower-stat-value').textContent = tower.totalSpent + 'g';

        const upgCost = tower.getUpgradeCost();
        const upgBtn = document.getElementById('btn-upgrade-tower');
        const evolveBtn = document.getElementById('btn-evolve-tower');
        const sellBtn = document.getElementById('btn-sell-tower');

        if (upgCost !== null) {
            upgBtn.classList.remove('hidden');
            document.getElementById('upgrade-cost').textContent = upgCost + 'g';
            upgBtn.disabled = this.gold < upgCost;
        } else {
            upgBtn.classList.add('hidden');
        }

        if (tower.canEvolve()) {
            evolveBtn.classList.remove('hidden');
            const evos = tower.getEvolutions();
            const minCost = Math.min(...evos.map(e => e.cost));
            document.getElementById('evolve-cost').textContent = minCost + 'g+';
        } else {
            evolveBtn.classList.add('hidden');
        }

        document.getElementById('sell-value').textContent = tower.getSellValue() + 'g';
        document.getElementById('evolve-options').classList.add('hidden');
    }

    closeTowerInfo() {
        this.selectedTower = null;
        document.getElementById('tower-info-panel').classList.add('hidden');
    }

    // ---- ABILITIES ----

    activateAbility(index) {
        if (!this.hero || this.state !== 'playing') return;
        if (this.abilityCooldowns[index] > 0) return;

        const ability = this.hero.abilities[index];

        // Some abilities need targeting
        if (ability.type === 'aoe_damage' || ability.type === 'trap') {
            this.abilityTargetMode = index;
            document.querySelectorAll('.ability-slot').forEach((s, i) => {
                s.classList.toggle('active-ability', i === index);
            });
            this.canvas.style.cursor = 'crosshair';
            return;
        }

        // Instant abilities
        this.executeAbility(index);
    }

    executeAbility(index, targetX, targetY) {
        const ability = this.hero.abilities[index];
        this.abilityCooldowns[index] = ability.cooldown;
        this.audio.playAbility();

        document.querySelectorAll('.ability-slot').forEach(s => s.classList.remove('active-ability'));

        switch (ability.type) {
            case 'buff_speed':
                this.activeBuffs.towerSpeed = ability.duration;
                this.activeBuffs.towerSpeedValue = ability.value;
                break;
            case 'shield':
                this.activeBuffs.shield = ability.duration;
                this.activeBuffs.shieldValue = ability.value;
                break;
            case 'damage_all':
                for (const e of this.enemies) {
                    if (e.alive) {
                        e.takeDamage(ability.value * (1 + (this.heroLevel - 1) * 0.1), 'holy', this);
                    }
                }
                break;
            case 'aoe_damage':
                if (targetX !== undefined) {
                    const radius = ability.radius || 80;
                    for (const e of this.enemies) {
                        if (!e.alive) continue;
                        const dx = e.x - targetX;
                        const dy = e.y - targetY;
                        if (Math.sqrt(dx * dx + dy * dy) <= radius) {
                            e.takeDamage(ability.value * (1 + (this.heroLevel - 1) * 0.1), 'magic', this);
                        }
                    }
                    this.particles.push(new Particle(targetX, targetY, radius, '#ff4400', 'explosion'));
                }
                break;
            case 'absorb':
                this.activeBuffs.absorb = ability.duration;
                this.activeBuffs.absorbCharges = ability.value;
                break;
            case 'storm':
                this.activeBuffs.storm = ability.duration;
                this.activeBuffs.stormValue = ability.value * (1 + (this.heroLevel - 1) * 0.1);
                this.activeBuffs.stormTimer = 0;
                break;
            case 'buff_crit':
                this.activeBuffs.crit = ability.duration;
                this.activeBuffs.critValue = ability.value;
                break;
            case 'trap':
                if (targetX !== undefined) {
                    // Stun enemies near the trap location
                    for (const e of this.enemies) {
                        if (!e.alive) continue;
                        const dx = e.x - targetX;
                        const dy = e.y - targetY;
                        if (Math.sqrt(dx * dx + dy * dy) <= 60) {
                            e.applyStun(ability.value);
                        }
                    }
                    this.particles.push(new Particle(targetX, targetY, 60, '#ffaa22', 'explosion'));
                }
                break;
            case 'overclock':
                // Buff closest tower to center or selected tower
                if (this.selectedTower) {
                    this.selectedTower.speedBuff = ability.value;
                    setTimeout(() => {
                        if (this.selectedTower) this.selectedTower.speedBuff = 0;
                    }, ability.duration * 1000);
                }
                break;
            case 'gold':
                this.gold += ability.value + this.heroLevel * 10;
                this.spawnFloatNumber(this.canvas.width / 2, this.canvas.height / 2, ability.value + this.heroLevel * 10, 'gold');
                break;
        }
    }

    updateAbilityCooldowns(dt) {
        for (let i = 0; i < 3; i++) {
            if (this.abilityCooldowns[i] > 0) {
                this.abilityCooldowns[i] = Math.max(0, this.abilityCooldowns[i] - dt);
            }
            // Update UI
            const cd = this.abilityCooldowns[i];
            const maxCd = this.hero.abilities[i].cooldown;
            const ratio = cd / maxCd;
            document.getElementById(`ability-cd-${i}`).style.height = (ratio * 100) + '%';

            const slot = document.querySelectorAll('.ability-slot')[i];
            slot.classList.toggle('on-cooldown', cd > 0);
        }
    }

    updateActiveBuffs(dt) {
        if (this.activeBuffs.towerSpeed > 0) this.activeBuffs.towerSpeed -= dt;
        if (this.activeBuffs.shield > 0) this.activeBuffs.shield -= dt;
        if (this.activeBuffs.crit > 0) this.activeBuffs.crit -= dt;
        if (this.activeBuffs.absorb > 0) this.activeBuffs.absorb -= dt;

        // Storm effect
        if (this.activeBuffs.storm > 0) {
            this.activeBuffs.storm -= dt;
            this.activeBuffs.stormTimer -= dt;
            if (this.activeBuffs.stormTimer <= 0) {
                this.activeBuffs.stormTimer = 0.5;
                // Random lightning strike
                const alive = this.enemies.filter(e => e.alive);
                if (alive.length > 0) {
                    const target = alive[Math.floor(Math.random() * alive.length)];
                    target.takeDamage(this.activeBuffs.stormValue, 'magic', this);
                    this.particles.push(new Particle(target.x, target.y, 30, '#ffee44', 'spark'));
                }
            }
        }
    }

    // ---- HERO XP ----

    addHeroXp(amount) {
        if (this.heroLevel >= CONFIG.MAX_HERO_LEVEL) return;
        this.heroXp += amount;
        while (this.heroXp >= this.heroXpToNext && this.heroLevel < CONFIG.MAX_HERO_LEVEL) {
            this.heroXp -= this.heroXpToNext;
            this.heroLevel++;
            this.heroXpToNext = Math.floor(CONFIG.XP_LEVEL_BASE * Math.pow(CONFIG.XP_LEVEL_SCALING, this.heroLevel - 1));
            // Level up bonus
            this.gold += 25;
            this.spawnFloatNumber(this.canvas.width / 2, 50, 0, 'gold');
        }
        this.updateHeroHUD();
    }

    updateHeroHUD() {
        document.getElementById('hero-level-text').textContent = `Lv ${this.heroLevel}`;
        const ratio = this.heroLevel >= CONFIG.MAX_HERO_LEVEL ? 1 : this.heroXp / this.heroXpToNext;
        document.getElementById('hero-xp-fill').style.width = (ratio * 100) + '%';
    }

    // ---- WAVES ----

    startNextWave() {
        if (this.waveActive) return;
        if (this.mode === 'campaign' && this.wave >= this.totalWaves) return;

        this.wave++;
        this.waveActive = true;
        this.killedThisWave = 0;
        this.passedThisWave = 0;

        let waveDef;
        if (this.mode === 'campaign' && this.wave <= WAVE_DEFS.length) {
            waveDef = WAVE_DEFS[this.wave - 1];
        } else {
            waveDef = this.generateEndlessWave();
        }

        this.waveEnemyQueue = [];
        this.waveSpawnDelay = waveDef.delay || 0.8;

        // Build enemy queue
        for (const group of waveDef.enemies) {
            for (let i = 0; i < group.count; i++) {
                this.waveEnemyQueue.push(group.type);
            }
        }
        // Add boss if present
        if (waveDef.boss) {
            // Boss comes at the end
            this.waveEnemyQueue.push(waveDef.boss);
        }

        // Shuffle slightly for variety (but keep boss at end)
        const hassBoss = waveDef.boss ? this.waveEnemyQueue.pop() : null;
        for (let i = this.waveEnemyQueue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.waveEnemyQueue[i], this.waveEnemyQueue[j]] = [this.waveEnemyQueue[j], this.waveEnemyQueue[i]];
        }
        if (hassBoss) this.waveEnemyQueue.push(hassBoss);

        this.totalWaveEnemies = this.waveEnemyQueue.length;
        this.waveSpawnTimer = 0;

        // Boss HP multiplier
        this.currentWaveBossHpMul = waveDef.bossHpMul || 1;

        this.audio.playWaveStart();
        this.updateHUD();

        document.getElementById('btn-next-wave').classList.remove('pulse');
    }

    generateEndlessWave() {
        this.endlessWaveNum++;
        const types = Object.keys(ENEMY_TYPES).filter(t => !ENEMY_TYPES[t].boss);
        const bossTypes = Object.keys(ENEMY_TYPES).filter(t => ENEMY_TYPES[t].boss);

        // Random mix of enemies, scaling count
        const numGroups = 2 + Math.floor(this.endlessWaveNum / 5);
        const enemies = [];
        for (let i = 0; i < numGroups; i++) {
            const type = types[Math.floor(Math.random() * types.length)];
            const count = 5 + Math.floor(this.endlessWaveNum * 1.5);
            enemies.push({ type, count });
        }

        const hasBoss = this.endlessWaveNum % 5 === 0;
        return {
            enemies,
            delay: Math.max(0.2, 0.8 - this.endlessWaveNum * 0.02),
            boss: hasBoss ? bossTypes[Math.floor(Math.random() * bossTypes.length)] : null,
            bossHpMul: 1 + this.endlessWaveNum * 0.2,
        };
    }

    spawnEnemy(type) {
        const scaling = this.mode === 'endless' ? Math.pow(CONFIG.ENDLESS_SCALING, this.endlessWaveNum) : 1;
        const enemy = new Enemy(type, this.wave, scaling);
        const spawn = this.map.getSpawnPoint();
        enemy.x = spawn.x;
        enemy.y = spawn.y;

        // Boss HP multiplier for campaign
        if (ENEMY_TYPES[type].boss && this.currentWaveBossHpMul) {
            enemy.maxHp = Math.floor(enemy.maxHp * this.currentWaveBossHpMul);
            enemy.hp = enemy.maxHp;
        }

        this.enemies.push(enemy);
    }

    updateWaveSpawning(dt) {
        if (!this.waveActive || this.waveEnemyQueue.length === 0) return;

        this.waveSpawnTimer -= dt;
        if (this.waveSpawnTimer <= 0) {
            const type = this.waveEnemyQueue.shift();
            this.spawnEnemy(type);
            this.waveSpawnTimer = this.waveSpawnDelay;
        }
    }

    checkWaveComplete() {
        if (!this.waveActive) return;
        if (this.waveEnemyQueue.length > 0) return;

        // Check if all spawned enemies are dead or passed
        const activeEnemies = this.enemies.filter(e => e.alive);
        if (activeEnemies.length === 0) {
            this.waveActive = false;

            // Wave rewards
            const goldReward = CONFIG.WAVE_BONUS_GOLD + this.wave * CONFIG.WAVE_BONUS_GOLD_SCALING;
            const scoreReward = this.killedThisWave * 10 + this.wave * 50;
            const xpReward = CONFIG.XP_PER_KILL * this.killedThisWave + this.wave * 5;

            this.gold += goldReward;
            this.score += scoreReward;
            this.addHeroXp(xpReward);

            // Show wave complete
            this.audio.playWaveComplete();
            document.getElementById('wave-complete-title').textContent = `🌊 Wave ${this.wave} Complete!`;
            document.getElementById('wave-gold-reward').textContent = `+${goldReward}`;
            document.getElementById('wave-score-reward').textContent = `+${scoreReward}`;
            document.getElementById('wave-xp-reward').textContent = `+${xpReward}`;
            document.getElementById('wave-complete-overlay').classList.remove('hidden');

            // Check victory
            if (this.mode === 'campaign' && this.wave >= this.totalWaves) {
                setTimeout(() => {
                    document.getElementById('wave-complete-overlay').classList.add('hidden');
                    this.triggerVictory();
                }, 1500);
            } else {
                document.getElementById('btn-next-wave').classList.add('pulse');
            }

            this.updateHUD();
            this.updateBuildBar();
        }
    }

    // ---- GAME OVER / VICTORY ----

    triggerGameOver() {
        this.state = 'gameOver';
        this.audio.playGameOver();

        document.getElementById('final-waves').textContent = this.wave;
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('final-towers').textContent = this.stats.towersBuilt;
        document.getElementById('final-kills').textContent = this.stats.totalKills;
        document.getElementById('final-hero-level').textContent = this.heroLevel;

        document.getElementById('game-over-overlay').classList.remove('hidden');
    }

    triggerVictory() {
        this.state = 'victory';
        this.audio.playVictory();

        document.getElementById('victory-score').textContent = this.score;
        document.getElementById('victory-lives').textContent = Math.floor(this.lives);
        document.getElementById('victory-kills').textContent = this.stats.totalKills;
        document.getElementById('victory-hero-level').textContent = this.heroLevel;

        // Star rating
        const stars = document.querySelectorAll('.star-rating .star');
        const livesRatio = this.lives / CONFIG.STARTING_LIVES;
        const earned = livesRatio >= 0.9 ? 3 : livesRatio >= 0.5 ? 2 : 1;
        stars.forEach((s, i) => {
            s.classList.toggle('earned', i < earned);
            s.classList.toggle('unearned', i >= earned);
            if (i < earned) {
                s.style.animationDelay = (i * 0.3) + 's';
            }
        });

        document.getElementById('victory-overlay').classList.remove('hidden');
    }

    quitToMenu() {
        this.state = 'menu';
        if (this.animFrame) cancelAnimationFrame(this.animFrame);
        document.querySelectorAll('.overlay').forEach(o => o.classList.add('hidden'));
        this.showScreen('main-menu');
    }

    togglePause() {
        if (this.state === 'playing') {
            this.state = 'paused';
            document.getElementById('pause-overlay').classList.remove('hidden');
        } else if (this.state === 'paused') {
            this.state = 'playing';
            document.getElementById('pause-overlay').classList.add('hidden');
            this.lastTime = performance.now();
            this.gameLoop();
        }
    }

    toggleSpeed() {
        if (this.gameSpeed === this.baseSpeed) {
            this.gameSpeed = this.baseSpeed * 2;
            document.getElementById('btn-fast').textContent = '⏩⏩';
        } else {
            this.gameSpeed = this.baseSpeed;
            document.getElementById('btn-fast').textContent = '⏩';
        }
    }

    // ---- HUD UPDATES ----

    updateHUD() {
        document.getElementById('hud-gold').textContent = Math.floor(this.gold);
        document.getElementById('hud-lives').textContent = Math.floor(this.lives);
        document.getElementById('hud-wave').textContent = this.wave;
        document.getElementById('hud-total-waves').textContent = this.mode === 'endless' ? '∞' : this.totalWaves;
        document.getElementById('hud-score').textContent = this.score;
        this.updateBuildBar();
    }

    updateBuildBar() {
        document.querySelectorAll('.tower-slot').forEach(slot => {
            const type = slot.dataset.tower;
            const data = TOWER_DATA[type];
            let cost = data.cost;
            if (this.hero && this.hero.passive.type === 'buildCost') {
                cost = Math.floor(cost * (1 + this.hero.passive.value));
            }
            slot.classList.toggle('disabled', this.gold < cost);
        });
    }

    updateWaveProgress() {
        if (!this.waveActive) {
            document.getElementById('wave-progress-fill').style.width = '0%';
            document.getElementById('wave-progress-text').textContent = this.wave === 0 ? 'Ready to start!' : 'Wave complete';
            return;
        }

        const spawned = this.totalWaveEnemies - this.waveEnemyQueue.length;
        const cleared = this.killedThisWave + this.passedThisWave;
        const progress = this.totalWaveEnemies > 0 ? (cleared / this.totalWaveEnemies) * 100 : 0;

        document.getElementById('wave-progress-fill').style.width = progress + '%';
        document.getElementById('wave-progress-text').textContent =
            `${cleared}/${this.totalWaveEnemies} cleared (${spawned} spawned)`;
    }

    // ---- FLOAT NUMBERS ----

    spawnFloatNumber(x, y, value, type = 'damage') {
        const container = document.getElementById('float-numbers');
        const el = document.createElement('div');
        el.className = 'float-number';
        if (type === 'gold') el.classList.add('gold');
        if (type === 'heal') el.classList.add('heal');
        if (type === 'crit') el.classList.add('crit');

        const prefix = type === 'gold' ? '+' : type === 'heal' ? '+' : '-';
        el.textContent = prefix + Math.floor(value);

        // Convert canvas coords to screen coords
        const rect = this.canvas.getBoundingClientRect();
        const sx = rect.left + (x / this.canvas.width) * rect.width;
        const sy = rect.top + (y / this.canvas.height) * rect.height;
        el.style.left = sx + 'px';
        el.style.top = sy + 'px';

        container.appendChild(el);
        setTimeout(() => el.remove(), 1000);
    }

    // ---- MAIN GAME LOOP ----

    gameLoop() {
        if (this.state !== 'playing') return;

        const now = performance.now();
        let dt = (now - this.lastTime) / 1000;
        this.lastTime = now;

        // Clamp dt
        dt = Math.min(dt, 0.1) * this.gameSpeed;

        this.update(dt);
        this.render();

        this.animFrame = requestAnimationFrame(() => this.gameLoop());
    }

    update(dt) {
        // Spawn enemies
        this.updateWaveSpawning(dt);

        // Reset tower buffs each frame (will be reapplied by aura towers)
        for (const t of this.towers) {
            if (t.evolutionType !== 'tesla') t.speedBuff = 0;
            if (t.evolutionType !== 'temple') t.damageBuff = 0;
        }

        // Update towers
        for (const tower of this.towers) {
            tower.update(dt, this.enemies, this.map.path, this);
        }

        // Update enemies
        for (const enemy of this.enemies) {
            enemy.update(dt, this.map.path);
            if (!enemy.alive && !enemy.reachedEnd) {
                // Killed
                this.gold += enemy.reward;
                this.score += enemy.reward * 2;
                this.stats.totalKills++;
                this.killedThisWave++;
                this.addHeroXp(CONFIG.XP_PER_KILL);
                this.audio.playEnemyDeath();
                this.spawnFloatNumber(enemy.x, enemy.y, enemy.reward, 'gold');
            }
            if (enemy.reachedEnd) {
                // Absorb check
                if (this.activeBuffs.absorb > 0 && this.activeBuffs.absorbCharges > 0) {
                    this.activeBuffs.absorbCharges--;
                } else {
                    this.lives -= (enemy.boss ? 5 : 1);
                    this.audio.playCastleDamage();
                }
                this.passedThisWave++;
            }
        }

        // Remove dead enemies
        this.enemies = this.enemies.filter(e => e.alive);

        // Update projectiles
        for (const p of this.projectiles) {
            p.update(dt, this);
        }
        this.projectiles = this.projectiles.filter(p => p.alive);

        // Update particles
        if (this.particlesEnabled) {
            for (const p of this.particles) {
                p.update(dt);
            }
            this.particles = this.particles.filter(p => p.alive);
            if (this.particles.length > CONFIG.PARTICLE_LIMIT) {
                this.particles = this.particles.slice(-CONFIG.PARTICLE_LIMIT);
            }
        }

        // Ability cooldowns & buffs
        this.updateAbilityCooldowns(dt);
        this.updateActiveBuffs(dt);

        // Update progress bar
        this.updateWaveProgress();

        // Check game over
        if (this.lives <= 0) {
            this.lives = 0;
            this.triggerGameOver();
            return;
        }

        // Check wave complete
        this.checkWaveComplete();

        // Update HUD (gold/lives may have changed)
        this.updateHUD();
    }

    // ---- RENDERING ----

    render() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const gs = CONFIG.GRID_SIZE;

        ctx.clearRect(0, 0, w, h);

        // Draw map background
        this.drawMap(ctx, gs);

        // Draw grid overlay
        if (this.showGrid) {
            this.drawGrid(ctx, gs, w, h);
        }

        // Draw build preview
        if (this.selectedTowerType && this.hoveredCell) {
            this.drawBuildPreview(ctx, gs);
        }

        // Draw ability target preview
        if (this.abilityTargetMode >= 0 && this.hoveredCell) {
            this.drawAbilityPreview(ctx);
        }

        // Draw towers
        for (const tower of this.towers) {
            const showRange = this.showRanges || (this.selectedTower === tower);
            tower.draw(ctx, showRange, this);
        }

        // Draw enemies
        for (const enemy of this.enemies) {
            enemy.draw(ctx);
        }

        // Draw projectiles
        for (const p of this.projectiles) {
            p.draw(ctx);
        }

        // Draw particles
        if (this.particlesEnabled) {
            for (const p of this.particles) {
                p.draw(ctx);
            }
        }

        // Draw active buff indicators
        this.drawBuffIndicators(ctx, w);

        // Draw castle
        this.drawCastle(ctx, gs);
    }

    drawMap(ctx, gs) {
        const map = this.map;

        for (let r = 0; r < map.rows; r++) {
            for (let c = 0; c < map.cols; c++) {
                const x = c * gs, y = r * gs;
                const cell = map.grid[r][c];

                if (cell === 1 || cell === 3) {
                    // Path
                    ctx.fillStyle = CONFIG.PATH_COLOR;
                    ctx.fillRect(x, y, gs, gs);
                    ctx.strokeStyle = CONFIG.PATH_BORDER_COLOR;
                    ctx.lineWidth = 0.5;
                    ctx.strokeRect(x + 1, y + 1, gs - 2, gs - 2);
                } else {
                    // Grass with variation
                    const ci = (r * 7 + c * 13) % CONFIG.GRASS_COLORS.length;
                    ctx.fillStyle = CONFIG.GRASS_COLORS[ci];
                    ctx.fillRect(x, y, gs, gs);
                }
            }
        }

        // Draw path direction arrows
        const path = map.path;
        for (let i = 0; i < path.length - 1; i += 3) {
            const p = path[i];
            const next = path[Math.min(i + 1, path.length - 1)];
            const dx = next.x - p.x;
            const dy = next.y - p.y;
            const angle = Math.atan2(dy, dx);

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(angle);
            ctx.fillStyle = 'rgba(255,255,255,0.08)';
            ctx.beginPath();
            ctx.moveTo(6, 0);
            ctx.lineTo(-4, -4);
            ctx.lineTo(-4, 4);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    }

    drawGrid(ctx, gs, w, h) {
        ctx.strokeStyle = 'rgba(255,255,255,0.04)';
        ctx.lineWidth = 0.5;
        for (let x = 0; x < w; x += gs) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        for (let y = 0; y < h; y += gs) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }
    }

    drawBuildPreview(ctx, gs) {
        const col = this.hoveredCell.col;
        const row = this.hoveredCell.row;
        const x = col * gs, y = row * gs;
        const canBuild = this.map.isBuildable(col, row);

        // Highlight cell
        ctx.fillStyle = canBuild ? 'rgba(74,255,122,0.2)' : 'rgba(255,74,74,0.2)';
        ctx.fillRect(x, y, gs, gs);
        ctx.strokeStyle = canBuild ? 'rgba(74,255,122,0.5)' : 'rgba(255,74,74,0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, gs, gs);

        // Range preview
        if (canBuild && this.selectedTowerType) {
            const data = TOWER_DATA[this.selectedTowerType];
            let range = data.range;
            if (this.hero && this.hero.passive.type === 'range') {
                range *= (1 + this.hero.passive.value);
            }
            const cx = x + gs / 2, cy = y + gs / 2;
            ctx.strokeStyle = 'rgba(240,192,64,0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(cx, cy, range, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = 'rgba(240,192,64,0.05)';
            ctx.fill();

            // Tower icon preview
            ctx.globalAlpha = 0.6;
            ctx.font = `${gs * 0.45}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(data.icon, cx, cy);
            ctx.globalAlpha = 1;
        }
    }

    drawAbilityPreview(ctx) {
        const ability = this.hero.abilities[this.abilityTargetMode];
        const radius = ability.radius || 60;
        const { x, y } = this.hoveredCell;

        ctx.strokeStyle = 'rgba(255,100,50,0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = 'rgba(255,100,50,0.1)';
        ctx.fill();
    }

    drawCastle(ctx, gs) {
        const castle = this.map.getCastlePoint();
        const x = castle.x, y = castle.y;
        const s = gs * 0.6;

        // Castle body
        ctx.fillStyle = CONFIG.CASTLE_COLOR;
        ctx.fillRect(x - s * 0.7, y - s * 0.8, s * 1.4, s * 1.2);

        // Battlements
        for (let i = -2; i <= 2; i++) {
            ctx.fillRect(x + i * s * 0.28 - 3, y - s * 1.1, 6, s * 0.3);
        }

        // Gate
        ctx.fillStyle = '#3a2a1a';
        ctx.beginPath();
        ctx.arc(x, y + s * 0.2, s * 0.25, Math.PI, 0);
        ctx.fillRect(x - s * 0.25, y + s * 0.2, s * 0.5, s * 0.2);
        ctx.fill();

        // Health indicator glow
        const livesRatio = this.lives / CONFIG.STARTING_LIVES;
        const glowColor = livesRatio > 0.6 ? '70,200,100' : livesRatio > 0.3 ? '255,170,50' : '255,50,50';
        ctx.shadowColor = `rgba(${glowColor},0.5)`;
        ctx.shadowBlur = 15;
        ctx.strokeStyle = `rgba(${glowColor},0.6)`;
        ctx.lineWidth = 2;
        ctx.strokeRect(x - s * 0.8, y - s * 1.2, s * 1.6, s * 1.8);
        ctx.shadowBlur = 0;

        // Castle icon
        ctx.font = `${gs * 0.5}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🏰', x, y - s * 0.3);
    }

    drawBuffIndicators(ctx, w) {
        let yOff = 80;
        const buffs = [];

        if (this.activeBuffs.towerSpeed > 0) buffs.push({ icon: '⚔️', time: this.activeBuffs.towerSpeed, label: 'Rally' });
        if (this.activeBuffs.shield > 0) buffs.push({ icon: '🛡️', time: this.activeBuffs.shield, label: 'Shield' });
        if (this.activeBuffs.crit > 0) buffs.push({ icon: '🦅', time: this.activeBuffs.crit, label: 'Eagle Eye' });
        if (this.activeBuffs.absorb > 0) buffs.push({ icon: '🔵', time: this.activeBuffs.absorb, label: `Absorb (${this.activeBuffs.absorbCharges})` });
        if (this.activeBuffs.storm > 0) buffs.push({ icon: '🌀', time: this.activeBuffs.storm, label: 'Storm' });

        for (const buff of buffs) {
            ctx.fillStyle = 'rgba(20,27,45,0.8)';
            ctx.fillRect(8, yOff, 120, 26);
            ctx.strokeStyle = 'rgba(240,192,64,0.4)';
            ctx.lineWidth = 1;
            ctx.strokeRect(8, yOff, 120, 26);

            ctx.font = '14px sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#f0c040';
            ctx.fillText(`${buff.icon} ${buff.label}`, 14, yOff + 13);

            ctx.font = '11px Inter, sans-serif';
            ctx.fillStyle = '#8890a8';
            ctx.textAlign = 'right';
            ctx.fillText(buff.time.toFixed(1) + 's', 122, yOff + 13);

            yOff += 30;
        }
    }
}


// ============================================================
// SECTION 6: INITIALIZE
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});
