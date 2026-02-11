# Sprite 4 & 5 Position Registers (SPR4X / SPR4Y / SPR5X / SPR5Y)

**Summary:** VIC-II sprite position registers for sprite 4 and sprite 5: horizontal (SPRnX) and vertical (SPRnY) low-byte addresses ($D009–$D00C). These registers hold the low 8 bits of each sprite's X/Y position (X MSB bits reside in the XMSB register).

**Description**
SPR4X / SPR4Y and SPR5X / SPR5Y are VIC-II registers that store the low 8 bits of the on-screen position for sprites 4 and 5:

- **SPR4X** — sprite 4 horizontal position low byte ($D009)
- **SPR4Y** — sprite 4 vertical position low byte ($D00A)
- **SPR5X** — sprite 5 horizontal position low byte ($D00B)
- **SPR5Y** — sprite 5 vertical position low byte ($D00C)

The high X-bit for each sprite is stored in the XMSB register ($D010); XMSB provides one extra X bit per sprite, allowing for horizontal positions beyond 255 pixels.

## Source Code
```text
Register | Function                      | Address
---------|-------------------------------|--------
SPR4X    | Sprite 4 Horizontal Position  | $D009
SPR4Y    | Sprite 4 Vertical Position    | $D00A
SPR5X    | Sprite 5 Horizontal Position  | $D00B
SPR5Y    | Sprite 5 Vertical Position    | $D00C
```

## Key Registers
- $D009–$D00C — VIC-II — Sprite 4–5 X/Y position low bytes (SPR4X, SPR4Y, SPR5X, SPR5Y)

## References
- "sprite_position_registers_0_1" — expands on position registers for sprites 0 and 1 and the table header
- "sprite_position_registers_2_3" — expands on position registers for sprites 2 and 3
- "sprite_position_registers_6_7_and_xmsb" — expands on position registers for sprites 6 and 7 and the XMSB register

## Labels
- SPR4X
- SPR4Y
- SPR5X
- SPR5Y
