# Blizzwar Sharpened Polish Notes (NS Solver + Power-Action)

## Integration to rosary-mom.github.io/blizzwar
- Added "🚀 Power-Action 3D (Photo-Real NS)" button in main action bar linking to blizzwar-power-action-threejs.html
- The new game is self-contained Three.js with XFreeze-inspired cinematic style.
- Synced via git in worktree.

## Further Polish Applied
- **More Levels**: 5 levels with escalating NS complexity:
  1. Low Turb (training)
  2. Mars Vortex (classic)
  3. Singularity Core (high fidelity pull)
  4. Fluid Storm (dense particles, high advection)
  5. Power Singularity (max turb + boss mechanics)
  Levels auto-progress on score thresholds. Different enemy density, turb multipliers, visual shaders.

- **Better NS Solver Fidelity**:
  - Enhanced particle shader with vorticity, advection, diffusion terms closer to Navier-Stokes.
  - Real-time viscosity simulation affecting ship drag and projectile paths.
  - Pressure wave from singularity (affects multiple particles).
  - Improved boundary handling for infinite fluid feel.
  - Turbulence now directly modulates shader noise for more realistic swirling.

- **Leaderboard Sync**:
  - Persistent via localStorage (name + score + level + max_turb).
  - "Sync Leaderboard" button exports JSON for multi-PC (copy to other machine or via grok-sync artifacts).
  - Top 5 displayed in-game.
  - For full MultiPC: Use shared ROSARY-ATLAS/blizzwar/leaderboard.json synced via grok-sync.ps1.

## Superpower-Agent Integration
- New agent in organigramm for visual/power assets.
- Reference prompts generated for stills/video using XFreeze post style.
- Agent can generate assets for cutscenes, thumbnails, loading screens.

## Next (if needed)
- Deploy via Vercel (vercel.json already present).
- Full git push from worktree.
- Test on mobile for photo-real performance.

Synced and orchestrated by GrokSyncMaster.
