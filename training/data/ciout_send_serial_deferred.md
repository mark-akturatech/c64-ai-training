# CIOUT: SEND SERIAL DEFERRED (KERNAL $FFA8 entry)

**Summary:** KERNAL deferred-serial output routine called from CIOUT ($FFA8). Tests the C3PO flag at $0094 (bit 7); if clear, sets it (SEC / ROR $0094), preserves A (PHA), calls the send-byte primitive at $ED40, restores A (PLA), stores the byte into BSOUR ($0095), clears carry (CLC) to signal success, and returns.

## Operation
This routine implements deferred serial output queuing used by the KERNAL serial driver:

- Entry: called from CIOUT ($FFA8) with the character in A.
- BIT $0094 tests the C3PO deferred-output flag (bit 7).
  - If bit 7 is set, the routine skips flag setup and proceeds to send the byte.
  - If bit 7 is clear, SEC followed by ROR $0094 rotates the processor carry (1) into bit 7 to set the C3PO flag.
    - (SEC sets carry=1; ROR shifts that 1 into bit 7.)
- The character in A is PHA'd to preserve it across the JSR $ED40 send routine (the send primitive can clobber A).
- JSR $ED40 transmits the byte on the serial bus (send-byte primitive).
- PLA restores A, STA $0095 stores the byte into BSOUR (serial buffer/source).
- CLC clears carry to indicate no error on return; RTS returns to caller.

This routine therefore sets up the deferred-output flag and ensures the byte is both sent (via the send primitive) and recorded in the kernel serial buffer.

## Source Code
```asm
                                *** CIOUT: SEND SERIAL DEFERRED
                                The KERNAL routine CIOUT ($ffa8) jumps to this routine.
                                The output flag, C3PO is set (ie. bit 7 = 1) and the
                                contents of (A) is placed in the serial buffer.
.,EDDD 24 94    BIT $94         C3PO flag, character in serial buffer
.,EDDF 30 05    BMI $EDE6       yes
.,EDE1 38       SEC             prepare for ROR
.,EDE2 66 94    ROR $94         set C3PO
.,EDE4 D0 05    BNE $EDEB       always jump
.,EDE6 48       PHA             temp store
.,EDE7 20 40 ED JSR $ED40       send data to serial bus
.,EDEA 68       PLA
.,EDEB 85 95    STA $95         store character in BSOUR
.,EDED 18       CLC             clear carry to indicate no errors
.,EDEE 60       RTS
```

## Key Registers
- $0094 - KERNAL workspace - C3PO deferred-output flag (bit 7)
- $0095 - KERNAL workspace - BSOUR serial buffer (stores last output character)

## References
- "tksa_send_talk_sa" — expands on send-byte handshake primitives ($ED36 / $ED40)
- "flag_errors" — expands on error-flag setting and exit handshake when send fails