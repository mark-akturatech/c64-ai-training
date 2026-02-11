# 6502: TAX (Transfer A → X)

**Summary:** TAX transfers the accumulator (A) into the X index register, updates the Negative (Sign) and Zero flags based on the transferred value; opcode $AA, implied addressing, 1 byte, 2 cycles.

## Description
TAX performs a register-to-register transfer: the 8-bit value in the accumulator is copied into the X register. After the copy, the processor sets:
- Negative (N) flag from bit 7 of the copied value (1 = negative).
- Zero (Z) flag if the copied value is zero.

Flags unaffected: Carry (C), Overflow (V), Decimal (D), Interrupt Disable (I), Break (B), and the unused bit. The operation uses implied addressing and completes in 2 CPU cycles.

Behavioral note: The N and Z flags reflect the value in X after the transfer (which equals the previous A).

## Source Code
```text
/* Original pseudocode */
    /* TAX */
    unsigned src = AC;
    SET_SIGN(src);
    SET_ZERO(src);
    XR = (src);
```

```asm
; Canonical assembly
TAX     ; Transfer Accumulator to X
        ; Opcode: $AA
        ; Bytes: 1
        ; Cycles: 2
        ; Addressing: Implied
```

```text
Opcode summary:
Mnemonic  Opcode  Bytes  Cycles  Addressing
TAX       $AA     1      2       Implied
```

## References
- "instruction_tables_tax" — expands on TAX opcode and related instruction table entries

## Mnemonics
- TAX
