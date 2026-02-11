# VIC-II Register Map $00–$2E (VIC-II / $D000–$D02E)

**Summary:** VIC-II register map for offsets $00–$2E (C64 absolute $D000–$D02E) showing DB7..DB0 bit field names and short descriptions for MOB (sprite) X/Y, control flags (RC8, ECM, BMM, DEN, RSEL, Y2..Y0), raster ($D012), light-pen ($D013/$D014), MOB enable, memory pointers, interrupts (ILP, IMMC, IMBC, IRST), priority/multicolor/X-expand, collision registers, exterior/background/multicolor color registers, and per-MOB color registers.

**Overview**
This chunk is a compact register map: each VIC-II register offset ($00–$2E) is listed with its bit-field names (MxXn, MxYn, MxE, MxDP, MxMC, MxXE, MxM, MxD, ECx, BxCx, MMxx, MxCx) and a one-line description. Conventions used:

- MxXn / MxYn: sprite (MOB) X/Y bit n for sprite x (0–7).
- MSB of sprite X positions are collected in offset $10 (absolute $D010).
- $11 (absolute $D011) is the VIC control register with bits: RC8 (raster MSB), ECM (extended color mode), BMM (bitmap mode), DEN (display enable), RSEL (row select), Y2..Y0 (fine vertical scroll).
- $12 (absolute $D012) is the raster low 8 bits (RC7..RC0).
- $13/$14 are light-pen X/Y registers.
- $15 enables sprites (MOB enable bits).
- $16 (absolute $D016) is control/reserved and X-scroll/CSEL/MCM bits (see table).
- $18 contains high bits for memory pointers (character/screen/bitmap pointers).
- $19/$1A are interrupt status and enable registers with flags: ILP (light-pen), IMMC (MOB–MOB/multicolor?), IMBC (MOB–background), IRST (raster), plus the IRQ flag.
- $1B–$1D set sprite priority, multicolor select, and X-expand.
- $1E/$1F are sprite-to-sprite and sprite-to-data collision registers.
- $20–$26 are exterior/background/multicolor color registers; $27–$2E are per-sprite color registers.

## Source Code
