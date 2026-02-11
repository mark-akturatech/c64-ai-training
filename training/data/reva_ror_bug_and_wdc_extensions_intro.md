# 6502 Instruction Set — Rev. A "ROR bug" and W65C02 extensions

**Summary:** Historical note on the Rev. A 6502 "ROR bug" (Sep 1975–Jun 1976) where ROR was not implemented and behaved like an ASL that did not update the carry; and a brief summary of WDC W65C02(S) CMOS extensions (69 instructions, 16 address modes, new zero-page indirect and absolute-indexed-indirect modes).

**Rev. A 6502: ROR bug (historical)**
The Rev. A NMOS 6502 (manufactured Sep 1975–Jun 1976) did not implement the ROR instruction: the control lines needed for ROR were missing from the silicon, so ROR was effectively illegal/undocumented on those chips. In Rev. B this instruction was implemented.

Behavior on Rev. A (observed):
- Operation: behaves like ASL (logical left shift) — bits are shifted left; a zero is shifted into bit0.
- Carry: NOT updated (no connection to the carry line).
- Flags: N (negative) and Z (zero) are updated correctly for the result; C (carry) remains unchanged.
- Representation (semantic):
  - Binary transform: [76543210] <- 0  (MSB shifted left, 0 enters LSB)
  - Flags after operation: N and Z valid; C unchanged
- Summary line from source: "As ASL, but does not update the carry. N and Z flags are set correctly for the operation performed."

**WDC W65C02(S) extensions (summary)**
- CMOS static design (WDC); fully static operation allows clock to be halted.
- Instruction count: 69 documented instructions.
- Addressing modes: 16 address modes (adds new modes vs NMOS 6502).
- Notable new address modes:
  - Zero-page indirect: (zp) — syntax: `LDA ($LL)` — an indirect through a zero-page pointer without the high-byte page wrap behavior of absolute indirect.
  - Absolute indexed indirect: (abs,X) — syntax: `JMP ($LLHH,X)` — an absolute (16-bit) address that is then indexed/indirected.

**JAM (KIL/HLT) instructions**
- Effect: freeze the CPU; processor remains trapped infinitely in T1 phase with $FF on the data bus; a reset is required to recover.
- Instruction codes: 02, 12, 22, 32, 42, 52, 62, 72, 92, B2, D2, F2

**Notes on illegal/undocumented instructions**
- Many "illegal" instructions arise from executing both slot sub-operations (c=1 and c=2) in a multi-instruction slot, producing combined effects. Example: SAX absolute ($8F) can be seen as STA abs ($8D) + STX abs ($8E) executed in the same slot.
- The Rev. A ROR case is a silicon omission rather than just an undocumented opcode mapping.

## Source Code

## Mnemonics
- ROR
- JAM
- KIL
- HLT
