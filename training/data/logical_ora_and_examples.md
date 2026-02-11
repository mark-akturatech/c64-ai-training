# ORA — Logical OR to A

**Summary:** Description of the 6502 ORA (bitwise OR with the Accumulator) behavior and a truth table showing how ORA masks force bits on. Includes an example turning on bits 4–6 of $C7 using ORA #$70 (mask 01110000b).

## Behavior
ORA performs a bitwise inclusive-OR between each bit of the A (accumulator) register and the corresponding bit of the operand (immediate or memory). For each bit position:
- If the mask bit is 1, the resulting A bit is forced to 1.
- If the mask bit is 0, the resulting A bit retains its original value.

This makes ORA suitable for selectively turning bits on while leaving other bits unchanged.

## Source Code
```text
Truth table (Original A bit OR Mask bit => Resulting A bit)

Original A Bit    Mask     Resulting A Bit
------------------------------------------
      0            0             0
      1            0             1
      0            1             1
      1            1             1
```

```text
Example: Turn on bits 4, 5, and 6 in value $C7

Original value:      11000111   ($C7)
Mask (ORA #$70):     01110000   ($70)
                    ------------
Result:              11110111   ($F7)
                      ^^^
Bits 4, 5, 6 were forced on; other bits unchanged.
```

```asm
; equivalent 6502 assembly sequence (illustrative)
    LDA #$C7       ; A = %11000111
    ORA #$70       ; mask %01110000 -> A = %11110111 ($F7)
```

## References
- "logical_and_and_examples" — expands on AND turning bits off (complementary masking technique)
- "logical_eor_and_examples" — expands on EOR flipping bits (bitwise toggle technique)

## Mnemonics
- ORA
