# 6502: Binary Multiplication Algorithm (llx.com)

**Summary:** Binary multiplication algorithm for use in 6502 machine code: iterate bits of the multiplier, add the multiplicand to an accumulating answer when a bit is 1, and shift the partial sums (the "stairstep" shift). Searchable terms: binary multiplication, multiplier bits, stairstep shift, machine code, one_byte_multiplication_routine, two_byte_multiplication_routine.

**Algorithm**
The binary multiplication algorithm is the same concept as longhand decimal multiplication, but simpler because each digit is only 0 or 1.

Procedure:
- Initialize answer = 0.
- For each bit (usually from least-significant to most-significant) in the multiplier:
  - Remove (examine) the rightmost bit of the multiplier.
  - If the bit is 1, add the multiplicand to answer shifted left by the number of bits already processed.
- Continue until all bits of the multiplier have been processed.

This produces partial sums in a "stairstep" pattern (each successive add is the multiplicand shifted one more bit to the left).

**Example**
Multiplying 110 (6) by 101 (5) in binary:

  110
x 101
-----
  110      <- multiplicand * least-significant 1
 110       <- multiplicand shifted one position for next 1 (middle bit of multiplier is 0 so skipped)
-----
11110      <- final binary result (30 decimal)

**Stairstep shift trick**
Machine-code implementations commonly exploit the stairstep pattern: rather than computing independent left-shifted copies of the multiplicand each time, the routine either
- shift the multiplicand left once per loop iteration and conditionally add it when the current multiplier bit is 1, or
- shift the accumulating answer right/left as appropriate and add an unshifted multiplicand when a bit is set.

(The source notes the "stairstep" trick is used in one-byte and multi-byte machine-code routines; detailed assembly implementations are covered in the referenced chunks.)

## Source Code
```text
Binary digit tables (reference):

+| 0  1      x| 0 1
--+-----     --+----
 0| 0  1      0| 0 0
 1| 1 10      1| 0 1

Example multiplication (as in source):

110
x 101
-----
  110
110
-----
11110
```

## References
- "one_byte_multiplication_routine" — one-byte machine code implementation of this algorithm
- "two_byte_multiplication_routine" — extension to wider operands (multi-byte multiplication)
