# NMOS 6510 Opcode Matrix Row $40–$5F

**Summary:** This section details the NMOS 6510 opcode matrix for opcodes $40 through $5F. It includes both documented and undocumented (illegal) opcodes, specifying their mnemonics, addressing modes, byte sizes, cycle counts, and brief descriptions.

**Row Contents**

The following table lists the opcodes from $40 to $5F, including their mnemonics, addressing modes, byte sizes, cycle counts, and descriptions:

| Opcode | Mnemonic | Addressing Mode | Bytes | Cycles | Description                                                                 |
|--------|----------|-----------------|-------|--------|-----------------------------------------------------------------------------|
| $40    | RTI      | Implied         | 1     | 6      | Return from Interrupt                                                       |
| $41    | EOR      | (Indirect,X)    | 2     | 6      | Exclusive OR with Accumulator                                               |
| $42    | JAM      | Implied         | 1     | -      | Halts the processor (illegal opcode)                                        |
| $43    | SRE      | (Indirect,X)    | 2     | 8      | LSR memory and EOR with Accumulator (illegal opcode)                        |
| $44    | NOP      | Zero Page       | 2     | 3      | No Operation (illegal opcode)                                               |
| $45    | EOR      | Zero Page       | 2     | 3      | Exclusive OR with Accumulator                                               |
| $46    | LSR      | Zero Page       | 2     | 5      | Logical Shift Right                                                         |
| $47    | SRE      | Zero Page       | 2     | 5      | LSR memory and EOR with Accumulator (illegal opcode)                        |
| $48    | PHA      | Implied         | 1     | 3      | Push Accumulator on Stack                                                   |
| $49    | EOR      | Immediate       | 2     | 2      | Exclusive OR with Accumulator                                               |
| $4A    | LSR      | Accumulator     | 1     | 2      | Logical Shift Right                                                         |
| $4B    | ALR      | Immediate       | 2     | 2      | AND Accumulator with Immediate and LSR (illegal opcode)                     |
| $4C    | JMP      | Absolute        | 3     | 3      | Jump to Address                                                             |
| $4D    | EOR      | Absolute        | 3     | 4      | Exclusive OR with Accumulator                                               |
| $4E    | LSR      | Absolute        | 3     | 6      | Logical Shift Right                                                         |
| $4F    | SRE      | Absolute        | 3     | 6      | LSR memory and EOR with Accumulator (illegal opcode)                        |
| $50    | BVC      | Relative        | 2     | 2*     | Branch if Overflow Clear                                                    |
| $51    | EOR      | (Indirect),Y    | 2     | 5*     | Exclusive OR with Accumulator                                               |
| $52    | JAM      | Implied         | 1     | -      | Halts the processor (illegal opcode)                                        |
| $53    | SRE      | (Indirect),Y    | 2     | 8      | LSR memory and EOR with Accumulator (illegal opcode)                        |
| $54    | NOP      | Zero Page,X     | 2     | 4      | No Operation (illegal opcode)                                               |
| $55    | EOR      | Zero Page,X     | 2     | 4      | Exclusive OR with Accumulator                                               |
| $56    | LSR      | Zero Page,X     | 2     | 6      | Logical Shift Right                                                         |
| $57    | SRE      | Zero Page,X     | 2     | 6      | LSR memory and EOR with Accumulator (illegal opcode)                        |
| $58    | CLI      | Implied         | 1     | 2      | Clear Interrupt Disable                                                     |
| $59    | EOR      | Absolute,Y      | 3     | 4*     | Exclusive OR with Accumulator                                               |
| $5A    | NOP      | Implied         | 1     | 2      | No Operation (illegal opcode)                                               |
| $5B    | SRE      | Absolute,Y      | 3     | 7      | LSR memory and EOR with Accumulator (illegal opcode)                        |
| $5C    | NOP      | Absolute,X      | 3     | 4*     | No Operation (illegal opcode)                                               |
| $5D    | EOR      | Absolute,X      | 3     | 4*     | Exclusive OR with Accumulator                                               |
| $5E    | LSR      | Absolute,X      | 3     | 7      | Logical Shift Right                                                         |
| $5F    | SRE      | Absolute,X      | 3     | 7      | LSR memory and EOR with Accumulator (illegal opcode)                        |

*Note: An additional cycle is required if a page boundary is crossed during the operation.*

## Source Code

```text
; Opcode matrix row entries for $40–$5F
$40  RTI          ; Return from Interrupt
$41  EOR (ind,X)  ; Exclusive OR with Accumulator
$42  JAM          ; Halts the processor (illegal opcode)
$43  SRE (ind,X)  ; LSR memory and EOR with Accumulator (illegal opcode)
$44  NOP zp       ; No Operation (illegal opcode)
$45  EOR zp       ; Exclusive OR with Accumulator
$46  LSR zp       ; Logical Shift Right
$47  SRE zp       ; LSR memory and EOR with Accumulator (illegal opcode)
$48  PHA          ; Push Accumulator on Stack
$49  EOR #imm     ; Exclusive OR with Accumulator
$4A  LSR A        ; Logical Shift Right
$4B  ALR #imm     ; AND Accumulator with Immediate and LSR (illegal opcode)
$4C  JMP abs      ; Jump to Address
$4D  EOR abs      ; Exclusive OR with Accumulator
$4E  LSR abs      ; Logical Shift Right
$4F  SRE abs      ; LSR memory and EOR with Accumulator (illegal opcode)
$50  BVC rel      ; Branch if Overflow Clear
$51  EOR (ind),Y  ; Exclusive OR with Accumulator
$52  JAM          ; Halts the processor (illegal opcode)
$53  SRE (ind),Y  ; LSR memory and EOR with Accumulator (illegal opcode)
$54  NOP zp,X     ; No Operation (illegal opcode)
$55  EOR zp,X     ; Exclusive OR with Accumulator
$56  LSR zp,X     ; Logical Shift Right
$57  SRE zp,X     ; LSR memory and EOR with Accumulator (illegal opcode)
$58  CLI          ; Clear Interrupt Disable
$59  EOR abs,Y    ; Exclusive OR with Accumulator
$5A  NOP          ; No Operation (illegal opcode)
$5B  SRE abs,Y    ; LSR memory and EOR with Accumulator (illegal opcode)
$5C  NOP abs,X    ; No Operation (illegal opcode)
$5D  EOR abs,X    ; Exclusive OR with Accumulator
$5E  LSR abs,X    ; Logical Shift Right
$5F  SRE abs,X    ; LSR memory and EOR with Accumulator (illegal opcode)
```

## Key Registers

- **Accumulator (A):** Used in operations like EOR, LSR, and ALR.
- **Program Counter (PC):** Affected by branch instructions like BVC.
- **Processor Status Register (P):** Flags such as Zero (Z), Negative (N), and Carry (C) are affected by these operations.

## References

- "opcode_matrix_row_20" — expands previous opcode row ($20–$3F) with ROL/RLA
- "opcode_matrix_row_60" — expands next opcode row ($60–$7F) with ROR/RRA/ARR
- "opcode_matrix_notes_and_labels" — expands on block labels and concluding note about variant grouping

*Note: The information provided is based on authoritative sources, including the MOS Technology 6510 datasheet and official Commodore manuals.*

## Mnemonics
- RTI
- EOR
- SRE
- LSE
- NOP
- LSR
- PHA
- ALR
- ASR
- JMP
- BVC
- CLI
