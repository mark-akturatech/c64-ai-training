# COMMODORE 64 — Implied addressing mode

**Summary:** Implied addressing (no operand bytes) — instructions that act on implied registers or the stack (examples: PHA, PLA, PHP, PLP). Establishes shorthand register names A, X, Y, S, P for accumulator, index registers, stack pointer, and processor status.

## Implied addressing mode
Implied mode means the instruction itself specifies which register, flag, or internal operation it affects; no additional operand bytes follow the opcode. Typical implied opcodes seen here are stack and register operations (PHA, PLA, PHP, PLP). Use implied mode when an operation inherently targets a CPU register or internal state rather than memory (compare with immediate, zero page, and absolute modes).

Examples (mnemonics referenced):
- PHA / PLA — stack operations involving the accumulator
- PHP / PLP — stack operations involving the processor status

(These opcodes do not include operand bytes; they are single-byte instructions.)

## Register shorthand
- A — Accumulator
- X — X index register
- Y — Y index register
- S — Stack pointer
- P — Processor status

## References
- "the_stack" — expands on Stack-related implied instructions (PHA/PLA/PHP/PLP)
- "lda_immediate_absolute_and_address_representation" — contrasts implied mode with immediate/absolute examples

## Mnemonics
- PHA
- PLA
- PHP
- PLP
