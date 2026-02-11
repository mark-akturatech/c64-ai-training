# PHP (Push Processor Status) — 6502

**Summary:** PHP (opcode $08) pushes the Processor Status (SR / P) onto the system stack ($0100-$01FF). It is an implied-mode, 1‑byte, 3‑cycle instruction; the pushed copy has the Break (B) and unused (bit 5) bits set.

## Description
PHP copies the current Processor Status register (P / SR) to the stack. The value actually written to the stack is not a verbatim snapshot: the pushed byte has the Break flag (bit 4, 0x10) and the unused/reserved bit (bit 5, 0x20) set to 1. The instruction itself does not alter the processor flags (other than the stack pointer update).

Behavior summary:
- Opcode: $08
- Addressing: Implied
- Length: 1 byte
- Cycles: 3
- Effect on flags: none (P register unchanged)
- Pushed value: (P) with bits 4 and 5 set — i.e. pushed = P | 0x30
- Stack semantics: store pushed byte at 0x0100 + SP, then SP := (SP - 1) & $FF (first push from default SP=$FF writes to $01FF)
- Differences vs BRK: BRK also pushes a copy of P with B and unused bits set; BRK also forces interrupt vector handling. The B bit in the pushed copy is not necessarily reflected in the internal P register.

Common implementation pseudocode:
- Build the pushed byte by ORing the SR with 0x30 to ensure bits 4 and 5 are set.
- Write the pushed byte to memory at $0100 + SP, then decrement SP.

## Source Code
```text
/* Original pseudocode */
    src = GET_SR;
    PUSH(src);

/* Clarified pushed-value pseudocode (6502 behavior) */
    pushed = GET_SR() | 0x30    ; set B (0x10) and unused (0x20) in pushed copy
    MEM[0x0100 + SP] = pushed
    SP = (SP - 1) & 0xFF

/* Assembly (one-byte instruction) */
    $00: 08        ; PHP
```

## Key Registers
- $0100-$01FF - Stack page (system stack used by PHA/PLA/PHP/PLP/JSR/RTS/BRK push/pull operations)

## References
- "instruction_tables_php" — expands on PHP opcode and table entries

## Mnemonics
- PHP
