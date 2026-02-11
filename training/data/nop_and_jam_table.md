# NMOS 6510 — NOP Variants and JAM (KIL) Behavior

**Summary:** This document details the unofficial NOP (DOP) and multi-byte NOP opcodes, as well as the JAM/KIL (CPU lock) opcodes for the NMOS 6510/6502 family. It includes opcode listings, descriptions of multi-operation combinations (e.g., SLO, RLA), and notes on the behavior of JAM/KIL opcodes, which halt the CPU with the system bus reading $FF. Specific problematic illegal opcodes ($D2, $F2) are also highlighted.

**Description**

This document enumerates unofficial NOP variants (single- and multi-byte "DOP"/"NOP" opcodes), opcodes reported as having no effect (official or unofficial NOP behavior), and opcodes that cause a CPU lock/halt (JAM/KIL). It also lists documented combinations of two operations with the same addressing mode (undocumented opcodes that perform two effects, e.g., SLO and RLA).

**Behavior Notes:**

- JAM/KIL opcodes permanently halt the CPU; the system bus reads back $FF after the JAM (buses set to $FF).
- Specific opcodes $D2 and $F2 are noted as causing CPU lock-up.
- Many unofficial opcodes act as NOPs of varying byte lengths (multi-byte DOPs), while others combine two operations (e.g., ASL+ORA).

The following raw opcode groupings and the "Types" two-operation combinations are preserved verbatim in the Source Code section for exact reference.

## Source Code

```text
No effect

NOP

$3A $82 $44 $34

$3C

No effect

NOP

$5A $C2 $64 $54

$5C

No effect

NOP

$7A $E2

$74

$7C

No effect

NOP

$DA $89

$D4

$DC

No effect

NOP

$FA

$F4

$FC

No effect

Opc.

-

JAM

-

-

-

-

-

-

$02 $12 $22 $32 $42 $52 $62

-

-

-

$72 $92 $B2

-

-

Function

$D2 $F2 CPU lock-up

-4-

N V - B D I Z C

Types
Combinations of two operations with the same addressing mode
Opcode

Function

SLO {addr} ASL {addr} + ORA {addr}
RLA {addr} ROL {addr} + AND {addr}
```

## Key Registers

- **N (Negative Flag):** Set if the result of an operation is negative.
- **V (Overflow Flag):** Set if an arithmetic operation results in an overflow.
- **B (Break Command):** Indicates that a BRK instruction has been executed.
- **D (Decimal Mode):** When set, the CPU operates in decimal mode for arithmetic operations.
- **I (Interrupt Disable):** When set, interrupts are disabled.
- **Z (Zero Flag):** Set if the result of an operation is zero.
- **C (Carry Flag):** Set if an operation results in a carry out or borrow into the high bit.

## References

- "opcode_matrix" — expands on where these NOPs/JAMs appear in the opcode matrix
- "lock_up" — expands on detailed lock-up behavior

## Mnemonics
- NOP
- DOP
- SLO
- RLA
- JAM
- KIL
