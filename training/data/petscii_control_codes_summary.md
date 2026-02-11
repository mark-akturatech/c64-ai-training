# PETSCII Control Codes Summary ($00-$9F)

**Summary:** Concise reference of frequently used PETSCII control codes with decimal/hex values and actions (e.g. Stop/RUN-STOP $03, charset switches $0E/$8E, cursor moves $11/$91/$1D/$9D, Reverse $12/$92, Clear Screen $93, Insert $94, function-key tokens $85-$8C). Includes common keyboard/token mappings used by C64 screen I/O and BASIC.

## Description
This chunk lists commonly used PETSCII control codes in the $00-$1F and $80-$9F control ranges with their decimal and hex values and the corresponding action or token. Codes include system keys (RUN/STOP, Run), Commodore-Shift enable/disable, Return vs Shift-Return, charset switch codes (lowercase/uppercase vs uppercase/graphics), cursor movement, screen editing (Home, Delete, Insert, Clear Screen), Reverse video on/off, and function-key tokens (F1–F8 mapped to PETSCII token values). (PETSCII = C64 screen/keyboard codes.)

## Source Code
```text
PETSCII CONTROL CODES SUMMARY

Dec  Hex   Action
---  ----  ------
  3  $03   Stop (RUN/STOP)
  8  $08   Disable Commodore-Shift
  9  $09   Enable Commodore-Shift
 13  $0D   Return
 14  $0E   Switch to lowercase/uppercase charset
 17  $11   Cursor Down
 18  $12   Reverse On
 19  $13   Home
 20  $14   Delete
 29  $1D   Cursor Right
131  $83   Run
133  $85   F1
134  $86   F3
135  $87   F5
136  $88   F7
137  $89   F2
138  $8A   F4
139  $8B   F6
140  $8C   F8
141  $8D   Shift-Return
142  $8E   Switch to uppercase/graphics charset
145  $91   Cursor Up
146  $92   Reverse Off
147  $93   Clear Screen
148  $94   Insert
157  $9D   Cursor Left
```

## References
- "petscii_control_00_1f" — full listing and descriptions for $00-$1F control codes
- "petscii_control_80_9f" — full listing and descriptions for $80-$9F control codes
