# C Flag (Processor Status Carry / GE)

**Summary:** Describes the 6502 C (carry) flag semantics after comparisons (CMP/CPX/CPY), its role in arithmetic (ADC/SBC and shifts/rotates), which instructions affect it (compare and arithmetic/shift/rotate), branch instructions that test it (BCS/BCC), and direct set/clear via SEC/CLC.

## Description and semantics
- After a comparison (CMP, CPX, CPY) the C flag is set if the compared register (A, X, or Y) is greater than or equal to the memory operand; it is clear if the register is smaller. Conceptually: C = 1 means ">= (no borrow)" from the comparison.
- In arithmetic, the C flag functions as a carry/borrow bit between significance columns (it is used by ADC and SBC). It is also affected by shift and rotate instructions which shift bits into or out of the carry (see below).
- Loading a register (e.g., LDA) changes the Z flag but does not affect the C flag, because no arithmetic/comparison is performed.
- The C flag can be explicitly set or cleared with SEC (set carry) and CLC (clear carry).

## Instructions that affect or test C
- Comparison instructions: CMP, CPX, CPY — set/clear C according to register >= operand.
- Arithmetic instructions: ADC, SBC — read and write C as carry/borrow.
- Shift/rotate instructions: instructions that move bits into/out of the carry (ROL, ROR, ASL, LSR) affect C.
- Branches:
  - BCS — branch if carry set (C = 1).
  - BCC — branch if carry clear (C = 0).
- Direct set/clear: SEC (set carry), CLC (clear carry).

**[Note: Source may contain an error — the original text calls rotate/shift a "type of multiplication and division"; shifts/rotates implement bit shifts (which can multiply/divide by two in unsigned arithmetic) but calling them a form of multiplication/division is misleading.]**

## Branch substitution note
- Because CMP sets C to indicate >=, some loop branches can be expressed using carry tests instead of equality tests. Example equivalence noted in the source: a BNE used to loop until a register equals 6 can, depending on the comparison used, be replaced by BCC (branch if less than) to achieve the same control flow. (The underlying equivalence depends on how the comparison was performed and which flags were affected.)

## Source Code
(none)

## Key Registers
(none)

## References
- "flags_introduction_and_z_flag" — related Z flag behavior and compare/branch examples  
- "v_flag_and_overflow" — contrast with V flag (signed overflow)