# NMOS 6510 — Absolute Y Indexed R-M-W timing (DCP/ISC/RRA/RLA/SLO/SRE on abs,Y)

**Summary:** Per-cycle R-M-W timing for unofficial NMOS 6510 opcodes DCP/ISC/RRA/RLA/SLO/SRE using absolute,Y addressing: opcode fetch, absolute low/high fetch, dummy read from <AAH,AAL+Y> (before high-byte correction), old-data reads, unmodified write-back, final write. Also includes an example zeropage,X R-M-W timing (ROR zp,X) and a pointer to visual6502 simulation notes.

## Timing diagram (per-cycle behavior) — abs,Y R-M-W (general sequence)
These undocumented R-M-W absolute,Y opcodes perform a 7-cycle sequence on NMOS 6510:

1. Opcode fetch (PC) — read opcode
2. Absolute address low byte (PC+1) — read AAL
3. Absolute address high byte (PC+2) — read AAH
4. Dummy read from address <AAH, AAL+Y> — read using low byte AAL+Y while still supplying AAH; this occurs prior to applying any page-carry correction to the high byte (the CPU internally detects if AAL+Y wraps and will correct the high byte for the final effective address)
5. Read old data from effective address (after high-byte correction if page crossed) — this is the actual memory operand read
6. Write back unmodified data to the effective address (first write of original byte) — the unmodified value is written back
7. Write final modified data to the effective address (second write with the operation result)

Key behavioral points:
- The dummy read in cycle 4 uses <AAH, AAL+Y> (low byte incremented by Y, prior to any correction to AAH). The effective address used for the actual operand read in cycle 5 is AAL+Y with AAH corrected if the low-byte addition carried into the high byte.
- The operation performs an extra write-back of the original (unmodified) data before writing the modified result; software relying on memory side-effects (e.g., hardware that latches on writes) will observe both writes.
- This sequence mirrors the R-M-W semantics seen on zero-page indexed RMW forms, with the difference that absolute addressing requires fetching both address bytes and a dummy read before the effective-data read.

## Notes
- These opcodes are unofficial/undocumented NMOS 6502 (6510) opcodes commonly listed as DCP/ISC/RRA/RLA/SLO/SRE. Behavior described applies to NMOS 6502 timing and the NMOS 6510 used in the C64.
- A visual6502 simulation of these cycles and the internal bus activity exists (search visual6502 for the specific opcode + "abs,Y") for cycle-by-cycle inspection and waveform visualization.
- See "unintended_addressing_modes_absolute_y_rmw" for expanded discussion of unintended abs,Y opcode behaviors.

## Source Code
```text
; Absolute,Y R-M-W (general per-cycle sequence — reference)
; 1: PC         - Opcode fetch                             - R
; 2: PC+1       - Absolute address low byte (AAL)          - R
; 3: PC+2       - Absolute address high byte (AAH)         - R
; 4:            - Dummy read from <AAH, AAL+Y> (before high-byte correction) - R
; 5:            - Read old data from effective address (AAL+Y, AAH corrected if page crossed) - R
; 6:            - Write unmodified data back to effective address - W
; 7:            - Write final modified data to effective address - W
```

```text
; Example reference from source: ROR zp,X (zero-page indexed R-M-W) — 6-cycle pattern
; Read/Write
; Cycle  Address/PC         Action               R/W
; 1      PC                 Opcode fetch         R
; 2      PC+1               Direct offset        R
; 3 (*)  DO                 Byte at direct offset before index was added  R
; 4      DO+X               Old Data             R
; 5 (*)  DO+X               Old Data             W    ; unmodified data is written back
; 6      DO+X               New Data             W
;
; Notes:
; (*) Dummy fetch from direct offset before the index was added
; (*) Unmodified data is written back to the target address
```

## Key Registers
- (none) — this chunk documents CPU memory-access/timing behavior, not specific C64 hardware registers

## References
- "unintended_addressing_modes_absolute_y_rmw" — expands on unintended abs,Y opcodes and timing
- visual6502 simulation (searchable) — per-cycle visualizations and notes