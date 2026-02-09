# ADRAY1 ($0003-$0004) — Zero-page vector: floating-point → signed integer

**Summary:** Zero-page vector ADRAY1 at $0003-$0004 points to the BASIC ROM routine that converts a floating-point number to a two-byte signed integer; current Kernal value points to $B1AA (decimal 45482). Useful for programs receiving floating-point parameters (for example via USR) and for stability across ROM revisions.

## Description
ADRAY1 is a two-byte zero-page vector ($0003-$0004) containing the address of a BASIC ROM routine that converts a floating-point value into a two-byte signed integer. The routine is handy when handling data stored in BASIC floating-point format (the same format used for parameters passed to BASIC's USR function).

- Current Kernal (as noted in the source) contains the routine at address 45482 ($B1AA).
- Disassembly of the ROMs shows BASIC itself does not use this vector, but it exists to provide a stable entry point for machine code programs that need BASIC's conversion routine.
- Using ADRAY1 protects your program from future ROM address changes; jump indirectly via the vector instead of hard-coding the ROM address.
- See the USR vector entry (at decimal 785 / $0311) for an example of calling BASIC routines from machine code and passing parameters in floating-point form.

## Source Code
(omitted — no assembly or tables provided in source)

## Key Registers
- $0003-$0004 - Zero page - ADRAY1 vector: address of BASIC routine to convert floating-point to two-byte signed integer

## References
- "adray2_int_to_float_vector" — complementary integer-to-floating-point conversion vector (ADRAY2)
- "zero_page_unused_02" — previous zero-page entries
- "usr_vector" — USR vector entry (decimal 785 / $0311): using USR to call BASIC routines and pass floating-point parameters