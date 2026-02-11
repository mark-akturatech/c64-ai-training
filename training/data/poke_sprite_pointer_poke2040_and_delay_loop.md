# LINE 80 — POKE 2040,P and FOR delay (sprite pointer + timing)

**Summary:** POKE 2040,P writes the sprite pointer byte at decimal address 2040 ($07F8) to select a 64‑byte sprite shape (pointer value P, here P=192). The FOR T=1 TO 60 : NEXT loop is a simple frame delay controlling the sprite animation speed.

## Explanation
- POKE 2040,P writes the value in variable P to memory address 2040 (decimal) — the first byte of the 8‑byte sprite pointer table at $07F8–$07FF. Each pointer byte is an index to a 64‑byte block; the actual sprite data base address = pointer * 64. With P=192, the sprite data base = 192 * 64 = 12,288 decimal ($3000).
- In this program P is set earlier (line 45) to 192, so POKE 2040,P assigns the sprite pointer to the sprite shape stored at $3000.
- The BASIC statement FOR T=1 TO 60 : NEXT is a CPU‑burn delay loop. The loop count (60) determines the time between pointer updates and therefore the apparent animation speed. Increasing the count slows the animation; decreasing it speeds it up.
- The program later increments P (P = P + 1) to advance the pointer to the next 64‑byte sprite block (see referenced chunks for wrap/sequence behaviour).

## Source Code
```basic
45 P = 192
80 POKE 2040,P
90 FOR T = 1 TO 60 : NEXT
```

## Key Registers
- $07F8-$07FF - VIC-II (system RAM region used by VIC-II) - Sprite 0–7 pointer table (each byte = index of 64‑byte sprite block; address = byte * 64)

## References
- "increment_pointer_and_wrap_three_sprite_shapes" — explains P=P+1 and how the pointer advances/wraps through sprite shapes
- "sprite_data_blocks_and_animation_via_pointers" — details the DATA blocks stored at the pointer targets and how the pointer selects successive shapes