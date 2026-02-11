# TNIF / TNIQ / STKY — KERNAL cassette-write cleanup and interrupt restore

**Summary:** KERNAL routine TNIF/TNIQ (at $FC93-$FCB6) restores system state after cassette write activity: saves flags (PHP/SEI), unlocks VIC display ($D011), turns off cassette motor (TNOF), clears tape timer interrupts (CIA1 ICR $DC0D), restores keyboard IRQ/vector from temporary storage (IOKEYS, IRQTMP $029F/$02A0 -> CINV $0314/$0315), and restores processor flags (PLP) before returning. STKY is an entry point that calls TNIF and conditionally returns to WRTBK on cassette IRQ.

## Description
This KERNAL chunk provides the cleanup sequence used after cassette write operations. Key behavior and sequence:

- Entry (TNIF at $FC93): pushes processor status (PHP) and disables interrupts (SEI) to protect the restore sequence.
- VIC unlock / display restore: reads $D011, ORs #$10, and writes it back — labelled here as "unlock VIC" / "enable display" (restores the VIC-II display bit modified during cassette activity).
- Turn off cassette motor: calls TNOF (JSR $FCCA) to stop the tape motor.
- Clear tape timer interrupts: loads #$7F and stores it to the CIA1 interrupt control register (D1ICR, $DC0D) to clear cassette-related interrupts.
- Restore keyboard IRQ handling:
  - JSR IOKEYS ($FDDD) — reinitializes keyboard/IRQ hookup from timer1.
  - Restores the IRQ vector from temporary KERNAL storage IRQTMP ($029F/$02A0) into CINV ($0314/$0315) so normal IRQ vector is back in place.
  - The code branches (BEQ) to the TNIQ exit if IRQTMP+1 (A after LDA $02A0) is zero — documenting that an IRQ vector cannot be in zero page (BEQ used as a heuristic to skip vector restore if value is zero).
- TNIQ ($FCB6): restores the saved processor status (PLP) and returns (RTS).
- STKY ($FCB8): provides an alternate entry which simply JSR TNIF and then BEQ to WRTBK (at $FC54 per the BEQ target in the source) — this means when STKY was invoked by the cassette IRQ, the handler returns to the WRTBK routine (RTI path), otherwise execution continues after the JSR.

Variables and vector locations used:
- IRQTMP: temporary IRQ vector storage at $029F-$02A0 (saved IRQ vector used during BSIV/IRQ switching).
- CINV: KERNAL IRQ vector at $0314-$0315 (restored from IRQTMP).
- D1ICR: CIA1 interrupt control register referenced as $DC0D.

Calls referenced (for further detail):
- TNOF (turn off cassette motor) — JSR $FCCA.
- IOKEYS (restore keyboard IRQ/setup) — JSR $FDDD.
- WRTBK: cassette write-back routine — referenced by BEQ after STKY.

## Source Code
```asm
; TNIF/TNIQ/STKY sequence: library routine to clean up after cassette write activity.
; Saves flags (PHP/SEI), unlocks VIC display (VICREG $D011), clears tape timer interrupts (D1ICR),
; restores keyboard IRQ/setup (IOKEYS and IRQTMP -> CINV), turns off motor (TNOF), restores flags (PLP) and returns.
; STKY entry calls TNIF when invoked by cassette IRQ and returns to WRTBK if appropriate.

        ;
.,FC93 08       PHP             TNIF   PHP             ;CLEAN UP INTERRUPTS AND RESTORE PIA'S
.,FC94 78       SEI             SEI
.,FC95 AD 11 D0 LDA $D011       LDA    VICREG+17       ;UNLOCK VIC
.,FC98 09 10    ORA #$10        ORA    #$10            ;ENABLE DISPLAY
.,FC9A 8D 11 D0 STA $D011       STA    VICREG+17
.,FC9D 20 CA FC JSR $FCCA       JSR    TNOF            ;TURN OFF MOTOR
.,FCA0 A9 7F    LDA #$7F        LDA    #$7F            ;CLEAR INTERRUPTS
.,FCA2 8D 0D DC STA $DC0D       STA    D1ICR
.,FCA5 20 DD FD JSR $FDDD       JSR    IOKEYS          ;RESTORE KEYBOARD IRQ FROM TIMMER1
.,FCA8 AD A0 02 LDA $02A0       LDA    IRQTMP+1        ;RESTORE KEYBOARD INTERRUPT VECTOR
.,FCAB F0 09    BEQ $FCB6       BEQ    TNIQ            ;NO IRQ (IRQ VECTOR CANNOT BE Z-PAGE)
.,FCAD 8D 15 03 STA $0315       STA    CINV+1
.,FCB0 AD 9F 02 LDA $029F       LDA    IRQTMP
.,FCB3 8D 14 03 STA $0314       STA    CINV
.,FCB6 28       PLP             TNIQ   PLP
.,FCB7 60       RTS             RTS
        ;
.,FCB8 20 93 FC JSR $FC93       STKY   JSR TNIF        ;GO RESTORE SYSTEM INTERRUPTS
.,FCBB F0 97    BEQ $FC54       BEQ    WRTBK           ;CAME FOR CASSETTE IRQ SO RTI
        ;
```

## Key Registers
- $D011 - VIC-II - display/control register (VICREG +17 used to re-enable display)
- $DC00-$DC0F - CIA1 - includes timer and interrupt control registers (D1ICR at $DC0D used to clear cassette timer interrupts)
- $029F-$02A0 - RAM - IRQTMP temporary IRQ vector storage (IRQTMP, used to hold saved IRQ vector)
- $0314-$0315 - RAM - CINV KERNAL IRQ vector (restored from IRQTMP)

## References
- "turn_off_cassette_motor_tnof" — details of the TNOF routine called here to stop the cassette motor
- "bsiv_change_irq_vectors" — context for why STKY/IRQTMP/CINV swapping is used when BSIV changes IRQ vectors for tape operations

## Labels
- TNIF
- TNIQ
- STKY
- IRQTMP
- CINV
- D1ICR
