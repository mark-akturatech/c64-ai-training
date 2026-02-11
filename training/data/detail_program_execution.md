# MACHINE — LDA absolute multi-fetch trace (PC $033C -> effective address $0380)

**Summary:** Step-by-step 6502 execution trace showing opcode fetch at $033C ($AD), two-byte operand fetch ($80,$03) forming little-endian address $0380, and the subsequent memory read into A; illustrates multi-fetch instruction behavior and PC advancement.

## Program Execution
1. The CPU issues a read at address $033C and receives byte $AD. The CPU decodes $AD as the opcode LDA (absolute addressing), which requires a two-byte operand (16-bit address).

2. The CPU performs two additional memory reads to fetch the operand bytes:
   - Read at $033D → $80 (low byte)
   - Read at $033E → $03 (high byte)
   These bytes are combined little-endian (low byte first) to form the effective address $0380.

3. After fetching opcode and operand bytes, the program counter (PC) has advanced to $033F (pointing to the next instruction). The CPU now executes LDA $0380: it places $0380 on the address bus, reads the memory at $0380 (for example $11), and loads that value into the A register. After this memory read, A contains $11.

4. The CPU is ready for the next instruction. The PC ($033F) is placed on the address bus for the next opcode fetch and program execution continues.

Notes:
- The sequence shows the multi-fetch nature of multi-byte instructions: opcode fetch, operand byte fetches, then execution memory access.  
- PC points to the next instruction ($033F) once the opcode+operand bytes have been fetched, before the instruction's effective-address memory read occurs.

## Source Code
```asm
; Example memory layout used in the trace
        .org $033C
        .byte $AD, $80, $03   ; $033C: AD 80 03  -> LDA $0380 (absolute)

        .org $0380
        .byte $11             ; $0380: data read by LDA -> loads $11 into A
```

## References
- "instruction_execution_fetch_cycle" — expands on the general fetch–execute cycle and timing of opcode/operand/memory accesses
- "preparing_and_running_program" — covers the example program setup and starting execution with .G $033C

## Mnemonics
- LDA
