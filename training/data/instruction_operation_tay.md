# TAY — Transfer Accumulator to Index Y (6502)

**Summary:** TAY (opcode $A8) copies the Accumulator (A) into the Y index register and sets the Negative (N) and Zero (Z) processor flags based on the transferred value; implied addressing, 1 byte, 2 CPU cycles.

## Operation
TAY performs a register-to-register transfer:
- Copies the contents of the Accumulator (A) into the Y register.
- Updates the processor status:
  - Zero (Z) is set if the transferred value is zero.
  - Negative (N) is set to the value of bit 7 (the sign bit) of the transferred value.
- Does not affect Carry (C), Overflow (V), Decimal (D), Interrupt disable (I), or Break (B) flags.
- Does not read or write memory.

Semantics (high-level):
- Y ← A
- Set Z if Y == 0
- Set N if bit7(Y) == 1

## Source Code
```asm
; Pseudocode from source:
; TAY
;     unsigned src = AC;
;     SET_SIGN(src);
;     SET_ZERO(src);
;     YR = (src);

; 6502 assembly encoding (reference)
; Opcode: $A8
; Addressing: Implied
; Bytes: 1
; Cycles: 2

        A8      ; TAY
```

```text
Status flag effects:
- N (Negative): Set to bit 7 of result (Y after transfer)
- V (Overflow): Unchanged
- Z (Zero): Set if result == 0
- C (Carry): Unchanged
- D (Decimal): Unchanged
- I (Interrupt Disable): Unchanged
- B (Break) / Unused: Unchanged
```

## References
- "instruction_tables_tay" — expands on TAY opcode details and opcode table entries

## Mnemonics
- TAY
