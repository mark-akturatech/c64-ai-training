# PETSCII control codes $80–$9F (decimal 128–159)

**Summary:** PETSCII control codes in the $80–$9F range (128–159) include color-setting codes (e.g. $81 = Orange, $90 = Black, $9F = Cyan), cursor and editing controls (Cursor Up/Left, Insert, Clear), mode controls (Switch charset, Shift-Return), Run, and an atypical mapping of function keys F1–F8.

## Description
This chunk documents the PETSCII control-code meanings for the byte values $80–$9F (decimal 128–159). These are control characters in the upper PETSCII control range used by the C64 text console and keyboard handling:

- Several byte values set text color (listed individually in the table). These are single-byte control codes that change the foreground color used for subsequent text.
- Run ($83) triggers program execution (the "RUN" key behavior).
- Shift-Return ($8D) produces a carriage return without linefeed (CR-only behavior).
- $8E switches the character set to uppercase/graphics (charset mode toggle).
- Cursor and editing controls: Cursor Up ($91), Cursor Left ($9D), Insert ($94), Clear screen ($93).
- Video attribute control: Reverse Off ($92) disables reverse-video.
- Function keys F1–F8 are encoded in a non-linear order in PETSCII: $85..$8C map to F1,F3,F5,F7,F2,F4,F6,F8 respectively (see table below).
- Unused codes in this range are explicitly listed as "(unused)".

(Parenthetical clarifications: "Shift-Return (CR-only)" and "charset switch (uppercase/graphics)".)

## Source Code
```text
PETSCII CONTROL CODES ($80-$9F)

Dec  Hex   Description
---  ----  -----------
128  $80   (unused)
129  $81   Orange (set text color to orange)
130  $82   (unused)
131  $83   Run (triggers program execution)
132  $84   (unused)
133  $85   F1 (function key 1)
134  $86   F3 (function key 3)
135  $87   F5 (function key 5)
136  $88   F7 (function key 7)
137  $89   F2 (function key 2)
138  $8A   F4 (function key 4)
139  $8B   F6 (function key 6)
140  $8C   F8 (function key 8)
141  $8D   Shift-Return (carriage return without linefeed)
142  $8E   Switch to uppercase/graphics character set
143  $8F   (unused)
144  $90   Black (set text color to black)
145  $91   Cursor Up
146  $92   Reverse Off (reverse video off)
147  $93   Clear (clear screen)
148  $94   Insert (insert character)
149  $95   Brown (set text color to brown)
150  $96   Pink (set text color to light red/pink)
151  $97   Dark Grey (set text color to dark grey)
152  $98   Grey (set text color to medium grey)
153  $99   Light Green (set text color to light green)
154  $9A   Light Blue (set text color to light blue)
155  $9B   Light Grey (set text color to light grey)
156  $9C   Purple (set text color to purple)
157  $9D   Cursor Left
158  $9E   Yellow (set text color to yellow)
159  $9F   Cyan (set text color to cyan)
```

## References
- "petscii_color_codes_summary" — expands on color-setting control codes in $80-$9F (e.g. $81 Orange)
- "petscii_control_codes_summary" — canonical summary of control actions across PETSCII ranges

## Labels
- ORANGE
- BLACK
- BROWN
- LIGHT_RED
- DARK_GRAY
- GRAY
- LIGHT_GREEN
- LIGHT_BLUE
- LIGHT_GRAY
- PURPLE
- YELLOW
- CYAN
