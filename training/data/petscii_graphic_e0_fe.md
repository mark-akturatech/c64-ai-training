# PETSCII Graphic Characters $E0-$FE (copies of $A0-$BE)

**Summary:** PETSCII character codes $E0-$FE (decimal 224–254) are graphic-character duplicates of $A0-$BE; this chunk lists the byte values, hex codes, PETSCII glyph names and the corresponding original $A0-$BE code each copies.

## Description
Codes in the range $E0-$FE are not unique glyphs on the Commodore 64 — each is a direct copy of the corresponding code in the $A0-$BE range. Use these values interchangeably with their $A0-$BE counterparts when working with PETSCII graphic characters (for screen output, font tables, or character-based graphics). Decimal equivalents are 224 through 254.

## Source Code
```text
PETSCII GRAPHIC CHARACTERS ($E0-$FE) - COPIES OF $A0-$BE

Dec  Hex   Character (same as)
---  ----  -------------------
224  $E0   Shift-Space               (copy of $A0)
225  $E1   Graphic: CBM-K            (copy of $A1)
226  $E2   Graphic: Shift-+          (copy of $A2)
227  $E3   Graphic: CBM-I            (copy of $A3)
228  $E4   Graphic: CBM-T            (copy of $A4)
229  $E5   Graphic: CBM-@            (copy of $A5)
230  $E6   Graphic: CBM-L            (copy of $A6)
231  $E7   Graphic: CBM-Y            (copy of $A7)
232  $E8   Graphic: CBM-G            (copy of $A8)
233  $E9   Graphic: Shift-Pound      (copy of $A9)
234  $EA   Graphic: CBM-J            (copy of $AA)
235  $EB   Graphic: CBM-+            (copy of $AB)
236  $EC   Graphic: CBM--            (copy of $AC)
237  $ED   Graphic: CBM-H            (copy of $AD)
238  $EE   Graphic: CBM-Z            (copy of $AE)
239  $EF   Graphic: CBM-S            (copy of $AF)
240  $F0   Graphic: CBM-E            (copy of $B0)
241  $F1   Graphic: CBM-Q            (copy of $B1)
242  $F2   Graphic: CBM-W            (copy of $B2)
243  $F3   Graphic: Shift-*          (copy of $B3)
244  $F4   Graphic: CBM-A            (copy of $B4)
245  $F5   Graphic: Shift-up arrow   (copy of $B5)
246  $F6   Graphic: CBM-X            (copy of $B6)
247  $F7   Graphic: CBM-V            (copy of $B7)
248  $F8   Graphic: CBM-N            (copy of $B8)
249  $F9   Graphic: CBM-C            (copy of $B9)
250  $FA   Graphic: CBM-D            (copy of $BA)
251  $FB   Graphic: CBM-F            (copy of $BB)
252  $FC   Graphic: CBM-B            (copy of $BC)
253  $FD   Graphic: Shift--          (copy of $BD)
254  $FE   Graphic: CBM-period       (copy of $BE)
```

## References
- "petscii_graphic_a0_bf" — original definitions for $A0-$BF (source of the glyphs copied by $E0-$FE)