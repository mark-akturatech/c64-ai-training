# 6502 AND (Logical AND)

**Summary:** 6502 AND performs a bitwise AND between the accumulator and a memory operand. Addressing modes and opcodes: Absolute $2D, Zero Page $25, Immediate $29, Absolute,X $3D, Absolute,Y $39, Zero Page,X $35, (Indirect,X) $21, (Indirect),Y $31; affects Negative and Zero flags.

## Description
Operation: A := A AND M (bitwise AND between accumulator and operand).

Flags affected:
- Negative (N) — set from bit 7 of the result.
- Zero (Z) — set if result is zero.

The instruction supports all standard 6502 memory addressing modes that operate on a single operand: immediate, zero page, zero page indexed, absolute, absolute indexed (X and Y), indexed indirect (X), and indirect indexed (Y). Use the listed opcodes and instruction lengths (bytes) for machine encoding.

## Source Code
```text
AND	Logical AND	Absolute	AND $aaaa	$2D	3	N,Z
		Zero Page	AND $aa	$25	2	
		Immediate	AND #$aa	$29	2	
		Absolute Indexed, X	AND $aaaa,X	$3D	3	
		Absolute Indexed, Y	AND $aaaa,Y	$39	3	
		Zero Page Indexed, X	AND $aa,X	$35	2	
		Indexed Indirect	AND ($aa,X)	$21	2	
		Indirect Indexed	AND ($aa),Y	$31	2	

Flags affected: Negative, Zero.
```

## References
- "eor_instruction" — expands on EOR (exclusive OR) related logical operation
- "ora_instruction" — expands on ORA (inclusive OR) related logical operation

## Mnemonics
- AND
