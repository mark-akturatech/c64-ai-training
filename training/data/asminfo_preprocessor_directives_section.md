# Kick Assembler: .assert preprocessor directive

**Summary:** .assert — Kick Assembler preprocessor directive that assembles two code blocks and reports "ok" or "failed" plus the assembled byte sequences for comparison (useful for regression checks and macro expansion verification).

## Description
.assert takes three arguments: a text label and two code blocks (each in braces). Kick Assembler assembles both blocks in the current assembly context and compares the resulting bytes. The directive prints either an "ok" result when the byte sequences match, or "failed" when they differ; the assembled byte sequences for each block are shown to help locate differences.

Syntax form shown in examples:
- .assert "label", { <block A> }, { <block B> }

Blocks may contain any valid Kick Assembler code (instructions, directives, preprocessor code such as .for loops). Comparison is performed on the assembled output bytes of each block.

## Source Code
```asm
.assert "Test2", { lda $1000 }, {ldx $1000}

.assert "Test", {
.for (var i=0; i<4; i++)
  sta $0400+i
}, {
  sta $0400
  sta $0401
  sta $0402
  sta $0403
}
```

Expected assembled-byte comparison (logical result):

```text
Test2: failed
  left  (lda $1000) -> AD 00 10
  right (ldx $1000) -> AE 00 10

Test: ok
  both -> 8D 00 04 8D 00 04 8D 00 04 8D 00 04
```

Notes:
- LDA absolute assembles to AD 00 10 (low-byte first), LDX absolute to AE 00 10 — hence Test2 fails.
- STA absolute assembles to 8D 00 04; the .for loop expands to four STA instructions, matching the explicit four STA lines, so Test passes.