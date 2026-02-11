# 6502 Status Register (P)

**Summary:** The 6502 Status Register P is an 8-bit flags register (bits 7..0 = S V - B D I Z C) that reflects results of arithmetic/logical operations and controls interrupt/decimal behavior. Commonly used flags: C (carry), Z (zero), V (overflow), S (sign/negative).

## Description
Bit layout (7..0):
S V 5 B D I Z C

- Bit 0 — C (Carry)
  - Set to 1 if arithmetic produces a carry out of bit 7 (unsigned overflow).
  - For subtraction, cleared (0) if a borrow is required; set (1) if no borrow is required.
  - Also used as the input/output bit for shift and rotate instructions (e.g., ROL, ROR).

- Bit 1 — Z (Zero)
  - Set to 1 when an operation's result is zero; cleared (0) when result is non-zero.

- Bit 2 — I (Interrupt Disable)
  - When set (1), maskable interrupt requests (IRQ) are ignored/disabled.
  - When cleared (0), IRQs are enabled.

- Bit 3 — D (Decimal Mode)
  - When set, ADC and SBC operate in Binary-Coded Decimal (BCD) mode (operands and results treated as two BCD nibbles 0x00–0x99).
  - When clear, ADC/SBC perform binary arithmetic.

- Bit 4 — B (Break)
  - Set in the copy of the status register pushed to the stack when a BRK instruction (software interrupt) is executed (indicates BRK-generated stack image).
  - Note: B is a flag in the pushed status value; the hardware representation in the live P register behaves specially during pushes and pulls.

- Bit 5 — (unused)
  - Not used by the CPU; typically reads back as logical 1.
  - Historically documented as "must be 1" in many contexts.

- Bit 6 — V (Overflow)
  - Indicates signed overflow for arithmetic operations (i.e., when the signed result cannot be represented in a signed byte).
  - **[Note: Source may contain an error — describing V as simply 'result too large to be represented in a byte' is ambiguous; V specifically signals signed (two's‑complement) overflow, not unsigned carry.]**

- Bit 7 — S (Sign / Negative)
  - Mirrors the high bit (bit 7) of the result: set if result has bit 7 = 1 (negative in two's‑complement), cleared if bit 7 = 0 (non-negative).

Most commonly tested/used flags: C, Z, V, S.

## References
- "instruction_operation_pseudocode_intro" — expands on SET_* and IF_* macros referencing these flags
