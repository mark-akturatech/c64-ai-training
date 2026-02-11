# 6502 Instruction Set — Rev. A "ROR bug" (pre‑June 1976)

**Summary:** Describes the Rev. A 6502 silicon issue where the ROR (rotate right) instruction was unimplemented on early chips produced before June 1976. In these versions, the ROR opcode performed an operation similar to ASL (arithmetic shift left) without updating the Carry flag; the Negative (N) and Zero (Z) flags were set according to the result. The affected ROR opcodes are: $66 (ROR zpg), $6A (ROR A), $6E (ROR abs), $76 (ROR zpg,X), and $7E (ROR abs,X). This document includes opcode tables highlighting ROR and related shift/rotate instructions.

**Rev. A ROR Issue (Behavioral Summary)**

Early NMOS 6502 silicon (Rev. A) lacked the necessary internal control lines to implement the ROR instruction. As a result:

- ROR instructions executed a left-shift operation (similar to ASL) instead of a rotate-right sequence.
- The Carry flag was not updated by ROR on these chips, while the Negative (N) and Zero (Z) flags were set according to the result.
- The documented opcodes for ROR are: $66 (ROR zpg), $6A (ROR A), $6E (ROR abs), $76 (ROR zpg,X), $7E (ROR abs,X).
- A later revision (Rev. B) restored correct ROR semantics; this change is often attributed to user demand.

**Note:** The description of ROR behaving like ASL while N and Z were "correct" may seem inconsistent with how ASL affects the Carry flag. This reflects the reported behavior; hardware tests are recommended for precise effects.

**Cross-Reference and Context**

- ROR is one of four shift/rotate operations alongside ASL, LSR, and ROL. The opcode group for these instructions is shown in the opcode tables below.
- The text refers to an "opcode/opcycle table for ROR on Rev A" and to an implementation change in Rev B, but explicit cycle counts and hardware schematic/control-line details are not present here.

## Mnemonics
- ROR
