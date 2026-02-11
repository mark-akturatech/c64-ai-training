# GIVAYF: Convert 16-bit signed integer to floating point (routine $B391)

**Summary:** Routine at $B391 converts a 16-bit signed integer (Accumulator = high byte, Y = low byte) into the Floating Point Accumulator. The zero-page RAM vector at $0005-$0006 points to this entry so it can be used to return USR-call results in the FP accumulator.

## Description
This KERNAL routine treats the value in the Accumulator (A) as the high byte and the Y register as the low byte of a 16-bit signed integer (two's complement) and converts that signed integer into the system Floating Point Accumulator (FPA). Callers place the integer bytes in A and Y, jump/call the routine at $B391, and read the resulting floating-point number from the FPA.

Because the RAM vector at zero-page addresses $0005-$0006 points to this routine, programs (via the USR vector) can return numeric results from machine-language USR calls by converting integer return values into the Floating Point Accumulator before returning control to BASIC.

## Key Registers
- $0005-$0006 - Zero page RAM - BASIC/USR vector (points to GIVAYF routine)
- $B391 - KERNAL ROM - GIVAYF entry (convert 16-bit signed A/Y -> Floating Point Accumulator)

## References
- "fre_free_memory_and_garbage_collection" — expands on usage: FRE uses this to convert the signed 16-bit free-memory value into floating point  
- "fp_to_signed_in_a_and_y_registers" — complementary routine used to place converted integers into A and Y for USR calls

## Labels
- GIVAYF
