# EOR (Exclusive OR) — apply mask to A, bit-flip behavior and example

**Summary:** EOR (Exclusive OR) on the A register flips (inverts) any A bits where the mask bit is 1 and leaves bits unchanged where the mask bit is 0; example: EOR #$70 (01110000b) applied to $C7 (11000111b) yields $B7 (10110111b).

## Explanation
EOR performs a bitwise exclusive-OR between the A register and an operand mask. For each bit position:
- If mask bit = 0 → resulting A bit = original A bit (unchanged).
- If mask bit = 1 → resulting A bit = inverted original A bit (0→1, 1→0).

Truth table (Original A bit vs Mask → Resulting A bit):
| Original A Bit | Mask | Resulting A Bit |
|---------------:|:----:|:---------------:|
| 0              | 0    | 0               |
| 1              | 0    | 1               |
| 0              | 1    | 1               |
| 1              | 1    | 0               |

Example (invert bits 4, 5, and 6 of $C7 using mask $70):
- Original value ($C7): 11000111
- Mask ($70):           01110000
- Result (A after EOR): 10110111  → hex $B7

Bits 4–6 (counting LSB as bit 0) are the marked bits that change; all other bits remain unchanged.

## Source Code
```asm
    ; Example: invert bits 4,5,6 of $C7 using immediate EOR #$70
    LDA #$C7     ; A = %11000111 (hex C7)
    EOR #$70     ; mask = %01110000 (hex 70) → flips bits 4,5,6
    ; After EOR: A = %10110111 (hex B7)
```

```text
Binary reference:
  $C7 = 1100 0111
  $70 = 0111 0000
XOR result = 1011 0111 = $B7
```

## References
- "logical_ora_and_examples" — compares ORA turning bits on with EOR flipping bits  
- "why_logical_operations_and_ascii_conversion" — uses logical ops for ASCII-to-binary conversion

## Mnemonics
- EOR
