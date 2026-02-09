# Kick Assembler quick-reference: branch and flag opcodes (beginning rows)

**Summary:** Beginning rows from Kick Assembler's 6502 quick-reference showing opcode hex bytes and mnemonics for branch instructions (BMI, BNE, BPL, BVC, BVS, BCC, BCS, BEQ) and basic processor/interrupt flag instructions (BRK, CLC, CLD, CLI). Contains raw opcode bytes interleaved with mnemonics.

**Notes / Explanation**

This chunk is an excerpt from the left-hand (opcode) columns of a standard 6502 quick-reference table. Branch opcodes are relative (signed 8-bit displacement), and the processor/flag instructions shown are implied-mode single-byte opcodes. Where the excerpt is truncated or ambiguous, standard 6502 opcode assignments are used to complete the usual set of branch instructions.

Canonical opcode mappings (mnemonic — opcode, addressing mode):

- BMI (Branch if Minus) — $30 (relative)
- BNE (Branch if Not Equal / Z=0) — $D0 (relative)
- BPL (Branch if Plus) — $10 (relative)
- BVC (Branch if Overflow Clear) — $50 (relative)
- BVS (Branch if Overflow Set) — $70 (relative)
- BCC (Branch if Carry Clear) — $90 (relative)
- BCS (Branch if Carry Set) — $B0 (relative)
- BEQ (Branch if Equal / Z=1) — $F0 (relative)

Processor/interrupt flag instructions (implied):

- BRK (Force Interrupt) — $00
- CLC (Clear Carry) — $18
- CLD (Clear Decimal Mode) — $D8
- CLI (Clear Interrupt Disable) — $58

Caveats:

- The excerpt includes stray bytes at the top ($24, $2C) which correspond to BIT zeropage ($24) and BIT absolute ($2C) in the 6502 opcode set; these appear here because the quick-reference table spans many mnemonics and addressing-mode columns. The table header and addressing-mode columns that would give full context are not included in this fragment.
- A trailing "87" appears in the fragment and is ambiguous in this context (87 is *not* a standard 6502 official opcode for documented instructions; on some variants, it is an illegal/undocumented opcode).

## Source Code

```text
$24

$2c

bmi

$30

bne

$d0

bpl

$10

brk

$00

bvc

$50

bvs

$70

clc

$18

cld

$d8

cli

$58

87
```

Reconstructed quick-reference rows (standard 6502 mappings for branch & flag opcodes):

```text
BRK  $00
BPL  $10
BMI  $30
BVC  $50
BVS  $70
BCC  $90
BCS  $B0
BNE  $D0
BEQ  $F0
CLC  $18
CLI  $58
CLD  $D8
```

## References

- "standard_table_header_addressing_modes" — expands on the quick-reference table header and addressing-mode columns
- "arithmetic_and_processor_status_and_transfers" — expands on related processor-status instructions (SEC/SED/SEI) that appear later in the table