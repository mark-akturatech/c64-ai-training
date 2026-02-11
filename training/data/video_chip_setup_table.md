# VIC-II (Video Chip) Startup Register Table ($D000–$D02E)

**Summary:** Initial VIC-II register values at C64 startup for $D000–$D02E: sprite X/Y coordinates and MSBs, control registers ($D011, $D012, $D016, $D018), light-pen positions, sprite enable/expansion, IRQ flag/mask ($D019/$D01A), priority/multicolour/collision settings, border/background and sprite colours, and sprite multicolour registers.

**Description**
This chunk reproduces the KERNAL's video chip setup table — the default bytes written into the VIC-II I/O range at system startup. It lists the power-on values used for sprite positions (low bytes and MSB), VIC control registers, light-pen locations, sprite enable/expansion/configuration, IRQ flag/mask defaults, collision registers, border/background colours, multicolour registers, and the per-sprite colour bytes present in the disassembly.

Keep in mind:
- Addresses are the VIC-II register range ($D000 base). Values shown are the KERNAL initialisation bytes.
- The table now includes $D02E (sprite 7 colour) and subsequent VIC-II colour/unused registers.
- For full bit-field descriptions (e.g. $D011/$D016/$D018 behaviour and bit meanings), see dedicated references such as "graphics_text_control" (cross-reference below).

## Source Code
```text
                                *** VIDEO CHIP SET UP TABLE
                                This is a table of the initial values for the VIC chip
                                registers at start up.
.:ECB9 00 00                    $d000/1, sprite0 - x,y coordinate
.:ECBB 00 00                    $d002/3, sprite1 - x,y coordinate
.:ECBD 00 00                    $d004/5, sprite2 - x,y coordinate
.:ECBF 00 00                    $d006/7, sprite3 - x,y coordinate
.:ECC1 00 00                    $d008/9, sprite4 - x,y coordinate
.:ECC3 00 00                    $d00a/b, sprite5 - x,y coordinate
.:ECC5 00 00                    $d00c/d, sprite6 - x,y coordinate
.:ECC7 00 00                    $d00e/f, sprite7 - x,y coordinate
.:ECC9 00                       $d010, sprite MSB
.:ECCA 9B                       $d011, VIC control register
.:ECCB 37                       $d012, raster register
.:ECCC 00 00                    $d013/4, light pen x/y position
.:ECCE 00                       $d015, sprite enable
.:ECCF 08                       $d016, VIC control register 2
.:ECD0 00                       $d017, sprite y-expansion
.:ECD1 14                       $d018, VIC memory control register
.:ECD2 0F                       $d019, VIC irq flag register
.:ECD3 00                       $d01a, VIC irq mask register
.:ECD4 00                       $d01b, sprite/background priority
.:ECD5 00                       $d01c, sprite multicolour mode
.:ECD6 00                       $d01d, sprite x-expansion
.:ECD7 00                       $d01e, sprite/sprite collision
.:ECD8 00                       $d01f, sprite/background collision
.:ECD9 0E                       $d020, border colour (light blue)
.:ECDA 06                       $d021, background colour 0 (blue)
.:ECDB 01                       $d022, background colour 1
.:ECDC 02                       $d023, background colour 2
.:ECDD 03                       $d024, background colour 3
.:ECDE 04                       $d025, sprite multicolour register 0
.:ECDF 00                       $d026, sprite multicolour register 1
.:ECE0 01                       $d027, sprite0 colour
.:ECE1 02                       $d028, sprite1 colour
.:ECE2 03                       $d029, sprite2 colour
.:ECE3 04                       $d02a, sprite3 colour
.:ECE4 05                       $d02b, sprite4 colour
.:ECE5 06                       $d02c, sprite5 colour
.:ECE6 07                       $d02d, sprite6 colour
.:ECE7 08                       $d02e, sprite7 colour
.:ECE8 00                       $d02f, unused
.:ECE9 00                       $d030, unused
.:ECEA 00                       $d031, unused
.:ECEB 00                       $d032, unused
.:ECEC 00                       $d033, unused
.:ECED 00                       $d034, unused
.:ECEE 00                       $d035, unused
.:ECEF 00                       $d036, unused
.:ECF0 00                       $d037, unused
.:ECF1 00                       $d038, unused
.:ECF2 00                       $d039, unused
.:ECF3 00                       $d03a, unused
.:ECF4 00                       $d03b, unused
.:ECF5 00                       $d03c, unused
.:ECF6 00                       $d03d, unused
.:ECF7 00                       $d03e, unused
.:ECF8 00                       $d03f, unused
```

## Key Registers
- $D000–$D00F - VIC-II - Sprite 0–7 low X/Y coordinate bytes (startup zeros)
- $D010 - VIC-II - Sprite X MSB (startup $00)
- $D011 - VIC-II - Control register 1 (startup $9B)
- $D012 - VIC-II - Raster register (startup $37)
- $D013–$D014 - VIC-II - Light-pen X/Y position (startup $00/$00)
- $D015 - VIC-II - Sprite enable (startup $00)
- $D016 - VIC-II - Control register 2 (startup $08)
- $D017 - VIC-II - Sprite Y expansion (startup $00)
- $D018 - VIC-II - Memory control register (startup $14)
- $D019 - VIC-II - IRQ flag register (startup $0F)
- $D01A - VIC-II - IRQ mask register (startup $00)
- $D01B - VIC-II - Sprite/background priority (startup $00)
- $D01C - VIC-II - Sprite multicolour mode (startup $00)
- $D01D - VIC-II - Sprite X expansion (startup $00)
- $D01E - VIC-II - Sprite/sprite collision (startup $00)
- $D01F - VIC-II - Sprite/background collision (startup $00)
- $D020–$D024 - VIC-II - Border and background colours (startup $0E, $06, $01, $02, $03)
- $D025–$D026 - VIC-II - Sprite multicolour registers 0–1 (startup $04, $00)
- $D027–$D02E - VIC-II - Sprite 0–7 colour registers (startup $01–$08)

## References
- "graphics_text_control" — expands on and manipulates $D018 (VIC memory control)
- "shift_run_equivalent" — expands on keyboard input placement into keyboard buffer relative to VIC settings