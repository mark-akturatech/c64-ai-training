# 6502: Stack, Logical, Rotate and Selected Opcodes (PHA/PHP/PLA/PLP; ORA; ROL/ROR; RTI/RTS; SBC; SEC/SED/SEI; STA)

**Summary:** This document details the stack instructions PHA, PHP, PLA, and PLP, including their interactions with the status register (SR) and the handling of the Break flag and bit 5. It also covers the ORA instruction across various addressing modes, the rotate instructions ROL and ROR with their opcodes, cycles, and flag effects, the behaviors of RTI and RTS, the SBC instruction with its opcode table and flag effects, and the single-byte set/store instructions SEC, SED, SEI, and STA.

**Stack Behavior and PHA/PHP/PLA/PLP Semantics**

- **PHP**: Pushes the processor status (SR) onto the stack with the Break flag (B) set and bit 5 set to 1.
- **PHA**: Pushes the accumulator onto the stack.
- **PLA**: Pulls the accumulator from the stack.
- **PLP**: Pulls the processor status from the stack; when restoring SR, it ignores the pushed Break flag and bit 5.
- **RTI**: Pulls SR from the stack (ignoring the Break flag and bit 5), then pulls the program counter (PC).

Note: The representation of SR when pushed (as seen in PHP, BRK, and interrupt vectors) differs from its internal semantics upon being pulled; the Break flag and bit 5 are not trusted when restored.

**Flag Effects Summary (Per Instruction)**

- **ROL / ROR**: Affect Negative (N), Zero (Z), and Carry (C) flags based on the result and carry; Interrupt (I), Decimal (D), and Overflow (V) flags are unaffected.
- **SBC**: Affects N, Z, C, and V flags; I and D flags remain unchanged.
- **SEC / SED / SEI**: Set the specified flag (C, D, I respectively); other flags are unaffected.
- **STA / PHA / PLA**: Do not affect flags, aside from the noted PLP/RTI semantics.

**ROR (Rotate Right) — Opcodes, Cycles, Flags**

- **Logical Description**: C → [76543210] → C (rotates right through Carry).
- **Flags Affected**: N, Z, C (I, D, V unaffected).

(Full opcode listing provided in Source Code.)

**ROL (Rotate Left) — Opcodes, Cycles, Flags**

- **Logical Description**: C ← [76543210] ← C (rotate left through Carry).
- **Flags Affected**: N, Z, C (I, D, V unaffected).

(Full opcode listing provided in Source Code.)

**RTI and RTS**

- **RTI**: Pulls SR (ignoring the Break flag and bit 5), then pulls PC from the stack. Opcode $40, 1 byte, 6 cycles.
- **RTS**: Pulls PC (incremented by 1 after pull), opcode $60, 1 byte, 6 cycles.

**SBC (Subtract with Borrow) — Semantics and Opcodes**

- **Operation**: A - M - (not C) → A (A - M - C̅ → A).
- **Flags Affected**: N, Z, C, V (I and D unchanged).

(Opcode table and page-crossing timing notes included in Source Code.)

**SEC / SED / SEI and STA**

- **SEC ($38)**: Set carry (C=1), 1 byte, 2 cycles.
- **SED ($F8)**: Set decimal flag (D=1), 1 byte, 2 cycles.
- **SEI ($78)**: Set interrupt disable (I=1), 1 byte, 2 cycles.
- **STA**: Store accumulator to memory; listed per addressing mode in Source Code.

## Source Code

```text
; ROL (Rotate Left) - opcode table
; addressing        assembler    opcode bytes cycles
accumulator         ROL A         2A      1     2
zeropage            ROL oper      26      2     5
zeropage,X          ROL oper,X    36      2     6
absolute            ROL oper      2E      3     6
absolute,X          ROL oper,X    3E      3     7

; ROR (Rotate Right) - opcode table
; addressing        assembler    opcode bytes cycles
accumulator         ROR A         6A      1     2
zeropage            ROR oper      66      2     5
zeropage,X          ROR oper,X    76      2     6
absolute            ROR oper      6E      3     6
absolute,X          ROR oper,X    7E      3     7

; RTI / RTS
; addressing        assembler    opcode bytes cycles
implied             RTI           40      1     6
implied             RTS           60      1     6

; SBC (Subtract Memory from Accumulator with Borrow)
; A - M - C̅ → A
; addressing        assembler    opcode bytes cycles
immediate           SBC #oper     E9      2     2
zeropage            SBC oper      E5      2     3
zeropage,X          SBC oper,X    F5      2     4
absolute            SBC oper      ED      3     4
absolute,X          SBC oper,X    FD      3     4*    ; +1 if page crossed
absolute,Y          SBC oper,Y    F9      3     4*    ; +1 if page crossed
(indirect,X)        SBC (oper,X)  E1      2     6
(indirect),Y        SBC (oper),Y  F1      2     5*    ; +1 if page crossed

; SEC / SED / SEI
; addressing        assembler    opcode bytes cycles
implied             SEC           38      1     2
implied             SED           F8      1     2
implied             SEI           78      1     2

; STA (Store Accumulator)
; addressing        assembler    opcode bytes cycles
zeropage            STA oper      85      2     3
zeropage,X          STA oper,X    95      2     4
absolute            STA oper      8D      3     4
absolute,X          STA oper,X    9D      3     5
absolute,Y          STA oper,Y    99      3     5
(indirect,X)        STA (oper,X)  81      2     6
(indirect),Y        STA (oper),Y  91      2     6

; Stack instructions
; addressing        assembler    opcode bytes cycles   notes
implied             PHA           48      1     3
implied             PHP           08      1     3    ; pushes SR with B=1 and bit5=1
implied             PLA           68      1     4
implied             PLP           28      1     4    ; PLP ignores pushed B and bit5 when restoring SR

; ORA (Inclusive OR)
; addressing        assembler    opcode bytes cycles
immediate           ORA #oper     09      2     2
zeropage            ORA oper      05      2     3
zeropage,X          ORA oper,X    15      2     4
absolute            ORA oper      0D      3     4
absolute,X          ORA oper,X    1D      3     4*   ; +1 if page crossed
absolute,Y          ORA oper,Y    19      3     4*   ; +1 if page crossed
(indirect,X)        ORA (oper,X)  01      2     6
(indirect),Y        ORA (oper),Y  11      2     5*   ; +1 if page crossed
```

## References

- "pha_php_pla_plp_examples" — Example usage patterns for pushing/pulling registers.
- "rol_ror_rotate_instructions" — Relation and opcodes for ROL and ROR.

## Mnemonics
- PHA
- PHP
- PLA
- PLP
- RTI
- RTS
- ORA
- ROL
- ROR
- SBC
- SEC
- SED
- SEI
- STA
