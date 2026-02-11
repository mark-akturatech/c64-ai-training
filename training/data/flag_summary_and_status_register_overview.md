# Status Register (SR) — Flags, bit layout, and branch mapping

**Summary:** Concise reference for the 6502/Commodore status register (SR): bit positions (7..0 = N V - B D I Z C), meanings of each bit including unused bit 5, control flags D and I with SED/CLD and SEI/CLI cautions, the non-testable B/D/I bits, and branch instructions for the four testable flags (Z, C, N, V). Includes an example interpreting SR hex $B1 and a warning about editing SR in the machine monitor.

## Flag Summary
A compact table of the four testable flags and the branches that test them.

| Flag | Name     | Meaning (short)              | Activity level | Branch taken if Set | Branch taken if Not Set |
|------|----------|------------------------------|----------------|---------------------|-------------------------|
| Z    | Zero     | Result was zero / equal      | Busy           | BEQ                 | BNE                     |
| C    | Carry    | Unsigned carry/borrow (>=)   | Quiet          | BCS                 | BCC                     |
| N    | Negative | High bit set (sign bit)      | Busy           | BMI                 | BPL                     |
| V    | Overflow | Signed arithmetic overflow   | Quiet          | BVS                 | BVC                     |

## The Status Register
Bit layout (MSB..LSB):

  7 6 5 4 3 2 1 0
  N V - B D I Z C

Per-bit meanings:

- N (bit 7) — Negative flag: set when the result has bit 7 = 1 (signed negative).
- V (bit 6) — Overflow flag: set when signed arithmetic overflow occurs. (See CLV instruction for clearing.)
- Bit 5 (bit 5) — Unused: typically reads as 1 on many machines; not architecturally defined.
- B (bit 4) — Break indicator: signals whether the interrupt was caused by a BRK instruction (BRK = software interrupt). This bit is not directly testable with branch instructions.
- D (bit 3) — Decimal mode: controls BCD (binary-coded decimal) behavior for ADC/SBC. On Commodore machines this flag is normally off; do not set it unless you understand BCD arithmetic implications. Set with SED, cleared with CLD.
- I (bit 2) — Interrupt disable (IRQ mask): when set, IRQs are disabled. Set with SEI, cleared with CLI. This is a control flag (not tested by branch instructions).
- Z (bit 1) — Zero flag: set when operation result is zero (equal).
- C (bit 0) — Carry flag: unsigned carry/borrow indicator; also used for shifts/rotates and multi-byte arithmetic.

Notes:
- B, D, and I are not testable by branch instructions; they act as control/status indicators.
- D (decimal mode) is considered dangerous on Commodore systems — avoid setting with SED unless code expects BCD arithmetic.
- I disables IRQ-level interrupts; use SEI/CLI to control IRQ responsiveness.
- Bit 5 is unused and often reads as 1; do not rely on it for program logic.

Example — interpreting an SR hex value:
- SR = $B1 (hex) = %10110001 (binary)
  - Bits (7..0): 1 0 1 1 0 0 0 1
  - N = 1 (set)
  - V = 0 (clear)
  - Bit5 = 1 (unused)
  - B = 1 (break indicator set)
  - D = 0 (decimal off)
  - I = 0 (interrupts enabled)
  - Z = 0 (zero clear)
  - C = 1 (carry set)
- Expressed in plain terms: N on, V off, Z off, C on (as in the source example).

Warning:
- The machine language monitor allows editing the SR value directly; be careful — accidentally setting D or I can change arithmetic behavior (D) or disable interrupts (I). Only modify SR manually if you know the consequences.

## References
- "flags_introduction_and_z_flag" — expands on Z flag details referenced in SR
- "c_flag_description" — expands on C flag referenced in SR
- "v_flag_and_overflow" — expands on V flag and CLV instruction

## Mnemonics
- SED
- CLD
- SEI
- CLI
- BRK
- CLV
- BEQ
- BNE
- BCS
- BCC
- BMI
- BPL
- BVS
- BVC
