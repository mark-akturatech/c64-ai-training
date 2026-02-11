# Flags, Status Register, Signed Numbers, and Logical Operators — Concise Recap

**Summary:** Recap of CPU flags (Z, C, N, V), the processor Status Register (SR with B/D/I), how flags link instructions and are tested by branches (e.g., BEQ/BNE), interrupts preserving SR (≈60 Hz), two's-complement signed numbers, and logical operators (AND, ORA, EOR) for bit manipulation of the A register.

## Flags and instruction linking
Flags are used to connect separated instructions: an instruction that sets a flag (for example, a load or a compare) can be followed later by a different instruction that tests that flag to decide program flow. Some instructions set or change one or more flags; others do not affect flags. Therefore flag-setting and flag-testing instructions need not be adjacent.

## Testable flags and branching
The four testable flags are:
- Z — Zero (indicates result is zero, used as "equals")
- C — Carry (used as "greater/equal" in unsigned arithmetic and shifts)
- N — Negative (reflects the high bit of the result)
- V — Overflow (signed arithmetic overflow)

These flags are examined by branch instructions to perform conditional control flow. Example mnemonics: BEQ (branch if equal, i.e., Z set) and BNE (branch if not equal, Z clear). (Other branch opcodes test other flags.)

## Status register (SR)
The processor Status Register (SR, a.k.a. processor status word) contains the four testable flags (Z, C, N, V) plus:
- B — Break indicator
- D — Decimal mode flag (affects add/subtract in decimal)
- I — Interrupt disable (lockout)

The SR value (often shown as a hexadecimal byte) can be converted to binary to inspect each flag bit individually.

## Interrupts and state preservation
The system typically receives a periodic interrupt (≈60 times per second). On interrupt entry the processor state — including the Status Register and other necessary registers — is preserved so that, after interrupt handling, the main program resumes as though uninterrupted.

## Signed numbers (two's-complement)
A byte in memory may be treated as signed by convention; signed values are stored in two's-complement form. The high bit (bit 7) is 0 for non-negative values and 1 for negative values. The CPU operates on the raw bits; whether a value is interpreted as signed or unsigned depends on how the program uses it. The V flag indicates signed overflow conditions.

## Logical operators (bit manipulation)
Three logical instructions operate on the accumulator (A) to manipulate bits:
- AND — clears selected bits (bitwise AND)
- ORA — sets selected bits (bitwise OR)
- EOR — inverts selected bits (bitwise exclusive OR)

These instructions allow selective modification of bits in A.

## References
- "flag_summary_and_status_register_overview" — expanded details on SR and flag summaries  
- "logical_operations_overview" — expanded coverage of logical operators and their uses

## Mnemonics
- AND
- ORA
- EOR
- BEQ
- BNE
