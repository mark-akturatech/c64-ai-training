# WAIT statement (Commodore 64 BASIC)

**Summary:** `WAIT <location>,<mask-1>[,<mask-2>]` suspends BASIC execution until a memory location's bits match a specified pattern by evaluating `(PEEK(location) AND mask-1) XOR mask-2`; numeric operands are converted to integers. Useful for polling hardware status (keys, tape, VIC‑II collision bits); can produce infinite pauses — recover with RUN/STOP + RESTORE.

**Description**
Type: Statement  
Format: `WAIT <location>,<mask-1>[,<mask-2>]`

Action: `WAIT` repeatedly examines the byte at `<location>` (equivalent to `PEEK(location)`), applies a bitwise AND with `<mask-1>`, then — if `<mask-2>` is supplied — exclusive‑ORs that result with `<mask-2>`. Program execution is suspended until the resulting value becomes non‑zero. In expression form:

`(PEEK(location) AND mask-1) XOR mask-2  <>  0`

If `<mask-2>` is omitted, the condition simplifies to `(PEEK(location) AND mask-1) <> 0`.

Behavior notes:
- `<location>`, `<mask-1>`, and `<mask-2>` may be any numeric expressions; they are coerced to integers.
- `mask-1` selects which bits to test (bits with 0 in `mask-1` are ignored).
- `mask-2` flips any tested bits so you can wait for bits to become 0 instead of 1; to test for a bit being 0, set that bit to 1 in `mask-2`.
- The statement can easily create an infinite halt if the tested condition never becomes true; recover by holding RUN/STOP and pressing RESTORE.

**Note:** The example address `36868` in the original text is outside the standard I/O range (`$D000–$DFFF`) and does not correspond to any known hardware register. This appears to be a typographical error. The typical VIC‑II sprite‑to‑background collision register is `$D01F` (decimal `53279`).

## Source Code
```basic
WAIT 1,32,32
WAIT 53273,6,6
WAIT 53279,144,16         (144 & 16 are masks. 144=10010000b and 16=00010000b.
                          The WAIT halts until the 128 bit is on or the 16 bit is off)
```

## Key Registers
- **53273 ($D019)**: VIC-II Interrupt Request Register. Bits:
  - Bit 0: Raster interrupt
  - Bit 1: Sprite-background collision
  - Bit 2: Sprite-sprite collision
  - Bit 3: Light pen interrupt
  - Bit 7: Interrupt flag (set if any interrupt condition is met)
- **53279 ($D01F)**: VIC-II Sprite-to-Background Collision Register. Each bit corresponds to a sprite (bit 0 for sprite 0, bit 7 for sprite 7); set to 1 if a collision with background graphics occurs.

## References
- "peek_function" — expands on PEEK and reading monitored memory locations
- "sprites_registers_and_pointers" — expands on WAIT usage for VIC-II sprite collision registers