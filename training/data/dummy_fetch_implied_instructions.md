# NMOS 6510 — Dummy Fetch for Implied-Mode Instructions & BRK Stack Sequence

**Summary:** The NMOS 6510 microprocessor performs a dummy read of the byte following the opcode (PC+1) for single-byte implied-mode instructions (e.g., CLC, CLD, CLI, CLV, DEX, DEY, INX, INY, NOP, SEC, SED, SEI, TAX, TAY, TSX, TXA, TYA, TXS). The BRK (software interrupt) instruction executes a dummy read of PC+1 on cycle 2, then pushes the program counter high byte, low byte, and the status register onto the stack.

**Dummy Read Behavior for Implied-Mode Single-Byte Instructions**

For the following single-byte implied-mode instructions, the NMOS 6510 performs a dummy read of the next byte (PC+1) immediately after fetching the opcode:

- CLC, CLD, CLI, CLV, DEX, DEY, INX, INY, NOP, SEC, SED, SEI, TAX, TAY, TSX, TXA, TYA, TXS

This dummy read is a bus operation with no effect on memory contents and is commonly referred to as a "fetch after opcode" or dummy fetch. This behavior is inherent to the NMOS 6502/6510 timing and affects bus activity and cycle-level traces without altering program semantics.

### Per-Cycle Sequence for Implied-Mode Single-Byte Instructions

The execution of these instructions involves the following cycles:

1. **Cycle 1:** Fetch opcode from address PC.
2. **Cycle 2:** Dummy read from address PC+1.

This sequence is consistent across all single-byte implied-mode instructions listed above.

**BRK (Software Interrupt) Per-Cycle Stack Push Sequence**

The BRK instruction executes as follows:

1. **Cycle 1:** Fetch opcode from address PC.
2. **Cycle 2:** Dummy read from address PC+1 (the byte following the opcode, often referred to as the "signature").
3. **Cycle 3:** Push the high byte of the program counter onto the stack.
4. **Cycle 4:** Push the low byte of the program counter onto the stack.
5. **Cycle 5:** Push the status register onto the stack.
6. **Cycle 6:** Fetch the low byte of the interrupt vector from address $FFFE.
7. **Cycle 7:** Fetch the high byte of the interrupt vector from address $FFFF.

The pushes occur as writes to $0100 + S (stack page), decrementing S appropriately; the order is PC high, PC low, then status.

## Source Code

```text
NMOS 6510 - Dummy Fetch Behavior for Implied-Mode Instructions
(CLC, CLD, CLI, CLV, DEX, DEY, INX, INY, NOP, SEC, SED, SEI, TAX, TAY, TSX, TXA, TYA, TXS):
After opcode fetch, the CPU performs a dummy read of PC+1.

Per-Cycle Sequence for Implied-Mode Single-Byte Instructions:

Cycle   Address Bus    Data Bus    Read/Write    Description
1       PC             Opcode      Read          Fetch opcode
2       PC+1           -           Read          Dummy read (fetch after opcode)

BRK (Software Interrupt) Per-Cycle Stack Push Sequence:

Cycle   Address Bus    Data Bus    Read/Write    Description
1       PC             $00         Read          Fetch opcode
2       PC+1           -           Read          Dummy read (fetch after opcode)
3       $0100 + S      PCH         Write         Push PC high byte
4       $0100 + S-1    PCL         Write         Push PC low byte
5       $0100 + S-2    P           Write         Push status register
6       $FFFE          PCL'        Read          Fetch interrupt vector low byte
7       $FFFF          PCH'        Read          Fetch interrupt vector high byte
```

## References

- "dummy_fetch_single_byte_accumulator_ops" — expands on single-byte accumulator/op fetch behavior

## Mnemonics
- CLC
- CLD
- CLI
- CLV
- DEX
- DEY
- INX
- INY
- NOP
- SEC
- SED
- SEI
- TAX
- TAY
- TSX
- TXA
- TYA
- TXS
- BRK
