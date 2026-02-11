# Stop cassette motor (ROM snippet)

**Summary:** Small 6502/6510 ROM routine that stops the C64 datasette motor by setting bit $20 on the 6510 I/O port $01 (reads $01, ORA #$20, STA $01, RTS). Searchable terms: $01, $20, 6510, ORA, STA, cassette motor.

## Description
This routine performs a read‑modify‑write on the 6510 CPU I/O port at $01 to set bit $20 (bit 5). The code:

- Reads the current value of $01 (LDA $01) to preserve other control bits.
- ORs the value with #$20 (ORA #$20) to set bit 5 without changing other bits.
- Writes the result back to $01 (STA $01), thereby changing the port state.
- Returns (RTS).

In this ROM context the effect documented in the original disassembly is to turn the cassette (datasette) motor off by setting bit $20. This is a non-destructive update of $01 because the read/OR/write preserves all bits except forcing bit 5 = 1.

## Source Code
```asm
.,FCCA A5 01    LDA $01         read the 6510 I/O port
.,FCCC 09 20    ORA #$20        mask xxxx xx1x, turn the cassette motor off
.,FCCE 85 01    STA $01         save the 6510 I/O port
.,FCD0 60       RTS
```

## Key Registers
- $0001 - 6510 - CPU I/O port (memory configuration and peripheral control; bit $20 (bit 5) used here to control the cassette motor — set to 1 to stop motor as per ROM comment)

## References
- "restore_everything_for_STOP" — expands on called when restoring system during STOP