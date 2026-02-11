# ROL (Rotate Left)

**Summary:** ROL (Rotate Left) is a 6502 rotate-through-carry instruction that shifts the operand left one bit, rotating the processor Carry into bit 0 and moving bit 7 into Carry. Addressing modes/opcodes: Accumulator $2A, Zero Page $26, Zero Page,X $36, Absolute $2E, Absolute,X $3E. Flags affected: Negative (N), Zero (Z), Carry (C).

**Operation**
ROL shifts the operand left one bit and uses the processor Carry as the low bit. Bit 7 of the original operand becomes the new Carry; the previous Carry becomes bit 0 of the result.

- Bit-level effect: result = (operand << 1) | C_old; C_new = (operand >> 7) & 1
- Flags:
  - Carry (C): set to previous bit 7 of the operand.
  - Negative (N): set if bit 7 of the result is 1.
  - Zero (Z): set if the result is 0.
- Other flags (e.g., Overflow) are unaffected.
- Accumulator mode operates on the A register. Memory modes are read-modify-write (RMW): the CPU reads the memory byte, computes the rotated value using the old Carry, writes the result back to memory, and updates flags.

## Source Code
```text
ROL	Rotate Left	Absolute	ROL $aaaa	$2E	3	6
		Zero Page	ROL $aa	$26	2	5
		Accumulator	ROL A	$2A	1	2
		Absolute Indexed, X	ROL $aaaa,X	$3E	3	7
		Zero Page Indexed, X	ROL $aa,X	$36	2	6
```

## References
- "asl_instruction" — comparison of arithmetic shift left (ASL) vs rotate left (ROL)
- "ror_instruction" — rotate right (ROR) details and opcodes

## Mnemonics
- ROL
