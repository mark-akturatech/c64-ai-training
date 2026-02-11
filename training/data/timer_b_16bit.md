# CIA 6526 — Timer B (TBLO/TBHI) $06/$07

**Summary:** Timer B is a 16-bit down-counter at offsets $06/$07 in the CIA6526 (TBLO/TBHI). Count source is selected by CRB bits 5–6 (PHI2, CNT edges, Timer A underflows, or Timer A underflows coincident with CNT positive edge); underflow can generate an ICR interrupt and/or toggle/pulse PB7. Timer A can be cascaded into Timer B to form a 32-bit timer.

## Timer B (TBLO/TBHI) — Description
Timer B is a 16-bit down-counter implemented as two 8-bit registers: low byte at offset $06 (TBLO) and high byte at offset $07 (TBHI). It operates identically to Timer A except for additional selectable count sources.

Count sources (selected by CRB bits 5–6):
- PHI2 system clock pulses
- Positive edges on the external CNT pin
- Timer A underflow pulses
- Timer A underflows coincident with a CNT positive edge

Underflow behavior:
- When the 16-bit counter decrements past 0, Timer B underflows.
- On underflow, Timer B can set its underflow interrupt flag (and generate an interrupt) if enabled in the Interrupt Control Register (ICR).
- On underflow, Timer B can also toggle or pulse PB7 (bit 7 of Port B) if configured in CRB.

Cascading / 32-bit mode:
- Timer B can be configured to count Timer A underflows so that the pair forms a 32-bit timer: Timer A decrements as the low 16 bits; each Timer A underflow (when configured as Timer B’s clock source) decrements Timer B (the high 16 bits).
- This allows long-period timing by treating Timer B as the high word and Timer A as the low word.

Notes:
- CRB bits 5–6 control the Timer B input mode; CRB also contains the start/stop and PB7 output mode controls (see control_register_b).
- Interrupt generation on underflow requires ICR configuration (see interrupt_control_register_icr).
- Timer A behavior and underflow pulse characteristics follow the same semantics as Timer B (see timer_a_16bit).

## Source Code
```text
CIA register offsets (relevant):
  $06 - TBLO  - Timer B Low byte
  $07 - TBHI  - Timer B High byte

Control notes (reference):
  - Timer B input mode selected by CRB bits 5-6:
      selects PHI2, CNT edges, Timer A underflow pulses,
      or Timer A underflows coincident with CNT positive edge.
  - Underflow can set ICR flag and toggle/pulse PB7 via CRB.
  - Cascading: Timer B counts Timer A underflows to form 32-bit timer.
```

## Key Registers
- $DC06-$DC07 - CIA 1 - Timer B low/high (TBLO/TBHI) 16-bit down-counter
- $DD06-$DD07 - CIA 2 - Timer B low/high (TBLO/TBHI) 16-bit down-counter

## References
- "control_register_b" — CRB bits select Timer B input mode, start/stop, and PB7 output
- "timer_a_16bit" — Timer A operation and use of underflows to clock Timer B (cascading)
- "interrupt_control_register_icr" — Interrupt enable/flag behavior for timer underflows

## Labels
- TBLO
- TBHI
