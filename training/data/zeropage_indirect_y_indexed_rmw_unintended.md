# NMOS 6510 — Unintended Zeropage Indirect Y Indexed (R‑M‑W) undocumented opcodes (D3,F3,33,73,13,53)

**Summary:** Unofficial NMOS 6510 opcodes D3, F3, 33, 73, 13, and 53 utilize the Zeropage Indirect Y Indexed addressing mode ((zp),Y) to perform read-modify-write (R‑M‑W) operations on target memory. These opcodes correspond to the undocumented instructions DCP, ISC, RLA, RRA, SLO, and SRE, respectively. This document provides a detailed 8-cycle breakdown of their execution, highlighting per-cycle bus actions and the specific operations performed.

**Description**

These undocumented 6510 opcodes are two bytes in length: the opcode followed by a zero-page pointer. The execution sequence is as follows:

1. Fetch the opcode.
2. Fetch the zero-page pointer.
3. Read the low byte of the target address from the zero-page pointer.
4. Read the high byte of the target address from the zero-page pointer plus one.
5. Add the Y register to the low byte of the target address, accounting for any carry into the high byte.
6. Perform a dummy read from the effective address.
7. Modify the data at the effective address.
8. Write the modified data back to the effective address.

This behavior mirrors the legal (zp),Y addressing mode for pointer fetching but differs by performing a modifying instruction that executes a read-modify-write on the final target byte.

Opcode-to-mnemonic mappings:

- $D3 → DCP
- $F3 → ISC
- $33 → RLA
- $73 → RRA
- $13 → SLO
- $53 → SRE

These instructions are 2 bytes in size and execute in 8 cycles.

## Source Code

```text
Cycle-by-cycle breakdown for undocumented opcodes D3, F3, 33, 73, 13, 53 using Zeropage Indirect Y Indexed (R-M-W) addressing mode:

Cycle | Address Bus | Data Bus | Read/Write | Description
------|-------------|----------|------------|------------
1     | PC          | Opcode   | Read       | Fetch opcode
2     | PC + 1      | Pointer  | Read       | Fetch zero-page pointer
3     | Pointer     | AAL      | Read       | Read low byte of target address
4     | Pointer + 1 | AAH      | Read       | Read high byte of target address
5     | AAL + Y     | Data     | Read       | Dummy read from effective address
6     | AAL + Y     | Data     | Read       | Read data from effective address
7     | AAL + Y     | Data     | Write      | Write modified data to effective address
8     | AAL + Y     | Data     | Write      | Write final data to effective address
```

In this sequence:

- AAL and AAH represent the low and high bytes of the absolute address, respectively.
- The dummy read in cycle 5 accounts for potential page boundary crossings.
- The modify operation in cycle 7 depends on the specific opcode:
  - DCP ($D3): Decrement memory and compare with accumulator.
  - ISC ($F3): Increment memory and subtract from accumulator with borrow.
  - RLA ($33): Rotate memory left and AND with accumulator.
  - RRA ($73): Rotate memory right and add to accumulator.
  - SLO ($13): Shift memory left and OR with accumulator.
  - SRE ($53): Shift memory right and XOR with accumulator.

For a visual simulation of this sequence, refer to the Visual6502 JSSim link:

http://visual6502.org/JSSim/expert.html?graphics=f&a=0&steps=22&d=a0d0d310eaeaeaeaeaeaeaeaeaeaeaea1280

## References

- "No More Secrets: NMOS 6510 Unintended Opcodes" by Christian Bauer
- Visual6502 JSSim: http://visual6502.org/JSSim/expert.html?graphics=f&a=0&steps=22&d=a0d0d310eaeaeaeaeaeaeaeaeaeaeaea1280

## Mnemonics
- DCP
- ISC
- RLA
- RRA
- SLO
- SRE
