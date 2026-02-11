# 9. Pseudo variables

**Summary:** Pseudo variables in ca65 are readable in all cases and, in some special cases, writable; notable pseudo variables include the program counter (*) and assembler directives like .ASIZE, .CPU, .ISIZE, .PARAMCOUNT, .TIME, and .VERSION.

## Overview
Pseudo variables provide assembler-visible values (and occasionally writable state) that macros, expressions, and directives can use. They are always readable; a subset may be written to under specific conditions documented by each pseudo variable's detailed page. This section is a general header pointing to the specific pseudo-variable documentation.

- Readable in all contexts.
- Writable only in the special cases described on each pseudo-variable's page (see references).

## References
- "pc_asterisk" — expands on Program counter pseudo variable (*)
- "asize_pseudo_variable" — expands on Accumulator size (.ASIZE)
- "cpu_pseudo_variable" — expands on CPU identification (.CPU)
- "isize_pseudo_variable" — expands on Index size (.ISIZE)
- "paramcount_pseudo_variable" — expands on Macro parameter count (.PARAMCOUNT)
- "time_pseudo_variable" — expands on Translation time (.TIME)
- "version_pseudo_variable" — expands on Assembler version (.VERSION)