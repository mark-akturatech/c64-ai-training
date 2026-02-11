# 6502 Undocumented / Illegal Opcodes (NMOS) — Mnemonics and Notes

**Summary:** NMOS 6502 undocumented (illegal) opcodes and common assembler mnemonics (ALR/ASR, ANC, ANE/XAA, ARR, DCP/DCM, ISC/ISB/INS, LAS/LAR, LAX, LXA, RLA, RRA, SAX/AXS/AAX, SBX/AXS/SAX, SHA/AHX/AXA, SHX, SHY, SLO, SRE/LSE, TAS, USBC, NOP variants, JAM/KIL/HLT). Warning: these behaviors apply to NMOS chips; CMOS families either redefine some opcodes as documented extensions or treat them as NOPs.

**Overview**
This node lists implementation-specific notes for several NMOS undocumented opcodes and common assembler synonyms used by ACME/DASM. It contains short behavioral descriptions and a compact table (see Source Code) with assembler names, opcode bytes, addressing modes, cycles, and flag effects where available.

- Audience: experienced 6502/C64 programmers working with NMOS 6502 variants.  
- Caution: undocumented opcodes are implementation-dependent. Use only with NMOS 6502 chips; CMOS variants (e.g., 65C02) change semantics or make them NOPs.  
- Assemblers: common synonyms shown here match names used by ACME and DASM (e.g., ANE is also called XAA).  
- The list at top of the original source enumerates many illegal mnemonics; only a subset has per-opcode detail in this chunk.

**Legend to markers used in the instruction details**
- * : add 1 cycle if page boundary is crossed  
- † : unstable  
- †† : highly unstable

**Brief descriptions (preserve technical behavior)**
- ALR (ASR): Performs A AND oper then LSR on the result (AND + LSR). Affected flags: N, Z, C reflect result and shifts. Use caution: undocumented and NMOS-specific.
- ANC: A AND oper, then sets Carry from bit 7 of the result (AND oper + set C as ASL). Effectively transfers bit7 to Carry after AND.
- ANC (ANC2): Variant where carry is set as if by ROL; functionally very similar to the other ANC opcode; same effects on A and flags.
- ANE (XAA): Operation approximates (A OR CONST) AND X AND oper -> A. Highly unstable/implementation-dependent — do not rely on it. Behavior depends on an internal constant varying by chip, temperature, etc. Using operand $00 or forcing A to $FF/$00 may stabilize some results. Marked highly unstable (††).
- ARR: Performs A AND oper then ROR. Also affects V flag based on adder semantics; description notes that "bit 7 (sign) is exchanged with the carry" and V set according to (A AND oper) + oper. Implementation-dependent behavior on V and C.
- DCP (DCM): Performs DEC on memory operand followed by CMP with A (DEC oper then CMP oper). Equivalent to M-1 -> M, then A - M compared for flags.
- ISC (ISB/INS): Increments memory operand, then subtracts it from A with borrow (INC oper then SBC oper). Equivalent to M+1 -> M, then A - M - (1 - C) -> A.
- LAS (LAR): Loads A, X, and SP with memory AND SP (A, X, SP = M AND SP). Affected flags: N, Z.
- LAX: Loads A and X with memory (A, X = M). Affected flags: N, Z.
- LXA: Loads A and X with immediate operand ANDed with A (A, X = A AND #oper). Highly unstable (††).
- RLA: Rotates memory left, then ANDs with A (ROL oper then AND A). Equivalent to M = (M << 1) | C; A = A AND M.
- RRA: Rotates memory right, then adds to A with carry (ROR oper then ADC A). Equivalent to M = (M >> 1) | (C << 7); A = A + M + C.
- SAX (AXS/AAX): Stores A AND X into memory (M = A AND X).
- SBX (AXS/SAX): Subtracts immediate operand from A AND X, stores result in X (X = (A AND X) - #oper). Affected flags: N, Z, C.
- SHA (AHX/AXA): Stores A AND X AND high byte of address + 1 into memory (M = A AND X AND (addr_hi + 1)). Unstable (†).
- SHX: Stores X AND high byte of address + 1 into memory (M = X AND (addr_hi + 1)). Unstable (†).
- SHY: Stores Y AND high byte of address + 1 into memory (M = Y AND (addr_hi + 1)). Unstable (†).
- SLO: Shifts memory left, then ORs with A (ASL oper then ORA A). Equivalent to M = M << 1; A = A OR M.
- SRE (LSE): Shifts memory right, then EORs with A (LSR oper then EOR A). Equivalent to M = M >> 1; A = A EOR M.
- TAS: Transfers A to SP, then stores A AND X AND high byte of address + 1 into memory (SP = A; M = A AND X AND (addr_hi + 1)). Unstable (†).
- USBC: Equivalent to SBC with immediate addressing mode (SBC #oper).
- NOP variants (DOP/TOP): Various NOPs with different byte sizes and cycles. Some affect flags or have side effects.
- JAM/KIL/HLT: Halts the processor; execution cannot continue without a reset.

## Source Code

## Mnemonics
- ALR
- ASR
- ANC
- ANC2
- ANE
- XAA
- ARR
- DCP
- DCM
- ISC
- ISB
- INS
- LAS
- LAR
- LAX
- LXA
- RLA
- RRA
- SAX
- AXS
- AAX
- SBX
- SHA
- AHX
- AXA
- SHX
- SHY
- SLO
- SRE
- LSE
- TAS
- USBC
- DOP
- TOP
- NOP
- JAM
- KIL
- HLT
