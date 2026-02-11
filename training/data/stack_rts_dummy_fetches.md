# NMOS 6510 — RTS (Return from Subroutine) Cycle Behaviour

**Summary:** Detailed cycle-by-cycle analysis of the NMOS 6510/6502 RTS instruction, including timing, bus activity, and stack pointer behavior. This includes opcode fetch, dummy fetches, stack pulls, program counter increment, and final dummy fetch from the target PC. Each cycle is annotated with stack pointer values and dummy read indications.

**Cycle-by-Cycle Description**

The RTS instruction (opcode $60) on the NMOS 6510/6502 processor completes a subroutine return by pulling the 16-bit return address from the stack, incrementing it, and resuming execution at the incremented address. The processor performs several dummy reads during this process; these reads do not affect program state but appear on the address/data buses.

Behavior summary:

- **JSR Instruction Behavior:** The JSR instruction pushes the address of the next instruction minus one onto the stack. Therefore, the stack contains the return address minus one. RTS pulls these two bytes (low then high), forms a 16-bit value, increments it, and sets the program counter (PC) to this result. Thus, the value read from the stack is (final_PC - 1).
- **Dummy Reads:** Occur before and after the stack pulls. These are for timing purposes; the data read is ignored.
- **Stack Operations:** The stack operates within page $01 ($0100–$01FF). During the pull sequence, the stack pointer (S) is adjusted to retrieve the bytes previously pushed by JSR.

Canonical NMOS cycle count: 6 clock cycles. Read cycles are labeled 'R'. Dummy reads are explicitly marked below.

## Source Code

```text
RTS (0x60) — NMOS 6510 / 6502 — 6 Cycles

Cycle | Address Bus           | Data Bus       | R/W | Stack Pointer (S) | Notes
--------------------------------------------------------------------------------
1     | PC                    | $60            | R   | S                 | Opcode fetch (real)
2     | PC + 1                | (ignored)      | R   | S                 | Dummy read from PC+1 (*1)
3     | $0100 + S             | (ignored)      | R   | S                 | Dummy read from stack (*2)
4     | $0100 + S + 1         | PCL (low byte) | R   | S + 1             | Pull low byte from stack
5     | $0100 + S + 2         | PCH (high byte)| R   | S + 2             | Pull high byte from stack
6     | new PC (pulled + 1)   | (ignored)      | R   | S + 2             | Final dummy fetch from target PC

Legend:
- (*1) Dummy read from PC+1: Performed for timing; data ignored.
- (*2) Dummy read from stack: Internal housekeeping read; stack pointer not yet adjusted.
- The actual bytes pulled from the stack (cycles 4 and 5) are the low and high bytes of the 16-bit value JSR pushed; RTS then increments the combined value and resumes at that address + 1.
```

## Key Registers

- **Stack Pointer (S):** Adjusted during the pull sequence to retrieve the correct return address bytes.

## References

- "MCS6500 Microcomputer Family Programming Manual" — Detailed explanation of JSR and RTS instructions, including stack behavior and cycle-by-cycle operations. ([syncopate.us](https://syncopate.us/books/Synertek6502ProgrammingManual.html?utm_source=openai))
- "MOS 6502 - CPCWiki" — Provides additional insights into 6502 instruction timing and behavior. ([cpcwiki.eu](https://www.cpcwiki.eu/index.php/MOS_6502?utm_source=openai))

## Mnemonics
- RTS
