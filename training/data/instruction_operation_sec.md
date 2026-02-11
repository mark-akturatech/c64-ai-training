# 6502 SEC — Set Carry Flag (C = 1)

**Summary:** SEC (opcode $38) — implied 6502 instruction that sets the processor status Carry flag (C = 1). Implied addressing, 1 byte, 2 cycles, affects only the Carry flag.

## Description
SEC sets the processor status Carry flag to 1. It uses implied addressing and performs no memory read/write. The instruction does not clear or modify the other status flags (N, V, Z, D, I). Typical opcode encoding is a single byte ($38) and the instruction takes 2 CPU cycles.

Behavior details:
- Operation: C <- 1
- Addressing: Implied
- Bytes: 1
- Cycles: 2
- Side effects: Only the Carry flag is set; other flags remain unchanged.

## Source Code
```asm
; Assembly mnemonic
SEC         ; Set Carry flag (C = 1)

; Pseudocode (from source)
/* SEC */
    SET_CARRY((1));
```

```text
Opcode summary:
Mnemonic  Opcode  Bytes  Cycles  Addressing
SEC       $38     1      2       Implied
```

## References
- "instruction_tables_sec" — expands on SEC opcode

## Mnemonics
- SEC
