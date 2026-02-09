# 6502: ADC / AND / ASL (opcode tables, flags, cycles)

**Summary:** ADC, AND, and ASL 6502 instruction entries with addressing modes, opcode hex, byte and cycle counts, and flags affected (N Z C I D V). Tables include immediate/zeropage/absolute/indexed/indirect modes and common cycle notes (page-crossing behavior).

## ADC — Add Memory to Accumulator with Carry
Performs A + M + C -> A (carry in). Flags affected: N Z C I D V (negative, zero, carry, interrupt-ignore not affected by ADC, decimal mode affected, overflow). Use of indexed absolute and (indirect),Y modes may add a cycle on page crossing (*).

## AND — Logical AND with Accumulator
Performs A AND M -> A. Flags affected: N Z (negative and zero); other flags unchanged. Indexed absolute and (indirect),Y modes may add a cycle on page crossing (*).

## ASL — Arithmetic Shift Left (memory or accumulator)
Operation: shift each bit left one position; bit 0 is filled with 0, bit 7 shifts into Carry: C <- bit7; result stored in destination. Flags affected: N Z C (negative, zero, carry). Modes supported: accumulator, zeropage, zeropage,X, absolute, absolute,X. Absolute,X may add a cycle on some implementations/conditions.

## Other entries included (branches and BIT)
The chunk also contains brief listings for BCC/BCS/BEQ branch opcodes (relative, 2 bytes) and the BIT zeropage instruction (test bits, sets N and V from bits 7 and 6 of operand and Z from A AND M).

**[Note: * in tables indicates the standard +1 cycle on page boundary crossing for indexed absolute and (indirect),Y addressing modes.]**

## Source Code
```text
ADC  Add Memory to Accumulator with Carry
     A + M + C -> A, C                   N Z C I D V
                                         + + + - - +
     addressing    assembler      opc   bytes cycles
     immediate     ADC #oper      69      2      2
     zeropage      ADC oper       65      2      3
     zeropage,X    ADC oper,X     75      2      4
     absolute      ADC oper       6D      3      4
     absolute,X    ADC oper,X     7D      3      4*
     absolute,Y    ADC oper,Y     79      3      4*
     (indirect,X)  ADC (oper,X)   61      2      6
     (indirect),Y  ADC (oper),Y   71      2      5*

AND  AND Memory with Accumulator
     A AND M -> A                        N Z C I D V
                                          + + - - - -
     addressing    assembler      opc   bytes cycles
     immediate     AND #oper      29      2      2
     zeropage      AND oper       25      2      3
     zeropage,X    AND oper,X     35      2      4
     absolute      AND oper       2D      3      4
     absolute,X    AND oper,X     3D      3      4*
     absolute,Y    AND oper,Y     39      3      4*
     (indirect,X)  AND (oper,X)   21      2      6
     (indirect),Y  AND (oper),Y   31      2      5*

ASL Shift Left One Bit (Memory or Accumulator)
    C <- [76543210] <- 0                 N Z C I D V
                                         + + + - - -
    addressing    assembler       opc   bytes cycles
    accumulator   ASL A           0A       1      2
    zeropage      ASL oper        06       2      5
    zeropage,X    ASL oper,X      16       2      6
    absolute      ASL oper        0E       3      6
    absolute,X    ASL oper,X      1E       3      7

BCC Branch on Carry Clear
    branch on C = 0                      N Z C I D V
                                         - - - - - -
    addressing    assembler       opc   bytes cycles
    relative      BCC oper        90       2      2**

BCS Branch on Carry Set
    branch on C = 1                      N Z C I D V
                                         - - - - - -
    addressing    assembler       opc   bytes cycles
    relative      BCS oper        B0       2      2**

BEQ Branch on Result Zero
    branch on Z = 1                      N Z C I D V
                                         - - - - - -
    addressing    assembler       opc   bytes cycles
    relative      BEQ oper        F0       2      2**

BIT Test Bits in Memory with Accumulator
    bits 7 and 6 of operand are transfered to bit 7 and 6 of SR (N,V);
    the zero-flag is set according to the result of the operand AND
    the accumulator (set, if the result is zero, unset otherwise).
    A AND M -> Z, M7 -> N, M6 -> V       N Z C I D V
                                         M7 + - - - M6
    addressing    assembler       opc   bytes cycles
    zeropage      BIT oper        24       2      3
```

## References
- "shift_and_rotate_instructions" — expands on ASL relation to ROL/ROR/LSR
- "adc_and_and_instructions" — expands on ADC/AND further usage in arithmetic/logic