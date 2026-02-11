# $030C-$030F — SAREG / SXREG / SYREG / SPREG (CPU Register Storage)

**Summary:** RAM bytes $030C-$030F are single-byte storage locations used to save CPU registers on the C64: $030C SAREG (Accumulator .A), $030D SXREG (.X), $030E SYREG (.Y), $030F SPREG (.P - status register).

## Overview
These four consecutive RAM bytes are reserved storage locations for copying the 6502 CPU registers. They are typically used by system/BASIC routines (for example, BASIC SYS entry/return paths) that need to preserve the CPU state across calls into machine code or system services. The names and purposes are:

- $030C — SAREG: Storage area for the Accumulator (.A).
- $030D — SXREG: Storage area for the X index register (.X).
- $030E — SYREG: Storage area for the Y index register (.Y).
- $030F — SPREG: Storage area for the Processor Status register (.P).

These bytes are contiguous in RAM and are referred to by system code by name (SAREG/SXREG/SYREG/SPREG) when saving/restoring the CPU state. SPREG holds the status flags' byte (see referenced "status_register_bits" for bit meanings).

## Key Registers
- $030C-$030F - RAM - Storage for CPU registers A/X/Y/P (SAREG, SXREG, SYREG, SPREG)

## References
- "register_storage_area" — how BASIC SYS uses these storage locations  
- "status_register_bits" — meaning of bits stored at SPREG

## Labels
- SAREG
- SXREG
- SYREG
- SPREG
