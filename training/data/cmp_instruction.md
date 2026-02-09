# 6502 CMP (Compare accumulator)

**Summary:** CMP compares the accumulator (A) with a memory operand using 6502 subtraction semantics and sets flags N, Z, C. Common opcodes: $C9, $C5, $CD, $D5, $DD, $D9, $C1, $D1 (Immediate, Zero Page, Absolute, Zero Page,X, Absolute,X, Absolute,Y, (ZP,X), (ZP),Y).

**Description**
CMP performs an internal subtraction A - M (operand) but does not store the result in A. Flags are updated as if the subtraction occurred:

- Carry (C): set if A >= M (unsigned comparison), clear if A < M.
- Zero (Z): set if A == M.
- Negative (N): set to bit 7 of the (A - M) result (two's complement sign; useful for signed comparisons).

Use CMP followed by conditional branches (e.g., BCC/BCS, BEQ/BNE, BMI/BPL) to make unsigned or signed decisions. CMP affects only the processor status flags N, Z, and C.

## Source Code
```text
CMP	Compare accumulator

Addressing modes and opcodes:
Immediate              CMP #$aa        $C9    2    2    N,Z,C
Zero Page              CMP $aa         $C5    2    3    N,Z,C
Zero Page,X            CMP $aa,X       $D5    2    4    N,Z,C
Absolute               CMP $aaaa       $CD    3    4    N,Z,C
Absolute,X             CMP $aaaa,X     $DD    3    4*   N,Z,C
Absolute,Y             CMP $aaaa,Y     $D9    3    4*   N,Z,C
(Indirect,X)           CMP ($aa,X)     $C1    2    6    N,Z,C
(Indirect),Y           CMP ($aa),Y     $D1    2    5*   N,Z,C

* Add 1 cycle if page boundary is crossed.

Flags affected: Negative (N), Zero (Z), Carry (C)
```

## Key Registers
(none)

## References
- "cpx_instruction" — CPX (Compare X register)
- "cpy_instruction" — CPY (Compare Y register)