# ADRAY2 (Zero-page $05-$06)

**Summary:** Zero-page vector ADRAY2 at $0005-$0006 points to the BASIC routine that converts an integer to a floating-point number (ROM address noted as 45969 / $B391). Search terms: ADRAY2, $0005, $0006, zero-page vector, integer→floating conversion, BASIC, $B391.

## Description
This zero-page vector contains the two-byte address of the BASIC routine which converts an integer into a floating-point value. At the time of the source, that routine resides in ROM at 45969 ($B391). BASIC itself does not appear to call this location; it is exposed for machine-language programs that need to perform the conversion while interacting with BASIC.

The entry in the documentation cross-references the USR vector for an example of using BASIC routines from machine code; see the USR vector entry referenced at 785 ($311).

## Key Registers
- $0005-$0006 - Zero page - ADRAY2: pointer to BASIC integer→floating-point conversion routine (ROM address noted as $B391)

## References
- "USR vector" — entry referenced at 785 ($311) for using BASIC routines from machine code  
- "adray1_float_to_int_vector" — inverse conversion vector (floating→integer)  
- "input_scanning_chars_charac_endchr_trmpos" — next group of BASIC input-scanning variables

## Labels
- ADRAY2
