# IRQ entry prologue: NOPs and status-save at $FF41-$FF47

**Summary:** Assembly at $FF41-$FF47 implements two waste-cycle NOPs and a status-save sequence (PHP / PLA / AND #$EF / PHA) used during IRQ entry. It produces a copy of the processor status with the BRK bit (bit 4) cleared and pushes that modified status onto the stack for IRQ processing.

## Description
- $FF41-$FF42: two NOP instructions used as waste cycles (timing padding).
- $FF43-$FF47: a saved/modified processor status prologue:
  - PHP pushes the current processor status (P) onto the stack.
  - PLA pulls that byte from the stack into A (A now contains the saved P).
  - AND #$EF clears bit 4 (BRK flag, value $10) in A (mask $EF = 1110 1111b).
  - PHA pushes the modified A back onto the stack.
- Result: the stack contains a saved copy of the processor status with the BRK bit cleared, ready for IRQ dispatch code to use. This sequence preserves the original P on the stack (PHP pushed it) while placing a modified copy above/below as intended by the IRQ handler's stack layout.

## Source Code
```asm
.,FF41 EA       NOP             waste cycles
.,FF42 EA       NOP             waste cycles

                                *** save the status and do the IRQ routine
.,FF43 08       PHP             save the processor status
.,FF44 68       PLA             pull the processor status
.,FF45 29 EF    AND #$EF        mask xxx0 xxxx, clear the break bit
.,FF47 48       PHA             save the modified processor status
```

## References
- "irq_vector_dispatch" — expands on prologue used prior to IRQ dispatch

## Mnemonics
- NOP
- PHP
- PLA
- AND
- PHA
