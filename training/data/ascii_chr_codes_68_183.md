# CHR$ Table — Codes 68–183 (uppercase letters, PETSCII graphic characters, control codes, C= graphics)

**Summary:** C64 CHR$ printable-character table for decimal codes 68–183 covering uppercase letters (68–90), punctuation/special (91–95), Shift key graphic characters (96–127: box-drawing lines, card suits spade/heart/diamond/club, circles, diagonals, rounded corners, pi), control codes (128–159: colors, function keys, cursor), and Commodore key graphic characters (160–183: half/quarter/eighth blocks, box-drawing corners and T-junctions, checkerboard, triangles).

## Description
CHR$ table for PRINT CHR$(X) on the C64 in default uppercase/graphics mode, codes 68–183. Four character categories:

- **68–95:** Uppercase letters A–Z and punctuation symbols ([ £ ] ↑ ←).
- **96–127:** Shift key PETSCII graphic characters. These are the graphics printed on the left-front of the C64 keyboard keys, accessed by holding Shift. Includes horizontal and vertical box-drawing lines (at various offsets: center, quarter-up, quarter-down, top, bottom, left, right), four card suits (♠ ♥ ♦ ♣), filled and outline circles, diagonal lines and diagonal cross, four rounded box corners, thin corner brackets, a checkered half-block, pi symbol, and upper-right triangle. CHR$(96–127) display the same characters as CHR$(192–223).
- **128–159:** Control codes (no visible character). Includes color switches (orange, black, brown, light red, greys, light green, light blue), function keys (F1–F8), shift+return, and uppercase mode switch.
- **160–183:** Commodore (C=) key PETSCII graphic characters. These are the graphics on the right-front of keyboard keys, accessed by holding the Commodore key. Includes left/lower half blocks, upper/lower/left/right eighth-blocks, quarter blocks, three-eighths blocks, medium shade checkerboard, box-drawing corners (┌ └ ┐) and T-junctions (├ ┤ ┬ ┴), small square quadrants, and upper-left triangle. CHR$(160–191) display the same characters as CHR$(224–254).

## Source Code
```text
CHR$ table — decimal codes 68..183 (C64 uppercase/graphics mode)

Column:  68–96 (uppercase letters and Shift key graphics)
 68   D
 69   E
 70   F
 71   G
 72   H
 73   I
 74   J
 75   K
 76   L
 77   M
 78   N
 79   O
 80   P
 81   Q
 82   R
 83   S
 84   T
 85   U
 86   V
 87   W
 88   X
 89   Y
 90   Z
 91   [
 92   £ pound sign
 93   ]
 94   ↑ up arrow
 95   ← left arrow
 96   ─ horizontal line (center of cell)

Column:  97–125 (Shift key PETSCII graphic characters)
 97   ♠ spade suit
 98   │ vertical line (center of cell)
 99   ─ horizontal line (same as 96)
100   ─ horizontal line (offset one quarter up from center)
101   ─ horizontal line (top of cell, two quarters up)
102   ─ horizontal line (offset one quarter down from center)
103   │ vertical line (offset one quarter left of center)
104   │ vertical line (offset one quarter right of center)
105   ╮ rounded corner / arc down and left
106   ╰ rounded corner / arc up and right
107   ╯ rounded corner / arc up and left
108   ⌐ one-eighth block corner (up and right)
109   ╲ diagonal line, upper-left to lower-right
110   ╱ diagonal line, upper-right to lower-left
111   one-eighth block corner (down and right)
112   one-eighth block corner (down and left)
113   ● black circle (filled)
114   ─ horizontal line (bottom of cell, two quarters down)
115   ♥ heart suit
116   │ vertical line (left edge of cell, two quarters left)
117   ╭ rounded corner / arc down and right
118   ╳ diagonal cross
119   ○ white circle (outline)
120   ♣ club suit
121   │ vertical line (right edge of cell, two quarters right)
122   ♦ diamond suit
123   ┼ cross / vertical and horizontal intersection
124   ▒ left half medium shade (checkered pattern)
125   │ vertical line (same as 98)

Column: 126–154 (Shift graphics continued, then control codes)
126   π pi (Greek letter)
127   ◥ black upper-right triangle
128   (control code — no visible character)
129   {orange}
130   (control code — no visible character)
131   (control code — no visible character)
132   (control code — no visible character)
133   f1
134   f3
135   f5
136   f7
137   f2
138   f4
139   f6
140   f8
141   shift+ret.
142   upper case
143   (control code — no visible character)
144   {black}
145   {up}
146   {rvs off}
147   {clear}
148   {inst}
149   {brown}
150   {lt. red}
151   {grey 1}
152   {grey 2}
153   {lt.green}
154   {lt.blue}

Column: 155–183 (control codes continued, then C= key graphics)
155   {grey 3}
156   {purple}
157   {left}
158   {yellow}
159   {cyan}
160   SPACE (non-breaking, Shift+Space)
161   ▌ left half block
162   ▄ lower half block
163   ▔ upper one-eighth block (thin line at top of cell)
164   ▁ lower one-eighth block (thin line at bottom of cell)
165   ▏ left one-eighth block (thin line at left of cell)
166   ▒ medium shade / checkerboard pattern
167   ▕ right one-eighth block (thin line at right of cell)
168   ▒ lower half medium shade (lower half checkered)
169   ◤ black upper-left triangle
170   right one-quarter block
171   ├ box corner: vertical and right (T-junction, right-facing)
172   ▗ small filled square, lower-right quadrant
173   └ box corner: up and right (lower-left corner of box)
174   ┐ box corner: down and left (upper-right corner of box)
175   ▂ lower one-quarter block
176   ┌ box corner: down and right (upper-left corner of box)
177   ┴ box junction: up and horizontal (T-junction, upward)
178   ┬ box junction: down and horizontal (T-junction, downward)
179   ┤ box junction: vertical and left (T-junction, left-facing)
180   ▎ left one-quarter block
181   ▍ left three-eighths block
182   right three-eighths block
183   upper one-quarter block
```

## Key Registers
(omitted — this chunk documents printable CHR$ mappings, not hardware registers)

## References
- "appendix_c_intro_and_ascii_chr_codes_0_63" — initial CHR$ table and introduction covering codes 0–63
- "ascii_chr_codes_184_191_and_extended_mappings" — final CHR$ entries (184–191) and notes on 192–255 mappings
