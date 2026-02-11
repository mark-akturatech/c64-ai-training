# TNOF — Turn Off Cassette Motor (KERNAL ROM $FCCA)

**Summary:** Small KERNAL routine at $FCCA that manipulates the 6510 I/O port ($0001 / R6510) to set the cassette motor control bit ($20) via ORA/STA and then returns with RTS. Searchable terms: $FCCA, $0001, R6510, cassette motor, ORA #$20, STA $01, RTS.

## Operation
This routine (labelled TNOF in the disassembly) reads the 6510 port at $0001 (R6510), sets the motor-control bit mask $20 with ORA #$20, writes the result back to $01, and returns. The routine is used by the KERNAL when the cassette motor must be turned off after tape operations.

Behavior summary:
- LDA $01 — fetch current 6510 port output (R6510).
- ORA #$20 — set bit mask $20 (motor control bit).
- STA $01 — store back to the 6510 port, changing the motor bit.
- RTS — return to caller.

(Labels and mnemonic names follow the KERNAL disassembly conventions; this chunk does not include surrounding context such as caller conventions or timing.)

## Source Code
```asm
.; Fully commented KERNAL disassembly snippet
.,FCCA A5 01    LDA $01         TNOF   LDA R6510       ;TURN OFF CASSETTE MOTOR
.,FCCC 09 20    ORA #$20        ORA    #$20            ;
.,FCCE 85 01    STA $01         STA    R6510
.,FCD0 60       RTS             RTS
```

## Key Registers
- $0001 - 6510 - CPU I/O port (R6510) — cassette motor control bit mask $20 (set by this routine)

## References
- "interrupt_restore_and_vic_keyboard_restore_tnif_tniq" — expands on use during system restore after tape write
- "block_completion_sync_and_write_zero_sequence" — expands on invocation when final block has been written

## Labels
- TNOF
- R6510
