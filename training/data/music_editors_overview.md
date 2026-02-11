# C‑64 Music Editors: DMC, JCH, Sidwinder, EMS, Odintracker

**Summary:** Overview of popular C‑64 music editors and players: DMC, JCH (tracker‑like), Sidwinder (highly optimized player with low rastertime), EMS and Odintracker; covers editor style, player rastertime and memory‑usage characteristics.

## Overview
- DMC — traditional C‑64 music editor: displays and edits one sequence/voice at a time. Full sound‑editing capabilities; player delivers reasonable rastertime and memory usage.
- JCH editor — tracker‑like interface (pattern/sequence oriented). Also provides full sound editing; players similarly offer decent rastertime and memory usage.
- Sidwinder (Taki / Natural Beat) — notable primarily for a very optimized player that consumes very little rastertime (CPU time in the raster interrupt).
- EMS (Odie / Cosine) — comparable in capability and performance to DMC and JCH.
- Odintracker — designed for simplicity of use, but its packer is poor (as of source), causing tunes to occupy large amounts of memory; this may change with future updates.

## Player characteristics
- Rastertime: players vary from "decent" (DMC, JCH, EMS) to "very low" (Sidwinder). Low rastertime reduces CPU load during raster interrupts (helps keep main program/game logic responsive).
- Memory usage: generally modest for DMC/JCH/EMS; Odintracker is currently an outlier with high memory usage due to an inefficient packer.
- Tradeoffs: highly optimized players (e.g., Sidwinder) minimize rastertime at possible cost of flexibility or editor features; simple editors (e.g., Odintracker) may prioritize ease of use over packed size.

## References
(none)
