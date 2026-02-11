# VIC-II Raster Register ($D012)

**Summary:** The VIC-II raster register at $D012 returns the lower 8 bits of the current raster line and is used for raster-compare interrupts; the MSB of the raster is in $D011. Writing $D012 (and $D011 for the MSB) stores a compare value that sets a bit in the interrupt/status register $D019 when the current raster equals the stored value.

## Raster register description
The VIC-II raster register is located at $D012 (decimal 53266). Its functions:

- Read: returns the lower 8 bits of the current raster line counter. The most significant bit (MSB) of the raster line is stored in $D011.
- Write: writing $D012 (and $D011 for the MSB) saves the value as the raster-compare target. When the current raster equals this stored value, the VIC-II sets the corresponding raster-compare bit in the interrupt status register ($D019).
- Usage: raster-compare is used to time screen changes (split-screen effects, mode switches) to avoid visible flicker. Make screen changes when the raster is outside the visible display area — the source notes dot positions between lines 51 and 251 as the visible area, so perform updates outside that range.
- Interrupts: if the raster-compare interrupt bit is enabled in the interrupt enable register, the set bit in $D019 will cause an IRQ.

(Write both $D012 and $D011 to set a full 9-bit compare value.)

## Key Registers
- $D012 - VIC-II - Raster register (low 8 bits; read returns current raster low byte; write stores raster-compare low byte)
- $D011 - VIC-II - Control register containing raster MSB (bit used with $D012 for full raster value)
- $D019 - VIC-II - Interrupt status/enable register (raster-compare bit set here when compare matches)

## References
- "interrupt_status_and_enable_registers_and_usage" — expands on raster-compare setting a bit in the interrupt status register and interrupt enable usage

## Labels
- $D012
- $D011
- $D019
