# NMOS 6510 — changelog V0.9 (2015-12-24) (IGNORED)

**Summary:** Changelog entry for NMOS 6510 material (v0.9) listing cosmetic fixes, corrected references, and additions: notes on ANE / LAX #imm usage, unintended addressing modes, references to 64doc.txt test code, decimal-flag effects for RRA and ISC, corrected ANE example, and new examples/explanations for RLA and LAS.

**Changes in this entry**
- Version/date: December 24th, 2015 (V0.9). Marked "IGNORED" in source.
- Cosmetic fixes: text justification and minor presentation cleanup.
- Fixed reference links in the references list.
- Added notes on ANE and LAX #imm usage (anonymous/undocumented illegal opcodes).
- Added a chapter describing unintended addressing modes (undocumented behavior causing alternative effective addresses).
- Added references to test code from 64doc.txt (test vectors / verification suites).
- Noted effect of the decimal flag on RRA and ISC (decimal-mode behavior discussed).
- Corrected an error in the ANE example.
- Added examples and explanations for RLA and LAS; credit given to Color Bar for explanations.

## Source Code
```text
; Corrected ANE example
LDA #$FF
LDX #$0F
ANE #$0F
; A = (A | CONST) & X & #$0F
; Equivalent to:
; TXA
; AND #$0F
```

```text
; RLA example
LDA #$AA
STA $0200
ROL $0200
AND $0200
; A = (A & ($0200 << 1))
```

```text
; LAS example
LDA #$FF
TAX
TAY
LAS $0200,Y
; A, X, S = $0200 & S
```

## Mnemonics
- ANE
- LAX
- RLA
- LAS
- RRA
- ISC
