# Sprite pointer wrap: P=P+1 ; IF P>194 THEN P=192

**Summary:** Explains the BASIC pointer increment and wrap test that cycles a sprite pointer variable P through three 64‑byte sprite shape pages (values 192, 193, 194). Shows the page-to-address mapping (address = P * 64) with decimal and hex ranges ($3000, $3040, $3080).

## Explanation
P is used as a sprite-data page pointer (an 8‑bit page number where each page is 64 bytes). Each time the code runs it increments P by 1, then tests whether P has exceeded 194; if so it resets P back to 192. This makes P run the sequence:

192 → 193 → 194 → 192 → ...

Because each pointer value selects a consecutive 64‑byte block in memory, the sprite will be pointed to three successive shape blocks, producing frame-by-frame animation as the program cycles.

Key facts:
- Sprite page formula: start_address = P * 64 (bytes).
- Each sprite shape block = 64 bytes long.
- The listed decimal endpoints in the original source were off by one; the correct inclusive ranges are shown below.
- This implementation prevents P from ever becoming 195 by resetting immediately when P>194.

**[Note: Source may contain an error — the original decimal end addresses appear to be off by one; corrected ranges below use the standard 64-byte page mapping.]**

## Source Code
```basic
85 P = P + 1 : IF P > 194 THEN P = 192
```

```text
Pointer -> 64-byte block mapping (decimal and hex)

P = 192  -> start 12288  -> end 12351   -> hex $3000 - $303F
P = 193  -> start 12352  -> end 12415   -> hex $3040 - $307F
P = 194  -> start 12416  -> end 12479   -> hex $3080 - $30BF

(note: start = P * 64 ; end = start + 63)
```

## References
- "sprite_pointer_sound_triggers_gosub200_and_gosub300" — which pointer values (192, 193) also invoke waveform/sound subroutines
- "sprite_data_blocks_and_animation_via_pointers" — expanded mapping of DATA blocks and how they map to sprite shapes
