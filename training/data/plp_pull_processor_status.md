# PLP — Pull Processor Status (6502)

**Summary:** PLP (opcode $28) pulls the processor status byte from the stack and restores the flags (N, Z, C, I, D, V). Addressing mode: Implied; Size: 1 byte; Timing: 4 cycles.

## Operation
PLP pops one byte from the stack and loads it into the processor status register P. The condition flags N (negative), Z (zero), C (carry), I (interrupt disable), D (decimal), and V (overflow) are taken directly from the pulled byte. Use PLP to restore a previously saved status (typically after PHP or during routine returns where P was pushed).

PLP is the counterpart to PHP (push processor status) and is also used (conceptually) by RTI (return from interrupt), which restores P from the stack as part of returning from an interrupt.

## Source Code
```asm
; Instruction summary / encoding
; Addressing Mode: Implied
; Assembly: PLP
; Opcode: $28
; Bytes: 1
; Cycles: 4

        PLP     ; Pull processor status from stack (opcode $28)
```

## References
- "php_push_processor_status" — covers PHP (push processor status)
- "rti_return_interrupt" — covers RTI (return from interrupt) which restores P from stack

## Mnemonics
- PLP
