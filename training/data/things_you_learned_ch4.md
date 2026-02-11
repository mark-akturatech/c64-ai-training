# Chapter 4 — Signed vs Unsigned, Multi-byte Arithmetic, Shifts, and Subroutines

**Summary:** Covers signed vs unsigned interpretation, multi-byte arithmetic and carry/borrow handling, ADC/CLC and SBC/SEC usage, checking C and V for unsigned/signed overflow, ASL/ROL and LSR/ROR for multiply/divide (A or memory), and machine-language subroutines (JSR/RTS). Keywords: ADC, SBC, CLC, SEC, ASL, ROL, LSR, ROR, carry, overflow, V flag, multi-byte.

## Signed vs unsigned numbers
- A byte's high bit (bit 7) is merely a convention: treat it as sign (0 = positive, 1 = negative) when using signed arithmetic; otherwise treat all bits as magnitude for unsigned arithmetic.
- The CPU performs the same bit-level operations regardless of interpretation; which flags you check (C vs V) depends on whether values are unsigned or signed.

## Multi-byte numbers and carry handling
- Use multiple bytes (low byte + high byte, little-endian) to hold values larger than 8 bits. Always process multi-byte arithmetic starting at the low end (least-significant byte).
- The processor carry flag (C) is used as the inter-byte carry/borrow:
  - For addition, clear C before the low-byte ADC; each subsequent ADC will add the carry into the next byte.
  - For subtraction, set C before the low-byte SBC; each subsequent SBC uses the carry as an inverted borrow.

## Addition (ADC + CLC)
- Sequence: CLC; ADC low-byte; ADC next-byte; ... (A holds intermediate)
- Clear the carry (CLC) before the first ADC so no stale carry is introduced.
- The carry flag propagates carries between bytes automatically.

## Subtraction (SBC + SEC)
- Sequence: SEC; SBC low-byte; SBC next-byte; ... (A holds intermediate)
- Set the carry (SEC) before the first SBC because SBC uses carry as inverted borrow.
- The carry flag propagates borrows between bytes.

## Overflow and flags (C vs V)
- Unsigned interpretation: final C indicates overflow past the high byte. (Source phrasing: "For unsigned numbers, the carry should end up as it started — clear for addition, set for subtraction; otherwise we have overflow in the result.")
- Signed interpretation: the V (overflow) flag indicates signed overflow; the carry flag is not relevant for signed overflow detection.
- Shifts and arithmetic also affect N (negative) and Z (zero) flags as usual; check V only for signed overflow conditions.

## Shifts and rotates (ASL/ROL, LSR/ROR)
- ASL (arithmetic shift left) multiplies a byte by 2; LSR (logical shift right) divides a byte by 2 (unsigned).
- For multi-byte shift:
  - Multiply (left shift): start at the low byte and propagate using ROL (rotate left) into higher bytes so the carry from the low byte becomes bit 0 of the next byte.
  - Divide (right shift): start at the high byte and propagate using ROR (rotate right) into lower bytes so the carry from the high byte becomes bit 7 of the next lower byte.
- Shifts/rotates may operate on the A register or directly on memory.
- N and Z are affected by shifts/rotates; C is used to pass the bit shifted out between bytes.

## Subroutines in machine language
- Subroutines are supported (call/return mechanism; e.g., JSR to call, RTS to return). (JSR/RTS noted parenthetically only.)
- Use A and memory and flags predictably across calls; preserve registers/flags as required by the calling convention you choose.

## References
- "addition_and_multi_byte_addition" — expands on ADC/CLC multi-byte rules  
- "left_shift_and_rol" — expands on ASL/ROL multi-byte shift behavior

## Mnemonics
- ADC
- SBC
- CLC
- SEC
- ASL
- ROL
- LSR
- ROR
- JSR
- RTS
