# Instruction Fetch / Execute Cycle (Machine)

**Summary:** Describes the 650x fetch/execute cycle: the Program Counter (PC) places an address on the address bus, the PC increments, memory returns the instruction on the data bus, the CPU executes it, and the cycle repeats; covers sequential execution and the effect of branch/jump instructions on the PC.

## Instruction Fetch/Execute Cycle
When the CPU is running, the PC contains the address of the next instruction to fetch. On each cycle the CPU:

1. Places the address held in the PC onto the address bus as a memory read.
2. Increments the PC (so it now points to the following byte/address).
3. Reads the byte returned on the data bus and interprets it as an instruction opcode.
4. Executes the instruction; after execution the fetch cycle repeats using the value currently in the PC.

Example (from source): if PC=$1234 when the processor is started, $1234 is driven on the address bus while the PC is incremented to $1235; the byte read from $1234 is taken as the instruction to execute, then the next fetch will use $1235 (PC will be incremented to $1236 after that fetch).

Branching / jumps: if the instruction executed modifies the PC (branch, jump, call, return), the next fetch will use the modified PC instead of the sequentially incremented value (branching: instruction that changes PC).

## Source Code
```text
              +-----------+             +--------------+
              |    PC     |             |    PC        |
              | +-------+ |             | +-------+    |
              | | $1234 | |ADDRESS      | | $1235 |    |ADDRESS
              | +-------+ |BUS          | +-------+    |BUS
              |     \     |--------     |              |--------
              |      ---> |   ->        |     $1234--->|   ->
              |           |--------     |              |--------
              |           |             |              |
              |           |             |              |DATA
              |           |             |              |BUS
              |           |             |              |--------
              |           |             |INSTRUCTION<--|   <-
              |           |             |              |--------
              |           |             |              |
              +-----------+             +--------------+

              Figure 1.6  Arrow to address bus
```

## Key Registers
- PC - Program Counter (6502) - holds address of next instruction; its contents are placed on the address bus during fetch and incremented after the address is issued.

## References
- "microprocessor_registers" — expands on PC behavior and the register set
- "detail_program_execution" — step-by-step walk-through of executing the sample program