# NMOS 6510 — Undocumented immediate-mode NOPs (DOP / SKB)

**Summary:** Undocumented immediate-mode NOP opcodes for the NMOS 6510 / 6502 family: $80, $82, $C2, $E2, $89. They behave as “NOP #imm” (fetch immediate byte and ignore), size = 2 bytes, cycles = 2; also known as DOP / SKB.

## Behavior
These opcodes perform no operation other than fetching the following immediate byte from the instruction stream. They are immediate-mode single-operand NOPs (often called DOP or SKB). Practical effects:
- Instruction action: Fetch #imm (read the immediate operand and discard).
- Size: 2 bytes (opcode + immediate).
- Timing: 2 clock cycles on typical NMOS 6510/6502 implementations.
- Registers and flags: no architected changes (no effect on A, X, Y, SP or processor status flags).

Caution: Some older references claim opcodes $82, $C2, and $E2 may JAM (cause the CPU to lock up). Examination of opcode decoding and broad machine testing indicate these opcodes behave as NOPs on the vast majority of machines; the JAM claim is likely erroneous or applicable only to a tiny subset of faulty hardware. Use caution if relying on these opcodes for portable code.

## Source Code
```text
Type: no effect

Opc.  Mnemonic    Function      Size  Cycles  N V - B D I Z C
$80   NOP #imm    Fetch #imm     2     2
$82   NOP #imm    Fetch #imm     2     2
$C2   NOP #imm    Fetch #imm     2     2
$E2   NOP #imm    Fetch #imm     2     2
$89   NOP #imm    Fetch #imm     2     2

Note: One classic source claims $82/$C2/$E2 may JAM. Opcode decoding and other sources do not corroborate this; on nearly all machines these opcodes act as no-ops. Still, avoid using them in code that must be maximally portable.
```

## References
- "single_byte_nops" — expands on other simple undocumented single-byte NOP forms
- "zero_page_nops" — expands on zero-page NOP variants (short read NOPs)

## Mnemonics
- DOP
- SKB
- NOP
