# NMOS 6510 - ANC (ANC2, ANA, ANB) undocumented opcode

**Summary:** Undocumented 6510/6502 opcode family ANC (also called ANC2 / ANA / ANB), opcode entries $0B and $2B; described as performing an immediate AND with A (A = A & #imm) combined with a following implied shift/rotate sub-operation. Listed size 2 bytes and 2 cycles; affects processor flags (N, V, Z, C per table).

## Description
ANC is an undocumented combination opcode on NMOS 6502/6510 variants. The source describes it as:
- Primary action: an immediate AND with accumulator (A = A & #imm).
- Secondary action: an implied sub-instruction that behaves like a shift/rotate (the source text groups ASL/ROL style behavior with the AND).

The provided opcode table lists opcode $0B as the canonical ANC immediate form (mnemonic shown as "ANC #imm", function "A = A & #{imm}"), size 2 bytes and 2 cycles. A $2B table entry is present but not expanded in the fragment.

The source marks the instruction as affecting processor flags; the tabular marks indicate changes to N and V and the Carry column (see the reference table in Source Code). The fragment is terse and leaves the exact implied sub-instruction behavior ambiguous.

**[Note: Source may contain an ambiguity — some references describe ANC simply as AND #imm with C set from the result's bit7, while other descriptions (as in this fragment) describe an explicit following shift/rotate sub-instruction. Implementation details can vary among 6502-family clones.]**

## Source Code
```text
ANC (ANC2, ANA, ANB)
Type: Combination of an immediate and an implied command (Sub-instructions: AND, ASL/ROL)
Opc.   Mnemonic     Function             Size  Cycles  N V - B D I Z    C

$0B    ANC #imm     A = A & #{imm}        2     2      o o o          o

$2B    ---
```

## References
- "isc_examples_and_usage_patterns" — expands on nearby examples for ISC (related undocumented opcodes)
- "isc_opcode_variants_and_addressing_modes" — expands on other undocumented arithmetic/logical opcode patterns in this document

## Mnemonics
- ANC
- ANC2
- ANA
- ANB
