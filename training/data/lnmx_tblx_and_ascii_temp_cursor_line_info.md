# LNMX ($D5), TBLX ($D6), and ASCII temp ($D7)

**Summary:** Editor variables at $D5/$D6/$D7 (zero-page/basic editor area) used by the screen/line editor: LNMX ($D5) stores the maximum physical length allowed for a physical screen line, TBLX ($D6) holds the current cursor physical screen line (0–24) and can be POKEd to move the cursor vertically, and $D7 is a temporary holding location for the ASCII value of the last printed character.

## LNMX ($D5)
LNMX contains the maximum length of a physical screen line as used by the line editor. When the editor reaches the end of a physical line it consults LNMX to decide whether the current logical line may extend onto another physical line (within the same logical record) or if a new logical line must be started.

## TBLX ($D6)
TBLX holds the cursor's current physical screen row index (0–24). POKEing this location with the target physical row (value = desired screen line 1–25 minus 1) and then issuing a PRINT causes the editor to update internal screen/editor variables and position subsequent output on that physical line. The source example shows POKE using decimal address 214 (which corresponds to $D6 in the table).

Alternative cursor set/read: the KERNAL PLOT routine (decimal 58634, $E50A) may also be used to set or read the cursor position (see related entry referenced in the original source).

## ASCII temporary ($D7)
This location temporarily stores the ASCII value of the last character printed to the screen. It can be read to inspect the last output character code.

## Source Code
```basic
POKE 214,9:PRINT:PRINT "WE'RE ON LINE ELEVEN"
```

```text
KERNAL PLOT routine reference: 58634 ($E50A)  ; (see entries 780-783 / $30C-$30F)
```

## Key Registers
- $00D5-$00D7 - BASIC editor (zero page) - LNMX (max physical line length), TBLX (cursor physical line 0–24), ASCII temp (last printed character ASCII)

## References
- "ldtb1_screen_line_link_table" — mapping of physical rows to logical lines used alongside LNMX and TBLX

## Labels
- LNMX
- TBLX
- ASCII_TEMP
