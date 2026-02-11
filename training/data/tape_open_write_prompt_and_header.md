# KERNAL: Cassette Open-for-Write (OP170/OP200) — $F3AF-$F3BF

**Summary:** KERNAL cassette open-for-write sequence at $F3AF-$F3BF. Uses GET ANY OLD HEADER (JSR $F72C), branch checks (BEQ/BCC/BCS), prompts via CSTE2 (JSR $F838), sets header type LDA #$04 and calls TAPEH (JSR $F76A) to write the data-file header.

## Flow and behavior
This snippet is the cassette "open for write" path in the C64 KERNAL. Execution steps and branch meanings:

- JSR $F72C (labelled OP170 / "JSR FAH" in the commented listing) calls the routine that attempts to get an existing header from tape (GET ANY OLD HEADER).
- BEQ $F3D4 (branch if zero flag set) transfers to OP180 when the STOP key was detected by the header routine — abort open (STOP key pressed).
- BCC $F3C2 (branch if carry clear) continues to OP171 when the header routine returns OK (carry clear indicates success). (BCC tests carry flag.)
- BCS $F3AC (branch if carry set) goes to OP160 when the header routine signalled "file not found" (carry set indicates failure/file-not-found).
- If header handling indicates write should proceed, the code continues to open cassette for write:
  - JSR $F838 (label OP200 / CSTE2) issues the user prompt "PRESS PLAY AND RECORD".
  - BCS $F3D4 tests for STOP key (carry set) and aborts if pressed.
  - LDA #$04 loads the accumulator with $04, the data-file header type to be written.
  - JSR $F76A (TAPEH) writes the header to tape.

After TAPEH returns the sequence continues into the common finish/open logic (post-open buffer initialization and read/write common steps are handled elsewhere).

Note: branch mnemonics refer to carry/zero flag conditions as per 6502 conventions (BCC/BCS use carry).

## Source Code
```asm
.,F3AF 20 2C F7 JSR $F72C       OP170  JSR FAH         ;GET ANY OLD HEADER
.,F3B2 F0 20    BEQ $F3D4       BEQ    OP180           ;STOP KEY PRESSED
.,F3B4 90 0C    BCC $F3C2       BCC    OP171           ;ALL O.K.
.,F3B6 B0 F4    BCS $F3AC       BCS    OP160           ;FILE NOT FOUND...
                                ;
                                ;OPEN CASSETTE TAPE FOR WRITE
                                ;
.,F3B8 20 38 F8 JSR $F838       OP200  JSR CSTE2       ;TELL "PRESS PLAY AND RECORD"
.,F3BB B0 17    BCS $F3D4       BCS    OP180           ;STOP KEY PRESSED
.,F3BD A9 04    LDA #$04        LDA    #BDFH           ;DATA FILE HEADER TYPE
.,F3BF 20 6A F7 JSR $F76A       JSR    TAPEH           ;WRITE IT
                                ;
                                ;FINISH OPEN FOR TAPE READ/WRITE
```

## References
- "tape_read_decision_and_search" — expands the alternative tape-read path that precedes this write flow
- "tape_open_finish_and_buffer_init" — covers common post-open buffer initialization for tape reads/writes