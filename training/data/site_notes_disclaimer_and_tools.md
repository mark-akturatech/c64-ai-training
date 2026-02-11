# 6502 Instruction Set (opcode map + illegal/unstable notes)

**Summary:** 6502 opcode map (0x00–0xFF) showing official and undocumented mnemonics, examples of illegal/JAM behavior (e.g., $62/$72/$22 = JAM), and notes on unstable combined instructions ANE ($8B) and LXA ($AB). Searchable terms: opcode addresses ($6A, $7A, $62, $72, $8B, $AB), JAM, illegal opcodes, ANE, LXA, undocumented mnemonics (SLO, RLA, RRA, SRE, ISC, DCP).

**Overview**

This chunk presents a full opcode table (0x00–0xFF) listing documented and many undocumented instructions as presented in the source, plus brief behavioral notes:

- Some illegal instruction encodings cause the CPU to "JAM" (lock up) and never complete; the table marks many such encodings (for example $02, $12, $22, $32, $42, $52, $62, $72, $82, $92, $A2, $B2, $C2, $D2, $E2, $F2).
- There is a distinction between accumulator-mode and implied instructions — e.g., $6A (ROR A) is a valid accumulator-mode instruction while $7A (ROR implied) is treated as a NOP in this table.
- Certain indirect-indexed combinations and other illegal addressing forms can fail timing or cause JAM behavior (the source notes indirect-indexed combinations as particularly unstable).
- The table contains many undocumented mnemonics (commonly seen in literature on illegal opcodes): SLO, RLA, RRA, SRE, ISC, DCP, ALR, ARR, ANE, LXA, LAX, SAX, SHA, SHX, SHY, TAS, LAS, etc. These typically combine a memory operation with side-effects and may have nonstandard cycle/timing behavior (not detailed here).
- Two especially unstable immediate-mode opcodes using a "magic constant" are ANE ($8B) and LXA ($AB):
  - $8B (ANE #): described as a combination of an accumulator logical operation with a transfer (source: "ANE # = STA # (NOP) + TXA"; semantics summarized as (A OR CONST) AND X -> A).
  - $AB (LXA #): described as LDA # + TAX (semantics summarized as (A OR CONST) AND oper -> A -> X).
  - The source characterizes both as "highly unstable" and involving a magic constant; internal micro-op combinations produce the observed results.

(No C64-specific registers are discussed; this node documents the 6502 opcode set and undocumented behaviors only.)

## Mnemonics
- SLO
- RLA
- RRA
- SRE
- ISC
- DCP
- ALR
- ARR
- ANE
- LXA
- LAX
- SAX
- SHA
- SHX
- SHY
- TAS
- LAS
- JAM
