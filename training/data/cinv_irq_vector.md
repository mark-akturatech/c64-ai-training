# $0314-$0315 CINV — Vector to IRQ Interrupt Routine

**Summary:** $0314-$0315 (CINV) is the zero-page vector holding the address jumped to on IRQs (default $EA31 / 59953). It is driven by CIA #1 Timer B (1/60 s) at power-on; change it to run user machine-code periodically. Use SEI/CLI or the Kernal VECTOR routine ($FD1A / 64794) when modifying, and follow the ROM push/pop register sequence when returning.

**Description**
This vector contains the low/high address of the IRQ interrupt entry point used by the system (normally $EA31 decimal 59953). At power-on, the CIA #1 Timer B is configured to generate an IRQ every 1/60 second; the ROM IRQ entry routed through this vector performs software-clock updates, STOP-key checking, cursor blink, tape interlock maintenance, and keyboard scanning.

Key points and precautions:
- Modify the vector only with interrupts disabled (SEI) and re-enable with CLI afterward, or use the Kernal VECTOR routine at $FD1A (decimal 64794) to set the vector safely.
- The ROM IRQ entry performs its own prelude: it checks IRQ vs BRK and then pushes registers onto the stack in the sequence PHA, TXA, PHA, TYA, PHA. Your IRQ handler must restore the stack correctly—either by returning through the normal IRQ route (letting ROM complete restore and RTI) or by executing the corresponding pull sequence: PLA, TAY, PLA, TAX, PLA, RTI.
- There is only one IRQ vector but many IRQ sources (two CIAs, VIC-II IRQs, etc.). A custom IRQ handler must detect the source of the interrupt and dispatch accordingly.
- If you replace the default IRQ routine entirely, you must still call the original routine at least once per 1/60 second (or preserve its functionality) so that keyboard scanning, clock updates, and STOP-key handling continue to work. Save the old vector address to another location if you intend to jump to the ROM keyboard routine instead of assuming the ROM address is constant.

## Source Code
```asm
; ROM prelude push sequence (as described in source)
PHA
TXA
PHA
TYA
PHA

; Matching pull/return sequence the user must perform if not returning
; through the normal IRQ:
PLA
TAY
PLA
TAX
PLA
RTI

; Disable/enable interrupts when changing vector:
SEI
; ... write $0314/$0315 ...
CLI

; Kernal routine to safely set vectors:
; VECTOR routine address: $FD1A (decimal 64794)
; (Call this routine per Kernal specification to set IRQ vector safely)
```

## Key Registers
- $0314-$0315 - CPU - CINV: low/high vector to the IRQ interrupt routine (default $EA31 / 59953)

## References
- "irqtmp_cassette_irq_vector_save"—expands on saving/restoring IRQ vector for cassette I/O
- "register_storage_area"—expands on effects of disabling keyboard/IRQ-driven services

## Labels
- CINV
