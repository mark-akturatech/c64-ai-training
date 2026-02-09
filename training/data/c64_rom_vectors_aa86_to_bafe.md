# MACHINE — ROM routine index continuation ($AA86–$BB12)

**Summary:** Continuation of the Commodore 64 ROM routine table listing routine entry addresses ($AA86 … $BB12) and routine names such as Perform CMD, Perform PRINT, input routines, FLOAT/FIXED conversions, string handling, garbage collection, and numeric/floating-point helpers.

**ROM routine index ($AA86–$BB12)**

The routines below are ROM entry points (hex addresses) with their names as given in the source listing. This chunk is an index only (no disassembly included).

- $AA86: Perform CMD
- $AAA0: Perform PRINT
- $AB1E: Print string from (Y.A)
- $AB3B: Print format character
- $AB4D: Bad input routine
- $AB7B: Perform GET
- $ABA5: Perform INPUT#
- $ABBF: Perform INPUT
- $ABF9: Prompt and input
- $AC06: Perform READ
- $ACFC: Input error messages
- $AD1E: Perform NEXT
- $AD78: Type match check
- $AD9E: Evaluate expression
- $AEA8: Constant-pi
- $AEF1: Evaluate within brackets
- $AEF7: Check for ")"
- $AEFF: Check for comma
- $AF08: Syntax error
- $AF14: Check range
- $AF28: Search for variable
- $AFA7: Set up FN reference
- $AFE6: Evaluate OR
- $AFE9: Evaluate AND
- $B016: Compare
- $B081: Perform DIM
- $B08B: Locate variable
- $B113: Check alphabetic
- $B11D: Create variable
- $B194: Array pointer subroutine
- $B1A5: Value 32768
- $B1B2: Float-fixed
- $B1D1: Set up array
- $B245: Print "BAD SUBSCRIPT"
- $B248: Print "ILLEGAL QUANTITY"
- $B34C: Compute array size
- $B37D: Evaluate FRE
- $B391: Fixed-float
- $B39E: Evaluate POS
- $B3A6: Check direct
- $B3B3: Perform DEF
- $B3E1: Check FN syntax
- $B3F4: Evaluate FN
- $B465: Evaluate STR$
- $B475: Calculate string vector
- $B487: Set up string
- $B4F4: Make room for string
- $B526: Garbage collection
- $B5BD: Check salvageability
- $B606: Collect string
- $B63D: Concatenate
- $B67A: Build string to memory
- $B6A3: Discard unwanted string
- $B6DB: Clean descriptor stack
- $B6EC: Evaluate CHR$
- $B700: Evaluate LEFT$
- $B72C: Evaluate RIGHT$
- $B737: Evaluate MID$
- $B761: Pull string parameters
- $B77C: Evaluate LEN
- $B782: Exit string-mode
- $B78B: Evaluate ASC
- $B79B: Input byte parameter
- $B7EB: Parameters for POKE/WAIT
- $B7F7: Float-fixed
- $B80D: Evaluate PEEK
- $B824: Perform POKE
- $B82D: Perform WAIT
- $B849: Add 0.5
- $B850: Subtract-from
- $B853: Evaluate - (subtraction)
- $B86A: Evaluate + (addition)
- $B947: Complement FAC (floating accumulator) #1
- $B97E: Print "OVERFLOW"
- $B983: Multiply by zero byte
- $B9EA: Evaluate LOG
- $BA2B: Evaluate * (multiplication)
- $BA59: Multiply a bit
- $BA8C: Memory to FAC#2
- $BAB7: Adjust FAC#1 and FAC#2
- $BAD4: Underflow/overflow
- $BAE2: Multiply by 10
- $BAF9: +10 in floating point
- $BAFE: Divide by 10
- $BB12: Evaluate / (division)

## Source Code

This chunk contains only the routine index (addresses and names). No assembly listings, register maps, or code were provided in the source; therefore, no Source Code section is included.

## Key Registers

- (none) — This chunk is an index of ROM routine entry addresses, not hardware registers. Key Registers omitted.

## Incomplete

- Missing: Disassembly or code listings for each routine (entry point bytes, mnemonic sequences, and parameter/stack conventions).
- Missing: Per-routine descriptions of inputs/outputs, exact behavior, and calling conventions used by BASIC and the KERNAL.
- Missing: Continuation beyond $BB12 (the source references a continuation chunk "c64_rom_vectors_bb.._to_e.." for later ROM routines).
- Missing: Any cross-reference table linking these routine names to higher-level BASIC/KERNAL calls or symbols.

## References

- "c64_rom_vectors_bb.._to_e.." — continuation of ROM routine table covering later addresses and routines