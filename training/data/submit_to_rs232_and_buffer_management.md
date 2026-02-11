# SUBMIT_TO_RS232 / SEND TO RS232 BUFFER (KERNAL RS232 handshaking & transmit buffer)

**Summary:** KERNAL routines for RS232 handshaking and transmitting via the 6551 ACIA image and CIA2 port lines ($DD00-$DD0F). Covers SUBMIT_TO_RS232 (handshake checks: DSR/CTS/RTS), NO DSR ERROR (sets RSSTAT = #$40), and SEND TO RS232 BUFFER (copy bytes into RS232 output buffer and configure CIA2 DDR/port registers $DD04/$DD05/$DD0E). Mentions 6551 image locations in page $02 ($0294-$029E) and zero page buffer pointers.

## Description
This chunk documents three related KERNAL entry points used for RS232 output handshaking and for moving bytes into the RS232 transmitter buffer (the ACIA/6551 image in RAM plus physical I/O via CIA2):

- SUBMIT_TO_RS232
  - Called when the system needs to submit data to the RS232 device and must perform handshaking.
  - Tests the 6551 command-register image at $0294 (M51CDR). If bit0 (after an LSR & BCC) indicates three-line mode, the routine exits immediately (no handshaking).
  - In other modes it probes the CIA2 RS232 port ($DD01) for DSR/CTS signals and uses the RS232 enable flags at $02A1 (ENABL) to determine active lines. Loops are used to wait for signals and to set RTS by writing back to $DD01.
  - If no DSR is present when expected, control goes to NO DSR ERROR.

- NO DSR ERROR
  - Sets the 6551 status-register image (RSSTAT) at $0297 to #$40 to indicate a "no DSR" condition, then returns.

- SEND TO RS232 BUFFER
  - Copies bytes from a source ring/circular buffer into the RS232 output buffer via an indirect zeropage pointer (STA ($F9),Y). The routine updates indices in page $02: uses $029E (index), $029D (end/limit).
  - Configures CIA2 registers used for RS232 signaling: writes to $DD0E, $DD04, $DD05 to set DDR/port outputs for the 6551 / line drivers. The routine also calls helper JSRs ($EF3B and $EF06) to perform any device-specific image transfers / transfers to the 6551 image.
  - Returns when configuration indicates no need for the extra setup (branch on carry after shifting $02A1).

Notes:
- Zero-page and page-$02 variables are both used: zero-page $009A (DFLTO) is written early, while $029A and others in page $02 hold the 6551 image / buffer pointers.
- CIA2 ($DD00-$DD0F) is used for RS232 I/O lines (CTS/DSR/RTS handling), and specific CIA2 offsets written here include $DD01, $DD04, $DD05, $DD0E.
- Helper routines and buffer management details (RODBS/RODBE, rs232_send_receive_helpers) are mentioned but are outside this chunk; they handle filling RODATA and updating circular buffer pointers used by the transmitter.

## Source Code
```asm
                                *** SUBMIT TO RS232
                                This routine is called when data is required from the
                                RS232 port. Its function is to perform the handshaking on
                                the port needed to receive the data. If 3 line mode is
                                used, then no handshaking is implemented and the routine
                                exits.
.,EFE1 85 9A    STA $9A         DFLTO, default output device
.,EFE3 AD 94 02 LDA $0294       M51CDR, 6551 command register image
.,EFE6 4A       LSR
.,EFE7 90 29    BCC $F012       3 line mode, no handshaking, exit
.,EFE9 A9 02    LDA #$02
.,EFEB 2C 01 DD BIT $DD01       RS232 I/O port
.,EFEE 10 1D    BPL $F00D       no DRS, error
.,EFF0 D0 20    BNE $F012
.,EFF2 AD A1 02 LDA $02A1       ENABL, RS232 enables
.,EFF5 29 02    AND #$02
.,EFF7 D0 F9    BNE $EFF2
.,EFF9 2C 01 DD BIT $DD01       RS232 I/O port
.,EFFC 70 FB    BVS $EFF9       wait for no CTS
.,EFFE AD 01 DD LDA $DD01
.,F001 09 02    ORA #$02
.,F003 8D 01 DD STA $DD01       set RTS
.,F006 2C 01 DD BIT $DD01
.,F009 70 07    BVS $F012       CTS set
.,F00B 30 F9    BMI $F006       wait for no DSR

                                *** NO DSR ERROR
                                This routine sets the 6551 status register image to #40
                                when a no DSR error has occurred.
.,F00D A9 40    LDA #$40
.,F00F 8D 97 02 STA $0297       RSSTAT, 6551 status register image
.,F012 18       CLC
.,F013 60       RTS

                                *** SEND TO RS232 BUFFER
                                Note: The entry point to the routine is at
.,F014 20 28 F0 JSR $F028
.,F017 AC 9E 02 LDY $029E
.,F01A C8       INY
.,F01B CC 9D 02 CPY $029D
.,F01E F0 F4    BEQ $F014
.,F020 8C 9E 02 STY $029E
.,F023 88       DEY
.,F024 A5 9E    LDA $9E
.,F026 91 F9    STA ($F9),Y
.,F028 AD A1 02 LDA $02A1
.,F02B 4A       LSR
.,F02C B0 1E    BCS $F04C
.,F02E A9 10    LDA #$10
.,F030 8D 0E DD STA $DD0E
.,F033 AD 99 02 LDA $0299
.,F036 8D 04 DD STA $DD04
.,F039 AD 9A 02 LDA $029A
.,F03C 8D 05 DD STA $DD05
.,F03F A9 81    LDA #$81
.,F041 20 3B EF JSR $EF3B
.,F044 20 06 EF JSR $EF06
.,F047 A9 11    LDA #$11
.,F049 8D 0E DD STA $DD0E
.,F04C 60       RTS
```

## Key Registers
- $DD00-$DD0F - CIA 2 - RS232 I/O and control registers used for handshaking and line-driver configuration (reads/writes in this chunk target $DD01, $DD04, $DD05, $DD0E)
- $0294 - KERNAL/page $02 - 6551 command register image (M51CDR)
- $0297 - KERNAL/page $02 - 6551 status register image (RSSTAT)
- $0299 - KERNAL/page $02 - 6551 / RS232 image / pointer data (used by SEND TO RS232 BUFFER)
- $029A - KERNAL/page $02 - 6551 image / device-table word (referenced when configuring CIA2)
- $029D-$029E - KERNAL/page $02 - RS232 output buffer indices/limits (used as compare/limit for buffer copy)
- $009A - Zero Page - DFLTO (default output device, written at entry)

## References
- "rs232_send_receive_helpers" — fills RODATA and manipulates buffer pointers used by transmitter (related helper routines and buffer management)

## Labels
- SUBMIT_TO_RS232
- NO_DSR_ERROR
- SEND_TO_RS232_BUFFER
