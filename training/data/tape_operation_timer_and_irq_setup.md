# TAPE entry — configure CIA (6526) and install cassette IRQ vector

**Summary:** Configures CIA1 registers $DC0D/$DC0E/$DC0F to set up cassette IRQ behavior, preserves TOD 50/60 bit into $02A2 (CASTON), waits for RS-232 completion (JSR $F0A4), disables the VIC-II display via $D011, saves the current IRQ vector ($0314/$0315) into IRQTMP ($029F/$02A0), and calls BSIV (JSR $FCBD) to install the cassette-specific IRQ vector.

## Description
- LDY #$7F / STY $DC0D: write 0x7F to CIA1 ICR ($DC0D) to clear/unmask IRQ bits (comment: "KILL UNWANTED IRQ'S").
- STA $DC0D: a subsequent write to $DC0D from A (comment: "TURN ON WANTED"). Note: this snippet does not show A being set immediately prior to this STA; the value written depends on prior code.
- LDA $DC0E / ORA #$19 / STA $DC0F: read CIA1 CRA ($DC0E), OR with #$19 and store into CIA1 CRB ($DC0F) — sets the timer control mask (comment: "TURN ON T2 IRQ'S FOR CASS WRITE (ONE SHOT)").
- AND #$91 / STA $02A2: mask A with #$91 and store into $02A2 (CASTON) to preserve the TOD 50/60Hz indication and place it for auto-mode timer T1 use.
- JSR $F0A4 (RSP232): wait for RS-232 to finish before proceeding with tape operations.
- LDA $D011 / AND #$EF / STA $D011: read VIC-II control register $D011, clear bit 4 (AND with $EF) to disable the screen display, then write back.
- LDA $0314 / STA $029F ; LDA $0315 / STA $02A0: save the current IRQ vector (CINV at $0314/$0315) into IRQTMP ($029F/$02A0) for later restoration.
- JSR $FCBD (BSIV): call the routine that installs the cassette-specific IRQ vector (overwrites the IRQ vector with the cassette handler).

**[Note: Source may contain an error — STA $DC0D appears here without A being set in this snippet; the value stored depends on earlier code not shown.]**

## Source Code
```asm
.,F875 A0 7F    LDY #$7F        ; TAPE   LDY #$7F        ;KILL UNWANTED IRQ'S
.,F877 8C 0D DC STY $DC0D              ; STY D1ICR
.,F87A 8D 0D DC STA $DC0D              ; STA D1ICR       ;TURN ON WANTED
.,F87D AD 0E DC LDA $DC0E              ; LDA D1CRA       ;CALC TIMER ENABLES
.,F880 09 19    ORA #$19               ; ORA #$19
.,F882 8D 0F DC STA $DC0F              ; STA D1CRB       ;TURN ON T2 IRQ'S FOR CASS WRITE(ONE SHOT)
.,F885 29 91    AND #$91               ; AND #$91        ;SAVE TOD 50/60 INDICATION
.,F887 8D A2 02 STA $02A2              ; STA CASTON      ;PLACE IN AUTO MODE FOR T1
                                ; WAIT FOR RS-232 TO FINISH
.,F88A 20 A4 F0 JSR $F0A4              ; JSR RSP232
                                ; DISABLE SCREEN DISPLAY
.,F88D AD 11 D0 LDA $D011              ; LDA VICREG+17
.,F890 29 EF    AND #$EF               ; AND #$FF-$10    ;DISABLE SCREEN
.,F892 8D 11 D0 STA $D011              ; STA VICREG+17
                                ; MOVE IRQ TO IRQTEMP FOR CASS OPS
.,F895 AD 14 03 LDA $0314              ; LDA    CINV
.,F898 8D 9F 02 STA $029F              ; STA    IRQTMP
.,F89B AD 15 03 LDA $0315              ; LDA    CINV+1
.,F89E 8D A0 02 STA $02A0              ; STA    IRQTMP+1
.,F8A1 20 BD FC JSR $FCBD              ; JSR    BSIV            ;GO CHANGE IRQ VECTOR
```

## Key Registers
- $DC0D - CIA1 - Interrupt Control Register (D1ICR) — IRQ mask/clear
- $DC0E - CIA1 - Control Register A (D1CRA) — timer/control read used to compute CRB
- $DC0F - CIA1 - Control Register B (D1CRB) — timer/IRQ enables (T2 IRQs enabled with ORA #$19)
- $D011 - VIC-II - Control register 1 (bit 4 cleared to disable screen)
- $029F-$02A0 - RAM - IRQTMP (saved IRQ vector low/high)
- $02A2 - RAM - CASTON (stores masked TOD 50/60 indication)
- $0314-$0315 - RAM - CINV (current IRQ vector low/high, copied to IRQTMP)

## References
- "block_entry_read_write_setup" — expands on called read/write entry points to start tape operations
- "motor_control_and_interrupt_enable" — expands on follows IRQ setup to start motor and local counters
- "tape_completion_wait_loop" — expands on uses the new IRQ vector and IRQTMP to determine completion

## Labels
- D1ICR
- D1CRA
- D1CRB
- D011
- CASTON
- IRQTMP
- CINV
