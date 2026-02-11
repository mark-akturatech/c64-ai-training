# LOAD THIRD SPRITE SHAPE INTO RAM (12416–12478)

**Summary:** Loads the third 63-byte sprite shape for sprite 0 into RAM addresses 12416–12478 using a BASIC FOR/READ/POKE loop; DATA statements supply the 63 bytes (sprite shape), and a sprite pointer (P) is used elsewhere to point sprite 0 at this block.

## Description
This BASIC loop reads the final block of 63 DATA values and writes them sequentially into memory locations 12416 through 12478 (inclusive). The loop variables and statements:

- FOR S3=12416 TO 12478 — iterates the destination address S3 over the 63-byte range (12478 − 12416 + 1 = 63).
- READ Q3 — reads the next numeric constant from the program DATA statements into variable Q3.
- POKE S3,Q3 — stores the byte value Q3 into the memory location held in S3.
- NEXT — advances S3 and repeats until the block is complete.

This block defines the third shape (third frame) usable by sprite 0. The program references related blocks (first and second shape blocks) and uses a sprite pointer P (see referenced chunk "sprite_pointer_setting_p_equals_192") to point sprite 0 at any of these three 63-byte shape blocks.

Note: A standard C64 hardware sprite shape is 63 bytes (bitmap for a single sprite image).

## Source Code
```basic
30 FOR S3=12416 TO 12478
   READ Q3
   POKE S3,Q3
NEXT
```

(Associated DATA statements supplying the 63 byte values are expected elsewhere in the program.)

## References
- "sprite_shape1_load_loop" — expands on First shape block for rotating shapes through sprite 0
- "sprite_shape2_load_loop" — expands on Second shape block for rotating shapes through sprite 0
- "sprite_pointer_setting_p_equals_192" — expands on Pointer P values used to point sprite 0 at any of these three blocks