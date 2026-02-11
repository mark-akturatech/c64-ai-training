# MEMBOT (KERNAL) — Read/Set bottom of memory (vectored from $FF9C)

**Summary:** MEMBOT is the KERNAL routine (vectored from $FF9C) that reads or sets the bottom-of-memory pointer MEMSTR ($0281/$0282). If the carry flag is set on entry it loads MEMSTR into X/Y; if carry is clear it stores X/Y into MEMSTR. Uses BCC/LDX/LDY/STX/STY/RTS.

## Description
This routine implements the MEMBOT KERNAL service. Entry is via the KERNAL vector at $FF9C. Behavior:

- Entry flag: the CPU carry flag determines operation.
  - Carry = 1 (set): read mode — load MEMSTR low byte into X and MEMSTR high byte into Y (LDX $0281; LDY $0282).
  - Carry = 0 (clear): write mode — store X into MEMSTR low and Y into MEMSTR high (STX $0281; STY $0282).
- Control flow: the routine tests carry with BCC to select the store path (branch on carry clear), otherwise it falls through to the load path; ends with RTS.
- MEMSTR is the two-byte KERNAL pointer holding the bottom-of-memory address (low byte at $0281, high byte at $0282).

## Source Code
```asm
.,FE34 90 06    BCC $FE3C       carry clear?
.,FE36 AE 81 02 LDX $0281       read membot from MEMSTR
.,FE39 AC 82 02 LDY $0282
.,FE3C 8E 81 02 STX $0281       store membot in MEMSTR
.,FE3F 8C 82 02 STY $0282
.,FE42 60       RTS
```

## Key Registers
- $0281-$0282 - KERNAL - MEMSTR low/high (bottom-of-memory pointer used by MEMBOT)

## References
- "kernal_memmap" — KERNAL pointer area (includes MEMSTR)

## Labels
- MEMBOT
- MEMSTR
