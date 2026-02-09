# Crunching BASIC DATA — crunched sprite loader (lines 10–40, 100–102, 200)

**Summary:** Example of "crunching" BASIC DATA statements into consecutive DATA lines to load a 63-byte sprite into RAM (POKE 832+n). Shows use of VIC-II base $D000 (53248), border/background pokes ($D020/$D021), and pokes to VIC registers used for sprite control/position ($D015, $D004/$D005) and a poke at $D022 (v+34).

## Description
This chunk demonstrates how to reduce BASIC program size by concatenating DATA statements (crunching) and using a FOR...READ...POKE loop to transfer sprite bytes into RAM.

- The program clears the screen and sets border/background colors with POKEs to 53280 and 53281 ($D020/$D021).
- v is set to 53248 (the VIC-II base, $D000). The sample then does POKE v+34,3 (i.e. poke $D022), and makes other control pokes referenced by the original material.
- A FOR n = 0 TO 62 / READ q / POKE 832 + n, q loop writes 63 DATA bytes into RAM starting at address 832 (decimal, $0340). The DATA statements are crunched together across lines 100–102.
- A placement line sets X and Y and pokes them to 53252 and 53253 (sprite position/pointer registers in this sample).
- This is a compact pattern useful for storing sprite bitmaps directly in memory in a small BASIC loader.

No additional behavioral claims about individual VIC-II bitfields are made beyond the addresses explicitly used in the sample.

## Source Code
```basic
10 print"{clear}":poke53280,5:poke53281,6
20 v=53248:pokev+34,3
30 poke 53269,4:poke2042,13
40 forn=0to62:readq:poke832+n,q:next
100 data255,255,255,128,0,1,128,0,1,128,0,1,144,0,1,144,0,1,144,0,1,144,0
101 data1,144,0,1,144,0,1,144,0,1,144,0,1,144,0,1,144,0,1,128,0,1,128,0,1
102 data128,0,1,128,0,1,128,0,1,128,0,1,255,255,255
200 x=200:y=100:poke53252,x:poke53253,y
```

## Key Registers
- $D000-$D02E - VIC-II - VIC-II register block (sprite X/Y, control, raster, collision, etc.)
- $D020 - VIC-II - Border color (poke 53280 in sample)
- $D021 - VIC-II - Background color (poke 53281 in sample)
- $D015 - VIC-II - Sprite/control register (poke 53269 in sample)
- $D004-$D005 - VIC-II - Sprite position/pointer registers (poke 53252/53253 in sample)
- $D022 - VIC-II - Register poked by v+34 (v=$D000, so $D022 was poked in sample)

## References
- "smooth_and_reverse_sprite_movement_plus_vertical_scrolling" — techniques for sprite movement after loading (wrap, X settings, vertical scroll)
- "michael_s_dancing_mouse_example_program" — full example animation demonstrating loading multiple sprites and movement techniques described earlier