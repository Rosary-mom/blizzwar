# Blizzwar — Lebenswirklichkeit im Spiel

Live: **https://rosary-mom.github.io/blizzwar**  
Repo: https://github.com/Rosary-mom/blizzwar

Hub `index.html` (Projekt Chimera / Mars Mission). 3D-Lauf: `blizzwar-power-action-threejs.html`.

## Imagine Cutscenes

Grok Imagine stills as in-engine clips (Ken Burns). **Video generation is unavailable under zero data retention (ZDR)** — stills are the shipped clips.

| File | Beat |
|------|------|
| `cutscenes/01-colony.jpg` | Mars colony, 1977 practical grain |
| `cutscenes/02-cockpit.jpg` | Lander cockpit |
| `cutscenes/03-vortex.jpg` | Dust vortex around craft |

They play on Power-Action start (skip available) and are linked from the hub.

## Numerical NS (not Clay)

Power-Action uses vorticity × velocity − νv, CFL-clamped dt, viscous ship drag. HUD watch `numerical_ns_blowup` is a **stepper flag**, not a Clay proof.

## Connect to xAI API Using Grok2

- Rename `.envsample` to `.env` and set XAI key value
- Setup virtual environment
- Run: `pip install -r requirements.txt`
