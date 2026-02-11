# Kernal patches area (58551-58623 $E4B7-$E4FF)

**Summary:** Kernal patch and additions block at $E4B7-$E4FF including patches (CHKOUT fix at $E4AD), unused filler bytes, and vectored I/O helper routines IOBASE ($E500), SCREEN ($E505), and PLOT ($E50A); contains startup ASCII messages and a Clear Color RAM routine (patch at $E4DA) that uses Background Color register $D021 and USER ($F3).

**Description**

This chunk documents a region of the C64 Kernal ROM that contains later-version patches and added vectored helpers to improve compatibility between U.S. and European machines and to fix bugs in earlier Kernal releases.

Contents and notable entries:

- **Patch area:** $E4B7-$E4FF (58551–58623) — 35 bytes filler (value $AA) present at $E4B7 onward in this block in some images.
- **CHKOUT patch at $E4AD (58541):** Preserves the A register when BASIC calls the Kernal CHKOUT routine if no error is returned; this prevents malfunctions in CMD and PRINT# in early Kernal versions.
- **Clear Color RAM routine at $E4DA (58586):** Added in later Kernal versions; when clearing a screen line, this routine sets Color RAM bytes to the value currently in Background Color register $D021 (decimal 53281) and stores via USER (zero page $F3) pointer. This replaced the earlier behavior of forcing Color RAM to 1, which produced a white foreground but caused visual artifacts while scrolling.
- **Pause-after-cassette-find routine at $E4E0 (58592):** Introduces a delay after locating a cassette file.
- **I/O helper routines (vectored to aid portability):**
  - **IOBASE at $E500 (58624):** Returns I/O base address in .X/.Y; on standard machines, this returns X = $00, Y = $DC (pointing at CIA#1 base $DC00).
  - **SCREEN at $E505 (58629):** Returns screen columns (.X) and rows (.Y) (used by higher-level routines and for portability between different screen modes/placements).
  - **PLOT at $E50A (58634):** Reads/sets cursor position via .X/.Y and uses the carry flag to indicate read vs set; vectored so screen memory/bank changes can be abstracted.
- **Power-up ASCII messages:** Startup banner and "BYTES FREE" are stored in this region of ROM.

**Compatibility/workaround note (Clear Color RAM):**

Because the Clear Color RAM routine uses the background color in $D021, programs that relied on setting Color RAM independently (by POKEing screen RAM and expecting a contrasting default color) can restore that behavior by:

- Save current background color, set $D021 to desired foreground color, clear the screen, then restore original background color.
- Example BASIC sequence is provided in Source Code.

## Source Code

```basic
REM Workaround to initialize Color RAM to a desired foreground color:
C = PEEK(53281)
POKE 53281, HUE
PRINT CHR$(147)  : REM CLR/HOME: clear screen
POKE 53281, C
```

```assembly
; Assembly listing for Clear Color RAM routine at $E4DA
E4DA   AD 86 02   LDA $0286
E4DD   91 F3      STA ($F3),Y
E4DF   60         RTS
```

```assembly
; Assembly listing for IOBASE routine at $E500
E500   A2 00      LDX #$00   ; low byte of $DC00
E502   A0 DC      LDY #$DC   ; high byte of $DC00
E504   60         RTS
```

```assembly
; Assembly listing for SCREEN routine at $E505
E505   A2 28      LDX #$28   ; 40 columns
E507   A0 19      LDY #$19   ; 25 rows
E509   60         RTS
```

```assembly
; Assembly listing for PLOT routine at $E50A
E50A   B0 07      BCS $E513
E50C   86 D6      STX $D6
E50E   84 D3      STY $D3
E510   20 6C E5   JSR $E56C
E513   A6 D6      LDX $D6
E515   A4 D3      LDY $D3
E517   60         RTS
```

```text
Startup ASCII messages stored in ROM (present in this region):
"**** COMMODORE 64 BASIC V2"
"****"
"... BYTES FREE"
```

```text
Data note (filler bytes found in some Kernal revisions):
Address range $E4B7-$E4D5 (58551-58586): 35 bytes with value $AA (170 decimal)
```

```text
Documented Kernal routine addresses (for retrieval/reference):
$E4AD - CHKOUT patch (preserve A on no-error)
$E4B7-$E4FF - Patches/unused filler area
$E4DA - Clear Color RAM routine
$E4E0 - Pause after finding cassette file
$E500 - IOBASE (returns I/O base in .X/.Y)
$E505 - SCREEN (returns screen columns/.X and rows/.Y)
$E50A - PLOT (read/set cursor via .X/.Y, carry=mode)
```

## Key Registers

- **$E4B7-$E4FF** - Kernal - Kernal patches / filler area (addresses in ROM)
- **$E4AD** - Kernal - CHKOUT preservation patch
- **$E4DA** - Kernal - Clear Color RAM routine
- **$E4E0** - Kernal - Pause after cassette-find routine
- **$E500** - Kernal - IOBASE vectored routine (returns I/O base in .X/.Y)
- **$E505** - Kernal - SCREEN vectored routine (returns screen columns/.X and rows/.Y)
- **$E50A** - Kernal - PLOT vectored routine (read/set cursor, uses carry)
- **$D021** - VIC-II - Background Color Register 0 (used by Clear Color RAM routine)
- **$DC00-$DC0F** - CIA #1 - CIA register block (IOBASE typically points here)
- **$F3** - Zero Page - USER pointer (decimal 243) used for Color RAM addressing by clear routine

## References

- "ciapra_ciaprb_registers_cia1_data_ports" — expands on IOBASE returning CIA base address used for port access
- "changing_vic_memory_banks_from_basic_and_sample_program" — expands on SCREEN/PLOT interplay when changing screen pointers

## Labels
- CHKOUT
- IOBASE
- SCREEN
- PLOT
- USER
- BGCOL0
