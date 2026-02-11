# PETSCII Control Codes $00-$1F

**Summary:** PETSCII control codes in the range $00-$1F (decimal 0–31) with each code's hex/decimal value and short action (color set, cursor, charset control, Stop/Return). Includes color codes ($05, $1C, $1E, $1F), Run/Stop ($03), Commodore-Shift enable/disable ($08/$09), and cursor/editing controls.

## Description
This chunk lists PETSCII control codes 0–31 (hex $00–$1F) and their brief meanings as used on the Commodore 64 PETSCII screen/code set. It enumerates unused codes, character-set locks and switches, basic cursor and editing controls, and the color-setting control bytes present in this low PETSCII range. Terminology: "Commodore-Shift" refers to the C= key combination that toggles an alternate character set (lock/unlock).

## Source Code
```text
PETSCII CONTROL CODES ($00-$1F)

Dec  Hex   Description
---  ----  -----------
  0  $00   (unused)
  1  $01   (unused)
  2  $02   (unused)
  3  $03   Stop (RUN/STOP key)
  4  $04   (unused)
  5  $05   White (set text color to white)
  6  $06   (unused)
  7  $07   (unused)
  8  $08   Disable Commodore-Shift (lock character set)
  9  $09   Enable Commodore-Shift (unlock character set)
 10  $0A   (unused)
 11  $0B   (unused)
 12  $0C   (unused)
 13  $0D   Return (carriage return)
 14  $0E   Switch to lowercase/uppercase character set
 15  $0F   (unused)
 16  $10   (unused)
 17  $11   Cursor Down
 18  $12   Reverse On (reverse video on)
 19  $13   Home (move cursor to home position)
 20  $14   Delete (delete character to left)
 21  $15   (unused)
 22  $16   (unused)
 23  $17   (unused)
 24  $18   (unused)
 25  $19   (unused)
 26  $1A   (unused)
 27  $1B   (unused)
 28  $1C   Red (set text color to red)
 29  $1D   Cursor Right
 30  $1E   Green (set text color to green)
 31  $1F   Blue (set text color to blue)
```

## References
- "petscii_color_codes_summary" — expands on color-setting control codes (e.g. $05 White, $1C Red)
- "petscii_control_codes_summary" — expands on summary list of PETSCII control code actions

## Labels
- WHITE
- RED
- GREEN
- BLUE
