# C64 PETSCII Reverse-Video Mapping $C0-$FF (192–255)

**Summary:** Reverse-video PETSCII glyph mappings for decimal 192–255 (hex $C0–$FF), showing each high-set code, its corresponding low-set/normal equivalent ($40–$7F), and the Commodore-specific graphic/shift-variant name (CBM symbols, shift variants, Reverse Shift-Space). Useful for PETSCII rendering, charset conversion, or lookup of reverse-graphic glyphs.

## Reverse-Video Mapping $C0-$FF
This table lists the PETSCII codes $C0 through $FF (decimal 192–255) which are the "reverse" variants of the $40–$7F character set: the glyph appears inverted (reverse video) compared to its $40–$7F counterpart. Entries show: decimal value, high-set hex ($C0–$FF), low-set equivalent hex ($40–$7F) and the glyph/label (letters, graphic blocks, Commodore/CBM symbols, shift variants). Notable entries: $E0 ($60) is Reverse Shift-Space; many entries are CBM graphics (Commodore-specific symbols). Use these mappings when generating reverse-video text or converting between PETSCII halves.

## Source Code
```text
192  $C0   $40          Reverse Horizontal line / Shift-@
193  $C1   $41          Reverse Graphic / A
194  $C2   $42          Reverse Graphic / B
195  $C3   $43          Reverse Graphic / C
196  $C4   $44          Reverse Graphic / D
197  $C5   $45          Reverse Graphic / E
198  $C6   $46          Reverse Graphic / F
199  $C7   $47          Reverse Graphic / G
200  $C8   $48          Reverse Graphic / H
201  $C9   $49          Reverse Graphic / I
202  $CA   $4A          Reverse Graphic / J
203  $CB   $4B          Reverse Graphic / K
204  $CC   $4C          Reverse Graphic / L
205  $CD   $4D          Reverse Graphic / M
206  $CE   $4E          Reverse Graphic / N
207  $CF   $4F          Reverse Graphic / O
208  $D0   $50          Reverse Graphic / P
209  $D1   $51          Reverse Graphic / Q
210  $D2   $52          Reverse Graphic / R
211  $D3   $53          Reverse Graphic / S
212  $D4   $54          Reverse Graphic / T
213  $D5   $55          Reverse Graphic / U
214  $D6   $56          Reverse Graphic / V
215  $D7   $57          Reverse Graphic / W
216  $D8   $58          Reverse Graphic / X
217  $D9   $59          Reverse Graphic / Y
218  $DA   $5A          Reverse Graphic / Z
219  $DB   $5B          Reverse Graphic / Shift-+
220  $DC   $5C          Reverse Graphic / CBM--
221  $DD   $5D          Reverse Graphic / Shift--
222  $DE   $5E          Reverse Graphic / Pi symbol
223  $DF   $5F          Reverse Graphic / CBM-+
224  $E0   $60          Reverse Shift-Space
225  $E1   $61          Reverse Graphic: CBM-K
226  $E2   $62          Reverse Graphic: Shift-+
227  $E3   $63          Reverse Graphic: CBM-I
228  $E4   $64          Reverse Graphic: CBM-T
229  $E5   $65          Reverse Graphic: CBM-@
230  $E6   $66          Reverse Graphic: CBM-L
231  $E7   $67          Reverse Graphic: CBM-Y
232  $E8   $68          Reverse Graphic: CBM-G
233  $E9   $69          Reverse Graphic: Shift-Pound
234  $EA   $6A          Reverse Graphic: CBM-J
235  $EB   $6B          Reverse Graphic: CBM-+
236  $EC   $6C          Reverse Graphic: CBM--
237  $ED   $6D          Reverse Graphic: CBM-H
238  $EE   $6E          Reverse Graphic: CBM-Z
239  $EF   $6F          Reverse Graphic: CBM-S
240  $F0   $70          Reverse Graphic: CBM-E
241  $F1   $71          Reverse Graphic: CBM-Q
242  $F2   $72          Reverse Graphic: CBM-W
243  $F3   $73          Reverse Graphic: Shift-*
244  $F4   $74          Reverse Graphic: CBM-A
245  $F5   $75          Reverse Graphic: Shift-up arrow
246  $F6   $76          Reverse Graphic: CBM-X
247  $F7   $77          Reverse Graphic: CBM-V
248  $F8   $78          Reverse Graphic: CBM-N
249  $F9   $79          Reverse Graphic: CBM-C
250  $FA   $7A          Reverse Graphic: CBM-D
251  $FB   $7B          Reverse Graphic: CBM-F
252  $FC   $7C          Reverse Graphic: CBM-B
253  $FD   $7D          Reverse Graphic: Shift--
254  $FE   $7E          Reverse Graphic: CBM-period
255  $FF   $7F          Reverse Graphic: CBM-R
```

## References
- "reverse_video_punctuation_numbers_space" — expands previous table section: punctuation, space and digits
- "reverse_video_intro" — overview: codes $80–$FF are reverse equivalents of $00–$7F