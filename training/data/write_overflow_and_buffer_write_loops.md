# ENABLE WRI — Destructive Write Sequence (Drive-Side)

**Summary:** Drive-side 6502 routine that clocks out a sector's GCR bytes to the drive serial port, using buffer pointers $0100,Y (OVERFLOW) and $0400,Y (BUFFER), and polling loops WAIT1, WAIT2, and WAIT3; finalizes by calling the drive routine at $FEOO. Searchable terms: $0100, $0400, $1C01, WAIT1, WAIT2, WAIT3, BUFFER, JSR $FEOO, GCR.

**Description**

This routine implements the byte-by-byte output portion of a destructive write sequence that sends a sector's GCR-encoded bytes from RAM to the drive. It reads bytes from a 256-byte buffer at $0400,Y (label BUFFER) and writes them to the drive via a store to the drive I/O location at $1C01. Three synchronization loops are used:

- **WAIT1:** Polls the drive-ready condition using a branch-on-overflow (BVC WAIT1) loop before the overflow-area write loop. CLV is executed just prior to the store to clear the overflow flag used by the poll.
- **OVERFLOW:** Handles writing from the overflow area at $0100,Y. This loop is executed if the main buffer at $0400,Y is exhausted before the write operation is complete.
- **WAIT2:** Polls the drive-ready condition before each byte transfer in the main buffer loop.
- **BUFFER:** Main byte-out loop that reads from $0400,Y and writes to $1C01, incrementing Y and repeating until the buffer is exhausted.
- **WAIT3:** Final synchronization loop executed after the buffer loop completes to ensure the final byte is fully processed before returning.

After synchronization, the code jumps to the routine at $FEOO to continue or finish drive-side processing.

This routine is drive-side (1541-style 6502 code); addresses like $1C01 and $FEOO are drive address-space references.

## Source Code

```asm
ENABLE_WRI:
    ; Initialize Y register and buffer pointers
    LDY #$00
    LDX #$04
    STX $FB
    LDX #$00
    STX $FC

    ; WAIT1: Poll drive-ready condition before overflow-area write loop
WAIT1:
    BVC WAIT1
    CLV

    ; OVERFLOW: Write loop for overflow area at $0100,Y
OVERFLOW:
    LDA $0100,Y
    STA $1C01
    INY
    BNE OVERFLOW

    ; WAIT2: Poll drive-ready condition before main buffer write loop
WAIT2:
    BVC WAIT2
    CLV

    ; BUFFER: Main byte-out loop
BUFFER:
    LDA $0400,Y
    STA $1C01
    INY
    BNE BUFFER

    ; WAIT3: Final synchronization loop
WAIT3:
    BVC WAIT3

    ; Jump to drive routine at $FEOO
    JSR $FEOO
```

## Key Registers

- **$1C01:** Drive I/O register used for data transfer.
- **$FEOO:** Drive routine entry point for further processing.

## References

- "Drive Register Setup and Write Sync" — Details on register initialization and synchronization for write operations.
- "Finalize Registers and Jump to Error Handler" — Information on finalizing registers and handling errors post-write.