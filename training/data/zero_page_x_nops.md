# NMOS 6510 — Undocumented zero-page,X NOPs (DOP / SKB / IGN) — opcodes $14,$34,$54,$74,$D4,$F4

**Summary:** Undocumented NMOS 6510 zero-page,X NOP variants (also called DOP / SKB / IGN) at opcodes $14 $34 $54 $74 $D4 $F4 — 2-byte instructions that consume 4 cycles and perform the zero-page,X addressing-mode memory read (value discarded), with no effect on registers or flags.

## Description
These opcodes are undocumented NOP variants that use zero-page,X addressing. Each is encoded as a 2-byte instruction (opcode + zero-page address) and takes 4 clock cycles on NMOS 6502/6510. They perform the full effective-address calculation for the zero-page,X addressing mode and execute a memory read from that computed zero-page address; the fetched byte is discarded (not written to any register or flags). Aside from performing the addressing-mode memory read and spending the associated cycles, they have no observable effect (no register or flag changes).

Key behavioral points:
- Instruction length: 2 bytes (opcode + zero-page operand).
- Timing: 4 cycles each (the timing of the zero-page,X addressing-mode).
- Memory access: performs one memory read at the computed zero-page address (addr = (operand + X) & $FF), value discarded.
- Flags: No flags are affected (N V - B D I Z C unchanged).
- Common undocumented mnemonics: DOP, SKB, IGN (names vary by disassembler/emulator).
- These instructions are useful for cycle padding or to replicate undocumented behavior when reproducing NMOS timing.

## Source Code
```text
Opc.  Mnemonic     Function         Size  Cycles  N V - B D I Z C
$14   NOP zp, x    Fetch {addr}     2     4
$34   NOP zp, x    Fetch {addr}     2     4
$54   NOP zp, x    Fetch {addr}     2     4
$74   NOP zp, x    Fetch {addr}     2     4
$D4   NOP zp, x    Fetch {addr}     2     4
$F4   NOP zp, x    Fetch {addr}     2     4

Operation note:
NOP zp and NOP zp,x actually perform a read operation from the effective address;
the value read is discarded and not stored anywhere.
```

## References
- "zero_page_nops" — expands on zero-page non-indexed NOP variants and their read-only behavior
- "absolute_nops_and_abs_x_variants" — expands on 3-byte absolute and absolute,X NOP variants and page-cross timing

## Mnemonics
- DOP
- SKB
- IGN
