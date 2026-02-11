# 6502 BIT (Bit Test) Instruction

**Summary:** BIT tests bits of a memory operand against the accumulator (A). Addressing modes: Absolute ($2C, 3 bytes) and Zero Page ($24, 2 bytes). Flags affected: Negative (N), Overflow (V), Zero (Z).

## Operation
BIT performs a non-destructive test between the accumulator and a memory operand:
- Computes A AND M (A bitwise-AND memory).
- Sets the Zero flag (Z) if the AND result is zero, clears Z otherwise.
- Loads the Negative flag (N) from bit 7 of the memory operand (M7).
- Loads the Overflow flag (V) from bit 6 of the memory operand (M6).
- The accumulator A is not modified.

Addressing modes and machine encodings:
- Zero Page — opcode $24, 2 bytes.
- Absolute — opcode $2C, 3 bytes.

Flags affected: N, V, Z (as described above). Carry and Decimal flags are not affected.

## Source Code
```text
BIT	Bit Test	Absolute	BIT $aaaa	$2C	3	N,V,Z
		Zero Page	BIT $aa	    $24	2	
```

## References
- "cmp_instruction" — related compare operations (CMP/CPX/CPY)

## Mnemonics
- BIT
