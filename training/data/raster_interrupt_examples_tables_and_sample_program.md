# Raster-scan Interrupt BASIC Sample (Mixed Hi-Res/Text/Multicolor Split)

**Summary:** This sample demonstrates a raster-scan interrupt technique on the Commodore 64 to create a split-screen display combining high-resolution bitmap, text, and multicolor bitmap modes. It utilizes a BASIC program to install the interrupt and a DATA table to define scanline parameters. The method involves manipulating VIC-II registers ($D012, $D011, $D018, $D020, $D021) and references SID registers ($D400-$D414).

**Raster-scan Split-screen BASIC Overview**

This document details a method to achieve mixed-mode displays on the C64 by changing video modes and colors at specific raster lines using interrupts. The approach includes:

- **DATA Table:** Contains entries for each mode boundary, specifying the raster line, background/border colors, and control/memory-pointer values for the VIC-II to select the desired display mode and memory banks.

- **BASIC Interrupt Installer:** Sets the raster compare register ($D012) and enables the raster IRQ. The interrupt service routine (ISR) reads the DATA table and updates VIC-II registers accordingly.

- **Runtime Modifications:** By editing DATA entries, users can adjust split positions, change colors, or swap memory banks without altering the ISR code.

**Conceptual Flow:**

1. The BASIC program installs the raster IRQ and sets $D012 to the first split line.

2. Upon reaching the specified raster line, the IRQ triggers; the ISR reads the current DATA row.

3. The ISR updates the VIC-II registers with the mode control and color values, then sets $D012 to the next split raster line from the DATA table.

4. This process repeats until the end of the table; the ISR may loop or disable the IRQ as needed.

**Notes:**

- The raster compare register is located at $D012 in the VIC-II. Timing-critical code is typically implemented in assembly language; however, BASIC can be used to prepare tables, install vectors, and modify DATA entries.

- DATA table entries are simple records containing scanline, color(s), and control bytes. During the IRQ, these bytes are mapped to VIC-II registers to change the display mode, memory bank, or colors.

**DATA Table Format and Mapping**

The DATA table used by the interrupt routine provides, for each split point, the values the ISR writes into VIC-II registers. The typical layout includes:

- **Scanline (Raster Value):** Written to $D012 to schedule the next IRQ.

- **Background/Border Colors:** Values written to $D020/$D021 or other color registers, depending on the desired effect.

- **Control Registers:** Bits/values that configure VIC-II modes (bitmap/text, multicolor flags) and memory pointers (character/bitmap screen base), typically written to $D011 and $D018.

**Typical Mapping Performed by the ISR:**

- `DATA.scanline` → POKE $D012, scanline

- `DATA.border` → POKE $D020, bordervalue

- `DATA.bgcolor` → POKE $D021, bgcolor

- `DATA.ctrl` → POKE $D011, ctrlvalue (mode & fine-scroll bits)

- `DATA.vmemptr` → POKE $D018, memptrvalue (character/bitmap bank selection)

Implementers should adapt the field order to their specific interrupt handler.

**Examples of Modifying Layout:**

- **Move a Split Upward or Downward:** Change the scanline value for that split in DATA (decreasing moves it up, increasing moves it down).

- **Swap Regions (Text ↔ Bitmap):** Swap the ctrl/memptr bytes for two consecutive DATA rows to exchange bank/mode bytes.

- **Change Colors Mid-screen:** Modify the background/border/color bytes in DATA for that split.

**Caveat:** Precise video timing (cycle alignment) and the need to clear the raster IRQ flag in $D019 and properly acknowledge/restore processor state are implementation details typically handled by the ISR assembly routine.

## Source Code

```text
10 REM BASIC Program to Install Raster Interrupt
20 POKE 56333, 127 : REM Disable CIA Interrupts
30 POKE 788, 0 : POKE 789, 192 : REM Set IRQ Vector to $C000
40 POKE 53274, 129 : REM Enable Raster Interrupts
50 POKE 53265, PEEK(53265) AND 127 : REM Clear Bit 7 of $D011
60 POKE 53266, 50 : REM Set Raster Line for Interrupt
70 DATA 169, 1, 141, 25, 208, 162, 146, 160, 6, 173, 18, 208, 16, 4, 162, 1
80 DATA 160, 0, 142, 18, 208, 140, 33, 208, 173, 13, 220
90 DATA 41, 1, 240, 3, 76, 49, 234, 76, 188, 254
100 FOR J = 49152 TO 49192 : READ X : POKE J, X : NEXT J
110 SYS 49152
```

```text
; Assembly Interrupt Service Routine
*=$C000
  SEI
  LDA #$01
  STA $D01A
  LDX #$92
  LDY #$15
  LDA $D012
  BMI SKIP
  LDX #$01
  LDY #$17
SKIP
  STX $D012
  STY $D019
  JMP $EA31
```

**DATA Table Example:**

```text
DATA 50, 1, 0, 27, 24
DATA 100, 2, 0, 27, 24
DATA 150, 3, 0, 27, 24
DATA 200, 4, 0, 27, 24
DATA -1
```

Each DATA row represents:

- **Scanline:** Raster line to trigger the interrupt.

- **Border Color:** Value for $D020.

- **Background Color:** Value for $D021.

- **Control Register ($D011):** Mode and fine-scroll settings.

- **Memory Pointer ($D018):** Character/bitmap bank selection.

The last entry (-1) indicates the end of the DATA table.

## Key Registers

- **$D012:** VIC-II Raster Compare Register (schedules raster IRQ when current raster equals this value).

- **$D011:** VIC-II Control Register (screen/bitmap/multicolor control bits, fine-scrolling).

- **$D018:** VIC-II Memory Pointer (character/bitmap/screen base selection).

- **$D020:** VIC-II Border Color.

- **$D021:** VIC-II Background Color.

- **$D400-$D406:** SID Voice 1 Registers (frequency low/high, pulse width low/high, control, attack/decay, sustain/release).

- **$D407-$D40D:** SID Voice 2 Registers (same as Voice 1).

- **$D40E-$D414:** SID Voice 3 Registers (same as Voice 1).

- **$D415-$D418:** SID Filter and Volume Control Registers.

## References

- "irq_mask_register_and_raster_interrupts_$D01A" — expands on installation and usage of raster interrupts.

- "Commodore 64 Video: A Guided Tour" — provides insights into raster interrupts and split-screen techniques.

- "Commodore 64 Color Bars" — offers a BASIC program example for installing machine language routines to alter screen colors.

- "Raster Interrupt Sample from Compute's Machine Language Routines for the Commodore 64/128" — includes a BASIC program and assembly ISR for raster interrupts.