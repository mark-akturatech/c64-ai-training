# 6502 Multiplication by Constants — Binary Decomposition (shifts & adds)

**Summary:** Method for multiplying a value by a constant on 6502-class CPUs by inspecting the constant's binary representation and combining powers of two (shifts and adds). Searchable terms: shifts, adds, binary decomposition, multiply by constant, 6502.

## Method
To multiply a register/memory value x by a constant C using only shifts (multiply by powers of two) and additions, write C in binary and use each 1 bit as an instruction to add a corresponding left-shifted copy of x. The bit at position k (LSB = position 0) indicates including 2^k * x (i.e., x shifted left k times).

Procedure (conceptual):
- Convert constant C to binary.
- For each bit set to 1 at position k, include x << k in the sum.
- Compute each x << k by performing k left shifts (or by repeated doubling) and accumulate with additions.

This requires no hardware multiply instruction and maps directly to sequences of ASL/ROL (or manual shift-and-add) on the 6502.

## Examples
Use the binary form of the constant; mark which powers of two contribute. Visual tree diagrams for each example are in the Source Code section below.

- 3 (decimal) = 11 (binary): 1*x + 2*x = 3*x (bits 0 and 1 set)
- 10 (decimal) = 1010 (binary): 2*x + 8*x = 10*x (bits 1 and 3 set)
- 25 (decimal) = 11001 (binary): 1*x + 8*x + 16*x = 25*x (bits 0, 3, and 4 set)

Notes:
- Left shifts implement multiplication by 2: one shift = 2*x, two shifts = 4*x, etc.
- On 6502, shifts are commonly implemented with ASL/ROL sequences (taking care with carry and multi-byte values).

## Source Code
```text
3 (decimal) = 11 (binary)
    |+--  1  (2^0)
    +--- +2  (2^1)
         --
          3, i.e. 1*x + 2*x = 3*x

10 (decimal) = 1010 (binary)
    | +--  2  (2^1)
    +---- +8  (2^3)
          --
          10, i.e. 2*x + 8*x = 10*x

25 (decimal) = 11001 (binary)
    ||  +--   1  (2^0)
    |+-----   8  (2^3)
    +------ +16  (2^4)
            ---
             25, i.e. 1*x + 8*x + 16*x = 25*x
```

## References
- "multiply_by_3_two_byte_example" — expands Example of 3 as 11b -> 2x + x
- "multiply_by_10_example_using_shifts_and_adds" — expands Example of 10 as 1010b -> 8x + 2x
- "multiply_by_non_power_of_two_strategy" — expands on Binary decomposition as the method used to choose which shifts/adds to perform