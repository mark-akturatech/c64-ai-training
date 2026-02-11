# VIC-II effects / applications (hyperscreen, FLI/FLD, linecrunch, doubled text, DMA delay, sprite stretching)

**Summary:** Techniques that exploit MOS 6567/6569 (VIC-II) behavior: raster timing, bad-line memory fetches, DMA contention and sprite DMA, memory-pointer changes, and border-control signals (CSEL/RSEL) to produce hyperscreen/open-border, FLI/FLD per-line color tricks, linecrunching, doubled text lines, DMA-delay tricks, and sprite stretching.

**Overview**

This node lists common VIC-II graphical effects and the hardware behaviors they exploit. Each technique relies on precise timing of VIC-II reads/fetches (bad lines, sprite DMA), raster interrupts or raster-polling, and selective changes to VIC memory pointers or control signals. The descriptions below are conceptual summaries.

**Hyperscreen (open-border)**

Hyperscreen/open-border effects expand the visible playfield by manipulating the VIC-II’s border behavior and memory selection lines. Implementations manipulate CSEL/RSEL (chip-select style signals) or change memory-pointer setup mid-frame so the VIC fetches character/bitmaps outside the normal visible area, effectively “opening” the left/right/top/bottom borders. This requires cycle-accurate changes and sometimes hardware modifications or use of bank-switch timing to avoid bus conflicts.

**FLI (Flexible Line Interpretation)**

FLI uses VIC bad-line timing and precise CPU writes during bad-line fetch windows to change character/color interpretation on a per-scanline basis. Commonly:

- Use bad lines to synchronize CPU writes to color RAM or character memory pointers.
- Change color RAM and/or character bitmap data while the VIC is performing its per-character-line fetches to create more on-screen colors or more detailed per-line graphics than normally possible.

FLI is dependent on exact bad-line timing and careful avoidance of sprite or other DMA fetch collisions.

**FLD (Flexible Line Display)**

FLD is a technique that uses bad-line timing to vary what the VIC displays on a per-raster-line basis. It involves manipulating the vertical fine-scroll register to delay the display of character rows, effectively shifting the screen content downward without moving the actual data in memory. This allows for smooth vertical scrolling effects and dynamic screen splitting.

**Linecrunch**

Linecrunch vertically compresses the displayed image by removing or re-using scanline rows so that more logical rows fit into fewer visible raster lines. Implementations manipulate vertical fine-scroll, vertical-character-row timing, or re-point the character/bitmap pointers mid-frame so that successive character rows are fetched or displayed with reduced raster-line repetition. Requires careful raster alignment to avoid tearing and to keep sprite alignment intact.

**Doubled text lines**

Doubled-text-line techniques cause each text character row to occupy twice (or multiple) the normal set of raster lines, producing a “stretched” text appearance without changing character bitmap data. Typical approaches reuse the same character-row fetch for consecutive raster-line groups by:

- Preventing the VIC’s vertical advance for one or more character-row steps, or
- Reloading the same character pointers for a following scanline group.

Precise timing is required to maintain correct alignment of borders and sprites.

**DMA delay / cycle stealing tricks**

The VIC-II takes CPU cycles for memory DMA (bad-line fetches and sprite DMA). Effects exploit the exact phase and duration of these memory steals to:

- Shift the CPU-visible timing for mid-line writes,
- Hide or reveal data by writing during stolen cycles,
- Make small horizontal sprite/bitmap offsets by changing when sprite pointer or position bytes are updated relative to VIC DMA.

These rely on cycle-exact code (typically carefully counted 6502 cycles or NOP padding) and awareness of which raster lines trigger DMA.

**Sprite stretching and per-line sprite tricks**

Sprite stretching (vertical expansion) is achieved using VIC sprite expansion features plus runtime changes to sprite data pointers or reloading sprite bitmaps mid-frame. More advanced techniques change sprite shape per raster line by updating sprite data during the sprite’s active fetch window (requiring bad-line/DMA timing knowledge) to produce non-standard heights or per-line sprite graphics.

**Practical constraints**

- All techniques require cycle-exact timing and knowledge of bad-line behavior, raster positions ($D012), and VIC memory fetch windows.
- Sprite DMA and bad lines steal CPU cycles — many tricks must account for or exploit this contention.
- Some methods (hyperscreen) may require hardware changes or bank-switch tricks to avoid bus contention or to access memory outside normal windows.
