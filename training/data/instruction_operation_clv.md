# 6502 CLV — Clear Overflow Flag

**Summary:** CLV is a 6502 implied-mode instruction that clears the processor status overflow flag (V = 0). This node contains the minimal pseudocode representation of the operation.

## Operation
Clears the processor status overflow flag (V). No operands — implied addressing. The instruction's sole effect is to set the V flag to 0.

## Source Code
```text
/* CLV */
    SET_OVERFLOW((0));
```

## References
- "instruction_tables_clv" — expands on CLV opcode details (opcode byte, cycles, encoding)

## Mnemonics
- CLV
