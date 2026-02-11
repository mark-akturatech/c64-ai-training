# STA — Store Accumulator (6502)

**Summary:** STA stores the CPU accumulator (A) to a memory effective address (all STA addressing modes). Searchable terms: STA, accumulator, store, addressing modes, 6502, opcode.

## Overview
STA writes the current contents of the accumulator to the effective memory address computed by the instruction's addressing mode. It is implemented for all standard 6502 store addressing forms (zero page, zero page,X, absolute, absolute,X, absolute,Y, (indirect,X), (indirect),Y).

## Behavior and side effects
- Operation: memory[effective_address] := A
- Flags: STA does not modify any processor status flags.
- STA performs a write to the computed address; it is not a read-modify-write instruction and does not perform an internal read-modify sequence on the target memory (aside from bus reads required to form the effective address).

## Addressing forms (supported)
- Zero Page: STA $00
- Zero Page,X: STA $00,X
- Absolute: STA $0000
- Absolute,X: STA $0000,X
- Absolute,Y: STA $0000,Y
- Indirect,X (pre-indexed): STA ($00,X)
- Indirect,Y (post-indexed): STA ($00),Y
- Not supported: immediate, implied (STA requires a memory address)

## Source Code
```text
/* STA */
    STORE(address, (src));
```

## References
- "instruction_tables_sta" — expands on STA opcodes and addressing-mode-specific opcode bytes and cycle counts

## Mnemonics
- STA
