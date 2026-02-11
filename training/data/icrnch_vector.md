# $0304-$0305 ICRNCH — Vector to the CRUNCH Routine (BASIC tokeniser)

**Summary:** $0304-$0305 (ICRNCH) is a two-byte little-endian vector in the BASIC indirect vector table that points to the CRUNCH routine at $A57C (42364). The CRUNCH routine converts ASCII BASIC keywords into internal BASIC tokens during tokenisation.

## Description
- Location: RAM bytes $0304 (low) and $0305 (high) hold the little-endian address for ICRNCH.
- Target: The vector points to the CRUNCH routine located at $A57C (decimal 42364) in the BASIC ROM.
- Purpose: The CRUNCH routine scans ASCII text of BASIC keywords and converts them into the interpreter's token format (keyword tokenisation) used by the BASIC interpreter when entering or storing program lines.
- Context: ICRNCH is one entry in the BASIC indirect vector table (basic_indirect_vector_table), a set of RAM vectors used by the BASIC ROM to call routines indirectly. Modifying this vector changes the entry point used for keyword crunching.

## Key Registers
- $0304-$0305 - BASIC indirect vector table - ICRNCH: pointer to CRUNCH routine ($A57C)

## References
- "basic_indirect_vector_table" — overview of BASIC indirect vectors and their purposes

## Labels
- ICRNCH
