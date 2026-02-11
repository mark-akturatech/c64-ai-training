# DATA DIRECTION REGISTER (DDR) — USER PORT ($DD03)

**Summary:** Data Direction Register for the USER port is at $DD03 (decimal 56579) on the C64; each bit controls one USER port line (PB0–PB7) where 1 = output and 0 = input. Use PEEK/POKE with a 0–255 decimal value (bitmask) to read or set the DDR.

## Description
- Address: $DD03 (decimal 56579). This is the DDR for the USER port lines (PB0–PB7) on CIA 2.
- Bit meaning: each bit in the 8-bit DDR corresponds to one physical USER port line:
  - Bit = 1 → corresponding PBx line is configured as an output.
  - Bit = 0 → corresponding PBx line is configured as an input.
- Bit numbering is 7..0 (MSB..LSB). To configure multiple lines as outputs, set the corresponding bits to 1 and write the resulting byte to $DD03.
- PEEK/POKE: BASIC PEEK and POKE expect decimal values 0–255. Convert a binary bit pattern into its decimal equivalent (sum of 2^n for each set bit) before using POKE.

Example behavior:
- Bit pattern: 7 6 5 4 3 2 1 0
  - VALUE: 0 0 1 1 1 0 0 0
  - Bits 5, 4, 3 are set → PB5, PB4, PB3 are outputs; all other PB lines are inputs.
  - Decimal value = 2^5 + 2^4 + 2^3 = 32 + 16 + 8 = 56
- To apply this in BASIC: POKE 56579,56

## Source Code
```text
Bit layout example (MSB->LSB):
  BIT #: 7 6 5 4 3 2 1 0
  VALUE: 0 0 1 1 1 0 0 0

Decimal conversion:
  2^5 + 2^4 + 2^3 = 32 + 16 + 8 = 56

BASIC examples:
  REM Read current DDR
  PRINT PEEK(56579)

  REM Set PB5, PB4, PB3 as outputs (others inputs)
  POKE 56579,56

  REM Clear all outputs (all inputs)
  POKE 56579,0

Notes:
  - PEEK(56579) returns a decimal 0-255 representing the current DDR bitmask.
  - POKE 56579,<0-255> writes the DDR bitmask to set input/output directions.
```

## Key Registers
- $DD03 - CIA 2 - USER port Data Direction Register (PB0–PB7): 1 = output, 0 = input

## References
- "user_port_connector_and_pin_descriptions" — maps USER port physical pins to PB0–PB7
- "user_port_flag1_and_pa2_handshaking" — explains special-case lines (FLAG1, PA2) and handshaking differences