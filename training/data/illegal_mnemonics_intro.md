# Kick Assembler — Illegal 6502 Mnemonics (A.3.2)

**Summary:** Describes Kick Assembler's default illegal 6502 instruction set (standard 6502 mnemonics plus undocumented/modified opcodes) and how to enable it with the assembler directive `.cpu _6502`. Includes Table A.4 detailing illegal 6502 mnemonics, their addressing modes, opcode bytes, and assembler-specific encodings.

**Overview**

The illegal instruction set used by Kick Assembler includes the standard documented 6502 mnemonics plus additional modifications (undocumented/"illegal" opcodes). This illegal set is the default instruction set for Kick Assembler; enable it explicitly with:


Table A.4 below provides a detailed list of illegal mnemonics, their addressing modes, opcode bytes, and assembler-specific encodings.

## Source Code

```
.cpu _6502
```

