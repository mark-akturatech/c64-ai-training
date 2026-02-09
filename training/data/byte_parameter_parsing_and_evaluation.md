# ROM: scan and get byte parameter routines ($B79B–$B7AA)

**Summary:** Contains the Commodore 64 ROM routines used when parsing a byte parameter: scan helper (JSR $0073), numeric-type checking (JSR $AD8A), and a byte-expression evaluator (JSR $B1B8). References FAC1 mantissa bytes ($64/$65) and returns by scanning memory (JMP $0079).

## Description
This snippet is the parameter-parsing sequence used by string functions that accept an optional byte-sized numeric argument. Flow:

- JSR $0073 — increment and scan memory (memory-scan helper).
- JSR $AD8A — evaluate an expression and verify it is numeric; on non-numeric input a type-mismatch error occurs.
- JSR $B1B8 — evaluate an integer expression; result is returned in X.
- LDX $64 — load FAC1 mantissa byte 3 (FAC1 = floating accumulator used by BASIC numeric routines).
  - BNE $B798 — if byte 3 ≠ 0, branch to $B798 which raises an "illegal quantity" error and performs a warm start (per source text).
- LDX $65 — load FAC1 mantissa byte 4.
- JMP $0079 — resume scanning memory and return to caller.

Notes:
- FAC1 mantissa bytes referenced are $64 and $65 (third and fourth bytes of FAC1 mantissa). The code checks these for nonzero values to detect out-of-range or non-byte results.
- The sequence is used by routines that require a byte-sized integer parameter and must detect both type and range errors before accepting the value.

## Source Code
```asm
                                *** scan and get byte parameter
.,B79B 20 73 00 JSR $0073       increment and scan memory

                                *** get byte parameter
.,B79E 20 8A AD JSR $AD8A       evaluate expression and check is numeric, else do
                                type mismatch

                                *** evaluate byte expression, result in X
.,B7A1 20 B8 B1 JSR $B1B8       evaluate integer expression, sign check
.,B7A4 A6 64    LDX $64         get FAC1 mantissa 3
.,B7A6 D0 F0    BNE $B798       if not null do illegal quantity error then warm start
.,B7A8 A6 65    LDX $65         get FAC1 mantissa 4
.,B7AA 4C 79 00 JMP $0079       scan memory and return
```

## References
- "mid_string_function" — expands on uses of byte-parameter parsing to retrieve optional MID length
- "chr_string_creation" — expands on uses of byte-expression evaluator for CHR$ argument
- "pull_string_and_byte_param" — invoked during parameter parsing and retrieval sequences