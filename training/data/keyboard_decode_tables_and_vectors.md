# Keyboard decode, CHROUT color handling, and screen-scroll routines (KERNAL addresses $E8B3–$EA31, SCNKEY $EA87)

**Summary:** Describes KERNAL keyboard decode entry SCNKEY ($EA87), keyboard-decode table vectors and the four 64-entry PETASCII decode tables (standard/SHIFT/Logo/CONTROL), plus CHROUT-related color-change detection, PETASCII color-code table, and screen/scroll/cursor routines including use of KERNAL zero-page pointers ($D1-$D2, $F3) and the background color register $D021.

## Keyboard decode and decode-table selection
SCNKEY (60039 / $EA87) reads the raw keyboard hardware and returns a keycode. KERNAL decode code converts that keycode into PETASCII and places the resulting ASCII into the keyboard buffer (60128 / $EAE0). Table-selection logic at 60232 ($EB48) chooses one of four 64-entry PETASCII decode tables depending on modifier state:
- Standard decode table (60289 / $EB81)
- SHIFT decode table (60354 / $EBC2)
- Commodore Logo (CBM) decode table (60419 / $EC03)
- CONTROL decode table (60536 / $EC78)

Decode-table vectors are collected at 60281 ($EB79). The KERNAL handles SHIFT and Logo (CBM) toggles and includes routines that set lowercase/uppercase (SET LOWERCASE/UPPERCASE at 60484 / $EC44 and related toggle handlers).

(Pet key -> PETASCII mapping and table vectors are implemented as 64-entry tables; each table is selected via the vector table at $EB79.)

## CHROUT color-change detection and PETASCII color codes
CHROUT uses a small subroutine (59695 / $E8CB) to check whether a character to be printed is a "color change" control code (CTRL-1 style) that changes the current foreground color. A PETASCII Color Code Equivalent Table maps each of the 16 colors to the PETASCII byte that causes that color change. CHROUT and the color-handling logic update Color RAM pointers and background/foreground color state during printing.

## Screen, cursor, and scrolling routines
KERNAL screen maintenance routines referenced here (addresses given are entry points):

- 59571 ($E8B3) — If at the end of a screen line, move cursor to next line.
- 59626 ($E8EA) — Scroll screen: move all screen lines up; if top logical line is two physical lines long, move up two lines. Holding CTRL inserts a brief pause after scroll.
- 59749 ($E965) — Insert a blank line on the screen (used by INSERT).
- 59848 ($E9C8) — Move one screen line (and its Color RAM) up one physical line (used by scroll).
- 59872 ($E9E0) — Set temporary Color RAM pointer for scrolling: stores pointer in zero page locations 17-175 ($AE-$AF) to the Color RAM address corresponding to temporary screen line address in 172-173 ($AC-$AD).
- 59888 ($E9F0) — Set pointer to screen address of start of line: places address of first byte of the screen line designated by .X into zero page locations 209-210 ($D1-$D2).
- 59903 ($E9FF) — Clear screen line: write space characters to a full line of screen RAM and clear corresponding Color RAM line to Background Color Register 0 (53281 / $D021).
- 59923 ($EA13) — Set cursor blink timing and Color RAM address for print-to-screen: set cursor blink countdown and pointer to Color RAM, then fall through to...
- 59932 ($EA1C) — Store to screen: store the character in A to screen address pointed by zero page pointer at 209 ($D1) and store color in X to address pointed by zero page pointer at 243 ($F3).
- 59940 ($EA24) — Synchronize Color RAM pointer to screen line pointer: set pointer at zero page 243 ($F3) to the Color RAM address corresponding to the current screen RAM line pointer at 209 ($D1).
- 59953 ($EA31) — IRQ interrupt entry: entry point for standard IRQ handler (CIA#1 Timer A causes IRQ at power-on by default).

Notes on pointers used by these routines: the KERNAL keeps a zero-page screen pointer pair at 209-210 (decimal) i.e. $D1-$D2 pointing at current screen RAM line; color pointer at 243 (decimal) i.e. $F3 points into Color RAM for the corresponding line. Background color register used for clearing lines is 53281 ($D021).

## Source Code
```text
; KERNAL addresses and brief labels (decimal PC / $HEX)
59571   $E8B3  ; If at the end of a screen line, move cursor to the next line
59595   $E8CB  ; Check for a color change (used by CHROUT)
59601   $E8D1  ; PETASCII Color Code Equivalent Table (16 entries)
59626   $E8EA  ; Scroll Screen
59749   $E965  ; Insert a Blank Line on the Screen
59848   $E9C8  ; Move Screen Line
59872   $E9E0  ; Set Temporary Color Pointer for Scrolling (zero page $AE-$AF <- Color RAM addr for temp line in $AC-$AD)
59888   $E9F0  ; Set Pointer to Screen Address of Start of Line (puts addr into zpg $D1-$D2)
59903   $E9FF  ; Clear Screen Line (clears Color RAM to Background Color Register 0 ($D021))
59923   $EA13  ; Set Cursor Blink Timing and Color RAM Address for Print to Screen
59932   $EA1C  ; Store to Screen (STA (D1), STX (F3) style)
59940   $EA24  ; Synchronize Color RAM Pointer to Screen Line Pointer (zpg $F3 <- addr corresponding to zpg $D1)
59953   $EA31  ; IRQ Interrupt Entry

; Keyboard decode entry and table addresses
60039   $EA87  ; SCNKEY - read keyboard, return keycode
60128   $EAE0  ; Keyboard buffer (KERNAL routine that stores ASCII)
60232   $EB48  ; Setup/choose keyboard decode table
60281   $EB79  ; Keyboard decode table vectors (vector table)
60289   $EB81  ; PETASCII decode table: STANDARD (64 bytes)
60354   $EBC2  ; PETASCII decode table: SHIFT   (64 bytes)
60419   $EC03  ; PETASCII decode table: COMMODORE LOGO (64 bytes)
60536   $EC78  ; PETASCII decode table: CONTROL (64 bytes)
60484   $EC44  ; SET LOWERCASE / UPPERCASE and Logo/Shift toggle handlers

; PETASCII Color Code Equivalent Table (16 entries)
; Each entry = PETASCII value that triggers change to the corresponding foreground color
; Index 0..15 corresponds to color numbers (sample mapping below)
144 ($90)  Change to color 0 (black)
  5 ($05)  Change to color 1 (white)
 28 ($1C)  Change to color 2 (red)
159 ($9F)  Change to color 3 (cyan)
156 ($9C)  Change to color 4 (purple)
 30 ($1E)  Change to color 5 (green)
 31 ($1F)  Change to color 6 (blue)
158 ($9E)  Change to color 7 (yellow)
129 ($81)  Change to color 8 (orange)
149 ($95)  Change to color 9 (brown)
150 ($96)  Change to color 10 (light red)
151 ($97)  Change to color 11 (dark gray)
152 ($98)  Change to color 12 (medium gray)
153 ($99)  Change to color 13 (light green)
154 ($9A)  Change to color 14 (light blue)
155 ($9B)  Change to color 15 (light gray)
```

## Key Registers
- $D021 - VIC-II - Background Color Register 0 (used when clearing Color RAM lines in clear-line routine)

## References
- "character_rom_byte_examples_and_graphic_tools" — expands on switching character sets and mapping character ROM/pointers

## Labels
- SCNKEY
- CHROUT
- D1
- D2
- F3
