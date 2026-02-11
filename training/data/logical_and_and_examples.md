# AND — Logical AND to A (6502)

**Summary:** Describes the 6502 AND instruction (mnemonic AND) applied to the accumulator A for bitwise masking; includes the truth table showing how AND can turn bits off and an example masking bits 4–6 of $C7 using immediate operand #$8F producing $87.

## Description
AND performs a bitwise logical AND between the accumulator (A) and a value (immediate, zero page, absolute, indexed, or indirect modes). For each corresponding bit:

- If the mask bit is 0, the resulting A bit is forced to 0.
- If the mask bit is 1, the resulting A bit remains the same as the original A bit.

This makes AND useful to selectively clear (turn off) bits in A while leaving other bits unchanged. Flags affected: Negative and Zero are updated from the result; Carry is unaffected; Overflow unaffected.

Brief example (single-instruction style): loading A with $C7 then ANDing with #$8F yields A = $87 because $C7 & $8F = $87.

## Source Code
```text
Truth table (per-bit):
Original A Bit    Mask     Resulting A Bit
------------------------------------------
      0            0             0
      1            0             0
      0            1             0
      1            1             1
```

```text
Example: Turn off bits 4,5,6 in $C7

Original value:      11000111  (binary) = $C7
Mask (AND #$8F):     10001111  (binary) = $8F
                    ------------
Result:              10000111  (binary) = $87
                      ^^^
Bits 4,5,6 (counting LSB=bit0) have been forced to 0; other bits unchanged.
```

```asm
; Assembly example (6502)
    LDA #$C7     ; A = $C7
    AND #$8F     ; A = A & $8F  -> result $87
    ; Now A == $87
```

## References
- "logical_operations_overview" — conceptual intro to logical operations
- "logical_ora_and_examples" — complementary operation ORA turns bits on

## Mnemonics
- AND
