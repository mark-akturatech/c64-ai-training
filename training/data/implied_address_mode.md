# Implied Addressing (No-Address) — 6502

**Summary:** Implied (no-address) instructions on the 6502 (e.g. INX, BRK, TAY, NOP) require no memory operand, operate on implicit targets (registers or processor state), and occupy one byte.

## Implied Addressing (No-Address)
Implied addressing (often called "no-address") denotes instructions that carry no memory operand and make no explicit memory reference. The instruction itself is complete — its operand (if any) is implicit in the opcode. Typical examples given: INX (increment X), BRK (break), and TAY (transfer A to Y). Such instructions occupy one byte.

The term "implied" reflects that the instruction implies the target (for example, a register or a processor vector) without specifying it in the instruction stream. The source notes this by suggesting INX implies the X register, and BRK implies the machine‑language monitor/interrupt vector. NOP is discussed as an edge case because it performs no observable action, so its characterization as "no-address" or "implied" is debated.

## References
- "nop_and_use_in_testing" — expands on NOP specifics and uses

## Mnemonics
- INX
- BRK
- TAY
- NOP
