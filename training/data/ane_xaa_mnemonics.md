# NMOS 6510 illegal opcode: ANE / XAA ($8B)

**Summary:** Unofficial NMOS 6510 opcode $8B, commonly named ANE or XAA by assemblers, is an illegal immediate-mode instruction that effectively ANDs the accumulator, X register and the immediate operand (A := A & X & #imm). It is undocumented on the 6502/6510 and not present on 65C02 CMOS variants.

## Description
ANE (also seen as XAA) is an undocumented (illegal) NMOS 6502/6510 instruction whose opcode byte is $8B. The visible effect on registers is a bitwise AND involving the accumulator, the X register and the immediate operand; the result is stored in A. In practice the operation can be described as:

- A := A & X & immediate

Processor status changes observed on NMOS 6502/6510 implementations:
- N (negative) and Z (zero) are updated to reflect the result in A.
- Other flags (C, V, etc.) are not reliably affected by this opcode.

Different assemblers and documentation use the names ANE or XAA for the same opcode and semantics; both names appear in historical opcode lists. The opcode is only available as an immediate-mode instruction ($8B #imm) on NMOS implementations — behaving as an illegal/undocumented opcode and therefore comes with the usual caveats about portability and future-CPU differences.

## References
- "lax_lxa_variants" — expands on related LAX/LXA illegal-opcode variants  
- "nops_tops_dops_and_jam" — expands on NOP/TOP/DOP/JAM opcode variants and related undocumented opcodes

## Mnemonics
- ANE
- XAA
