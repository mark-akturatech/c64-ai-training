# GET FROM SERIAL/RS232 (KERNAL $F1AD–$F1C8)

**Summary:** KERNAL receive entry that selects between the IEC serial bus path (ACPTR at $EE13) and the RS232 6551 path; checks zero-page STATUS ($0090) and the 6551 status register RSSTAT ($0297) masked with $60. Code addresses: $F1AD–$F1C8, calls JSR $F14E and JMP $EE13.

## Operation
This routine implements two receive paths depending on the I/O status byte in zero page $0090 (STATUS):

- Entry ($F1AD): LDA $0090; if zero (BEQ $F1B5) it jumps to the serial-bus receiver (ACPTR), otherwise it returns a carriage return (#$0D) in A and RTS.
  - JMP $EE13 (ACPTR) at $F1B5 — get byte from serial bus.

- RS232 path: execution falls through to JSR $F14E ($F1B8) which performs an RS232 receive.
  - If the RS232 receive sets the carry (BCS $F1B4) execution returns immediately with carry set (success).
  - If carry is clear, code compares A to #$00:
    - If A != #$00, it loads #$0D and returns (carry cleared) — effectively returning CR.
    - If A == #$00, it reads RSSTAT ($0297), masks with #$60:
      - If masked result is non-zero (BNE $F1B1), it returns CR.
      - If masked result is zero (BEQ $F1B8), it loops back to JSR $F14E to attempt another RS232 receive.

Behavior summary:
- STATUS ($0090) == 0 → serial-bus receive via ACPTR ($EE13).
- STATUS ($0090) != 0 → immediate return of #$0D in A.
- RS232 receive (JSR $F14E) may return with carry set (successful read) or clear; when carry clear further checks on A and RSSTAT ($0297 & $60) determine whether to return CR or retry.

## Source Code
```asm
.,F1AD A5 90    LDA $90         ; STATUS, I/O status word
.,F1AF F0 04    BEQ $F1B5       ; status OK -> serial bus
.,F1B1 A9 0D    LDA #$0D        ; else return <CR> and exit
.,F1B3 18       CLC
.,F1B4 60       RTS
.,F1B5 4C 13 EE JMP $EE13       ; ACPTR, get byte from serial bus

.,F1B8 20 4E F1 JSR $F14E       ; receive from RS232
.,F1BB B0 F7    BCS $F1B4       ; end with carry set
.,F1BD C9 00    CMP #$00
.,F1BF D0 F2    BNE $F1B3       ; end with carry clear (return CR)
.,F1C1 AD 97 02 LDA $0297       ; RSSTAT, 6551 status register
.,F1C4 29 60    AND #$60        ; mask bits $60
.,F1C6 D0 E9    BNE $F1B1       ; return with <CR>
.,F1C8 F0 EE    BEQ $F1B8       ; get from RS232 (retry)
```

## Key Registers
- $0090 - Zero Page - STATUS (I/O status word)
- $0297 - 6551 - RS232 status register (RSSTAT); masked with #$60 in this routine

## References
- "chrout_output_character" — expands on sending output to devices (screen/serial/RS232)
- "find_file_lat_search" — shows other uses of STATUS and device checks in file I/O

## Labels
- STATUS
- RSSTAT
