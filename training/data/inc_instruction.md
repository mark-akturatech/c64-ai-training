# INC — Increment Memory (6502)

**Summary:** INC increments a memory location by one on the 6502 CPU. Includes Absolute, Zero Page, Absolute,X and Zero Page,X addressing modes with opcodes $EE, $E6, $FE, $F6; affects the Negative (N) and Zero (Z) flags.

## Description
INC adds one to the memory operand and stores the result back to the same memory location. It does not affect the Carry or Overflow flags; only the Negative and Zero flags are updated based on the result.

Addressing modes included:
- Zero Page — one-byte zero-page address.
- Zero Page,X — zero-page address plus X index (wraps in zero page).
- Absolute — full 16-bit address.
- Absolute,X — 16-bit address plus X index.

## Source Code
```text
INC	Increment a 	memory location	Addressing Mode	Example			Opcode	Bytes	Flags
INC	Increment a 	Absolute		INC $aaaa		$EE	3	N,Z
	memory location	Zero Page		INC $aa		$E6	2	
		Absolute Indexed, X	INC $aaaa,X		$FE	3	
		Zero Page Indexed X	INC $aa,X		$F6	2	
```

## References
- "dec_instruction" — DEC (decrement memory) counterpart and expanded discussion.

## Mnemonics
- INC
