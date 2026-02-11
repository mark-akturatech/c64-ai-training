# 6502 Division by Powers of Two (LSR / ROR)

**Summary:** Using LSR (logical shift right) and ROR (rotate right) on the 6502 divides unsigned integers by powers of two; remainder bits are recovered from the processor carry flag. Examples cover single-byte and two-byte (16-bit) values and the method of repeating shifts for higher powers of two.

## Division by 2 (single byte)
Use LSR on a single byte to divide it by 2 (unsigned). The least-significant bit (LSB) shifted out becomes the new carry flag and represents the remainder (0 or 1).

- Instruction: LSR NUM
- Result: NUM := NUM >> 1 (logical), Carry := original bit0 (remainder)

## Two-byte (16-bit) numbers
To divide a 16-bit unsigned value (NUMHI:NUMLO, high then low) by 2, shift the high byte first, then rotate the low byte through the carry so the high byte's low bit becomes the low byte's bit7:

- Sequence:
  - LSR NUMHI
  - ROR NUMLO

After this pair:
- The 16-bit value is divided by 2 (logical right shift across the two bytes).
- The final carry contains the original least-significant bit of the 16-bit value (the remainder).

(Explanation: LSR NUMHI shifts NUMHI right and places its bit0 into Carry; ROR NUMLO rotates Carry into NUMLO's bit7 and shifts NUMLO right, preserving a coherent 16-bit logical shift-right.)

## Higher powers of two
Divide by 2^n by repeating the single-/multi-byte shift sequence n times:

- Repeat LSR (single-byte) or (LSR NUMHI ; ROR NUMLO) (two-byte) n times.
- Remainder bits: each shift moves one bit into Carry. The first bit shifted out is the least-significant remainder bit, the second shift yields the next remainder bit, etc. Collect these carry bits in order if a full remainder (multiple bits) is required.

## Division by non-powers-of-two
Dividing by arbitrary constants (not powers of two) is more complex than multiplying by constants; implementing constant divisors often requires nontrivial algorithms. When you need both quotient and remainder, a general divide-anything-by-anything routine is often simpler and preferable.

## Source Code
```asm
; Single-byte divide by 2
        LSR NUM       ; NUM := NUM >> 1, Carry := original bit0 (remainder)

; Two-byte (16-bit) divide by 2 -- NUMHI = high byte, NUMLO = low byte
        LSR NUMHI
        ROR NUMLO     ; final Carry := original LSB of 16-bit value (remainder)

; For divide by 2^n, repeat the above shift n times.
```

## References
- "dividing_arbitrary_pencil" — expands on general division algorithm and non-power-of-two divisors

## Mnemonics
- LSR
- ROR
