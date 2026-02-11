# TXS — Transfer X to Stack Pointer

**Summary:** TXS copies the X register into the processor stack pointer (SP). Implied addressing, opcode $9A, 1 byte, 2 CPU cycles, does not affect any processor status flags.

## Operation
TXS performs a simple register-to-register transfer:

- SP ← X (the 8-bit stack pointer is replaced with the current X register value).
- The full 16-bit stack base remains page $01; effective stack address for pushes/pops is $0100 + SP.
- No memory read or write occurs.
- No status flags (N, V, Z, C, I, D, B) are affected.

Behavioral notes:
- SP is an 8-bit internal register; X is 8-bit on the 6502, so no truncation beyond 8 bits occurs.
- Changing SP with TXS immediately affects subsequent PHA/PLA/JSR/RTS/RTI stack operations because they use $0100 + SP.
- Instruction is implied addressing and is encoded as a single opcode byte.

## Source Code
```text
; Pseudocode (from source)
/* TXS */
    unsigned src = XR;
    SP = (src);

; 6502 encoding / example
$9A        TXS    ; opcode 0x9A, implied
; Instruction size: 1 byte
; Cycles: 2
; Flags: none affected
```

## References
- "instruction_tables_txs" — expands on TXS opcode

## Mnemonics
- TXS
