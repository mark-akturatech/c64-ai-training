# 6502 Subtraction (SBC) — Inverted-Borrow and Multi-Byte Rules

**Summary:** Explains SBC's inverted carry/borrow semantics on the 6502 (SEC before subtract), multi-byte subtraction ordering (low→high), and how to test the Carry and Overflow flags for unsigned underflow/signed overflow detection.

**Behavior**

On the 6502, the carry flag acts inverted for subtraction: C=1 means "no borrow," C=0 means "borrow occurred." SBC performs A := A - M - (1 - C), i.e., the implicit borrow is (1 - C). Because of that, you must set the carry (SEC) before a subtraction to indicate no incoming borrow. ([scribd.com](https://www.scribd.com/document/794833757/6502-Users-Manual?utm_source=openai))

**Multi-Byte Subtraction Procedure**

- For multi-byte (multi-precision) subtraction, set the carry once before the low-order byte subtraction: execute SEC, then perform SBC on the low-order byte.
- Process bytes from low-order to high-order (little-endian): low byte first, then the next more significant byte, etc.
- Do not re-SEC between bytes. Each SBC propagates the borrow via the hardware carry flag into the next byte.
- After the high-order byte SBC, the carry flag contains the final borrow state for the whole multi-byte value. ([atariarchives.org](https://www.atariarchives.org/roots/chapter_10.php?utm_source=openai))

**Flags and Overflow/Underflow Detection**

- **Unsigned underflow (borrow):** Check the Carry (C) after the final SBC. C=1 → no borrow (result ≥ 0 unsigned). C=0 → borrow occurred (unsigned underflow).
- **Signed two's-complement overflow:** Check the Overflow (V) flag after the operation. If V=1, then a signed overflow occurred. (V is set when the signed result cannot be represented in 7-bit magnitude with sign bit.) ([syncopate.us](https://syncopate.us/articles/2024/b29c?utm_source=openai))
- Do not rely on the negative (N) flag alone for overflow detection; use V for signed overflow and C for unsigned borrow.

**Rules (Summary)**

- SEC before starting any multi-byte subtraction.
- Use SBC on A for each byte, low-order byte first.
- Let the carry flag propagate borrows between bytes.
- After completion, test C for unsigned borrow and V for signed overflow.

## References

- "addition_multi_byte_machine_code" — complementary rules for multi-byte addition (CLC/ADC) and how carries propagate between bytes

## Mnemonics
- SBC
- SEC
