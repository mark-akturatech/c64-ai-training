# 6502 Accumulator (A)

**Summary:** The 6502 Accumulator (A) is an 8-bit CPU register used for arithmetic and logical operations on the 6502; data must be loaded into A before those operations execute, except for increment/decrement instructions. See "processor_status_register" for the flags (Zero, Negative, Carry, Overflow) affected by accumulator operations.

## Description
- Name: Accumulator (A)
- Size: 8 bits
- Role: Primary operand/result register for arithmetic and logical instructions on the 6502.
- Usage rule: Data must be loaded into A before being manipulated by arithmetic/logical instructions. Increment (INC) and decrement (DEC) instructions operate on memory or index registers and do not require prior loading into A.
- Effects: Operations on A update processor status flags (see referenced processor status documentation).

## References
- "processor_status_register" — details on flags affected by accumulator operations (Zero, Negative, Carry, Overflow)