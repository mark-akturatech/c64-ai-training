# PHP — Push Processor Status (Opcode $08)

**Summary:** PHP (opcode $08) pushes the processor status register (P) onto the stack (P to S). Implied addressing, 1 byte, 3 cycles; does not modify processor flags but the pushed copy sets the Break flag and the unused bit as described below.

## Description
PHP copies the current processor status register onto the stack. The instruction itself does not change any flags in the processor status (N, V, D, I, Z, C are unaffected). The value pushed to the stack is a copy of P with two specific bits forced:

- Bit 4 (B — Break) is set to 1 in the pushed copy produced by PHP.
- Bit 5 (unused / always-one on stack) is set to 1 in the pushed copy.

Note: The processor's internal Break flag (the one that influences interrupts) is not altered by executing PHP — only the value placed on the stack has the B bit set. The stack pointer (S) is decremented and the byte is stored at $0100 + S (stack grows downward).

Common usage: Save status before interrupts, subroutine calls, or other contexts where a software snapshot of P is needed. Use PLP to restore P from the stack (see references).

## Source Code
```asm
; Opcode and basic encoding
; PHP — opcode $08, size 1, cycles 3
; Machine byte:
    .org $0800
0800:   $08        ; PHP

; Example sequence (addresses illustrative)
    sei         ; set interrupt disable (affects I flag)
    php         ; push status (08) -> stores P with B=1, unused bit=1
    ; ... later ...
    plp         ; pull status from stack (restores P)
```

```text
; Processor status byte layout (bit = value pushed by PHP)
; Bit 7 6 5 4 3 2 1 0
;     N V 1 B D I Z C
; N = Negative, V = Overflow, 1 = unused/set-on-stack, B = Break (set in pushed copy)
; D = Decimal, I = Interrupt Disable, Z = Zero, C = Carry
```

```text
; Reference table (from source)
+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
|  Implied       |   PHP                 |    08   |    1    |    3     |
+----------------+-----------------------+----------------------+----------+
```

## References
- "plp_pull_processor_status" — restores status from stack (PLP)
- "pha_push_accumulator" — push accumulator to stack (PHA)

## Mnemonics
- PHP
