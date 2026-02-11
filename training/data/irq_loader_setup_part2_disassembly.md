# Loader Setup - Part 2: NMI Vector and CIA#2 Timer-A One‑Shot Setup

**Summary:** Sets the 6510 NMI vector ($FFFA/$FFFB) to point at the load loop at $03E7 and programs CIA#2 ($DD00-$DD0F) Timer A (latch and control: $DD05, $DD0D, $DD0E) to produce an immediate NMI by starting Timer A in one‑shot forced‑latch mode.

## Description
This snippet performs the hardware setup to force an NMI that rendezvous the CPU into the loader's read loop at $03E7.

Steps performed:
- Write the NMI vector low/high to $FFFA/$FFFB so NMIs transfer execution to $03E7.
- Configure CIA#2 Timer A:
  - Store the Timer A high byte latch ($DD05) with #$01.
  - Enable Timer A interrupt in the CIA Interrupt Control Register ($DD0D) by writing $81 (set Timer A interrupt enable).
  - Program CIA Control Register A ($DD0E) with $99 to:
    - start Timer A (bit 0),
    - set Timer A run mode to one‑shot (bit 3),
    - force the latched value into the Timer A counter immediately (bit 4).
- Enter a tight BNE loop waiting; Timer A expiration (and the CIA interrupt line wired to the 6510 NMI pin) generates an NMI which transfers execution to the vector at $03E7.

Notes:
- Two NMI sources exist on the C64: the RESTORE key (direct to the 6510 NMI pin) and the CIA#2 interrupt line (wired to the 6510 NMI pin). This code uses the CIA#2 Timer A interrupt to create the NMI.
- ICR $DD0D is written with $81 (bit7 set to "set" and bit0 = Timer A) to enable Timer A interrupt in the CIA interrupt mask.
- The code intentionally hangs at BNE $02FE until the CIA generates the NMI and the CPU jumps to $03E7 (the load loop).

## Source Code
```asm
; ********************************************
; * Loader Setup-Part 2                      *
; * Description: Hardware setup instructions *
; ********************************************

02E5  A9 E7          LDA #$E7       ; Non-Maskable Interrupt Hardware Vector setup:
02E7  8D FA FF       STA $FFFA      ;  make it point to our Load Loop at $03E7. (2)
02EA  A9 03          LDA #$03
02EC  8D FB FF       STA $FFFB

; (2) There are two possible sources for an NMI interrupt.  The first is the
;     RESTORE key, which is connected directly to the 6510 NMI line.  The
;     second is CIA #2, the interrupt line of which is connected to the 6510
;     NMI line.


02EF  A9 01          LDA #$01       ; Set CIA #2 Timer A high byte
02F1  8D 05 DD       STA $DD05

02F4  A9 81          LDA #$81       ; CIA #2 Interrupt Control Register setup:
02F6  8D 0D DD       STA $DD0D      ;  enable Timer A interrupt (bit 0)

02F9  A9 99          LDA #$99       ; CIA #2 Control Register A setup:
02FB  8D 0E DD       STA $DD0E      ;  start timer A                (bit 0)
                                    ;  Timer A run mode is one-shot (bit 3)
                                    ;  Force latched value to be
                                    ;  loaded to Timer A counter    (bit 4)

02FE  D0 FE          BNE $02FE      ; C64 should hang here, but CIA #2 Timer A
                                    ; expiration causes the NMI request, which makes
                                    ; Program Counter move to $03E7.

; ********************************************
; * Loader Setup-Part 2.END                  *
; ********************************************
```

## Key Registers
- $FFFA-$FFFB - CPU - NMI vector (low/high)
- $DD00-$DD0F - CIA#2 - Timer A latch & control, Interrupt Control Register (contains $DD05, $DD0D, $DD0E used here)

## References
- "nmi_isr" — NMI handler / load loop entry used by this setup