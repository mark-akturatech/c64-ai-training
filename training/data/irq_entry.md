# IRQ / BRK entry (KERNAL, vectored at $FFFE)

**Summary:** IRQ/BRK entry (vectored at $FFFE) saves A/X/Y, loads a byte from the stack and ANDs #$10 (status bit 4 — the 6502 Break flag) to distinguish BRK (software) from hardware IRQ, then JMPs indirectly via $0316 (CBINV — warm start) for BRK or $0314 (CINV — normal IRQ handler) for IRQ.

## Description
This KERNAL entry (the IRQ/BRK entry routine) performs a minimal prologue and dispatch:

- Saves A, X, Y on the stack (PHA / TXA / PHA / TYA / PHA).
- Uses TSX to copy the current stack pointer into X, then reads a byte from the stack (LDA $0104,X) that was pushed by the CPU at interrupt/BRK time.
- Tests bit 4 of that stack byte with AND #$10. Bit 4 is the 6502 Break (B) flag: BRK pushes the status with B set, IRQ pushes it with B clear.
- If the B bit is set (BRK), JMPs indirectly to the vector at $0316 (CBINV) — typically points to the warm-start/BRK handler (often FE66).
- If the B bit is clear (hardware IRQ), JMPs indirectly to the vector at $0314 (CINV) — the normal IRQ handler (often EA31).

This routine thus separates BRK and IRQ processing early and vectors to the appropriate KERNAL handler. The routine bytes shown below are the canonical KERNAL prologue that does the stack read-and-test and the two indirect JMPs.

**[Note: Source may contain an error — the instruction LDA $0104,X (BD 04 01) is verbatim in the listing; typical stack indexing to read the CPU-pushed status byte after the three PHA pushes is often described as $0103,X in other references. Verify against the ROM image if the precise offset is critical.]**

## Source Code
```asm
.,FF48 48       PHA             ; Store Acc
.,FF49 8A       TXA
.,FF4A 48       PHA             ; Store X-reg
.,FF4B 98       TYA
.,FF4C 48       PHA             ; Store Y-reg
.,FF4D BA       TSX
.,FF4E BD 04 01 LDA $0104,X     ; Read byte on stack written by processor?
.,FF51 29 10    AND #$10        ; check bit 4 to determine HW or SW interrupt
.,FF53 F0 03    BEQ $FF58
.,FF55 6C 16 03 JMP ($0316)     ; jump to CBINV. Points to FE66, BASIC warm start
.,FF58 6C 14 03 JMP ($0314)     ; jump to CINV. Points to EA31, main IRQ entry point
```

## Key Registers
- $FF48-$FF58 - KERNAL - IRQ/BRK entry prologue and dispatcher
- $FFFE - System vector (IRQ/BRK) - address at reset/IRQ/BRK vectors (low byte stored here)
- $0314 - KERNAL vector CINV - normal IRQ handler vector (commonly points to EA31)
- $0316 - KERNAL vector CBINV - BRK/warm-start handler vector (commonly points to FE66)

## References
- "kernal_reset_vectors" — expands on CINV/CBINV vectors and the kernel vector table

## Labels
- CINV
- CBINV
