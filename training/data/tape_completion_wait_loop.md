# KERNAL: Wait loop that monitors IRQ vector for cassette completion (TP40)

**Summary:** Small KERNAL loop at $F8BE that polls whether the IRQ vector has been restored (compares IRQTMP+1 $02A0 with CINV+1 $0315) to detect cassette completion; if not complete it repeatedly calls TSTOP ($F8D0) to check the STOP key and UD60 ($F6BC) to ignore 60Hz keyscan until tapes finish.

## Description
This code implements a tight wait loop used during cassette operations. It checks whether the saved IRQ vector (IRQTMP+1 at $02A0) matches the cassette/key interrupt vector (CINV+1 at $0315). If they match, the cassette operation is complete and execution branches to STOP3 (returns). If they do not match, the routine:

- Calls TSTOP ($F8D0) to test for a STOP key press during cassette activity.
- Calls UD60 ($F6BC) to ignore/handle the 60Hz keyscan (prevents the normal 60Hz key-scan from interfering while waiting).
- Loops back to re-check the IRQ vector until the vector has been restored to CINV+1.

Labels/notes from the disassembly:
- TP40 is used as the local label for the loop entry at $F8BE.
- The compare is done against the high byte (+1) of the vectors (IRQTMP+1 and CINV+1) — this detects whether the IRQ vector points back to the key routine.

Behavior summary:
- Detects cassette completion by vector restoration rather than polling cassette hardware directly.
- Allows STOP key to be detected while cassette is active.
- Suppresses/ignores normal 60Hz key-scan processing via UD60 to avoid interfering key handling.

## Source Code
```asm
.,F8BE AD A0 02 LDA $02A0       TP40   LDA IRQTMP+1    ;CHECK FOR INTERRUPT VECTOR...
.,F8C1 CD 15 03 CMP $0315       CMP    CINV+1          ;...POINTING AT KEY ROUTINE
.,F8C4 18       CLC             CLC
.,F8C5 F0 15    BEQ $F8DC       BEQ    STOP3           ;...YES RETURN
.,F8C7 20 D0 F8 JSR $F8D0       JSR    TSTOP           ;...NO CHECK FOR STOP KEY
                                ;
                                ; 60 HZ KEYSCAN IGNORED
                                ;
.,F8CA 20 BC F6 JSR $F6BC       JSR    UD60            ; STOP KEY CHECK
.,F8CD 4C BE F8 JMP $F8BE       JMP    TP40            ;STAY IN LOOP UNTILL TAPES ARE DONE
```

## Key Registers
- $02A0 - RAM - IRQTMP+1 — high byte of temporary IRQ vector used to detect vector restoration
- $0315 - RAM - CINV+1 — high byte of cassette/key interrupt vector (compare target)
- $F8D0 - KERNAL ROM - TSTOP — STOP-key check routine (called each loop)
- $F6BC - KERNAL ROM - UD60 — routine to ignore/handle 60Hz keyscan during wait

## References
- "motor_control_and_interrupt_enable" — enters this wait loop after motor is turned on and interrupts enabled
- "stop_key_handler" — invoked when TSTOP detects a STOP key press during cassette operations

## Labels
- IRQTMP
- CINV
- TSTOP
- UD60
