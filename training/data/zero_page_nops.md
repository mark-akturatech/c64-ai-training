# NMOS 6510 — Undocumented zero-page NOPs (DOP, SKB, IGN) — opcodes $04, $44, $64

**Summary:** Undocumented NMOS 6510 zero-page NOPs (often named DOP / SKB / IGN) at opcodes $04, $44, $64 — 2-byte instructions that perform a dummy memory read from a zero-page address (Fetch {addr}), take 3 cycles, and do not modify processor state.

## Behavior
These opcodes are undocumented “double-byte” zero-page NOPs. Each instruction consists of the opcode followed by a zero-page address byte; during execution the CPU performs a memory read from that zero-page address (a dummy/fetch) and discards the value — no register or flag is updated. Instruction length and timing are consistent with a 2-byte zero-page operation on NMOS 6502/6510 (size = 2, cycles = 3).

- Instruction form: opcode + zero-page operand (implicit zero-page read).
- Execution effect: dummy read from the supplied zero-page address; no state change.
- Flags: none affected (no N/V/B/D/I/Z/C changes).
- Use cases: used in code-golfing, alignment padding, or cycle/byte-filling where a single-byte NOP is insufficient; see related NOP variants for other sizes/forms.

## Source Code
```text
Opc.  Mnemonic   Function      Size  Cycles  N V - B D I Z C
$04   NOP zp     Fetch {addr}   2     3
$44   NOP zp     Fetch {addr}   2     3
$64   NOP zp     Fetch {addr}   2     3

Notes:
- These instructions perform a memory read from the given zero-page address; the read value is discarded.
- They are undocumented NMOS 6510/6502 opcodes (often labeled DOP / SKB / IGN in opcode lists).
```

## References
- "immediate_nop_variants" — expands on other small-sized undocumented NOPs (immediate forms)
- "zero_page_x_nops" — expands on zero-page,X variants that behave similarly but use X indexing

## Mnemonics
- DOP
- SKB
- IGN
