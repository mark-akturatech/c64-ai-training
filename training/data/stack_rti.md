# NMOS 6510 — RTI / Reset-Cycle Observations (Opcode & Dummy Fetches, Stack Pops, Vector Reads)

**Summary:** This document details the cycle-by-cycle behavior of the NMOS 6510 CPU during the execution of the RTI (Return from Interrupt) instruction and the reset sequence. It includes opcode fetches, dummy fetches, stack operations (pushes and pops), and vector address reads.

**RTI Instruction Cycle Sequence**

The RTI instruction is used to return from an interrupt by restoring the processor status and program counter from the stack. The cycle sequence for RTI is as follows:

1. **Cycle 1:** Fetch opcode from the program counter (PC).
2. **Cycle 2:** Dummy fetch from PC+1.
3. **Cycle 3:** Pull processor status from the stack (address SP+1).
4. **Cycle 4:** Pull program counter low byte from the stack (address SP+2).
5. **Cycle 5:** Pull program counter high byte from the stack (address SP+3).

After these cycles, the processor resumes execution at the restored program counter address with the restored status register.

**Reset Sequence Cycle Observations**

During a reset, the 6510 CPU performs a specific sequence of operations:

1. **Cycle 1:** Fetch from address $FFFC (low byte of reset vector).
2. **Cycle 2:** Fetch from address $FFFD (high byte of reset vector).
3. **Cycle 3:** Initialize internal registers and set the program counter to the address obtained from the reset vector.

Notably, during the reset sequence, the R/W line remains high, indicating that the CPU does not perform any write operations to the stack or memory.

## Source Code

```text
RTI Instruction Cycle Sequence:

Cycle | Address Bus | Data Bus           | R/W | Description
------|-------------|--------------------|-----|------------------------------
1     | PC          | Opcode ($40)       | R   | Fetch RTI opcode
2     | PC+1        | (Unused)           | R   | Dummy fetch
3     | SP+1        | Status Register    | R   | Pull status register from stack
4     | SP+2        | PCL (Low Byte)     | R   | Pull program counter low byte
5     | SP+3        | PCH (High Byte)    | R   | Pull program counter high byte

Reset Sequence Cycle Observations:

Cycle | Address Bus | Data Bus           | R/W | Description
------|-------------|--------------------|-----|------------------------------
1     | $FFFC       | PCL (Low Byte)     | R   | Fetch reset vector low byte
2     | $FFFD       | PCH (High Byte)    | R   | Fetch reset vector high byte
3     | Internal    | Internal Operations| -   | Initialize registers, set PC
```

## Key Registers

- **Program Counter (PC):** Holds the address of the next instruction to be executed.
- **Stack Pointer (SP):** Points to the current position in the stack.
- **Status Register:** Contains flags that represent the state of the processor.

## References

- "NMOS 6510 Unintended Opcodes — No More Secrets"
- "MOS Technology 6510 — Raw Silicon 0.1 Documentation"
- "MOS Technology 6502/6510 Instruction Set"

## Mnemonics
- RTI
