# 6502 DEC (Decrement memory) Instruction

**Summary:** DEC decrements a memory location by one. Addressing modes: Absolute ($CE), Zero Page ($C6), Absolute,X ($DE), Zero Page,X ($D6). Flags affected: Negative (N) and Zero (Z).

## Description
DEC performs a read-modify-write on the specified memory operand: it reads the byte, subtracts one (value - 1 modulo 256), and writes the result back to memory. The instruction updates the Zero flag if the result is zero, and the Negative flag according to bit 7 of the result. DEC does not affect the Carry or Overflow flags. It operates on memory (not the accumulator) and behaves as a memory RMW operation (important for bus cycles and side effects).

Behavior details:
- Arithmetic: result = (operand - 1) & $FF
- Flags changed: Z (set if result == $00), N (set if bit 7 of result is 1)
- Flags not changed: C, V, (also I and D are unaffected by DEC)
- Wrap-around: decrementing $00 yields $FF (negative)
- Operation type: Read-Modify-Write memory instruction

## Source Code
```text
DEC  Decrement a memory location
Mode                      Assembly       Opcode  Bytes  Flags
Absolute                  DEC $aaaa      $CE     3      N,Z
Zero Page                 DEC $aa        $C6     2      N,Z
Absolute Indexed, X       DEC $aaaa,X    $DE     3      N,Z
Zero Page Indexed, X      DEC $aa,X      $D6     2      N,Z
```

Example usage (assembly):
```asm
    DEC $C000      ; decrement memory at $C000
    DEC $10        ; decrement zero page location $10
    DEC $C000,X    ; decrement memory at $C000 + X
    DEC $10,X      ; decrement zero page location $10 + X
```

## References
- "inc_instruction" — INC (increment memory) counterpart and related details

## Mnemonics
- DEC
