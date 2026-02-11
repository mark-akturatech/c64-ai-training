# CPY — Compare Y register (6502)

**Summary:** CPY compares the Y register with a memory/immediate operand and sets flags N, Z, C; opcodes: Immediate $C0, Zero Page $C4, Absolute $CC (instruction lengths: 2, 2, 3 bytes respectively). Searchable terms: CPY, Y register, $C0, $C4, $CC, N/Z/C.

**Operation**
CPY performs a comparison between the Y register and the operand (performs Y - operand, sets flags accordingly). It does not change Y or the operand; only the processor status flags are affected:

- Carry (C): set if Y >= operand (no borrow required).
- Zero (Z): set if Y == operand.
- Negative (N): set to bit 7 of the subtraction result (Y - operand).

Addressing modes supported: Immediate, Zero Page, Absolute. See the Source Code section for the opcode/length table.

## Source Code
```text
CPY	Compare Y 	Absolute	CPY $aaaa	$CC	3	4	N,Z,C
	register	Zero Page	CPY $aa	$C4	2	3	
		Immediate	CPY #$aa	$C0	2	2	

Flags affected: Negative, Zero, Carry.
```

## Source Code

```assembly
    LDY #0          ; Initialize Y register to 0
loop:
    LDA array,Y     ; Load value from array at index Y
    ; Process the value in A
    INY             ; Increment Y
    CPY #array_size ; Compare Y with array_size
    BNE loop        ; If Y != array_size, repeat loop
    ; Continue with the rest of the program
```

## References
- "cmp_instruction" — CMP compare accumulator (related comparison operation)

## Mnemonics
- CPY
