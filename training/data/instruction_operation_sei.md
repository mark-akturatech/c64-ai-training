# SEI (SET INTERRUPT DISABLE)

**Summary:** SEI is a 6502 instruction (opcode $78) that sets the processor status I flag (Interrupt Disable, bit 2 of P) to 1, masking IRQs (but not NMI). Implied addressing, 2 CPU cycles, does not alter other status flags.

## Description
SEI (Set Interrupt Disable) writes 1 to the I bit in the processor status register P (bit 2). When I = 1, maskable IRQ interrupts are inhibited; NMIs remain unaffected. SEI is an implied-mode single-byte instruction (no operand), requires 2 clock cycles, and performs no memory read/write or stack operations.

Behavioral notes:
- Only the I bit is modified; N, V, D, Z, C and the B bit are unchanged by SEI.
- Because the 6502 samples interrupt requests between instruction executions, SEI prevents IRQs from being taken after SEI completes; depending on exact timing a previously asserted IRQ may still be serviced.
- SEI does not affect NMI; NMIs are edge-sensitive and will still be taken when asserted.
- SEI is atomic as an instruction but does not push or pull processor status.

## Source Code
```asm
; Assembly form
SEI        ; opcode $78, implied, 2 cycles

; Pseudocode (as provided)
/* SEI */
    SET_INTERRUPT((1));
```

```text
; Opcode reference
Mnemonic: SEI
Opcode: $78
Addressing: Implied
Bytes: 1
Cycles: 2
Effect: P.I <- 1  ; sets Interrupt Disable flag
```

```text
; Processor status (P) bit layout (bit numbers)
; 7 6 5 4 3 2 1 0
; N V - B D I Z C
; Bit 2 (I) = Interrupt Disable (0 = IRQ enabled, 1 = IRQ disabled)
```

## References
- "instruction_tables_sei" — expands on SEI opcode and instruction table entries

## Mnemonics
- SEI
