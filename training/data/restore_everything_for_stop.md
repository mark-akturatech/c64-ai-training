# Restore system state for STOP (ROM $FC93-$FCB7)

**Summary:** Restores CPU/VIC/CIA state when returning from STOP: saves processor status (PHP), disables interrupts (SEI), clears vertical fine-scroll blank via $D011 (VIC-II), stops cassette motor (JSR $FCCA), writes $7F to CIA1 ICR ($DC0D) to disable interrupts, calls $FDDD to restore vectors, restores IRQ vector bytes from $02A0/$029F into $0315/$0314 if non-zero, then restores status and returns (PLP, RTS).

## Operation
This routine restores system state after a STOP. Sequence and effects:

- PHP — push processor status to stack to preserve current flags.
- SEI — disable maskable IRQ interrupts while restoring state.
- LDA $D011 / ORA #$10 / STA $D011 — sets bit 4 of VIC-II control register $D011 (vertical fine-scroll/control) to unblank the screen (writes back modified control byte).
- JSR $FCCA — call ROM routine to stop the cassette motor.
- LDA #$7F / STA $DC0D — load $7F (disable all interrupts) and store it to CIA1 Interrupt Control Register ($DC0D). This writes a value intended to disable sources via the CIA ICR.
- JSR $FDDD — call ROM routine (restore vectors/related restores).
- LDA $02A0 / BEQ ... — read saved IRQ vector high byte from $02A0; if zero skip restoring vectors.
- STA $0315 — if non-zero, restore IRQ vector high byte into $0315.
- LDA $029F / STA $0314 — restore IRQ vector low byte from $029F into $0314.
- PLP / RTS — restore saved processor status and return.

Behavioral notes:
- The code tests the saved high byte at $02A0 for zero; zero indicates "no saved vector" and the restore is skipped.
- IRQ vector on C64 is stored at $0314-$0315 (low byte at $0314, high at $0315); this routine writes high then low.
- CIA1 ICR is at $DC0D (writes $7F here to disable interrupt sources).

## Source Code
```asm
.,FC93 08       PHP             save status
.,FC94 78       SEI             disable the interrupts
.,FC95 AD 11 D0 LDA $D011       read the vertical fine scroll and control register
.,FC98 09 10    ORA #$10        mask xxx1 xxxx, unblank the screen
.,FC9A 8D 11 D0 STA $D011       save the vertical fine scroll and control register
.,FC9D 20 CA FC JSR $FCCA       stop the cassette motor
.,FCA0 A9 7F    LDA #$7F        disable all interrupts
.,FCA2 8D 0D DC STA $DC0D       save VIA 1 ICR
.,FCA5 20 DD FD JSR $FDDD       
.,FCA8 AD A0 02 LDA $02A0       get saved IRQ vector high byte
.,FCAB F0 09    BEQ $FCB6       branch if null
.,FCAD 8D 15 03 STA $0315       restore IRQ vector high byte
.,FCB0 AD 9F 02 LDA $029F       get saved IRQ vector low byte
.,FCB3 8D 14 03 STA $0314       restore IRQ vector low byte
.,FCB6 28       PLP             restore status
.,FCB7 60       RTS             
```

## Key Registers
- $D011 - VIC-II - vertical fine scroll and control register (bit 4 manipulated to unblank screen)
- $DC0D - CIA1 - Interrupt Control Register (ICR) — written $7F here
- $0314-$0315 - CPU vectors - IRQ vector (low = $0314, high = $0315)
- $029F-$02A0 - RAM - saved IRQ vector low/high bytes used for conditional restore

## References
- "stop_cassette_motor" — expands on stop cassette motor via $FCCA
- "set_tape_vector" — expands on tape vector settings restored/cleared during STOP

## Labels
- D011
- DC0D
- 0314
- 0315
- 029F
- 02A0
