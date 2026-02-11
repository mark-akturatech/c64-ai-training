# 6502 Overflow Flag (V)

**Summary:** The Overflow flag (V) in the 6502 processor status indicates an invalid two's-complement result from an arithmetic operation; it is part of the Processor Status register (P) and commonly arises from arithmetic on the accumulator (A).

## Description
The overflow flag is set when an arithmetic operation produces a result that is invalid for two's-complement signed arithmetic. Example: adding two positive 8-bit numbers that produce a negative signed result (64 + 64 => -128) will set V.

General rule (two's-complement):
- If the most significant bits (MSBs) of the two operands are the same, and that MSB differs from the MSB of the result, then the overflow flag is set.

The V flag is stored in the processor status register P (see processor_status_register for layout and usage). Overflow detection typically concerns signed arithmetic on the accumulator.

## References
- "accumulator" — where overflow typically arises from arithmetic on A  
- "processor_status_register" — shows flag P contains the V bit