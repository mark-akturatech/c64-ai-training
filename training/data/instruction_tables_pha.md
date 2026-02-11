# 6502 PHA (Push Accumulator on Stack)

**Summary:** PHA pushes the accumulator (A) onto the processor stack at page $0100. Implied addressing, opcode $48, 1 byte, 3 cycles, does not affect processor flags (N, Z, C, I, D, V).

## Description
PHA stores the current A register value onto the hardware stack (addresses $0100–$01FF) and updates the stack pointer (S). The stack on the 6502 grows downward: the byte is written to address $0100 + S, then S is decremented (wraps from $00 to $FF). The instruction is 1 byte long and requires 3 clock cycles.

Flag effects:
- N Z C I D V — unchanged (no flags are affected)

Operation (concise): A -> (S)

Addressing mode: Implied

Opcode: $48 (hex), 72 (decimal)

Bytes: 1

Cycles: 3

Behavioral notes:
- The push writes a single byte (low 8 bits of A) to the stack page.
- After the write, S := S - 1 (8-bit wrap).
- Typical use: save A across subroutine calls or interrupts; pair with PLA to restore.

## Source Code
```asm
; Single-byte opcode
PHA         ; opcode $48

; Example usage (assembly)
LDA #$7F
PHA         ; push 0x7F onto stack
; ... other code ...
PLA         ; pop value back into A

; Opcode table (from source)
+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
|  Implied       |   PHA                 |    48   |    1    |    3     |
+----------------+-----------------------+---------+---------+----------+

; Operation summary
; Operation:  A toS
; Flags: N Z C I D V = unchanged
```

## References
- "instruction_operation_pha" — expanded pseudocode and operation details  
- "stack_instructions_table" — PHP/PLA/PLP and related stack usage contexts

## Mnemonics
- PHA
