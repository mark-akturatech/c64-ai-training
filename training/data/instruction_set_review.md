# 6502 Instruction Set — Loads/Stores, ALU, Shifts, Branches, Control, Stack, BIT, NOP/BRK

**Summary:** Covers LDA/LDX/LDY/STA/STX/STY/CMP/CPX/CPY loads, stores and compares; A-only logical/arithmetic (AND/ORA/EOR/ADC/SBC); shifts/rotates (ASL/ROL/LSR/ROR) on A or memory; INC/DEC/INX/DEX/INY/DEY; conditional branches (BEQ/BNE/BCS/BCC/BMI/BPL/BVS/BVC) and JMP; subroutines/interrupt return (JSR/RTS/RTI); status flag set/clear (SEC/CLC/SEI/CLI/SED/CLD/CLV); transfers (TAX/TAY/TSX/TXA/TYA/TXS); stack ops (PHA/PLA/PHP/PLP); BIT semantics; and NOP/BRK.

## Overview
This chunk lists the standard 650x (6502-family) instruction mnemonics and their roles. It emphasizes which instructions operate on which registers (A, X, Y, or memory), special addressing-mode notes, and the BIT instruction's exact flag effects. Status flags I (interrupt disable) and D (decimal mode) are highlighted for their influence on interrupts and ADC/SBC behavior respectively. Branches are conditional short-range transfers; JMP is unconditional.

## Loads, Stores, Compares
- LDA, LDX, LDY — load A, X, Y from memory.
  - Note: the A register supports the full set of indirect/indexed addressing modes (e.g., (indirect),Y and (indirect,X)); X and Y have fewer addressing modes.
- STA, STX, STY — store A, X, Y to memory.
- CMP, CPX, CPY — compare A/X/Y with memory (affect N, V not altered, Z and C set appropriately).

## Logical and Arithmetic (A only)
- AND, ORA, EOR — bitwise logical operations apply only to A.
- ADC, SBC — add/subtract with carry operate on A; the D (decimal mode) flag modifies ADC/SBC behavior.

## Shifts and Rotates
- ASL, LSR, ROL, ROR — shift/rotate instructions may operate on A or directly on memory.

## Increment / Decrement
- INC, DEC — increment/decrement memory.
- INX, DEX, INY, DEY — increment/decrement X and Y registers.

## Branches and Jump
- Conditional branches: BEQ, BNE, BCS, BCC, BMI, BPL, BVS, BVC — all conditional relative branches (short hops).
  - Branches use a short relative displacement (signed 8-bit offset).
- JMP — unconditional jump (absolute or indirect addressing forms).

## Subroutines and Interrupt Return
- JSR — jump to subroutine.
- RTS — return from subroutine.
- RTI — return from interrupt (restores processor status).

## Status Flag Set / Clear
- SEC, CLC — set/clear Carry.
- SEI, CLI — set/clear Interrupt Disable (I) flag (I prevents maskable interrupts).
- SED, CLD — set/clear Decimal (D) flag (affects ADC/SBC).
- SEV/CLV — set/clear Overflow (V) flag.

## Transfers and Stack Pointer Operations
- Transfers between A and index registers: TAX, TAY, TXA, TYA.
- Stack pointer transfers: TSX (SP -> X), TXS (X -> SP).
  - Note from source: moving X into SP (TXS) is powerful; use with care.

## Stack Operations
- PHA, PHP — push A or processor status onto stack.
- PLA, PLP — pull A or processor status from stack.

## BIT instruction (test bits and set flags)
- BIT tests memory against A without changing A or memory.
- Addressing: BIT is used on specific locations — no indexing allowed (zero indexing).
- Flags affected:
  - N (Negative) <-- bit 7 of tested memory.
  - V (Overflow) <-- bit 6 of tested memory.
  - Z (Zero) <-- set if (A & M) == 0, clear otherwise (i.e., Z indicates whether any bits set in A match bits set in memory).
- Usage: BIT is commonly used to test input/status ports; follow with BMI to test bit 7, BVS to test bit 6, or BNE to test any selected bits.

## NOP and BRK
- NOP — no operation; does nothing (advances PC).
- BRK — causes a software interrupt/“false interrupt”; typically transfers control to a monitor or interrupt handler.

## References
- "programming_model_and_registers" — expands on processor status and register model relevant to instructions
- "instruction_timing_and_opcode_table" — expands on timing and opcode encodings for these instructions

## Mnemonics
- LDA
- LDX
- LDY
- STA
- STX
- STY
- CMP
- CPX
- CPY
- AND
- ORA
- EOR
- ADC
- SBC
- ASL
- LSR
- ROL
- ROR
- INC
- DEC
- INX
- DEX
- INY
- DEY
- BEQ
- BNE
- BCS
- BCC
- BMI
- BPL
- BVS
- BVC
- JMP
- JSR
- RTS
- RTI
- SEC
- CLC
- SEI
- CLI
- SED
- CLD
- CLV
- TAX
- TAY
- TXA
- TYA
- TSX
- TXS
- PHA
- PLA
- PHP
- PLP
- BIT
- NOP
- BRK
