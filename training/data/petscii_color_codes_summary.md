# PETSCII Color Codes (C64 16-color palette)

**Summary:** PETSCII control codes that set text color on the Commodore 64, listing PETSCII byte values (decimal and hex) for the 16-color VIC-II palette (VIC-II color values 0–15).

## PETSCII color codes
The PETSCII character set includes control codes that change the text (foreground) color. The following list is a concise mapping of PETSCII control-code byte values (decimal and hex) to their color names. These PETSCII codes are the control characters you embed in screen text output to change the current text color; they correspond to the C64 VIC-II 16-color palette (VIC-II color values 0–15).

Note: PETSCII color-setting codes appear in the control-code ranges $00–$1F and $80–$9F (see referenced chunks for the full control-code tables).

## Source Code
```text
PETSCII COLOR CODES SUMMARY

Dec  Hex   Color
---  ----  -----
  5  $05   White
 28  $1C   Red
 30  $1E   Green
 31  $1F   Blue
129  $81   Orange
144  $90   Black
149  $95   Brown
150  $96   Pink (Light Red)
151  $97   Dark Grey
152  $98   Grey (Medium Grey)
153  $99   Light Green
154  $9A   Light Blue
155  $9B   Light Grey
156  $9C   Purple
158  $9E   Yellow
159  $9F   Cyan

These correspond to the C64's 16 color palette (VIC-II color values 0-15).
```

## References
- "petscii_control_00_1f" — expands on control codes in the $00–$1F range (example: $05 White)
- "petscii_control_80_9f" — expands on control codes in the $80–$9F range (example: $81 Orange)
