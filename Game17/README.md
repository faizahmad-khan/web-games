# 🏰 Castle Defenders — Tower Defense RPG

A complex, feature-rich tower defense game with RPG elements. Defend your castle from waves of enemies using strategic tower placement, hero abilities, and resource management.

## What's New

- Better accessibility with ARIA labels for menu controls
- Improved keyboard focus visibility for interactive controls
- Reduced motion support via `prefers-reduced-motion`
- Enhanced browser metadata and theme color support
- Footer branding consistency with other upgraded games

## 🎮 Game Features

### Core Gameplay
- **30 Campaign Waves** with escalating difficulty and boss encounters
- **Endless Mode** with procedurally scaling waves
- **8 Unique Tower Types** each with 2 upgrade tiers + 2 evolution paths (16 final forms!)
- **4 Playable Heroes** with unique passive bonuses and 3 active abilities each
- **12 Enemy Types** including 3 epic bosses

### Tower Types
| Tower | Cost | Type | Special |
|-------|------|------|---------|
| 🏹 Archer | 50g | Physical | Fast single-target → Sniper / Rapid |
| 🔮 Mage | 80g | Magic | AoE splash → Archmage / Enchanter |
| 💣 Cannon | 100g | Physical | High damage splash → Mortar / Gatling |
| ❄️ Frost | 70g | Magic | Slows enemies → Blizzard / Cryomancer |
| ⚡ Lightning | 120g | Magic | Chain damage → Storm / Tesla |
| ☠️ Poison | 90g | Magic | DoT damage → Plague / Venom |
| ✝️ Holy | 150g | Holy | Heals & buffs → Paladin / Temple |
| 💀 Necro | 200g | Dark | Drain & summon → Lich / Graveyard |

### Heroes
- **🛡️ Knight** — +20% Tower HP | Rally, Shield Wall, Heroic Strike
- **🧙 Mage** — +15% Magic Damage | Meteor, Mana Shield, Arcane Storm
- **🏹 Ranger** — +25% Range | Arrow Rain, Eagle Eye, Trap
- **⚒️ Engineer** — -15% Build Cost | Overclock, Gold Mine, Bomb

### RPG Progression
- Heroes gain XP from kills and wave completions
- Hero level scales ability power
- Level-up gold bonuses

### Enemy Variety
- **Basic:** Goblins, Skeletons, Wolves
- **Mid-tier:** Orcs, Dark Knights, Dark Mages, Trolls (regeneration!)
- **Elite:** Demons (magic resistant), Dragons
- **Bosses:** Ogre King, Lich Lord, Elder Dragon

## 🎹 Controls

### Keyboard Shortcuts
| Key | Action |
|-----|--------|
| `1-8` | Select tower type |
| `Q/W/E` | Activate hero abilities |
| `Space` | Pause/Resume |
| `F` | Toggle fast forward |
| `N` | Send next wave |
| `U` | Upgrade selected tower |
| `S` | Sell selected tower |
| `Esc` | Cancel selection |
| `Right-click` | Cancel selection |

### Mouse
- **Left-click** empty cell → Place selected tower
- **Left-click** existing tower → Select & view info
- **Left-click** while ability targeting → Cast ability

## 🏗️ Technical Features

- Procedural map generation with winding paths
- Web Audio API for sound effects
- Canvas-based rendering with particles and projectiles
- Tower aura system (Tesla speed buff, Temple damage buff)
- Status effects: slow, stun, DoT, armor debuff, heal reduction
- Responsive design for various screen sizes

## 📁 Files

- `index.html` — Game structure and UI
- `style.css` — Complete styling with dark fantasy theme
- `script.js` — Full game engine (~1800 lines)

## 🚀 How to Play

1. Open `index.html` in a modern browser
2. Choose your hero
3. Click **New Campaign** or **Endless Mode**
4. Place towers on grass tiles along the path
5. Click **Send Wave** (or press `N`) to start each wave
6. Upgrade and evolve towers as you earn gold
7. Use hero abilities strategically to survive tough waves
8. Defend your castle through all 30 waves to achieve victory!

## 📜 License

See [LICENSE](LICENSE) for details.
