# VIC-II color registers & SID paddle/random/ENV3 registers ($D020-$D026, $D418-$D41F)

**Summary:** VIC-II color registers $D020-$D026 control border color, background colors 0–3, and two sprite multicolor registers (only lower 4 bits used). SID-side registers $D418-$D41C include Volume/Filter select, paddle positions (POTX/POTY), Oscillator 3 random/output ($D41B), and ENV3 ($D41C). CIA Data Port bits ($DC00/$DC01) read paddle fire buttons. Color RAM is at $D800-$DBFF.

**VIC-II color registers (border/background/sprite multicolor)**

VIC-II color registers at $D020–$D026 select display colors:

- $D020 — Border color.
- $D021–$D024 — Background Color 0 through Background Color 3.
- $D025–$D026 — Sprite Multicolor 1 and Sprite Multicolor 2.

Only the lower 4 bits of each color register are connected for read/write; the upper bits read back as zeros (or ignored). Colors are encoded in 4-bit color values (0–15). The default color values are:

- Border Color ($D020): 14 (Light Blue)
- Background Color 0 ($D021): 6 (Blue)
- Background Color 1 ($D022): 0 (Black)
- Background Color 2 ($D023): 0 (Black)
- Background Color 3 ($D024): 0 (Black)
- Sprite Multicolor 1 ($D025): 0 (Black)
- Sprite Multicolor 2 ($D026): 0 (Black)

See also Color RAM ($D800–$DBFF) for per-character foreground colors (character matrix foreground colors are stored in Color RAM; VIC-II color registers are global/background/sprite multicolor).

**Paddle inputs, fire buttons and SID oscillator outputs**

Paddle position and related outputs are read via SID-area registers:

- POTX ($D419 / decimal 54297) — Read Game Paddle 1 (or 3) position (upper 8 bits).
- POTY ($D41A / decimal 54298) — Read Game Paddle 2 (or 4) position (upper 8 bits).

Paddle fire buttons are read from CIA data ports:

- CIA1 Data Port A ($DC00 / decimal 56320) and Data Port B ($DC01 / decimal 56321).
  - On Port A: Bit 2 = button 1 (0 when pressed), Bit 3 = button 2 (0 when pressed).
  - On Port B: Bit 2 = button 3 (0 when pressed), Bit 3 = button 4 (0 when pressed).

BASIC expressions to sample buttons:

- PB(1)=(PEEK(56321)AND4)/4
- PB(2)=(PEEK(56321)AND8)/8
- PB(3)=(PEEK(56320)AND4)/4
- PB(4)=(PEEK(56320)AND8)/8

When a 0 is returned the button is pressed; 1 means not pressed.

Restoring IRQ after a paddle read in BASIC:

- POKE 56333,129

It is recommended to use a machine-language paddle-read routine for timing accuracy (refer to the Commodore 64 Programmer's Reference Guide, p.347).

**SID Oscillator 3, RANDOM and ENV3 behavior**

SID registers described:

- RANDOM ($D41B / decimal 54299) — reads the upper 8 bits of Oscillator 3 waveform output.
  - Sawtooth waveform: returns 0..255 incrementing then wrap to 0.
  - Triangle waveform: returns ramp 0..255 then down to 0 repeatedly.
  - Pulse waveform: returns either 255 or 0.
  - Noise waveform: returns pseudo-random values 0..255 (usable as RNG).
  - Useful as a modulation source (add to other voice frequency, filter freq, pulse width). When using Oscillator 3 as modulation, audio output of voice 3 is typically muted by setting Bit 7 of the Volume & Filter Select register ($D418) to 1. Oscillator 3 output is not gated by the ADSR envelope and is available regardless of envelope state.

- ENV3 ($D41C / decimal 54300) — reads voice 3 envelope generator output.
  - ENV3 outputs the envelope value (0–255) corresponding to the current ADSR envelope of voice 3.
  - To produce an envelope output, the gate bit in Control Register 3 must be set (gate=1 starts attack/decay/sustain; gate=0 starts release).

Unused/mirrored addresses:

- $D41D–$D41F ($54301–$54303) — Not connected: reading returns $FF; writing has no effect.
- The SID occupies a 1K block ($D400–$D7FF) but only 32 addresses are decoded; every 32-byte window in that block is a mirror of the SID registers. For clarity and safety, avoid using the mirrored addresses.

**Color RAM**

- $D800–$DBFF — Color RAM (1K block; per-character foreground color for screen characters). Separate from VIC-II global color registers.

## Source Code

```basic
REM Buttons
PB(1)=(PEEK(56321)AND4)/4
PB(2)=(PEEK(56321)AND8)/8
PB(3)=(PEEK(56320)AND4)/4
PB(4)=(PEEK(56320)AND8)/8

REM Example reads
A=PEEK(54297)  : REM POTX ($D419)
B=PEEK(54298)  : REM POTY ($D41A)

REM Restore IRQ after paddle read (BASIC)
POKE 56333,129
```

```text
Register listings (decimal / hex / name)

54297         $D419          POTX      Read Game Paddle 1 (or 3) Position
54298         $D41A          POTY      Read Game Paddle 2 (or 4) Position
54299         $D41B          RANDOM    Read Oscillator 3 / Random Number Generator
54300         $D41C          ENV3      Envelope Generator 3 Output

Location Range: 54301-54303 ($D41D-$D41F)  Not Connected (reads $FF)
Location Range: 54304-55295 ($D420-$D7FF)  SID Register Images (mirrors of $D400-$D41F)

55296-56319   $D800-$DBFF   Color RAM
```

## Key Registers

- $D020-$D026 - VIC-II - Border Color ($D020), Background Colors 0–3 ($D021–$D024), Sprite Multicolor 1–2 ($D025–$D026). (Only lower 4 bits connected.)
- $DC00-$DC01 - CIA1 - Data Port A/B (paddle fire buttons: bits 2 and 3).
- $D418-$D41C - SID - Volume & Filter Select ($D418), POTX/POTY ($D419/$D41A), RANDOM/Osc3 ($D41B), ENV3 ($D41C).
- $D41D-$D41F - SID - Not connected (reads $FF).
- $D400-$D7FF - SID mirror area (avoid using mirrors; every 32-byte window mirrors SID registers).
- $D800-$DBFF - Color RAM - per-character foreground colors (screen character color RAM).

## References

- "color_ram_and_color_mapping" — expands on Color RAM providing per-character foreground colors
- Commodore 64 Programmer's Reference Guide — machine-language paddle read routine (referenced: p.347)

## Labels
- POTX
- POTY
- RANDOM
- ENV3
- BLACK
- BLUE
- LIGHT_BLUE
