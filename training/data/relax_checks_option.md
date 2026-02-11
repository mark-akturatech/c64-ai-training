# ca65 --relax-checks option

**Summary:** ca65 assembler option --relax-checks disables specific assembler error checks: truncation of byte-sized values from non-zero-page addresses and the page-boundary indirect JMP check (6502 page-wrap bug). Use when targeting corner-case or intentionally non-portable 6502 behavior.

## Description
--relax-checks turns off selected assembler safety checks so code that would normally be rejected can be assembled. This is intended for special cases where the programmer knowingly relies on non-standard or CPU-specific behavior (for example, the 6502 indirect-JMP page-wrap quirk).

Two checks disabled by this option are explicitly:

- Address vs. fragment size: byte-sized loads (or byte-valued expressions) generated from non-zero-page addresses will be silently truncated to a byte instead of producing an assembler error. This allows emitting 8-bit values even if the source expression references a full address rather than an 8-bit constant.

- Indirect JMP page-boundary: the assembler will allow jmp (label) even when label resides at a page boundary ($xxFF). On real 6502 CPUs, an indirect JMP vector placed at $xxFF causes the high byte to be fetched from $xx00 instead of $xx+1$ due to the CPU's page-wrap behavior; with --relax-checks the assembler will not flag this as an error.

Use this option only when you intentionally rely on these behaviors (for example, writing code that depends on the 6502 page-wrap bug), because it disables checks that normally catch likely mistakes.

## References
- "cpu_type_and_supported_cpus" — expands on 6502-specific behavior relevant to indirect-JMP page-boundary semantics
