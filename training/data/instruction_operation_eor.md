# 6502 EOR (Exclusive OR)

**Summary:** The 6502 EOR instruction performs a bitwise exclusive-OR between the Accumulator (AC) and an operand, updates the Negative (N) and Zero (Z) flags, and stores the result back into the Accumulator. Search terms: EOR, exclusive-or, AC, Accumulator, Negative flag, Zero flag.

**Operation**

EOR computes the bitwise exclusive-OR of the Accumulator and the fetched operand and places the 8-bit result into the Accumulator. The instruction affects only the Negative (N) and Zero (Z) flags:

- **Negative (N):** Set if bit 7 of the result is 1; cleared otherwise.
- **Zero (Z):** Set if the result is zero; cleared otherwise.

It does not modify the Carry (C) or Overflow (V) flags. Operands and the Accumulator are 8-bit values; the operation is performed modulo 256.

**Addressing Modes and Opcodes**

The EOR instruction supports the following addressing modes, each with its corresponding opcode and cycle count:

| Addressing Mode | Syntax           | Opcode | Bytes | Cycles | Notes                          |
|-----------------|------------------|--------|-------|--------|--------------------------------|
| Immediate       | EOR #$44         | $49    | 2     | 2      |                                |
| Zero Page       | EOR $44          | $45    | 2     | 3      |                                |
| Zero Page,X     | EOR $44,X        | $55    | 2     | 4      |                                |
| Absolute        | EOR $4400        | $4D    | 3     | 4      |                                |
| Absolute,X      | EOR $4400,X      | $5D    | 3     | 4*     | *Add 1 cycle if page boundary is crossed. |
| Absolute,Y      | EOR $4400,Y      | $59    | 3     | 4*     | *Add 1 cycle if page boundary is crossed. |
| Indirect,X      | EOR ($44,X)      | $41    | 2     | 6      |                                |
| Indirect,Y      | EOR ($44),Y      | $51    | 2     | 5*     | *Add 1 cycle if page boundary is crossed. |

*Note: Cycle counts marked with an asterisk (*) indicate that an additional cycle is required if a page boundary is crossed during the operation.*

**Example Usage**

Here are some example assembly instructions demonstrating the use of EOR with different addressing modes:

In these examples, the EOR instruction is used with various addressing modes to perform bitwise exclusive-OR operations between the Accumulator and different operands.

## Source Code

```assembly
; Example 1: Immediate addressing
LDA #$AA        ; Load Accumulator with immediate value $AA
EOR #$55        ; Exclusive-OR Accumulator with immediate value $55
; Result: Accumulator = $FF

; Example 2: Zero Page addressing
LDA #$AA        ; Load Accumulator with immediate value $AA
STA $10         ; Store Accumulator value into zero page address $10
EOR $10         ; Exclusive-OR Accumulator with value at zero page address $10
; Result: Accumulator = $00

; Example 3: Absolute addressing
LDA #$AA        ; Load Accumulator with immediate value $AA
STA $1000       ; Store Accumulator value into memory address $1000
EOR $1000       ; Exclusive-OR Accumulator with value at memory address $1000
; Result: Accumulator = $00

; Example 4: Indexed Indirect addressing
LDX #$04        ; Load X register with value $04
LDA #$20        ; Load Accumulator with immediate value $20
STA $04         ; Store Accumulator value into zero page address $04
LDA #$10        ; Load Accumulator with immediate value $10
STA $05         ; Store Accumulator value into zero page address $05
LDA #$AA        ; Load Accumulator with immediate value $AA
EOR ($00,X)     ; Exclusive-OR Accumulator with value at address stored in $04 and $05
; Result: Accumulator = $AA
```

```text
/* EOR */
    src ^= AC;
    SET_SIGN(src);
    SET_ZERO(src);
    AC = src;
```

## References

- "instruction_tables_eor" — expands on EOR opcodes, addressing modes, and timing information.

## Mnemonics
- EOR
