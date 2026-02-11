# CMPSTE — Compare start/end tape load/save addresses (KERNAL $FCD1)

**Summary:** KERNAL ROM routine at $FCD1 that compares start (SAL/SAH) and end (EAL/EAH) addresses used by tape read/save/write. Uses SBC across low/high bytes (16-bit subtraction), requires SEC on entry, and returns with RTS; affects processor flags used by callers (BCC/BNE). Addresses: $00AC,$00AD,$00AE,$00AF; opcodes: SEC, LDA, SBC, RTS.

## Description
This subroutine (labelled CMPSTE in the disassembly) performs a 16-bit comparison of the start and end addresses used by tape load/save/write routines. It is called by tape read, save and tape write code paths.

Operation:
- Entry: expects carry set (SEC) so that SBC operates as a normal subtraction-with-borrow for comparison.
- It performs SBC on the low bytes (SAL - EAL) then SBC on the high bytes (SAH - EAH). The low-byte SBC may generate a borrow that affects the high-byte SBC, producing a correct 16-bit result.
- Flags after the two SBCs reflect the signed/unsigned relation of start vs end and are used by callers with branch instructions (e.g. BCC, BNE) to make decisions.
- Returns with RTS; routine does not clear or alter carry beyond the subtraction sequence semantics (it preserves the logical comparison result expected by callers).

Called from tape header/data output and other tape I/O code paths that need to check the start ≤ end or equality conditions.

## Source Code
```asm
                                ;COMPARE START AND END LOAD/SAVE
                                ;ADDRESINESES.  SUBROUTINE CALLED BY
                                ;TAPE READ, SAVE, TAPE WRITE
.,FCD1 38       SEC             CMPSTE SEC
.,FCD2 A5 AC    LDA $AC         LDA    SAL
.,FCD4 E5 AE    SBC $AE         SBC    EAL
.,FCD6 A5 AD    LDA $AD         LDA    SAH
.,FCD8 E5 AF    SBC $AF         SBC    EAH
.,FCDA 60       RTS             RTS
```

## Key Registers
- $00AC-$00AF - KERNAL - SAL (start low), SAH (start high), EAL (end low), EAH (end high) — 16-bit start/end addresses used by tape load/save/write routines

## References
- "byte_finish_parity_and_header_character_output" — expands on CMPSTE usage to compare start:end when writing header/data ranges

## Labels
- CMPSTE
- SAL
- SAH
- EAL
- EAH
