# 6502 Branch Instructions, BIT and BRK (opcodes, cycles, flags)

**Summary:** Branch opcodes (BCC/BCS/BEQ/BMI/BNE/BPL/BVC/BVS) with relative addressing, signed 8-bit offset, and cycle timing (2 / 3 / 4 cycles). BIT instruction forms ($24 zeropage, $2C absolute) — A AND M affects Z, copies M7->N and M6->V. BRK ($00) behavior: pushes PC+2 and SR (B flag set in pushed SR), vector to $FFFE/$FFFF, sets I flag, and timing.

**Branch instructions (conditional branches)**

- **Addressing:** Relative (signed 8-bit offset added to PC+2).
- **Base encoding:** 1 opcode byte + 1 operand byte (2 bytes total).
- **Timing (6502):**
  - Branch not taken: 2 cycles.
  - Branch taken (target on same page): 3 cycles.
  - Branch taken and target crosses a 256-byte page boundary: 4 cycles.
  (Page-cross penalty applies only when branch is taken.)
- **Branch conditions and opcodes:**
  - BPL (Branch on Result Plus): branch if N = 0 — opcode $10 — 2 bytes.
  - BMI (Branch on Result Minus): branch if N = 1 — opcode $30 — 2 bytes.
  - BVC (Branch on Overflow Clear): branch if V = 0 — opcode $50 — 2 bytes.
  - BVS (Branch on Overflow Set): branch if V = 1 — opcode $70 — 2 bytes.
  - BCC (Branch on Carry Clear): branch if C = 0 — opcode $90 — 2 bytes.
  - BCS (Branch on Carry Set): branch if C = 1 — opcode $B0 — 2 bytes.
  - BNE (Branch on Result Not Zero): branch if Z = 0 — opcode $D0 — 2 bytes.
  - BEQ (Branch on Result Equal): branch if Z = 1 — opcode $F0 — 2 bytes.

**Notes:**
- The offset is a signed 8-bit value and is added to the address of the next instruction (PC+2) to form the target.
- The extra cycle for page crossing arises from adding the signed offset crossing a 256-byte boundary.

**BIT (Bit Test)**

- **Operation:** Performs A AND M (result is not stored), sets flags:
  - Z = 1 if (A & M) == 0, else Z = 0
  - N = bit 7 of M (M7)
  - V = bit 6 of M (M6)
- BIT does not change A, C, I, or D.
- **Forms, opcodes, sizes, and cycles:**
  - BIT zeropage: opcode $24 — 2 bytes — 3 cycles.
  - BIT absolute: opcode $2C — 3 bytes — 4 cycles.
- **Common use:** Test specific bits in memory while also preserving the accumulator.

**BRK (Force Break / software interrupt)**

- **Opcode:** $00 — 1 byte — 7 cycles (6502).
- **Behavior:**
  - Acts as a software interrupt. When executed, the CPU:
    - Increments PC by 2 and pushes the return address (PC+2) onto the stack (high byte then low byte).
    - Pushes the status register (SR) onto the stack with the Break flag set in the pushed copy.
    - Loads the interrupt vector from $FFFE/$FFFF into PC (jump to IRQ/BRK vector).
    - Sets the Interrupt Disable flag (I) so that further maskable interrupts are disabled.
  - When SR is later pulled by RTI, the Break flag in the pulled SR is ignored by the hardware (the B bit is not a physical processor status flag in the same way as N/Z/C...).
- **Return path:** RTI (ReTurn from Interrupt) restores SR and the pushed PC (so execution resumes at the saved PC).

## Source Code
```text
Opcode summary (branches, BIT, BRK)

Instruction  Opcode  Bytes  Cycles (not taken / taken / taken+page)
BPL          $10     2      2 / 3 / 4
BMI          $30     2      2 / 3 / 4
BVC          $50     2      2 / 3 / 4
BVS          $70     2      2 / 3 / 4
BCC          $90     2      2 / 3 / 4
BCS          $B0     2      2 / 3 / 4
BNE          $D0     2      2 / 3 / 4
BEQ          $F0     2      2 / 3 / 4

BIT zp       $24     2      3      ; A AND M -> Z, N<-M7, V<-M6
BIT abs      $2C     3      4

BRK          $00     1      7      ; push PC+2, push SR (B=1 in pushed copy), vector $FFFE/$FFFF
```

## Key Registers
- (none) — this chunk documents instructions and opcodes, not memory-mapped hardware registers.

## References
- "conditional_branching_and_interrupts" — expands on branch/interrupt interactions and timing
- "bit_test_and_practical_examples" — expands on BIT usage and examples