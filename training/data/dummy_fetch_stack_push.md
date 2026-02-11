# NMOS 6510 — Dummy Fetch Behavior for Stack Push Operations (PHA, PHP)

**Summary:** This document details the cycle-by-cycle behavior of the NMOS 6510/6502 microprocessor during stack push instructions (PHA, PHP). It highlights the dummy read operation from PC+1 during these instructions and provides a comprehensive timing table for PHA/PHP. Additionally, it includes the complete cycle sequence for the RTI instruction and clarifies the previously ambiguous fragment lines. For related dummy-fetch behaviors in JSR, RTS, and RTI instructions, refer to "stack_jsr_dummy_fetches."

**Description**

On the NMOS 6510/6502, single-byte stack push instructions (PHA, PHP) execute a three-cycle sequence:

1. **Cycle 1 — Opcode Fetch:** The CPU fetches the instruction opcode from the address pointed to by the program counter (PC).
2. **Cycle 2 — Dummy Read:** The CPU performs a read from PC+1 (the subsequent program byte). This read is a dummy fetch; the data read is ignored and serves only internal timing purposes.
3. **Cycle 3 — Stack Write:** The CPU writes the value (A for PHA, processor status for PHP) to the stack at address $0100 + S, then decrements the stack pointer (S).

The dummy PC+1 fetch is characteristic of the 6502 NMOS behavior for several stack and subroutine-related operations; it does not alter program flow and is not used as the value to push. Related dummy-fetch patterns for JSR, RTS, and RTI differ and are discussed in "stack_jsr_dummy_fetches."

**Cycle-by-Cycle Timing for PHA/PHP**

The following table provides a detailed breakdown of the cycles involved in the PHA and PHP instructions:

| Cycle | Address Bus | Data Bus | R/W | Description                         |
|-------|-------------|----------|-----|-------------------------------------|
| 1     | PC          | Opcode   | R   | Fetch opcode                        |
| 2     | PC+1        |          | R   | Dummy read (data ignored)           |
| 3     | $0100 + S   | A or P   | W   | Write A (PHA) or P (PHP) to stack; decrement S |

*Note: 'R' denotes a read operation; 'W' denotes a write operation.*

**RTI Cycle Sequence**

The RTI (ReTurn from Interrupt) instruction restores the processor status and program counter from the stack. It operates over six cycles as follows:

| Cycle | Address Bus | Data Bus | R/W | Description                         |
|-------|-------------|----------|-----|-------------------------------------|
| 1     | PC          | $40      | R   | Fetch RTI opcode                    |
| 2     | PC+1        |          | R   | Dummy read (data ignored)           |
| 3     | $0100 + S+1 | P        | R   | Pull processor status from stack    |
| 4     | $0100 + S+2 | PCL      | R   | Pull low byte of return address     |
| 5     | $0100 + S+3 | PCH      | R   | Pull high byte of return address    |
| 6     | PCH:PCL     | Opcode   | R   | Fetch next instruction opcode       |

*Note: PCL and PCH represent the low and high bytes of the program counter, respectively.*

**Clarification of Fragment Lines**

The previously ambiguous fragment lines beginning with "W 6 VA ..." refer to the write operations during the interrupt sequence, specifically the storage of the return address and processor status on the stack. These lines correspond to the cycles where the CPU writes the processor status and program counter to the stack during an interrupt.

**Timing Diagram for PHA/PHP**

Below is an ASCII representation of the timing diagram for the PHA and PHP instructions:

## Source Code
```text
Cycle: 1
Address Bus: PC
Data Bus: Opcode
Operation: Fetch opcode

Cycle: 2
Address Bus: PC+1
Data Bus: (Ignored)
Operation: Dummy read

Cycle: 3
Address Bus: $0100 + S
Data Bus: A (for PHA) or P (for PHP)
Operation: Write to stack; decrement S
```

*Note: This diagram illustrates the sequence of operations and bus activities during the execution of PHA and PHP instructions.*

## Key Registers

- **$0100-$01FF**: Stack memory area (S points to the current top of the stack).
- **S**: Stack pointer register.
- **A**: Accumulator register.
- **P**: Processor status register.

## References

- "stack_jsr_dummy_fetches" — Discusses dummy fetch behaviors in JSR, RTS, and RTI instructions.
- "6502 Instruction Set" — Provides detailed information on 6502 instructions and their behaviors.
- "Visual6502wiki/6502 Timing of Interrupt Handling" — Offers insights into the timing of interrupt handling on the 6502 processor.

## Mnemonics
- PHA
- PHP
- RTI
