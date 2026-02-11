# 6502 Instructions — Logical Group (AND, EOR, ORA)

**Summary:** This section provides detailed information on the 6502's logical bitwise instructions: AND, EOR, and ORA. It includes opcode tables, addressing modes, cycle counts, flag effects, and example assembly snippets for each instruction.

**Logical Instructions Overview**

The 6502 microprocessor features three primary logical bitwise operations:

- **AND** — Performs a bitwise AND between the accumulator and a memory value.
- **EOR** — Performs a bitwise exclusive OR (XOR) between the accumulator and a memory value.
- **ORA** — Performs a bitwise OR between the accumulator and a memory value.

Each of these instructions supports various addressing modes, affecting their opcode, cycle count, and behavior.

**Opcode Tables and Addressing Modes**

Below are the opcode tables for each instruction, detailing the supported addressing modes, corresponding opcodes, byte sizes, and cycle counts.

### AND (Logical AND)

| Addressing Mode | Syntax        | Opcode | Bytes | Cycles | Notes                          |
|-----------------|---------------|--------|-------|--------|--------------------------------|
| Immediate       | `AND #$44`    | $29    | 2     | 2      |                                |
| Zero Page       | `AND $44`     | $25    | 2     | 3      |                                |
| Zero Page,X     | `AND $44,X`   | $35    | 2     | 4      |                                |
| Absolute        | `AND $4400`   | $2D    | 3     | 4      |                                |
| Absolute,X      | `AND $4400,X` | $3D    | 3     | 4 (+1) | +1 cycle if page boundary crossed |
| Absolute,Y      | `AND $4400,Y` | $39    | 3     | 4 (+1) | +1 cycle if page boundary crossed |
| Indirect,X      | `AND ($44,X)` | $21    | 2     | 6      |                                |
| Indirect,Y      | `AND ($44),Y` | $31    | 2     | 5 (+1) | +1 cycle if page boundary crossed |

### EOR (Exclusive OR)

| Addressing Mode | Syntax        | Opcode | Bytes | Cycles | Notes                          |
|-----------------|---------------|--------|-------|--------|--------------------------------|
| Immediate       | `EOR #$44`    | $49    | 2     | 2      |                                |
| Zero Page       | `EOR $44`     | $45    | 2     | 3      |                                |
| Zero Page,X     | `EOR $44,X`   | $55    | 2     | 4      |                                |
| Absolute        | `EOR $4400`   | $4D    | 3     | 4      |                                |
| Absolute,X      | `EOR $4400,X` | $5D    | 3     | 4 (+1) | +1 cycle if page boundary crossed |
| Absolute,Y      | `EOR $4400,Y` | $59    | 3     | 4 (+1) | +1 cycle if page boundary crossed |
| Indirect,X      | `EOR ($44,X)` | $41    | 2     | 6      |                                |
| Indirect,Y      | `EOR ($44),Y` | $51    | 2     | 5 (+1) | +1 cycle if page boundary crossed |

### ORA (Logical OR)

| Addressing Mode | Syntax        | Opcode | Bytes | Cycles | Notes                          |
|-----------------|---------------|--------|-------|--------|--------------------------------|
| Immediate       | `ORA #$44`    | $09    | 2     | 2      |                                |
| Zero Page       | `ORA $44`     | $05    | 2     | 3      |                                |
| Zero Page,X     | `ORA $44,X`   | $15    | 2     | 4      |                                |
| Absolute        | `ORA $4400`   | $0D    | 3     | 4      |                                |
| Absolute,X      | `ORA $4400,X` | $1D    | 3     | 4 (+1) | +1 cycle if page boundary crossed |
| Absolute,Y      | `ORA $4400,Y` | $19    | 3     | 4 (+1) | +1 cycle if page boundary crossed |
| Indirect,X      | `ORA ($44,X)` | $01    | 2     | 6      |                                |
| Indirect,Y      | `ORA ($44),Y` | $11    | 2     | 5 (+1) | +1 cycle if page boundary crossed |

*Note: Cycle counts marked with (+1) indicate an additional cycle is required if a page boundary is crossed during the operation.*

**Flag Effects**

Each of these instructions affects the processor status flags as follows:

- **Negative (N):** Set if the result's most significant bit (bit 7) is set; cleared otherwise.
- **Zero (Z):** Set if the result is zero; cleared otherwise.
- **Overflow (V):** Not affected.
- **Carry (C):** Not affected.

**Example Assembly Snippets**

Below are example assembly code snippets demonstrating typical usage of each instruction.

### AND Example


### EOR Example


### ORA Example

## Source Code

```assembly
LDA #$F0      ; Load accumulator with 11110000
AND #$0F      ; AND with 00001111
; Result in A: 00000000, Z flag set
```

```assembly
LDA #$AA      ; Load accumulator with 10101010
EOR #$FF      ; EOR with 11111111
; Result in A: 01010101, N flag set
```

```assembly
LDA #$0F      ; Load accumulator with 00001111
ORA #$F0      ; OR with 11110000
; Result in A: 11111111, N flag set
```



## References

- "AND Instruction" — Detailed information on the AND instruction (opcodes, modes, flags)
- "EOR Instruction" — Detailed information on the EOR instruction (opcodes, modes, flags)
- "ORA Instruction" — Detailed information on the ORA instruction (opcodes, modes, flags)

## Mnemonics
- AND
- EOR
- ORA
