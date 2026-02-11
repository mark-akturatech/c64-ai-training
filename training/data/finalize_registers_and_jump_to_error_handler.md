# Final destructive-write termination and branch to KERNAL error handler

**Summary:** Final register updates for the drive control byte ($0031) and immediate A-load ($01), then JMP to the KERNAL error handler $F969; uses 6502 mnemonics LDA, STA, JMP.

## Operation
This snippet finishes a destructive write sequence by updating a drive-control byte in zero page and then transferring control to the KERNAL error handler for the "single sector 23 error" flow. It performs:

- LDA #$05 — load immediate $05 into A
- STA $0031 — store A into zero-page location $31 (drive control byte)
- LDA #$01 — load immediate $01 into A (value left in A for the branch)
- JMP $F969 — unconditional jump to KERNAL routine at $F969 (error handler)

**[Note: source used '*' to denote hex (e.g. *31, *F969). This has been interpreted as the conventional C64 hex prefix '$'.]**

## Source Code
```asm
        ; Final register updates and termination of destructive write routine
700     LDA #$05
710     STA $0031
720     LDA #$01
730     JMP $F969
```

## Key Registers
- $0031 - Zero Page - drive control byte (updated to $05 to finish destructive write)
- $F969 - KERNAL - entry point for single-sector-23 error handler

## References
- "write_overflow_and_buffer_write_loops" — expands on buffer write and drive routine call