# 6502 LDA — Load Accumulator (AC) and Set Sign/Zero

**Summary:** The LDA instruction loads the accumulator (AC) with an 8-bit value from memory or immediate data, updating the Zero (Z) and Negative (N) flags in the processor status register (P).

**Behavior**

LDA transfers an 8-bit value into the accumulator and updates the processor status flags as follows:

- **Zero flag (Z):** Set if the result is zero; cleared otherwise.
- **Negative flag (N):** Set if bit 7 of the result is set (i.e., the result is negative in two's complement representation); cleared otherwise.
- **Other flags (C, V, D, I, B):** Unaffected by LDA.

**Addressing Modes, Opcodes, and Cycle Counts**

LDA supports multiple addressing modes, each with a specific opcode and cycle count:

| Addressing Mode       | Syntax         | Opcode | Bytes | Cycles | Description                                                                                   |
|-----------------------|----------------|--------|-------|--------|-----------------------------------------------------------------------------------------------|
| Immediate             | `LDA #$10`     | $A9    | 2     | 2      | Load accumulator with immediate value.                                                        |
| Zero Page             | `LDA $00`      | $A5    | 2     | 3      | Load accumulator from zero page address.                                                      |
| Zero Page, X          | `LDA $10,X`    | $B5    | 2     | 4      | Load accumulator from zero page address offset by X.                                          |
| Absolute              | `LDA $1234`    | $AD    | 3     | 4      | Load accumulator from absolute address.                                                       |
| Absolute, X           | `LDA $1234,X`  | $BD    | 3     | 4*     | Load accumulator from absolute address offset by X.                                           |
| Absolute, Y           | `LDA $1234,Y`  | $B9    | 3     | 4*     | Load accumulator from absolute address offset by Y.                                           |
| Indirect, X           | `LDA ($20,X)`  | $A1    | 2     | 6      | Load accumulator from address obtained by adding X to zero page address and dereferencing.    |
| Indirect, Y           | `LDA ($20),Y`  | $B1    | 2     | 5*     | Load accumulator from address obtained by dereferencing zero page address and adding Y.       |

*Add 1 cycle if a page boundary is crossed.

**Undocumented Opcodes**

The original 6502 processor includes undocumented opcodes that are not officially supported. For LDA, the following undocumented opcode exists:

- **LAX (Load Accumulator and X Register):** Combines LDA and LDX, loading the same value into both the accumulator and the X register.

  | Addressing Mode       | Syntax         | Opcode | Bytes | Cycles | Description                                                                                   |
  |-----------------------|----------------|--------|-------|--------|-----------------------------------------------------------------------------------------------|
  | Immediate             | `LAX #$10`     | $A7    | 2     | 2      | Load accumulator and X register with immediate value.                                         |
  | Zero Page             | `LAX $00`      | $A7    | 2     | 3      | Load accumulator and X register from zero page address.                                       |
  | Zero Page, Y          | `LAX $10,Y`    | $B7    | 2     | 4      | Load accumulator and X register from zero page address offset by Y.                           |
  | Absolute              | `LAX $1234`    | $AF    | 3     | 4      | Load accumulator and X register from absolute address.                                        |
  | Absolute, Y           | `LAX $1234,Y`  | $BF    | 3     | 4*     | Load accumulator and X register from absolute address offset by Y.                            |
  | Indirect, X           | `LAX ($20,X)`  | $A3    | 2     | 6      | Load accumulator and X register from address obtained by adding X to zero page address and dereferencing. |
  | Indirect, Y           | `LAX ($20),Y`  | $B3    | 2     | 5*     | Load accumulator and X register from address obtained by dereferencing zero page address and adding Y. |

  *Add 1 cycle if a page boundary is crossed.

Note: Undocumented opcodes may behave differently across different 6502 variants and are not guaranteed to be stable.

**Example Assembly Code**

Below are examples demonstrating the use of LDA with various addressing modes:

## Source Code

```assembly
; Immediate addressing
LDA #$10        ; Load immediate value $10 into accumulator

; Zero Page addressing
LDA $00         ; Load value from zero page address $00 into accumulator

; Zero Page, X addressing
LDX #$04        ; Load X register with $04
LDA $10,X       ; Load value from zero page address $10 offset by X into accumulator

; Absolute addressing
LDA $1234       ; Load value from absolute address $1234 into accumulator

; Absolute, X addressing
LDX #$04        ; Load X register with $04
LDA $1234,X     ; Load value from absolute address $1234 offset by X into accumulator

; Absolute, Y addressing
LDY #$04        ; Load Y register with $04
LDA $1234,Y     ; Load value from absolute address $1234 offset by Y into accumulator

; Indirect, X addressing
LDX #$04        ; Load X register with $04
LDA ($20,X)     ; Load value from address obtained by adding X to zero page address $20 and dereferencing

; Indirect, Y addressing
LDY #$04        ; Load Y register with $04
LDA ($20),Y     ; Load value from address obtained by dereferencing zero page address $20 and adding Y
```



## References

- "6502 Instruction Set" — Detailed information on 6502 instructions and addressing modes.
- "Undocumented 6502 Opcodes" — Exploration of undocumented opcodes and their behaviors.
- "6502 Instruction Set Decoded" — Comprehensive decoding of 6502 instructions and opcodes.

## Mnemonics
- LDA
- LAX
