# NMOS 6510 - DCP (DCM) Undocumented Opcode

**Summary:** DCP (also known as DCM) is an undocumented opcode for the NMOS 6510 processor that combines the operations of DEC (decrement memory) and CMP (compare accumulator with memory) into a single instruction. It decrements the value at a specified memory address and then compares the accumulator (A) with the decremented value. This operation affects the Negative (N), Zero (Z), and Carry (C) flags based on the result of the comparison.

**Description**

The DCP instruction performs the following steps:

1. **Decrement Memory:** The value at the specified memory address is decremented by one. If the value was zero, it wraps around to 255 (0xFF).

2. **Compare Accumulator with Memory:** The accumulator is compared with the decremented memory value. This comparison sets the processor status flags as follows:

   - **Carry (C):** Set if the accumulator is greater than or equal to the memory value; cleared otherwise.
   - **Zero (Z):** Set if the accumulator equals the memory value; cleared otherwise.
   - **Negative (N):** Set if the result of the subtraction (A - memory) is negative; cleared otherwise.

   The Overflow (V), Decimal (D), Interrupt Disable (I), and Break (B) flags are unaffected by this instruction.

**Addressing Modes, Opcodes, Sizes, and Cycles:**

| Addressing Mode        | Opcode | Size (Bytes) | Cycles |
|------------------------|--------|--------------|--------|
| Zero Page              | $C7    | 2            | 5      |
| Zero Page,X            | $D7    | 2            | 6      |
| Absolute               | $CF    | 3            | 6      |
| Absolute,X             | $DF    | 3            | 7      |
| Absolute,Y             | $DB    | 3            | 7      |
| (Indirect,X)           | $C3    | 2            | 8      |
| (Indirect),Y           | $D3    | 2            | 8      |

*Note:* For indexed addressing modes (Absolute,X and Absolute,Y), if a page boundary is crossed during the effective address calculation, an additional cycle is required.

**Status Flags Affected:**

| Flag | Description                                                                                   |
|------|-----------------------------------------------------------------------------------------------|
| N    | Set if the result of A - memory is negative; cleared otherwise.                               |
| Z    | Set if A equals the decremented memory value; cleared otherwise.                              |
| C    | Set if A is greater than or equal to the decremented memory value; cleared otherwise.         |
| V    | Unaffected.                                                                                   |
| D    | Unaffected.                                                                                   |
| I    | Unaffected.                                                                                   |
| B    | Unaffected.                                                                                   |

## Source Code

```text
; Example: Decrementing a 16-bit pointer using DCP

LDA #$FF
DCP pointer   ; Decrement pointer low byte and compare result to A = #$FF
BNE skip
DEC pointer+1 ; Decrement pointer high byte if underflow occurred
skip:
```

In this example, `DCP` is used to decrement the low byte of a 16-bit pointer. If the result is zero (indicating an underflow), the high byte is decremented. This method is more efficient in terms of cycles and code size compared to the standard implementation using separate `DEC` and `CMP` instructions.

## Key Registers

- **Accumulator (A):** Used in the comparison operation.
- **Memory:** The value at the specified address is decremented and compared with the accumulator.
- **Processor Status Register:** The N, Z, and C flags are updated based on the comparison result.

## References

- [NMOS 6510 Unintended Opcodes - No More Secrets](https://www.c64-wiki.com/wiki/DCP)
- [C64-Wiki: DCP](https://www.c64-wiki.com/wiki/DCP)

*Note:* The DCP instruction is undocumented and may not be supported on all 6510 processors. Its behavior is based on observed functionality and may vary between different hardware implementations.

## Mnemonics
- DCP
- DCM
