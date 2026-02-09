# Crunching your sprite programs (two-line BASIC example)

**Summary:** Demonstrates "crunching" (condensing) a BASIC sprite initialization into two lines using V=53248 ($D000 — VIC‑II base), POKE to the sprite pointer table (2040 / $07F8), and a FOR loop to fill sprite bitmap bytes (832–894). Shows compressed statements with colons and the PRINTCHR$(147) clear-screen trick.

## Crunching explanation
The example shows how separate BASIC setup lines can be combined onto fewer lines by separating statements with ":" (colon). V is used as a variable holding 53248 (decimal = $D000), the VIC‑II base address; subsequent POKE V+offset writes target VIC registers. POKE 2040,13 writes to the sprite pointer table at address 2040 (decimal = $07F8) assigning sprite memory block 13 (13*64 = 832). The FOR loop POKE S,255 fills the sprite bitmap bytes from 832 to 894 with 255 (solid pixels).

Do not alter semantics when crunched: use correct commas in POKE statements and preserve the FOR/NEXT structure. PRINTCHR$(147) (clear screen) is commonly placed at the start of a compressed line to clear the screen before setup.

## Source Code
```basic
10 PRINTCHR$(147):V=53248:POKE V+21,1:POKE 2040,13:POKE V+39,1
20 FOR S=832 TO 894:POKE S,255:NEXT:POKE V,24:POKE V+1,100
```

## Key Registers
- $D000-$D02E - VIC-II - VIC register block (V=53248 used as base; offsets like V+1, V+21, V+39 referenced)
- $07F8-$07FF - RAM - Sprite pointer table (POKE 2040,13 sets sprite 0 pointer to block 13 -> address 832)

## References
- "sprite_program_overview_and_pointer_setup" — expands on the original multi-line program being crunched
- "sprite_bitmap_memory_blocks_and_manual_editing" — expands on the FOR loop that fills sprite bytes 832..894