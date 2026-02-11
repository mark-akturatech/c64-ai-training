# TSX (Transfer Stack Pointer to X) — opcode $BA

**Summary:** TSX (opcode $BA) copies the stack pointer (S) into the X index register and updates the N and Z flags; implied addressing, 1 byte, 2 cycles.

## Description
Operation transfers the current stack pointer value into the X register (X <- S). The instruction uses implied addressing and executes in 2 CPU cycles.

Flags affected:
- N (Negative): set if bit 7 of X is 1 after transfer
- Z (Zero): set if X == 0 after transfer
- C, I, D, V: unaffected

Operation notation: S -> X

Reference: (Ref: 8.9)

## Source Code
```text
+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
|  Implied       |   TSX                 |   $BA   |    1    |    2     |
+----------------+-----------------------+---------+---------+----------+
```

```asm
; TSX - Transfer Stack Pointer to X
; Opcode: $BA
; Pseudocode:
;   X = S
;   N = (X & 0x80) != 0
;   Z = (X == 0)
; Flags: N,Z updated; C,I,D,V unchanged
```

## References
- "instruction_operation_tsx" — expands on TSX pseudocode and behavior

## Mnemonics
- TSX
