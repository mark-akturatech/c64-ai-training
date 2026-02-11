# 6502 Relative Addressing (Branch Displacement)

**Summary:** Relative addressing (used by branch instructions like BEQ/BNE/BCC/BCS/BMI/BPL/BVC/BVS) uses a one‑byte signed two's‑complement displacement added to the PC (which points to the next instruction). The 8‑bit displacement encodes offsets in the signed range -128..+127; for larger jumps use the opposite branch to skip a JMP.

## Relative Addressing
- Branch instructions take a single byte displacement (two's complement, 8 bits). Bit 7 = sign (1 = negative, 0 = positive). The value is added to the program counter, which already points to the next instruction before the displacement is applied.
- Effective offset range: -128..+127 bytes relative to the address of the following instruction.
- Branches test a status flag (Zero, Carry, Negative, Overflow); if the tested condition is true the displacement is applied, otherwise execution continues at the next instruction.
- Important calculation detail: the PC used for the addition points to the byte following the branch opcode+operand sequence (i.e., the address of the next instruction) before adding the signed displacement. Account for instruction length when computing targets.
- If you need to reach a target farther than the signed 8‑bit displacement allows, use the opposite condition to skip an unconditional JMP to the distant target (the classic "opposite-branch + JMP" technique).

**[Note: Source may contain an error — the example binary 10100111 ($A7) in the original text is decimal 167, which as signed 8‑bit two's‑complement equals -89 (not -39). Also the correct signed 8‑bit range is -128..+127.]**

## Source Code
```text
eg  bit no.  7 6 5 4 3 2 1 0    signed value          unsigned value
    value    1 0 1 0 0 1 1 1    -39                   $A7
    value    0 0 1 0 0 1 1 1    +39                   $27

Instruction example:
  BEQ $A7
  $F0 $A7
```

## References
- "branch_instructions_behavior" — expands on BCC, BCS, BEQ, BNE, BMI, BPL, BVC, BVS timing and page‑cross penalty

## Mnemonics
- BCC
- BCS
- BEQ
- BNE
- BMI
- BPL
- BVC
- BVS
