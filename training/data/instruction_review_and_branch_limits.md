# 6502 Instruction Review: Loads, Stores, Compare, INX/DEX, JSR/RTS, BRK, Branches

**Summary:** Review of primary 6502 instruction categories and register roles: Load (LDA/LDX/LDY), Store (STA/STX/STY), Compare (CMP/CPX/CPY); register specializations (INX/INY/DEX/DEY restricted to X/Y; A as accumulator for arithmetic); subroutines (JSR/RTS) and BRK for debugging; eight branch instructions with short-range relative hops (~100 bytes).

## A Review
The three CPU registers A, X, and Y support three common operations:
- Load: LDA, LDX, LDY
- Store: STA, STX, STY
- Compare: CMP, CPX, CPY

Historically these registers behaved similarly for these operations; newer instructions give them distinct roles.

## Register specializations
- INX, INY, DEX, DEY (increment/decrement) operate only on X and Y.
- X and Y are commonly used for indexing (index registers).
- A (the accumulator) is used for arithmetic and other accumulator-specific operations.

## Subroutines and BRK
- JSR calls a subroutine (pushes return address and jumps to target).
- RTS returns from a subroutine (pulls return address and resumes).
- BRK causes a software interrupt to the monitor/interrupt vector; useful for stopping execution during debugging (insert BRK to examine program state).

## Branch instructions
- There are eight branch instructions (conditional relative branches).
- Branch offsets are short-range: effective hops are limited to about a hundred memory locations (relative addressing range). Plan program layout accordingly.

## References
- "comparison_instructions_and_branch_usage" — expands on Compare + branch examples  
- "logical_operations_overview" — expands on next topic: logical instructions that operate on A

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
- INX
- INY
- DEX
- DEY
- JSR
- RTS
- BRK
- BCC
- BCS
- BEQ
- BNE
- BMI
- BPL
- BVC
- BVS
