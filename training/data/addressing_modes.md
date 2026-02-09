# 6510/6502 Addressing Modes

**Summary:** Definitions of 6502/6510 addressing modes: Accumulator, Immediate, Absolute (low/high byte order, full 64K access), Zero Page (implied high byte zero), Indexed Zero Page (Zero Page,X/Y — no page crossing), Indexed Absolute (Absolute,X/Y — may cross pages), Implied, Relative (branch offset ±128), Indexed Indirect ([Indirect, X] — ZP pointer = operand + X, wrap in page zero), Indirect Indexed ([Indirect], Y — ZP pointer contents + Y with carry into high byte), and Absolute Indirect (JMP indirect). Relevant to mnemonics such as LDA, STA, JMP and branch instructions.

## Addressing Modes

Accumulator addressing
- One-byte instruction that operates directly on the accumulator (A). No operand bytes follow the opcode.

Immediate addressing
- Operand is the second byte of the instruction (a literal constant). No further memory access to form the effective address.

Absolute addressing
- Instruction second byte = low-order 8 bits of effective 16-bit address; third byte = high-order 8 bits. Allows access to any location in the full 64K address space.

Zero Page addressing
- Instruction fetches only the second byte; high-order address byte is implicitly zero. Shorter fetch and faster execution than absolute addressing.

Indexed Zero Page addressing (Zero Page,X / Zero Page,Y)
- Second byte is a zero-page base; effective address = (base + index) & $FF (carry discarded). Both pointer and effective address reside in page zero; no page crossing or high-byte carry occurs.

Indexed Absolute addressing (Absolute,X / Absolute,Y)
- Second and third bytes form a 16-bit base address; effective address = base + X (or base + Y). Index is added to the full 16-bit base and may cross a page boundary (may set a carry into the high byte).

Implied addressing
- Operand location is implied by the opcode; no operand bytes are fetched (e.g., instructions that operate solely on processor state or registers).

Relative addressing
- Used only by branch instructions. The second byte is a signed 8-bit offset added to the low 8 bits of the program counter after the PC has advanced to the next instruction. Offset range = -128..+127 from the next-instruction address.

Indexed Indirect addressing ([Indirect, X])
- The second byte is a zero-page pointer base. Add X to that byte (discard carry) to produce a zero-page pointer. The zero-page byte at that pointer is the low-order byte of the effective address; the following zero-page location is the high-order byte. Both pointer bytes must reside in page zero (wrap within page zero).

Indirect Indexed addressing ([Indirect], Y)
- The second byte points to a zero-page pointer (low-order byte). Add Y to that low-order byte; the sum (low-order result) is the low-order byte of the effective address. Any carry from adding Y is added to the zero-page pointer's high-order byte (the next zero-page location) to form the effective high-order byte.

Absolute Indirect (JMP (addr))
- The second and third instruction bytes form a 16-bit memory location that contains a two-byte pointer: the byte at that memory location is the low-order byte of the effective PC, and the next memory location contains the high-order byte which is loaded into the program counter.

## References
- "signal_descriptions" — Bus and timing behavior for memory accesses performed by these addressing modes  
- "instruction_mnemonics_alphabetic_list" — Instructions that use each addressing mode (e.g., LDA, STA, JMP, branch instructions)