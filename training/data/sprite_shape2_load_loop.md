# LINE 25 — Load second sprite shape (POKE 63 DATA values into 12352–12414)

**Summary:** BASIC loop that READs 63 DATA bytes and POKEs them into memory $3040–$307E (decimal 12352–12414) to define the second sprite shape for sprite 0; note $303F (decimal 12351) is the skipped 64th slot of the previous block.

## Explanation
- The FOR loop runs S2 from 12352 to 12414 inclusive (decimal), which is 63 memory locations total (12414 − 12352 + 1 = 63).
- This block defines the second sprite shape for sprite zero by storing 63 bytes of sprite bitmap data into consecutive RAM locations starting at 12352 ($3040).
- Location 12351 ($303F) is intentionally skipped: it is the 64th location of the previous 64-byte sprite block and does not contain sprite-data numbers for this (second) shape. The source emphasizes that when storing consecutive sprite shapes you allocate 64 locations per shape, but only POKE sprite data into the first 63 locations of each block in this layout.
- READ Q2 reads the next DATA value from the program’s DATA statements (sequentially continuing after the first sprite’s DATA), providing the byte to be stored.
- POKE S2,Q2 writes that byte into the current memory location S2.
- NEXT increments S2 and repeats until the loop completes, storing all 63 bytes for the second sprite shape.

## Source Code
```basic
25 FOR S2 = 12352 TO 12414
   READ Q2
   POKE S2, Q2
NEXT
```

## References
- "sprite_shape1_load_loop" — expands on the first sprite shape stored immediately before this block  
- "sprite_shape3_load_loop" — expands on the third sprite shape stored immediately after this block  
- "sprite_pointer_setting_p_equals_192" — expands on pointer values that select which of these stored shapes sprite 0 uses
