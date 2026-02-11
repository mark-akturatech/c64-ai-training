# MACHINE - 6502 Addressing Modes (accumulator, immediate, absolute, zero page, indexed ZP, indexed ABS, implied, relative, (IND,X), (IND),Y, absolute indirect)

**Summary:** Concise definitions and effective-address formation for 6502 addressing modes: accumulator, immediate, absolute ($HHLL little-endian), zero page, zero-page indexed (ZP,X / ZP,Y), absolute indexed (ABS,X / ABS,Y), implied, relative (signed branch offset -128..+127), indexed indirect (IND,X), indirect indexed (IND),Y, and absolute indirect (JMP (abs) indirect). Includes wrap/ carry behavior and the 6502 JMP indirect page-boundary bug.

## Addressing Modes

Accumulator
- Instruction is one byte; the operation acts on the accumulator (A). No operand bytes and no memory address is formed.

Immediate
- Operand is the next byte of the instruction (usually written with #, e.g. LDA #$12). The effective operand is the immediate value itself; no memory indirection.

Absolute
- Instruction contains two operand bytes: low then high (little-endian). Effective address (EA) = (high << 8) | low. Allows full 16-bit addressing (0x0000–0xFFFF).

Zero Page
- Single operand byte (ZP offset). Effective address = zero page address $00LL where LL is the operand. High byte is implicitly $00. Useful for shorter code and faster access.

Indexed Zero Page (Zero Page,X and Zero Page,Y)
- Operand is a zero-page byte LL. Compute EA = (LL + X) & $FF (or (LL + Y) & $FF). Addition wraps within page zero (no carry into high byte).

Absolute Indexed (ABS,X and ABS,Y)
- Operand is 16-bit base address (low, high). EA = base + X (or base + Y). Addition may cross a page boundary and carry into the high byte (affects timing on some instructions).

Implied
- No operand bytes; operand is implied by the opcode (e.g., CLC, RTS). No EA formed.

Relative (branches)
- Operand is a signed 8-bit offset (two's complement) added to the program counter (PC) after the branch instruction; allowed range -128..+127. Target = PC_after_branch + signed_offset (PC_after_branch is the address of the next instruction).

Indexed Indirect — (IND,X) (often written (operand,X))
- Operand is a zero-page byte P. Compute pointer location ptr = (P + X) & $FF (zero-page wrap).
- Fetch pointer low = M[ptr], pointer high = M[(ptr + 1) & $FF].
- EA = (pointer_high << 8) | pointer_low. (Used by instructions like LDA ($nn,X).)

Indirect Indexed — (IND),Y (often written (operand),Y)
- Operand is a zero-page byte P.
- Fetch pointer low = M[P], pointer high = M[(P + 1) & $FF] (zero-page wrap).
- Base = (pointer_high << 8) | pointer_low.
- EA = Base + Y (addition may cross a page boundary and carry into high byte). (Used by instructions like LDA ($nn),Y.)

Absolute Indirect (JMP (abs))
- Operand is a 16-bit pointer address PTR (low, high).
- Effective indirect pointer low = M[PTR], pointer high = M[PTR+1] (normally).
- EA = (pointer_high << 8) | pointer_low.
- **6502 hardware quirk:** If PTR low byte = $FF, the high byte is fetched from PTR & $FF00 (i.e., high byte read wraps within the same page) instead of PTR+1. This is the classic JMP (ABS) indirect page-boundary bug on NMOS 6502.

## References
- "instruction_timing_and_opcode_table" — opcode formats, sizes and timing implications for these addressing modes

## Mnemonics
- JMP
