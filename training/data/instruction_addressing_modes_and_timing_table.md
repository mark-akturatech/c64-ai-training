# 6502 / C64 — Instruction addressing modes and execution times (clock cycles)

**Summary:** 6502 instruction timings for common addressing modes (accumulator, immediate, zero page, zero page,X/Y, absolute, absolute,X/Y, implied, relative, (indirect,X), (indirect),Y, absolute-indirect) with footnotes describing page-cross and branch-taken penalties. Useful for C64 / 6502 cycle-accurate timing, opcode selection (see opcode maps), and optimization.

## How to read this table
- Rows = addressing modes (Accumulator, Immediate, Zero Page, Zero Page,X, Zero Page,Y, Absolute, Absolute,X, Absolute,Y, Implied, Relative, (Indirect,X), (Indirect),Y, Absolute Indirect).
- Columns = instruction classes (labeled by single letters in the original source). Use an opcode hex map (see References) to map a specific opcode to its instruction class/column.
- Cells = clock cycles required to execute the instruction of that class with the given addressing mode. A "." entry means "not applicable" (instruction/class does not use that addressing mode).
- Footnotes:
  - "*" — add one cycle if indexing crosses a page boundary (e.g., Absolute,X or Absolute,Y that crosses a 256-byte page).
  - "**" — for branches: add one cycle if the branch is taken; add one additional cycle if the branch crosses a page boundary.
- Branch timings: Relative row entries that include "**" indicate the conditional branch timing behavior described above.
- (Indirect),Y and Absolute,X/Y entries often show the page-cross penalty marker (*) where applicable.
- To find the concrete opcode for an instruction class column, consult an opcode map (see References).

## Source Code
```text
+------------------------------------------------------------------------
| INSTRUCTION ADDRESSING MODES AND RELATED EXECUTION TIMES
| (in clock cycles)
+------------------------------------------------------------------------

                 A   A   A   B   B   B   B   B   B   B   B   B   B   C
                 D   N   S   C   C   E   I   M   N   P   R   V   V   L
                 C   D   L   C   S   Q   T   I   E   L   K   C   S   C
 Accumulator  |  .   .   2   .   .   .   .   .   .   .   .   .   .   .
 Immediate    |  2   2       .   .   .   .   .   .   .   .   .   .   .
 Zero Page    |  3   3   5   .   .   .   3   .   .   .   .   .   .   .
 Zero Page,X  |  4   4   6   .   .   .   .   .   .   .   .   .   .   .
 Zero Page,Y  |  .   .   .   .   .   .   .   .   .   .   .   .   .   .
 Absolute     |  4   4   6   .   .   .   4   .   .   .   .   .   .   .
 Absolute,X   |  4*  4*  7   .   .   .   .   .   .   .   .   .   .   .
 Absolute,Y   |  4*  4*  .   .   .   .   .   .   .   .   .   .   .   .
 Implied      |  .   .   .   .   .   .   .   .   .   .   .   .   .   2
 Relative     |  .   .   .   2** 2** 2** .   2** 2** 2** 7   2** 2** .
 (Indirect,X) |  6   6   .   .   .   .   .   .   .   .   .   .   .   .
 (Indirect),Y |  5*  5*  .   .   .   .   .   .   .   .   .   .   .   .
 Abs. Indirect|  .   .   .   .   .   .   .   .   .   .   .   .   .   .
              +-----------------------------------------------------------
                 C   C   C   C   C   C   D   D   D   E   I   I   I   J
                 L   L   L   M   P   P   E   E   E   O   N   N   N   M
                 D   I   V   P   X   Y   C   X   Y   R   C   X   Y   P
 Accumulator  |  .   .   .   .   .   .   .   .   .   .   .   .   .   .
 Immediate    |  .   .   .   2   2   2   .   .   .   2   .   .   .   .
 Zero Page    |  .   .   .   3   3   3   5   .   .   3   5   .   .   .
 Zero Page,X  |  .   .   .   4   .   .   6   .   .   4   6   .   .   .
 Zero Page,Y  |  .   .   .   .   .   .   .   .   .   .   .   .   .   .
 Absolute     |  .   .   .   4   4   4   6   .   .   4   6   .   .   3
 Absolute,X   |  .   .   .   4*  .   .   7   .   .   4*  7   .   .   .
 Absolute,Y   |  .   .   .   4*  .   .   .   .   .   4*  .   .   .   .
 Implied      |  2   2   2   .   .   .   .   2   2   .   .   2   2   .
 Relative     |  .   .   .   .   .   .   .   .   .   .   .   .   .   .
 (Indirect,X) |  .   .   .   6   .   .   .   .   .   6   .   .   .   .
 (Indirect),Y |  .   .   .   5*  .   .   .   .   .   5*  .   .   .   .
 Abs. Indirect|  .   .   .   .   .   .   .   .   .   .   .   .   .   5
              +-----------------------------------------------------------
 *  Add one cycle if indexing across page boundary
 ** Add one cycle if branch is taken, Add one additional if branching
    operation crosses page boundary
```

```text
-------------------------------------------------------------------------+
  INSTRUCTION ADDRESSING MODES AND RELATED EXECUTION TIMES              |
  (in clock cycles)                                                     |
-------------------------------------------------------------------------+

                 J   L   L   L   L   N   O   P   P   P   P   R   R   R
                 S   D   D   D   S   O   R   H   H   L   L   O   O   T
                 R   A   X   Y   R   P   A   A   P   A   P   L   R   I
 Accumulator  |  .   .   .   .   2   .   .   .   .   .   .   2   2   .
 Immediate    |  .   2   2   2   .   .   2   .   .   .   .   .   .   .
 Zero Page    |  .   3   3   3   5   .   3   .   .   .   .   5   5   .
 Zero Page,X  |  .   4   .   4   6   .   4   .   .   .   .   6   6   .
 Zero Page,Y  |  .   .   4   .   .   .   .   .   .   .   .   .   .   .
 Absolute     |  6   4   4   4   6   .   4   .   .   .   .   6   6   .
 Absolute,X   |  .   4*  .   4*  7   .   4*  .   .   .   .   7   7   .
 Absolute,Y   |  .   4*  4*  .   .   .   4*  .   .   .   .   .   .   .
 Implied      |  .   .   .   .   .   2   .   3   3   4   4   .   .   6
 Relative     |  .   .   .   .   .   .   .   .   .   .   .   .   .   .
 (Indirect,X) |  .   6   .   .   .   .   6   .   .   .   .   .   .   .
 (Indirect),Y |  .   5*  .   .   .   .   5*  .   .   .   .   .   .   .
 Abs. Indirect|  .   .   .   .   .   .   .   .   .   .   .   .   .   .
              +-----------------------------------------------------------
                 R   S   S   S   S   S   S   S   T   T   T   T   T   T
                 T   B   E   E   E   T   T   T   A   A   S   X   X   Y
                 S   C   C   D   I   A   X   Y   X   Y   X   A   S   A
 Accumulator  |  .   .   .   .   .   .   .   .   .   .   .   .   .   .
 Immediate    |  .   2   .   .   .   .   .   .   .   .   .   .   .   .
 Zero Page    |  .   3   .   .   3   3   3   .   .   .   .   .   .   .
 Zero Page,X  |  .   4   .   .   .   4   .   4   .   .   .   .   .   .
 Zero Page,Y  |  .   .   .   .   .   .   4   .   .   .   .   .   .   .
 Absolute     |  .   4   .   .   .   4   4   4   .   .   .   .   .   .
 Absolute,X   |  .   4*  .   .   .   5   .   .   .   .   .   .   .   .
 Absolute,Y   |  .   4*  .   .   .   5   .   .   .   .   .   .   .   .
 Implied      |  6   .   2   2   2   .   .   .   2   2   2   2   2   2
 Relative     |  .   .   .   .   .   .   .   .   .   .   .   .   .   .
 (Indirect,X) |  .   6   .   .   .   6   .   .   .   .   .   .   .   .
 (Indirect),Y |  .   5*  .   .   .   6   .   .   .   .   .   .   .   .
 Abs. Indirect|  .   .   .   .   .   .   .   .   .   .   .   .   .   .
              +-----------------------------------------------------------
 *  Add one cycle if indexing across page boundary
 ** Add one cycle if branch is taken, Add one additional if branching
    operation crosses page boundary
```

## References
- "transfer_instructions_tsx_txa_txs_tya" — timing examples for implied-mode transfer instructions
- "opcode_hex_maps_00_to_FF" — opcode-to-instruction mapping to locate specific opcodes for the instruction classes shown in the timing table