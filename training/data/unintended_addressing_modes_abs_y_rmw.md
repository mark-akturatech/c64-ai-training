# NMOS 6510 — Unintended Absolute,Y Indexed R-M-W for Several Undocumented Opcodes (DCP/ISC/RRA/RLA/SLO/SRE)

**Summary:** Describes an unintended 3-byte, 7-cycle Absolute,Y indexed Read-Modify-Write (R-M-W) sequence observed for undocumented opcodes DCP, ISC, RRA, RLA, SLO, and SRE. Includes per-cycle bus operations and a simulation link. Notes that the legal equivalent R-M-W form is Absolute,X indexed for some instructions.

**Description**

Several undocumented 6502/6510 opcodes (DCP, ISC, RRA, RLA, SLO, SRE) exhibit an unintended addressing mode that behaves like a 3-byte Absolute,Y indexed R-M-W sequence executed in 7 CPU cycles. The per-cycle bus operations for this sequence are detailed below, including opcode fetch, low/high address operand fetches, a read before the high-byte correction, two reads of the old data, and a final write of the new data. A simulator snapshot is provided to reproduce the exact timing.

The legal equivalent mode for these undocumented behaviors is the Absolute,X indexed R-M-W form, which is the valid, documented R-M-W addressing mode used by ASL, LSR, ROL, ROR, INC, and DEC when indexed.

Simulation: [Visual 6502 Simulator](http://visual6502.org/JSSim/expert.html?graphics=f&a=0&steps=22&d=a0d0db10eaeaeaeaeaeaeaeaeaeaeaea1280)

Listed opcodes exhibiting this behavior:

- DCP abs, y
- ISC abs, y
- RRA abs, y
- RLA abs, y
- SLO abs, y
- SRE abs, y

Legal documented R-M-W instructions:

- ASL abs, x
- DEC abs, x
- INC abs, x
- LSR abs, x
- ROL abs, x
- ROR abs, x

## Source Code

```text
Simulation Link:
http://visual6502.org/JSSim/expert.html?graphics=f&a=0&steps=22&d=a0d0db10eaeaeaeaeaeaeaeaeaeaeaea1280

Equivalent legal mode: Absolute X Indexed (R-M-W)
• 3 bytes, 7 cycles
ASL abs, x
DEC abs, x
INC abs, x
LSR abs, x
ROL abs, x
ROR abs, x

Opcode Mnemonics:
DCP abs, y
ISC abs, y
RRA abs, y
RLA abs, y
SLO abs, y
SRE abs, y

Cycle   Address-Bus                Data-Bus                           Read/Write
1       PC                         Opcode fetch                        R
2       PC + 1                     Absolute Address Low                R
3       PC + 2                     Absolute Address High               R
4       < AAH, AAL + Y >           Byte at target address before high byte was corrected   R
5       AA + Y                     Old Data                            R
6       AA + Y                     Old Data                            W
7       AA + Y                     New Data                            W
```

## References

- "dcp_opcode_variants_table" — expands on DCP variants in this unintended addressing mode mapping
- "isc_opcode_variants_and_examples" — expands on ISC in this unintended abs,Y R-M-W mapping

## Mnemonics
- DCP
- ISC
- RRA
- RLA
- SLO
- SRE
- ASL
- DEC
- INC
- LSR
- ROL
- ROR
