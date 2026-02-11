# VICIRQ ($D019) — VIC Interrupt Flag Register

**Summary:** $D019 (VICIRQ) reports latched VIC-II IRQ sources (raster compare, sprite/background collision, sprite-sprite collision, light pen) and contains the overall VIC-II IRQ flag (bit 7). Bits are latched on set; write a 1 to a bit to clear that latched IRQ (default clear value $0F).

## Description
This register holds latched status bits for the VIC-II chip's interrupt sources. When a VIC-II condition eligible for an IRQ occurs, the corresponding bit in this register is set to 1 and latched; while latched, further occurrences of the same condition are ignored until the latch is cleared by software. Bit 7 is an OR of the other bits and indicates that the VIC-II chip is the source of an IRQ.

Typical IRQ handling sequence:
- Confirm VIC-II caused the IRQ by testing bit 7.
- Read individual bits (0–3) to determine which condition(s) occurred.
- Clear serviced source(s) by writing a 1 to the corresponding bit(s) in $D019.
- The usual default write value $0F ($00001111b) clears bits 0–3 (all standard VIC IRQ sources).

Relevant related registers:
- Raster compare register: $D012 — the raster line that triggers the raster IRQ when enabled.
- Sprite collision registers: $D01E–$D01F — report which sprites collided (see referenced chunk).

## Source Code
```text
$D019        VICIRQ       VIC Interrupt Flag Register

Bit 0    Flag: Is the Raster Compare a possible source of an IRQ? (1 = yes)
Bit 1    Flag: Is a collision between a sprite and the normal graphics display a possible source of an IRQ? (1 = yes)
Bit 2    Flag: Is a collision between two sprites a possible source of an IRQ? (1 = yes)
Bit 3    Flag: Is the light pen trigger a possible source of an IRQ? (1 = yes)
Bits 4-6 Not used
Bit 7    Flag: Is there any VIC-II chip IRQ source which could cause an IRQ? (1 = yes)

Behavior notes:
- When a condition is met, the corresponding bit is set and latched.
- Latched bits prevent subsequent same-source IRQs until cleared.
- To clear a latched bit, write a 1 to that bit position in $D019.
- Default write value $0F clears all standard interrupt bits (bits 0–3).
```

## Key Registers
- $D019 - VIC-II - VIC Interrupt Flag Register (latched IRQ status; write 1 to clear)

## References
- "d01a_irqmask_and_raster_interrupts" — Masking and enabling VIC interrupts
- "sprite_collision_registers" — Which registers to read to determine colliding sprites ($D01E-$D01F)

## Labels
- VICIRQ
