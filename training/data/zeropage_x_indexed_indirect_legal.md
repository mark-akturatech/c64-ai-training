# NMOS 6510 — Zeropage Indirect,Y (R-M-W) Addressing and Unofficial Opcodes

**Summary:** This document details the NMOS 6510's Zeropage Indirect Y addressing mode when utilized by read-modify-write (R-M-W) unofficial opcodes (D3, F3, 33, 73, 13, 53). It covers the operand length (2 bytes), cycle count (8 cycles), and provides a per-cycle breakdown of bus activity, including the modify and write-back phases.

**Description**

This document examines the (zp),Y addressing mode as employed by R-M-W unofficial instructions. These instructions have a 2-byte operand and execute in 8 cycles. The cycle-by-cycle table below outlines the opcode and operand fetches, the indirection reads of the low and high bytes from the zero page address and zero page address plus one, and the subsequent reads and writes at the final absolute address offset by the Y register.

The specific unofficial opcodes that invoke R-M-W behaviors in the (zp),Y form include:

- DCP (opcode $D3)
- ISC (opcode $F3)
- RLA (opcode $33)
- RRA (opcode $73)
- SLO (opcode $13)
- SRE (opcode $53)

The table below provides a detailed breakdown of the address bus, data bus, and read/write operations for each cycle, including the modify and write-back phases.

## Source Code

```text
Zeropage Indirect Y Indexed (R-M-W)
• 
2 bytes, 8 cycles

D3 zp
F3 zp
33 zp
73 zp
13 zp
53 zp

DCP (zp), y
ISC (zp), y
RLA (zp), y
RRA (zp), y
SLO (zp), y
SRE (zp), y
```

```text
Cycle   Address-Bus      Data-Bus                                    Read/Write
1       PC               Opcode fetch                                 R
2       PC + 1           Direct Offset                                R
3       DO               Absolute Address Low                         R
4       DO + 1           Absolute Address High                        R
5       < AAH, AAL + Y > Byte at target address before high byte was corrected  R
6       AA + Y           Old Data                                     R
7       AA + Y           Modified Data                                W
8       AA + Y           Modified Data                                W
```

In this sequence:

- **Cycle 1:** Fetch the opcode from the program counter (PC).
- **Cycle 2:** Fetch the zero-page address (Direct Offset) from PC + 1.
- **Cycle 3:** Read the low byte of the absolute address from the zero-page address.
- **Cycle 4:** Read the high byte of the absolute address from the zero-page address plus one.
- **Cycle 5:** Perform a dummy read from the address formed by combining the high byte and the low byte plus Y, before correcting the high byte if a page boundary is crossed.
- **Cycle 6:** Read the original data from the effective address (AA + Y).
- **Cycle 7:** Write the modified data back to the effective address.
- **Cycle 8:** Perform a second write of the modified data to the effective address.

This cycle breakdown ensures that the read-modify-write operation is completed correctly, even when crossing page boundaries.

## References

- "NMOS 6510 Unintended Opcodes — No More Secrets"
- "Visual6502wiki/6502 Timing States - NESdev Wiki"
- "6502 Instruction Set"

## Mnemonics
- DCP
- DCM
- ISC
- ISB
- INS
- RLA
- RRA
- SLO
- ASO
- SRE
- LSE
