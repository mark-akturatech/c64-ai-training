# Convert Floating-Point to Signed Integer in A and Y (entry $B1AA)

**Summary:** ROM routine at $B1AA calls AYINT to range-check the Floating Point Accumulator and convert it to a 16-bit signed integer stored at $0064-$0065 (100-101), high byte first; result is left with high byte in A and low byte in Y. The vector at $0003-$0004 points to this routine for use by USR calls.

## Description
This subroutine (entry $B1AA) invokes AYINT to:
- Ensure the value in the Floating Point Accumulator is within the signed 16-bit range -32768..+32767.
- Convert the floating-point value to a 16-bit signed integer stored at $0064-$0065 (decimal 100-101), high byte first.
- Return with the high byte of the 16-bit result in the Accumulator (A) and the low byte in the Y register.

Although not referenced by BASIC code, the pointer stored at addresses $0003-$0004 is set to this entry, so the routine is available to user code (e.g., via a USR call) for passing/converting numeric parameters.

## Key Registers
- $B1AA - ROM - entry point: call AYINT to convert FPA -> 16-bit signed at $0064-$0065; returns A=high, Y=low
- $0003-$0004 - System Vector - points to $B1AA (provides USR-call access)
- $0064-$0065 - Zero Page (100-101) - 16-bit signed integer result, high byte first

## References
- "ayint_fp_to_signed_integer" — expands on AYINT range checking and conversion
- "givayf_int16_to_floating_point" — inverse: converting a 16-bit signed integer back to floating point (paired usage with USR vectors)
