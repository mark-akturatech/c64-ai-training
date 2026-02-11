# VIC-II: Sprite X/Y positions, Sprite X MSB (MSIGX), Raster ($D012) and Light Pen ($D013-$D014)

**Summary:** Sprite position registers (SP0X..SP7Y $D000-$D00F) and the Sprite X MSB register (MSIGX $D010) — bits 0–7 map to sprite 0–7 MSBs (add 256 when set). Raster register $D012 (read current raster / write raster-compare low 8 bits) and the ninth raster bit (bit 7 of $D011) are explained, plus light-pen registers $D013-$D014. Includes timing note: move sprites during vertical blank.

**Sprite X/Y registers and MSB (MSIGX)**
The VIC-II stores sprite X and Y positions in the SP0X..SP7Y register block. The X positions for sprites 0–7 are 8-bit low values in $D000-$D00F; horizontal positions may require a ninth (MSB) bit to address X >= 256.

- MSIGX ($D010) contains the horizontal MSB bits for sprites 0–7: each bit (bit0..bit7) corresponds to sprite 0..7. When a bit is set, add 256 to that sprite's X position (i.e., X = MSB*256 + low_byte).
- On reset/power-up these registers are typically initialized to 0 (i.e., MSB cleared), but software should not assume a guaranteed value for the ninth bit unless explicitly set by the program or known kernel versions.
- Move sprites during vertical blank (off-screen) — if you update sprite position registers while the raster is actively scanning the sprite lines, sprite shapes can waver.

(Short: MSB bits expand X coordinate to 9 bits.)

**Raster register and raster-compare behavior ($D012 and $D011)**
- $D012 (53266) — Raster register: reading returns the current raster scan line (low 8 bits); writing sets the low 8 bits of the raster-compare value for the raster interrupt.
- The raster number requires 9 bits. The ninth (MSB of the 9-bit raster-compare) is bit 7 of $D011 (53265). When setting or checking a raster-compare you must manage both $D012 (low 8 bits) and bit 7 of $D011 to get or set the full 9-bit value (0–511).
- There are 262 scan lines for NTSC (312 for PAL); visible lines typically lie in a subset (NTSC: lines 50–249 are visible). Raster interrupts (when enabled) trigger when the electron beam reaches the full 9-bit compare value.
- Using raster interrupts (via the Interrupt Mask Register $D01A) is more efficient for midscreen changes than continuously polling $D012.

Timing/wait example (assembly and BASIC forms are in Source Code):
- Assembly snippet loops on $D011 to synchronize with vertical blanking before updating registers so sprite moves happen off-screen.
- BASIC has WAIT 53265,128 as an equivalent (but BASIC is often too slow to run the next statement inside the blanking interval).

**Light pen registers ($D013-$D014)**
- $D013-$D014 (53267–53268) — Light pen X/Y registers. When the light-pen trigger (joystick port) closes, VIC-II latches the current beam position into these registers (updated once per frame). After a write to these registers their values are latched for the remainder of that frame; subsequent triggers in the same frame do not change the latched values.
- Light-pen readings are noisy; average multiple samples to improve accuracy. ([cx16.dk](https://cx16.dk/mapping_c64.html?utm_source=openai))
- The X coordinate is stored in $D013 as an 8-bit value ranging from 0 to 160, representing half the actual horizontal position. Multiply by 2 to approximate the actual X position. ([cx16.dk](https://cx16.dk/mapping_c64.html?utm_source=openai))
- The Y coordinate is stored in $D014 as an 8-bit value ranging from 0 to 255, corresponding directly to the screen's vertical position. ([cx16.dk](https://cx16.dk/mapping_c64.html?utm_source=openai))

## Source Code
```asm
; Wait for vertical blank (example from source)
LOOP
    LDA $D011
    BPL LOOP
; Explanation: poll $D011 and loop until the sign bit changes.
```

```basic
' BASIC equivalent (often too slow to use reliably):
WAIT 53265,128
```

```basic
40 FOR I=49152 TO 49188:READ A:POKE I,A:NEXT:POKE 53280,11
50 PRINT CHR$(147):FOR I=1024 TO I+1000:POKE I,160:POKE I+54272,11:NEXT I
60 FOR I=0 TO 15:FOR J=0 TO 15
70 P=1196+(48*I)+J:POKE P,J+I:POKE P+54272,J:NEXT J,I
80 PRINT TAB(15)CHR$(5)"COLOR CHART":FOR I=1 TO 19:PRINT:NEXT
85 PRINT "THIS CHART SHOWS ALL COMBINATIONS OF   "
86 PRINT "FOREGROUND AND BACKGROUND COLORS.      "
87 PRINT "FOREGROUND INCREASES FROM LEFT TO RIGHT"
88 PRINT "BACKGROUND INCREASES FROM TOP TO BOTTOM"
90 SYS 12*4096
100 DATA 169,90,133,251,169,0,141,33,208,162,15,120,173,17,208,48
105 DATA 251,173,18,208
110 DATA 197,251,208,249,238,33,208,24,105,8,133,251,202,16,233,48,219
```

```text
Register quick reference (detailed bits are implementation reference)
$D000-$D00F  Sprite 0-7 X/Y low bytes (SP0X..SP7Y)
$D010       MSIGX - Sprite X MSB bits: bit0 => sprite0 MSB ... bit7 => sprite7 MSB
$D011       Control / contains raster MSB (bit 7 is the 9th raster bit)
$D012       Raster register (read current raster / write raster-compare low 8 bits)
$D013-$D014 Light pen registers (X/Y)
$D01A       Interrupt Mask Register (referenced for raster interrupts)
```

## Key Registers
- $D000-$D00F - VIC-II - Sprite 0-7 X/Y positions (low bytes)
- $D010 - VIC-II - Sprite X MSB bits (MSIGX) (bit0..bit7 => sprite0..sprite7 MSBs)
- $D011 - VIC-II - Control / contains raster-compare MSB (bit 7)
- $D012 - VIC-II - Raster register (current raster / raster-compare low 8 bits)
- $D013-$D014 - VIC-II - Light pen X/Y registers
- $D01A - VIC-II - Interrupt Mask Register (raster interrupt enable/flags referenced)

## References
- "sprite_position_registers_and_horizontal_msb" — expands on usage examples and explanation
- ([cx16.dk](https://cx16.dk/mapping_c64.html?utm_source=openai))