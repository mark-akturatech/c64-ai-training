# KERNAL: T2 and FLAG NMI top-level checks and returns ($FEA3-$FEC1)

**Summary:** Top-level KERNAL NMI entry that checks the T2 bit and the FLAG edge, calling T2NMI ($FED6) or FLNMI ($FF07) as appropriate; restores the ENABL byte ($02A1) into CIA2 ICR ($DD0D) and performs PLA/TAY/PLA/TAX/PLA followed by RTI. Searchable terms: $02A1 (ENABL), $DD0D (D2ICR), T2NMI, FLNMI, RTI.

## Overview
This code is the KERNAL's top-level NMI dispatch for two paths:

- T2 NMI path (receive a bit):
  - Uses TXA to copy X into A, AND #$02 to mask the T2 bit, BEQ skips if the T2 bit is clear.
  - If set, JSR to $FED6 (T2NMI) to handle the T2 interrupt, then JMP to NMIRTI ($FEB6) to continue common return work.

- FLAG NMI path (receive a start bit):
  - At the alternate branch, TXA/AND #$10 checks the FLAG bit (edge detect); BEQ skips if not asserted.
  - If set, JSR to $FF07 (FLNMI) to begin half-bit timing.

Common return sequence (label NMIRTI at $FEB6):
- LDA $02A1 (ENABL) — load the saved ENABL byte from zero-page/ram.
- STA $DD0D (D2ICR) — restore the CIA2 Interrupt Control Register, re-enabling NMIs as needed.
- PLA / TAY / PLA / TAX / PLA — pull three byte/context values from the stack (note the TAY/TAX to restore registers).
- RTI — return from interrupt and resume execution.

Implementation details preserved from the listing:
- Tests use bit masks #$02 (T2) and #$10 (FLAG).
- Two subroutines are invoked: T2NMI at $FED6 and FLNMI at $FF07.
- The code restores the ENABL value into CIA2 ICR ($DD0D) before restoring registers and issuing RTI.

## Source Code
```asm
                                ;
                                ; T2 NMI CHECK - RECIEVE A BIT
                                ;
.,FEA3 8A       TXA             NNMI30 TXA
.,FEA4 29 02    AND #$02               AND #$02        ;MASK TO T2
.,FEA6 F0 06    BEQ $FEAE              BEQ NNMI40      ;NO...
                                ;
.,FEA8 20 D6 FE JSR $FED6              JSR T2NMI       ;HANDLE INTERRUPT
.,FEAB 4C B6 FE JMP $FEB6              JMP NMIRTI
                                ; FLAG NMI HANDLER - RECIEVE A START BIT
                                ;
.,FEAE 8A       TXA             NNMI40 TXA             ;CHECK FOR EDGE
.,FEAF 29 10    AND #$10               AND #$10        ;ON FLAG...
.,FEB1 F0 03    BEQ $FEB6              BEQ NMIRTI      ;NO...
                                ;
.,FEB3 20 07 FF JSR $FF07              JSR FLNMI       ;START BIT ROUTINE
.,FEB6 AD A1 02 LDA $02A1       NMIRTI LDA ENABL       ;RESTORE NMI'S
.,FEB9 8D 0D DD STA $DD0D              STA D2ICR
.,FEBC 68       PLA             PREND  PLA             ;BECAUSE OF MISSING SCREEN EDITOR
.,FEBD A8       TAY                    TAY
.,FEBE 68       PLA                    PLA
.,FEBF AA       TAX                    TAX
.,FEC0 68       PLA                    PLA
.,FEC1 40       RTI                    RTI
```

## Key Registers
- $02A1 - RAM - ENABL (saved NMI enable/flags byte)
- $DD0D - CIA 2 - Interrupt Control Register (D2ICR) — restored from ENABL

## References
- "nested_nmi_dispatch_and_rstrab" — expands on alternative entry points for nested NMI checks
- "t2nmi_subroutine_sample_and_timer_update" — expands on detailed T2NMI implementation invoked here
- "flnmi_half_bit_setup_and_return" — expands on detailed FLNMI implementation invoked here

## Labels
- ENABL
- D2ICR
