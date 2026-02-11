# Kick Assembler — Appendix A.3.3 — DTV Mnemonics

**Summary:** Lists DTV CPU (.cpu dtv) mnemonic extensions for Kick Assembler, including new opcodes, mnemonics such as `bra` (branch always), `sac`, and `sir`, and small changes to addressing support.

**Description**

This appendix enumerates the extra mnemonics and opcode bytes that Kick Assembler accepts when the assembler is set to the DTV CPU mode (`.cpu dtv`). It adds DTV-specific instructions on top of the standard 6502 set (and Kick's illegal opcodes set). Notable entries include:

- `bra` — Branch Always.
- `sac` — Set Accumulator Control.
- `sir` — Set Interrupt Register.

Additionally, there are small changes to addressing support.

## Source Code

```text
bra  $12
sac  $32
sir  $42
```

## References

- "mnemonics_6502_illegal_a3_2" — expands on DTV and contains standard + illegal 6502 mnemonics plus DTV-specific ones.

## Mnemonics
- BRA
- SAC
- SIR
