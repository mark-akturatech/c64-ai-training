# IOINIT — KERNAL ROM I/O Initialization (C64)

**Summary:** Initializes CIA1/CIA2 ($DC00-$DC0F, $DD00-$DD0F) I/O (PRA/PRB, DDRA/DDRB, CRA/CRB, Timer1), disables interrupts (ICRs), configures 6510 port/DDR ($0000-$0001), disables SID ($D418), sets keyboard timer (writes D1T1L/H $DC04/$DC05) using PAL/NTSC flag at $02A6 (labels IOKEYS/IOINIT), then jumps to PIOKEY.

## Description
This KERNAL routine (IOINIT) configures core I/O hardware at system startup:

- Kill interrupts by loading A=#$7F and storing to CIA1/2 ICR ($DC0D, $DD0D).
- Enable the STOP key by writing to CIA1 PRA ($DC00).
- Stop both CIA timers by writing CRA/CRB (#$08, i.e. %00001000) to $DC0E/$DC0F and $DD0E/$DD0F.
- Configure CIA data direction registers for keyboard and user-port:
  - CIA1 DDRB ($DC03) set to 0 (inputs for keyboard).
  - CIA2 DDRB ($DD03) set to 0 (user port - no RS-232).
  - CIA1 DDRA ($DC02) set to 0 (keyboard outputs).
- Disable SID output by writing 0 to SID register $D418.
- Initialize 6510 port registers used for memory/config control:
  - $01 <- #$E7 (motor on, HIRAM low, LORAM/CHAREN high as in this ROM).
  - $00 <- #$2F (DDRx / control direction; comment: MTR OUT, SW IN, WR OUT, CONTROL OUT).
- Read PAL/NTSC flag at $02A6 (label IOKEYS). If zero (BEQ), treat as NTSC and load D1T1L/H with the SIXTYP constant; otherwise load D1T1L/H with SIXTY constant — this sets CIA1 Timer1 for keyboard scanning rate.
- Store timer low/high into D1T1L ($DC04) and D1T1H ($DC05), then jump to PIOKEY (JMP $FF6E).

Labels and flow:
- IOINIT — entry point; performs the writes described above.
- IOKEYS (LDA $02A6) — PAL/NTSC decision; selects constants SIXTY or SIXTYP.
- Final branch sets D1T1L/D1T1H and then JMP PIOKEY.

Behavioral notes preserved from source:
- The routine explicitly clears CIA ICRs to prevent pending CIA interrupts.
- STOP key is enabled via CIA1 PRA.
- SID is explicitly silenced by writing zero to $D418.
- 6510 port writes establish memory and peripheral control early in boot.
- Timer values are selected from constants named SIXTY and SIXTYP (definitions located elsewhere in ROM).

## Source Code
```asm
                                ; IOINIT - INITILIZE IO DEVICES
                                ;
.,FDA3 A9 7F    LDA #$7F        IOINIT LDA #$7F        ;KILL INTERRUPTS
.,FDA5 8D 0D DC STA $DC0D              STA D1ICR
.,FDA8 8D 0D DD STA $DD0D              STA D2ICR
.,FDAB 8D 00 DC STA $DC00              STA D1PRA       ;TURN ON STOP KEY
.,FDAE A9 08    LDA #$08               LDA #%00001000  ;SHUT OFF TIMERS
.,FDB0 8D 0E DC STA $DC0E              STA D1CRA
.,FDB3 8D 0E DD STA $DD0E              STA D2CRA
.,FDB6 8D 0F DC STA $DC0F              STA D1CRB
.,FDB9 8D 0F DD STA $DD0F              STA D2CRB
                                ; CONFIGURE PORTS
.,FDBC A2 00    LDX #$00               LDX #$00        ;SET UP KEYBOARD INPUTS
.,FDBE 8E 03 DC STX $DC03              STX D1DDRB      ;KEYBOARD INPUTS
.,FDC1 8E 03 DD STX $DD03              STX D2DDRB      ;USER PORT (NO RS-232)
.,FDC4 8E 18 D4 STX $D418              STX SIDREG+24   ;TURN OFF SID
.,FDC7 CA       DEX                    DEX
.,FDC8 8E 02 DC STX $DC02              STX D1DDRA      ;KEYBOARD OUTPUTS
.,FDCB A9 07    LDA #$07               LDA #%00000111  ;SET SERIAL/VA14/15 (CLKHI)
.,FDCD 8D 00 DD STA $DD00              STA D2PRA
.,FDD0 A9 3F    LDA #$3F               LDA #%00111111  ;SET SERIAL IN/OUT, VA14/15OUT
.,FDD2 8D 02 DD STA $DD02              STA D2DDRA
                                                       ;
                                                       ; SET UP THE 6510 LINES
                                                       ;
.,FDD5 A9 E7    LDA #$E7               LDA #%11100111  ;MOTOR ON, HIRAM LOWRAM CHAREN HIGH
.,FDD7 85 01    STA $01                STA R6510
.,FDD9 A9 2F    LDA #$2F               LDA #%00101111  ;MTR OUT,SW IN,WR OUT,CONTROL OUT
.,FDDB 85 00    STA $00                STA D6510
.,FDDD AD A6 02 LDA $02A6       IOKEYS LDA PALNTS      ;PAL OR NTSC
.,FDE0 F0 0A    BEQ $FDEC              BEQ I0010       ;NTSC
.,FDE2 A9 25    LDA #$25               LDA #<SIXTYP
.,FDE4 8D 04 DC STA $DC04              STA D1T1L
.,FDE7 A9 40    LDA #$40               LDA #>SIXTYP
.,FDE9 4C F3 FD JMP $FDF3              JMP I0020
.,FDEC A9 95    LDA #$95        I0010  LDA #<SIXTY     ;KEYBOARD SCAN IRQ'S
.,FDEE 8D 04 DC STA $DC04              STA D1T1L
.,FDF1 A9 42    LDA #$42               LDA #>SIXTY
.,FDF3 8D 05 DC STA $DC05       I0020  STA D1T1H
.,FDF6 4C 6E FF JMP $FF6E              JMP PIOKEY
```

## Key Registers
- $DC00-$DC0F - CIA 1 - PRA/PRB, DDRA/DDRB, CRA/CRB, Timer1 low/high, ICR (used: $DC0D, $DC00, $DC0E, $DC0F, $DC03, $DC02, $DC04, $DC05)
- $DD00-$DD0F - CIA 2 - PRA/PRB, DDRA/DDRB, CRA/CRB, ICR (used: $DD0D, $DD00, $DD0E, $DD0F, $DD03, $DD02)
- $D400-$D418 - SID - Voice/filter registers (used: $D418 to turn off SID)
- $0000-$0001 - 6510 - Processor port DDR/Port (used: $00 and $01 to set control lines and memory config)

## References
- "system_start_reset_sequence" — expands on IOINIT invocation early in startup to configure I/O hardware
- "sixty_and_file_io_helpers" — defines SIXTY / SIXTYP constants used for keyboard timer setup

## Labels
- IOINIT
- IOKEYS
