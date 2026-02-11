# ASL and ROL — Left Shift (Multiply by Two) and Multi‑byte Rotation

**Summary:** ASL (Arithmetic Shift Left) multiplies a byte by two on the 6502: each bit shifts left, bit7 becomes the Processor Status C flag, and a zero is shifted into bit0. ROL (Rotate Left) shifts left while inserting the previous C into bit0 and moving the old bit7 into C — used to chain shifts across multi‑byte (little‑endian) numbers.

## Left Shift (ASL)
ASL shifts every bit one position toward the high-order side (left). The bit that was in bit7 is moved into the carry flag (C); a zero is injected into bit0. The instruction can be used on the accumulator (ASL A) or on memory (ASL addr), and it updates the N (negative) and Z (zero) flags from the result and sets C from the old bit7.

Example effect on a single byte:
- Binary: %01100100 (decimal 100)
- After ASL: %11001000 (decimal 200)
- Old bit7 -> C; bit0 <- 0

Both ASL and ROL set N and Z according to the result; C is set to the bit shifted out (old bit7).

## Rotate Left (ROL) and Multi‑byte Shifts
ROL performs a left shift similar to ASL but uses the carry to supply bit0 and places the old bit7 into carry. This makes ROL ideal to propagate the bit shifted out from a lower-order byte into the next higher-order byte, enabling multi‑byte doubling.

Multi-byte doubling procedure (little-endian bytes, low-order first):
1. ASL the low-order byte (this shifts its bit7 into C).
2. ROL the next byte (C is shifted into its bit0; its old bit7 goes into C).
3. Repeat ROL for each successive higher-order byte.
4. After the highest byte, C contains the overflow bit from the whole multi-byte value.

Thus for an N‑byte value at addresses b0 (low) ... bN-1 (high):
- ASL b0
- For i = 1..N-1: ROL bi
- Final C = overflow from the whole N‑byte multiply-by-two

Use ASL on the low byte (so a zero would be injected there if no previous carry is desired), and use ROL for all higher bytes to chain the carry.

## Source Code
```text
Binary example:
  100:  %01100100
  200:  %11001000
(Each bit moved left one position; doubling the number)

ASCII diagram (ASL):
              +-----+----+----+----+----+----+----+-----+
              |     |    |    |    |    |    |    |     |
    CARRY   <---- <--- <--- <--- <--- <--- <--- <---  <---- 0
   (C FLAG)   |     |    |    |    |    |    |    |     |
              +-----+----+----+----+----+----+----+-----+
                                  ASL
```

```text
ASCII diagram (ROL):
                                                           CARRY
              +-----+----+----+----+----+----+----+-----+  |
              |     |    |    |    |    |    |    |     |  |
           ,----- <--- <--- <--- <--- <--- <--- <---  <----'
           |  |     |    |    |    |    |    |    |     |
           |  +-----+----+----+----+----+----+----+-----+
           v                      ROL
         CARRY
```

```asm
; Multiply a 3‑byte little-endian value at $0200-$0202 by two (no loop)
; Result replaces the bytes in place; final carry in C indicates overflow.
ASL $0200    ; shift low byte, old bit7 -> C
ROL $0201    ; shift middle byte, C -> bit0, old bit7 -> C
ROL $0202    ; shift high byte, C -> bit0, old bit7 -> C (final overflow)
```

## References
- "addition_and_multi_byte_addition" — expands on ASL/ROL producing carries which behave like overflow bits
- "multiplication_by_shifts_and_adds" — expands on using shifts and adds to build multiplications

## Mnemonics
- ASL
- ROL
