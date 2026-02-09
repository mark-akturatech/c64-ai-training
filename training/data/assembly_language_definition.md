# Assembly language

**Summary:** Assembly language uses an assembler to translate mnemonics into machine code once before running; key terms: assembler, mnemonics, machine code, POKE/PEEK, memory variables (example $20), mixing BASIC and assembly.

## Overview
Assembly language programs are written using mnemonic opcodes that an assembler converts into binary machine code in a one-time translation step (the assembled output is machine code). A well-written assembly program is essentially as efficient as hand-written machine code while providing readable symbolic mnemonics and named memory locations.

## Performance and hardware control
Assembly gives full software control of the computer and direct access to hardware features not available from BASIC. Because instructions execute with minimal overhead, assembly is the language of choice for timing-sensitive code (games, demos, tight loops) where execution speed and precise control are required.

## Memory variables and program interaction
In assembly you explicitly manage where data resides in memory by defining addresses as meaningful symbols (for example, $20 used as "player horizontal position"). ($ indicates a hexadecimal literal.) This explicit placement makes it straightforward to exchange data between BASIC and assembly: BASIC can POKE values into a chosen memory location and assembly can read them, or assembly can POKE values for BASIC to PEEK later.

## Assembler features (brief)
Assemblers translate mnemonics to opcodes and commonly provide pseudo-opcodes and directives (labels, constants, data definitions, address arithmetic) to simplify coding and improve readability. See related chunks for detailed pseudo-opcodes and assembler features.

## References
- "using_an_assembler_pseudo_opcodes" — expands on assembler features and pseudo-opcodes used in book  
- "machine_language_overview" — expands on assembly giving the speed of machine language with programmer-friendly syntax