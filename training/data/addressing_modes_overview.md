# 650x Addressing Modes (Overview)

**Summary:** Overview of 650x/C64 addressing modes: implied/accumulator, immediate, absolute/zero-page, indexed (absolute,X / absolute,Y / zero-page,X / zero-page,Y), indirect, relative (branches), and the combined indirect-indexed and indexed-indirect modes.

## Addressing Modes
An instruction consists of an opcode and an operand; the addressing mode describes how the operand is obtained. Some modes supply no memory address (the operand is implicit or in the instruction), others compute or fetch an address from memory. The 650x family uses the following modes:

1. No memory address: implied, accumulator.  
   - Operand is encoded by the opcode (or uses the accumulator register).

2. No address, but a value supplied: immediate.  
   - The operand value is contained directly in the instruction.

3. Single-memory-location addressing: absolute, zero-page.  
   - Operand is a two-byte (absolute) or one-byte (zero-page) memory address.

4. Indexed addressing (range of 256 locations): absolute,X; absolute,Y; zero-page,X; zero-page,Y.  
   - A base address (absolute or zero-page) is adjusted by the X or Y register to index into a 256-byte range.

5. Indirect: a memory location contains the two-byte jump/target address.  
   - Useful for JMP (indirect) and other pointer-based addressing.

6. Relative: branch offsets.  
   - Operand is a signed offset (forward/back) relative to the next instruction for branch instructions.

7. Combined indirect/indexed modes: indirect,X (indexed indirect) and indirect,Y (indirect indexed).  
   - Indexed indirect (indirect,X): index into a zero-page table, then fetch a two-byte address.  
   - Indirect indexed (indirect),Y: fetch a two-byte base address from zero page, then add Y to that address to reach anywhere in memory.

## References
- "implied_address_mode" — expands on no-address instructions such as INX/BRK/TAY  
- "indirect_indexed_addressing" — expands on indirect,Y to reach anywhere in memory