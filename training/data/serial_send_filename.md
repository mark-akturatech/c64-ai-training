# KERNAL: OP35/OP40 filename-send loop (serial/RS-232)

**Summary:** KERNAL ROM routine at $F3F6–$F406 implements an OP35/OP40 sequence to send a filename over the serial/RS-232 link: it tests FNLEN ($B7), loops reading bytes from (FNADR) (zero-page $BB) with (FNADR),Y, calls CIOUT (JSR $EDDD) for each character, increments Y until FNLEN bytes are sent, then jumps to CUNLSN ($F654). Search terms: FNLEN, FNADR, (FNADR),Y, CIOUT, JSR $EDDD, CUNLSN, $F3F6.

## Operation
- Entry at $F3F6: load FNLEN (zero-page $B7) and BEQ to $F406 if length is zero (no filename to send).
- If FNLEN > 0, set Y = 0 and enter the send loop:
  - LDA (FNADR),Y — fetch next filename byte via the zero-page pointer at $BB (indirect indexed addressing).
  - JSR $EDDD — call CIOUT to output the character to the current device (serial/RS-232 output routine).
  - INY — increment the index register to advance to the next character.
  - CPY FNLEN — compare Y to the filename length.
  - BNE back to the LDA if more bytes remain.
- After all bytes are sent, execution continues at $F406 which JMPs to CUNLSN ($F654). The comment notes that CUNLSN performs JSR UNLSN, CLC, RTS (cleanup/return).

Notes:
- FNLEN ($B7) is the byte count; FNADR pointer is at zero-page $BB (base address for the filename buffer).
- (FNADR),Y reads successive bytes without modifying FNADR; the index Y is used to traverse the buffer.
- CIOUT is at $EDDD in this KERNAL build.

## Source Code
```asm
.,F3F6 A5 B7    LDA $B7         OP35   LDA FNLEN
.,F3F8 F0 0C    BEQ $F406       BEQ    OP45            ;NO NAME...DONE SEQUENCE
                                ;
                                ;SEND FILE NAME OVER SERIAL
                                ;
.,F3FA A0 00    LDY #$00        LDY    #0
.,F3FC B1 BB    LDA ($BB),Y     OP40   LDA (FNADR)Y
.,F3FE 20 DD ED JSR $EDDD       JSR    CIOUT
.,F401 C8       INY             INY
.,F402 C4 B7    CPY $B7         CPY    FNLEN
.,F404 D0 F6    BNE $F3FC       BNE    OP40
                                ;
.,F406 4C 54 F6 JMP $F654       OP45   JMP CUNLSN      ;JSR UNLSN: CLC: RTS
```

## References
- "openi_serial_listen_and_presence_check" — expands on how the filename send is performed after successful LISTN/SECND presence checks
- "open_rs232_init_and_param_transfer" — expands on open for parallel/RS-232 devices and using filename/parameter transfer to device registers

## Labels
- CIOUT
- CUNLSN
- FNLEN
- FNADR
