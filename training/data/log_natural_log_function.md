# LOG — natural logarithm of FAC1 (entry $B9EA)

**Summary:** Computes the natural logarithm (ln) of the floating-point value in FAC1 and leaves the result in FAC1. Entry point at $B9EA (decimal 47594); refers to LOGCN2 constants table and is related to EXP routines.

**Operation**
Performs the natural logarithm (base e) of the number stored in FAC1 (Floating-Point Accumulator #1). The result replaces the original value in FAC1. The implementation utilizes a constants table named LOGCN2 during the calculation and shares methods/tables related to the EXP function.

## Source Code

## Labels
- LOG
