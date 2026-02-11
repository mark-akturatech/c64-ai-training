# 6502 DEX — Decrement X Register

**Summary:** DEX ($CA) decrements the CPU X register (XR) by 1 with 8-bit wrap-around; addressing = implied; size = 1 byte; cycles = 2. Updates Negative (Sign) and Zero flags only.

## Operation
DEX performs an 8-bit decrement on the X register with wrap-around from $00 to $FF. After the decrement the processor sets:
- Zero flag (Z) if the result is 0.
- Negative flag (N, "Sign") if bit 7 of the result is 1.

It does not affect Carry (C), Overflow (V), or the Decimal mode. Addressing is implied; the instruction is a single opcode byte and executes in 2 clock cycles on the NMOS 6502.

Semantics (result wrap and flag calculation):
- result = (X - 1) & $FF
- Z = (result == 0)
- N = (result & $80) != 0

## Source Code
```text
/* Pseudocode given */
    unsigned src = XR;
    src = (src - 1) & 0xff;
    SET_SIGN(src);
    SET_ZERO(src);
    XR = (src);
```

```asm
; Assembly form
DEX        ; opcode $CA, implied, 1 byte, 2 cycles
```

```text
Opcode  Mnemonic  Addressing  Bytes  Cycles
$CA     DEX       Implied     1      2
```

## References
- "instruction_tables_dex" — expands on DEX opcode and related instruction-table entries

## Mnemonics
- DEX
