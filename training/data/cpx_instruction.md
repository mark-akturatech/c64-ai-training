# 6502 CPX (Compare X register)

**Summary:** CPX compares the X register with a memory operand using Absolute ($EC), Zero Page ($E4) or Immediate ($E0) addressing. It affects the Negative (N), Zero (Z) and Carry (C) processor flags.

## Description
CPX performs the operation X - M (where M is the memory operand) without storing the result; only the processor status flags are updated:

- Carry (C): set if X >= M (unsigned compare), clear if X < M.
- Zero (Z): set if X == M.
- Negative (N): set to bit 7 of the subtraction result (X - M) (two's complement sign).

Addressing modes supported: Immediate, Zero Page, Absolute. Use CPX for unsigned comparisons of X against memory or constants; for signed comparisons interpret the N flag after considering two's-complement semantics.

(See "cmp_instruction" for the equivalent operation comparing the accumulator.)

## Source Code
```text
CPX	Compare X 	Absolute	CPX $aaaa	$EC	3	N,Z,C
	register	Zero Page	CPX $aa	$E4	2	
		Immediate	CPX #$aa	$E0	2	
```

```asm
; Examples
CPX #$10        ; Compare X with immediate 0x10
CPX $20         ; Compare X with zero page at $0020
CPX $1234       ; Compare X with absolute address $1234
```

## Key Registers
(Instruction-focused; no memory-mapped registers.)

## References
- "cmp_instruction" — CMP (compare accumulator) and equivalent flag semantics