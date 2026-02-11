# Overflow error handler entry (ROM $B97E–$B980)

**Summary:** 6502 ROM snippet at $B97E–$B980 that implements the arithmetic overflow error entry: it loads the error code $0F into X and jumps to the central error/warm-start routine at $A437 (VIC/CPU: 6502). Search terms: $B97E, $B980, $A437, overflow error, LDX #$0F, JMP $A437.

## Description
This ROM fragment is the entry used when an arithmetic overflow condition is detected. The handler performs two simple actions:

- LDX #$0F — load the X register with $0F, the error code for "overflow error".
- JMP $A437 — unconditional jump to the central error/reporting and warm-start routine at $A437 which uses the error code to report the error and restart.

Addresses and bytes shown are from the Commodore 64 ROM disassembly: the entry begins at $B97E (byte A2 0F) and the following JMP is at $B980 (bytes 4C 37 A4). This sequence is a minimal trampoline that sets the error number and transfers control to the shared error/warm-start logic.

Related implementation notes (see referenced chunks):
- The overflow can originate from exponent increment during floating-point alignment/mantissa operations; see "add_fac2_to_fac1_alignment_and_mantissa_operations" for the exact condition where exponent increment results in overflow.
- "negate_and_twos_complement_fac1" is referenced as a fallback path if mantissa/increment operations overflow into this error case.

## Source Code
```asm
.,B97E A2 0F    LDX #$0F        error $0F, overflow error
.,B980 4C 37 A4 JMP $A437       do error #X then warm start
```

## References
- "add_fac2_to_fac1_alignment_and_mantissa_operations" — expands on the case where exponent increment results in overflow
- "negate_and_twos_complement_fac1" — referenced fallback when mantissa/increment operations overflow into the error case