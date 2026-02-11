# 6502 undocumented / illegal instructions: SLO, SRE, TAS, USBC, SHY, NOP variants, JAM

**Summary:** Descriptions and opcode maps for several undocumented 6502 instructions (SLO/ASO, SRE/LSE, TAS/XAS/SHS, SHY (A11/SYA/SAY), USBC (EB), various multi-byte NOPs/DOP/TOP, and note on JAM/KIL). Includes behavior, affected flags (N Z C I D V), addressing modes, opcode bytes and cycle counts, and caveats about unstable/masked effects and page-boundary issues.

**Overview**
This chunk documents several widely-known illegal 6502 opcodes and their observed effects:

- Many illegal opcodes combine the effects of two legal micro-operations (for example, a shift plus a register operation). They can be understood as producing combined behavior by blending two "threads" (denoted c=1 and c=2 bit-pattern behaviors) encoded in the opcode table layout.
- JAM (also called KIL or HLT) permanently freezes the CPU until reset — the instruction halts further execution.
- Some illegal instructions are unstable on real silicon: they may sometimes drop parts of their intended operation (for example, the "AND (H+1)" in store variants), or behave oddly at page crossings. These hardware quirks are noted per-opcode below.
- NOP variants (commonly called DOP/TOP) exist in multiple addressing modes and byte lengths; they consume operands but otherwise do nothing useful.

The sections below summarize the functional effect, affected flags, addressing modes, mnemonic aliases, opcode encoding (hex), byte size and cycle counts as observed.

**SHY (A11, SYA, SAY)**
- Effect: Stores Y AND (high-byte of effective address + 1) at memory.
- Formal: Y AND (H+1) -> M (but this "AND (H+1)" masking is known to be unstable on some chips — see caveat).
- Flags: none affected (N Z C I D V = - - - - - -)
- Caveats: Sometimes the high-byte mask (AND (H+1)) is dropped; page boundary crossings may not work reliably (there are reports the high byte of the stored value is used as the high byte of the address in some silicon revisions).
- Assembler aliases: A11, SYA, SAY mentioned in some documents.
- Addressing mode: absolute,X with opcode 9C, 3 bytes, 5 cycles.

**SLO (also called ASO)**
- Effect: ASL (shift left) on memory, then ORA with accumulator.
- Behavior summary:
  - Memory: shift left with carry: M = C <- [76543210] <- 0 (i.e. ASL into carry)
  - Accumulator: A OR M -> A (ORA with the shifted memory)
- Flags: N and Z updated by ORA result; C set by ASL; I D V unaffected (N Z C I D V = + + + - - -)
- Addressing modes, opcodes, bytes and cycles:
  - zeropage       SLO oper         07   2 bytes   5 cycles
  - zeropage,X     SLO oper,X       17   2 bytes   6 cycles
  - absolute       SLO oper         0F   3 bytes   6 cycles
  - absolute,X     SLO oper,X       1F   3 bytes   7 cycles
  - absolute,Y     SLO oper,Y       1B   3 bytes   7 cycles
  - (indirect,X)   SLO (oper,X)     03   2 bytes   8 cycles
  - (indirect),Y   SLO (oper),Y     13   2 bytes   8 cycles

**SRE (also called LSE)**
- Effect: LSR (logical shift right) on memory, then EOR with accumulator.
- Behavior summary:
  - Memory: logical shift right where M = 0 -> [76543210] -> C (LSR to carry)
  - Accumulator: A EOR M -> A
- Flags: N and Z updated by EOR result; C set by LSR; I D V unaffected (N Z C I D V = + + + - - -)
- Addressing modes, opcodes, bytes and cycles:
  - zeropage       SRE oper         47   2 bytes   5 cycles
  - zeropage,X     SRE oper,X       57   2 bytes   6 cycles
  - absolute       SRE oper         4F   3 bytes   6 cycles
  - absolute,X     SRE oper,X       5F   3 bytes   7 cycles
  - absolute,Y     SRE oper,Y       5B   3 bytes   7 cycles
  - (indirect,X)   SRE (oper,X)     43   2 bytes   8 cycles
  - (indirect),Y   SRE (oper),Y     53   2 bytes   8 cycles

**TAS (also called XAS, SHS)**
- Effect: Stores A AND X into the stack pointer (SP) and writes A AND X AND (high-byte of effective address + 1) to memory (unstable).
- Formal: A AND X -> SP ; A AND X AND (H+1) -> M
- Flags: none affected (N Z C I D V = - - - - - -)
- Addressing mode: absolute,Y with opcode 9B, 3 bytes, 5 cycles.
- Caveats: The mask AND (H+1) is unstable on some silicon; page boundary crossing behavior may be unreliable in some revisions.

**USBC (undocumented SBC variant)**
- Effect: Equivalent to SBC immediate (E9) in effect — subtract with carry (A - M - NOT(C)).
- Formal: A - M - C̅ -> A
- Flags affected: N Z C and V as for SBC (N Z C I D V = + + + - - +)
- Addressing mode: immediate, opcode EB, 2 bytes, 2 cycles — acts like SBC #oper.

**NOP variants (including DOP, TOP)**
- Effect: Various opcodes act as multi-byte NOPs: they consume operand bytes in different addressing modes but otherwise have no useful effect. They are sometimes written DOP/TOP in documentation (double/ternary/other byte NOPs depending on mode).
- Flags: generally unaffected (N Z C I D V unspecified in the brief listing).

**JAM (KIL/HLT)**
- Effect: Permanently freezes the CPU; execution does not continue until a system reset. Known as JAM/KIL/HLT.
- Opcodes that invoke this behavior:
  - 02
  - 12
  - 22
  - 32
  - 42
  - 52
  - 62
  - 72
  - 92
  - B2
  - D2
  - F2

**Stability and hardware caveats**
- Several store-type illegal opcodes conditionally use the high byte of the effective address plus one (H+1) as a mask; some silicon revisions drop the mask or use other high-byte values. Expect behavior variations on real chips versus emulators.
- Page boundary crossing effects: some absolute,X / absolute,Y / (indirect),Y addressing modes may not calculate high byte as expected, producing inconsistent results on certain stepping of 6502 silicon.
- The "†" footnote appears next to some cycle counts, indicating that an additional cycle is required if a page boundary is crossed during the instruction's execution.

## Source Code

## Mnemonics
- SLO
- ASO
- SRE
- LSE
- TAS
- XAS
- SHS
- SHY
- A11
- SYA
- SAY
- USBC
- DOP
- TOP
- JAM
- KIL
- HLT
