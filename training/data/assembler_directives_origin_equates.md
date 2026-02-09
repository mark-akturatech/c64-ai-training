# Assembler directives and equates (.OPT, *=, IDL/IDH)

**Summary:** Uses assembler optimization directive `.OPT P,02`, sets the assembly origin to $0400 with `* = *0400`, and defines equates `IDL = *0431` and `IDH = IDL+35` (per-track ID low/high table addresses).

## Directives and equates
- .OPT P,02 — assembler optimization directive (assembler-specific flag field).
- *= *0400 — sets the location counter (assembly origin) to $0400 so subsequent labels/equates are absolute within that segment.
- IDL = *0431 — equates the symbol IDL to absolute address $0431.
- IDH = IDL+35 — defines IDH as 35 (decimal) bytes after IDL; IDH = $0431 + 35 = $0454 (per-track ID high table address).

These equates are typically used to position per-track ID low/high tables within the code/data block placed at origin $0400.

## Source Code
```asm
.OPT  P,02

*=  *0400
IDL  =  *0431
IDH  =  IDL+35
```

## References
- "basic_preamble_open_sys" — expands on BASIC invocation that calls into the assembled code
- "vector_and_drive_initialization" — expands on initialization of zero page and vectors that uses the origin and equates