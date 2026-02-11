# KERNAL: RS232 input helpers — INPUT FROM RS232 / GET FROM RS232 / SERIAL BUS IDLE

**Summary:** Disassembly of C64 KERNAL routines handling RS232 receive and serial-bus idle detection. Covers INPUT FROM RS232 (F04D), GET FROM RS232 (F086) — buffer reads using zero-page indirect pointer and index ($029B/$029C), and SERIAL BUS IDLE (F0A4) — CIA2 ICR ($DD0D) and ENABL ($02A1) handling.

## Overview
This chunk documents three tightly related KERNAL routines used for RS232 receive processing:

- INPUT FROM RS232 (starts at $F04D): performs status checks on the RS232 receive state image and CIA2 port register, manipulates CIA2 port bits, and conditionally branches into higher-level handling (jump to $EF3B) or returns. It stores the current A to $99 early on and inspects memory flag bytes ($0294 and $02A1) and CIA2 port ($DD01).

- GET FROM RS232 (starts at $F086): attempts to return one byte from the RS232 receive buffer. It reads the status image $0297 and an index in $029C, compares the index with the buffer base pointer $029B, and either fetches a byte using an indirect zero-page pointer at $F7 plus Y, increments the index, and clears a status bit in $0297 (AND #$F7), or marks the status image with bit $08 and returns A=$00 when the buffer is empty.

- SERIAL BUS IDLE (starts at $F0A4): waits for active RS232 enable bits to clear before signalling CIA2's interrupt control (writing $10 to $DD0D). It saves/restores A on the stack, polls ENABL ($02A1) and the two least significant ENABL bits, sets CIA#2 I.C.R. ($DD0D) with $10, clears ENABL, and returns.

Behavioral notes (observed from code, no added interpretation):
- Buffer access is performed via LDA ($F7),Y with Y from $029C; the zero-page indirect pointer at $F7 is used for the receive buffer page/table.
- Status image $0297 is read and updated by GET FROM RS232: it clears bit 3 (AND #$F7) when returning a byte, or sets bit 3 (ORA #$08) when the buffer is empty before returning A=$00.
- INPUT FROM RS232 manipulates CIA2 port ($DD01) (clearing bit 1 via AND #$FD and waiting for bit 2 via AND #$04) and may jump to $EF3B with A=$90 in certain conditions.
- SERIAL BUS IDLE explicitly writes to CIA2 ICR ($DD0D) to set an interrupt condition ($10), then clears the RS232 ENABL flag ($02A1).

## Source Code
```asm
                                *** INPUT FROM RS232
.,F04D 85 99    STA $99
.,F04F AD 94 02 LDA $0294
.,F052 4A       LSR
.,F053 90 28    BCC $F07D
.,F055 29 08    AND #$08
.,F057 F0 24    BEQ $F07D
.,F059 A9 02    LDA #$02
.,F05B 2C 01 DD BIT $DD01
.,F05E 10 AD    BPL $F00D
.,F060 F0 22    BEQ $F084
.,F062 AD A1 02 LDA $02A1
.,F065 4A       LSR
.,F066 B0 FA    BCS $F062
.,F068 AD 01 DD LDA $DD01
.,F06B 29 FD    AND #$FD
.,F06D 8D 01 DD STA $DD01
.,F070 AD 01 DD LDA $DD01
.,F073 29 04    AND #$04
.,F075 F0 F9    BEQ $F070
.,F077 A9 90    LDA #$90
.,F079 18       CLC
.,F07A 4C 3B EF JMP $EF3B
.,F07D AD A1 02 LDA $02A1
.,F080 29 12    AND #$12
.,F082 F0 F3    BEQ $F077
.,F084 18       CLC
.,F085 60       RTS

                                F086 GET FROM RS232
.,F086 AD 97 02 LDA $0297
.,F089 AC 9C 02 LDY $029C
.,F08C CC 9B 02 CPY $029B
.,F08F F0 0B    BEQ $F09C
.,F091 29 F7    AND #$F7
.,F093 8D 97 02 STA $0297
.,F096 B1 F7    LDA ($F7),Y
.,F098 EE 9C 02 INC $029C
.,F09B 60       RTS
.,F09C 09 08    ORA #$08
.,F09E 8D 97 02 STA $0297
.,F0A1 A9 00    LDA #$00
.,F0A3 60       RTS

                                *** SERIAL BUS IDLE
                                This routine checks the RS232 bus for data transmission/
                                reception. The routine waits for any activity on the bus
                                to end before setting I.C.R. The routine is called by
                                serial bus routines, since these devices use IRQ generated
                                timing, and conflicts may occur if they are all used at
                                once.
.,F0A4 48       PHA             store (A)
.,F0A5 AD A1 02 LDA $02A1       ENABL, RS232 enables
.,F0A8 F0 11    BEQ $F0BB       bus not in use
.,F0AA AD A1 02 LDA $02A1       ENABL
.,F0AD 29 03    AND #$03        test RS232
.,F0AF D0 F9    BNE $F0AA       yes, wait for port to clear
.,F0B1 A9 10    LDA #$10
.,F0B3 8D 0D DD STA $DD0D       set up CIA#2 I.C.R
.,F0B6 A9 00    LDA #$00        clear
.,F0B8 8D A1 02 STA $02A1       ENABL
.,F0BB 68       PLA             retrieve (A)
.,F0BC 60       RTS
```

## Key Registers
- $0294 - System image/flags - examined by INPUT FROM RS232 (LSR/AND tests)
- $0297 - Status image - read/updated by GET FROM RS232 (bit $08 set when buffer empty; AND #$F7 clears bit)
- $029B - Buffer base pointer - compared against index ($029C) to detect empty buffer
- $029C - Buffer index/Y - loaded into Y for indirect buffer reads and incremented by GET FROM RS232
- $029B-$029E - Buffer pages / RIBUF page pointers (receive buffer page pointer region referenced by KERNAL RS232 code)
- $02A1 - ENABL (RS232 enable flags) - polled/cleared by SERIAL BUS IDLE and tested by INPUT FROM RS232
- $DD01 - CIA#2 port (PRB) - read/AND/STA manipulated by INPUT FROM RS232 (clears bit1 via AND #$FD; tests bit2 via AND #$04)
- $DD0D - CIA#2 I.C.R. - written with $10 by SERIAL BUS IDLE to set an interrupt condition

## References
- "rs232_receive_and_processing" — expands on RIBUF / RIDATA handling used when receiving bytes

## Labels
- ENABL
