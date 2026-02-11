# Commodore 64 — Screen Display Codes (Appendix B)

**Summary:** Screen memory (decimal 1024–2023 / $0400–$07E7) is filled with numeric character codes (0–127; add 128 for REVERSE). Color RAM is at decimal 55296–56295 / $D800–$DBE7. Two mutually exclusive character sets (upper/lower) are selected by keyboard (SHIFT+C=) or with VIC-II register $D018 (POKE 53272,21 / POKE 53272,23). Example: POKE 1504,81 draws the solid circle; POKE 55776,7 sets its color to yellow.

**Screen codes and usage**

- Screen memory contains one byte per on-screen character (40×25 = 1000 bytes). Default addresses: decimal 1024–2023 (hex $0400–$07E7). POKE the desired numeric code into a screen memory location to display that character.
- Character codes range from 0–127; to display the REVERSE (inverse) version of any character, add 128 to the code (producing values 128–255).
- Two built-in character sets exist (commonly called upper-case/graphics and lower-case/upper-case). Only one set is active at a time; characters from the other set cannot be displayed simultaneously.
  - Keyboard switch: Hold SHIFT + C= to toggle sets.
  - From BASIC (writes to VIC-II register $D018): POKE 53272,21 selects upper-case mode; POKE 53272,23 selects lower-case mode. (53272 decimal = $D018)
- Example usage:
  - Draw a solid circle at screen location 1504 (decimal): POKE 1504,81
  - Color memory is a parallel 1000-byte area controlling each character's color. Default color RAM addresses: decimal 55296–56295 (hex $D800–$DBE7). To set the circle to yellow (color code 7): POKE 55776,7
- For the full listing of character codes (codes 0–127 for both sets) and the reverse variants (128–255), see the complete mapping table below.

## Source Code

```text
Commodore 64 Character Set Mapping Table

SET 1 (Uppercase/Graphics) and SET 2 (Lowercase/Uppercase)

Code | SET 1 Char | SET 2 Char
-----|------------|------------
  0  |     @      |     @
  1  |     A      |     a
  2  |     B      |     b
  3  |     C      |     c
  4  |     D      |     d
  5  |     E      |     e
  6  |     F      |     f
  7  |     G      |     g
  8  |     H      |     h
  9  |     I      |     i
 10  |     J      |     j
 11  |     K      |     k
 12  |     L      |     l
 13  |     M      |     m
 14  |     N      |     n
 15  |     O      |     o
 16  |     P      |     p
 17  |     Q      |     q
 18  |     R      |     r
 19  |     S      |     s
 20  |     T      |     t
 21  |     U      |     u
 22  |     V      |     v
 23  |     W      |     w
 24  |     X      |     x
 25  |     Y      |     y
 26  |     Z      |     z
 27  |     [      |     [
 28  |     £      |     £
 29  |     ]      |     ]
 30  |     ↑      |     ↑
 31  |     ←      |     ←
 32  | (space)    | (space)
 33  |     !      |     !
 34  |     "      |     "
 35  |     #      |     #
 36  |     $      |     $
 37  |     %      |     %
 38  |     &      |     &
 39  |     '      |     '
 40  |     (      |     (
 41  |     )      |     )
 42  |     *      |     *
 43  |     +      |     +
 44  |     ,      |     ,
 45  |     -      |     -
 46  |     .      |     .
 47  |     /      |     /
 48  |     0      |     0
 49  |     1      |     1
 50  |     2      |     2
 51  |     3      |     3
 52  |     4      |     4
 53  |     5      |     5
 54  |     6      |     6
 55  |     7      |     7
 56  |     8      |     8
 57  |     9      |     9
 58  |     :      |     :
 59  |     ;      |     ;
 60  |     <      |     <
 61  |     =      |     =
 62  |     >      |     >
 63  |     ?      |     ?
 64  |     π      |     π
 65  |     A      |     A
 66  |     B      |     B
 67  |     C      |     C
 68  |     D      |     D
 69  |     E      |     E
 70  |     F      |     F
 71  |     G      |     G
 72  |     H      |     H
 73  |     I      |     I
 74  |     J      |     J
 75  |     K      |     K
 76  |     L      |     L
 77  |     M      |     M
 78  |     N      |     N
 79  |     O      |     O
 80  |     P      |     P
 81  |     Q      |     Q
 82  |     R      |     R
 83  |     S      |     S
 84  |     T      |     T
 85  |     U      |     U
 86  |     V      |     V
 87  |     W      |     W
 88  |     X      |     X
 89  |     Y      |     Y
 90  |     Z      |     Z
 91  |     [      |     [
 92  |     £      |     £
 93  |     ]      |     ]
 94  |     ↑      |     ↑
 95  |     ←      |     ←
 96  |     ░      |     ░
 97  |     ▒      |     ▒
 98  |     ▓      |     ▓
 99  |     ─      |     ─
100  |     │      |     │
101  |     ┌      |     ┌
102  |     ┐      |     ┐
103  |     └      |     └
104  |     ┘      |     ┘
105  |     ├      |     ├
106  |     ┤      |     ┤
107  |     ┬      |     ┬
108  |     ┴      |     ┴
109  |     ┼      |     ┼
110  |     ▀      |     ▀
111  |     ▄      |     ▄
112  |     █      |     █
113  |     ▌      |     ▌
114  |     ▐      |     ▐
115  |     ▀      |     ▀
116  |     ▄      |     ▄
117  |     █      |     █
118  |     ▌      |     ▌
119  |     ▐      |     ▐
120  |     ▀      |     ▀
121  |     ▄      |     ▄
122  |     █      |     █
123  |     ▌      |     ▌
124  |     ▐      |     ▐
125  |     ▀      |     ▀
126  |     ▄      |     ▄
127  |     █      |     █
```

*Note: To display the REVERSE (inverse) version of any character, add 128 to the code (producing values 128–255).*

*For a visual representation of the PETSCII character sets, refer to the PETSCII chart available at [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:C64_Petscii_Charts.png).*

## Key Registers

- $0400-$07E7 - Screen memory (VIC-II mapping) — character codes for 40×25 text screen (decimal 1024–2023)
- $D800-$DBE7 - Color RAM — one color byte per screen position (decimal 55296–56295)
- $D018 - VIC-II - character/ROM/select register (POKE 53272,21 = upper-case mode; POKE 53272,23 = lower-case mode)

## References

-

## Labels
- D018
