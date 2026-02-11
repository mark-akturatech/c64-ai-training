# TXA — Transfer X to Accumulator

**Summary:** TXA (opcode $8A) — implied-mode 6502 instruction that copies the X register into the accumulator (A) and updates the Negative (Sign) and Zero flags based on the transferred value.

## Operation
TXA performs a straight register transfer: A ← X. The instruction sets the Negative (N, sign) flag from bit 7 of the transferred value and sets the Zero (Z) flag if the result is zero. Other processor status flags (C, V, D, I) are unaffected.

Behavior details:
- Transfer is a simple byte copy; no arithmetic or BCD effects.
- Negative flag = bit7 of the result (A after transfer).
- Zero flag = 1 if result == 0, else 0.
- Instruction uses implied addressing; it does not read or write memory.

## Source Code
```text
Pseudocode (from source):
/* TXA */
    unsigned src = XR;
    SET_SIGN(src);
    SET_ZERO(src);
    AC = (src);
```

```asm
; 6502 assembly form
TXA     ; opcode $8A, implied
        ; A := X ; N,Z updated
```

```text
Opcode summary:
- Mnemonic: TXA
- Opcode byte: $8A
- Addressing: Implied
- Bytes: 1
- Cycles: 2
- Flags affected: N (Negative), Z (Zero)
- Flags not affected: C, V, D, I, (unused)
```

## References
- "instruction_tables_txa" — expands on TXA opcode and related instruction table entries

## Mnemonics
- TXA
