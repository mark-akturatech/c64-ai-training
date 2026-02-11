# OPN232 — KERNAL: Open RS-232 / Parallel Port (6551 init)

**Summary:** OPN232 (JSR $F483 → CLN232) initializes the RS‑232 subsystem (6551 ACIA setup), clears RSSTAT ($0297), and if FNLEN ($00B7) > 0 copies up to 4 filename parameters from FNADR ($00BB)+Y into M51 control/data registers at $0293-$0296 for later 6551 configuration.

## Operation
- Entry: OPN232 calls CLN232 (JSR $F483). CLN232 configures user port lines and clears NMI; comment indicates it returns with Y=0.
- RSSTAT is cleared by storing Y into $0297 (STY $0297).
- The routine checks FNLEN ($00B7) to see whether filename/parameter bytes are present (CPY $B7). If FNLEN == 0 it branches out.
- If parameters exist, it loads bytes from FNADR (indirect zero-page pointer at $00BB) using LDA ($BB),Y and writes them to M51 registers at $0293+Y (STA $0293,Y).
- The loop increments Y and stops after 4 bytes (CPY #$04 / BNE loop). Thus a maximum of four filename parameters are copied into $0293-$0296 (M51 registers) for later use configuring the 6551 ACIA.
- The header/inline comments list variables initialized by OPN232: BITNUM (bits to send calculated from M51CTR), BAUDOF (baud rate full), RSSTAT, M51CTR, M51CDR, M51AJB (user baud), ENABL (6526 NMI enables). The code snippet here explicitly clears RSSTAT and moves up to four parameter bytes into M51 registers; other initializations occur elsewhere in the routine or in CLN232.

## Source Code
```asm
                                ; OPN232 - OPEN AN RS-232 OR PARALLEL PORT FILE
                                ;
                                ; VARIABLES INITILIZED
                                ;   BITNUM - # OF BITS TO BE SENT CALC FROM M51CTR
                                ;   BAUDOF - BAUD RATE FULL
                                ;   RSSTAT - RS-232 STATUS REG
                                ;   M51CTR - 6551 CONTROL REG
                                ;   M51CDR - 6551 COMMAND REG
                                ;   M51AJB - USER BAUD RATE (CLOCK/BAUD/2-100)
                                ;   ENABL  - 6526 NMI ENABLES (1-NMI BIT ON)
                                ;
.,F409 20 83 F4 JSR $F483       OPN232 JSR CLN232      ;SET UP RS232, .Y=0 ON RETURN
                                ;
                                ; PASS PRAMS TO M51REGS
                                ;
.,F40C 8C 97 02 STY $0297              STY RSSTAT      ;CLEAR STATUS
                                ;
.,F40F C4 B7    CPY $B7         OPN020 CPY FNLEN       ;CHECK IF AT END OF FILENAME
.,F411 F0 0A    BEQ $F41D              BEQ OPN025      ;YES...
                                ;
.,F413 B1 BB    LDA ($BB),Y            LDA (FNADR)Y    ;MOVE DATA
.,F415 99 93 02 STA $0293,Y            STA M51CTR,Y    ;TO M51REGS
.,F418 C8       INY                    INY
.,F419 C0 04    CPY #$04               CPY #4          ;ONLY 4 POSSIBLE PRAMS
.,F41B D0 F2    BNE $F40F              BNE OPN020
```

## Key Registers
- $0293-$0296 - M51 control/data registers (6551 parameter bytes written here from FNADR)
- $0297 - RSSTAT - RS‑232 status register (cleared by STY $0297)
- $00B7 - FNLEN - filename/parameter length (checked with CPY $B7)
- $00BB - FNADR - zero-page pointer to filename/parameters (used with LDA ($BB),Y)

## References
- "rs232_bit_calculation" — expands on calculating BITNUM from M51 control register
- "cln232_cleanup_and_port_setup" — expands on CLN232 routine invoked here to set up DDRB/CB2 and initial port state

## Labels
- OPN232
- RSSTAT
- FNLEN
- FNADR
- M51CTR
