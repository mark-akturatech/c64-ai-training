# START TIMER (CIA#1)

**Summary:** Starts CIA#1 timer A and configures CIA#1 control/interrupt registers ($DC0E, $DC0D) to enable an interrupt on a timer underflow and force-load/start timer A; then jumps to serial clock-off handler at $EE8E. Contains exact 6502 mnemonics and addresses (LDA/STA, AND/ORA, JMP).

## Description
This routine configures CIA#1 to enable an interrupt and to load/start timer A, then transfers execution to the serial-clock-off routine at $EE8E.

Behavior, step-by-step:
- Write #$81 to $DC0D (CIA#1 Interrupt Control Register, ICR). The source comment states this enables IRQ when timer B reaches zero.
- Read $DC0E (CIA#1 Control Register A, CRA), mask with AND #$80 to preserve bit7, OR with #$11 to set bit4 (force-load timer A) and bit0 (start timer A), then write back to $DC0E. This forces the timer A latch to be reloaded from the timer low/high registers and starts timer A.
- JMP $EE8E to continue serial handling (serial clock off routine).

**[Note: Source may contain an error — the ICR value used is #$81; the comment says "enable IRQ when timer B reaches zero", but #$81 sets bit0 (typically Timer A) with the set flag (bit7). Expected Timer B enable would normally set bit1; thus the ICR immediate value may be incorrect or the comment mislabeled the timer.]**

## Source Code
```asm
.,FF6E A9 81    LDA #$81        Enable IRQ when timer B reaches zero
.,FF70 8D 0D DC STA $DC0D       CIA#1 interrupt control register
.,FF73 AD 0E DC LDA $DC0E       CIA#1 control register A
.,FF76 29 80    AND #$80
.,FF78 09 11    ORA #$11        Force load of timer A values -bit4, and start -bit0
.,FF7A 8D 0E DC STA $DC0E       Action!
.,FF7D 4C 8E EE JMP $EE8E       Continue to 'serial clock off'
```

## Key Registers
- $DC0D - CIA#1 - Interrupt Control Register (ICR): written with #$81 in this routine (comment: enable IRQ on timer B; see note about possible mismatch)
- $DC0E - CIA#1 - Control Register A (CRA): bit4 = force load timer A latch, bit0 = start/stop timer A (routine preserves bit7, sets bits 4 and 0)

## References
- "enable_timer" — expands on uses precomputed timer values to start the timer