# LEN() implementation and string-evaluation helper (C64 ROM)

**Summary:** LEN() implementation at $B77C-$B77F calls the string-evaluation helper (JSR $B782 / JSR $B6A3) which returns a string length in A (and copies it into Y), clears the BASIC numeric/data-type flag $0D, and then jumps to $B3A2 to convert Y into FAC1 byte form. Searchable terms: $B77C, $B782, $B6A3, $B3A2, $0D, FAC1, LEN, evaluate-string.

## Behavior and flow
- LEN() entry: JSR $B782 evaluates the string expression and provides the length in A (and Y). After that LEN code jumps to $B3A2 to convert the length (in Y) into FAC1 byte form and return to the caller.
- String-evaluation helper ($B782): calls the core string evaluator at $B6A3, clears the BASIC data-type flag in zero-page $0D to indicate numeric (0 = numeric, $FF = string), copies the returned length from A into Y, and returns. (FAC1 = floating-point accumulator 1.)
- Interaction summary:
  - JSR $B6A3 — evaluate string expression and place length in A.
  - STX #$00 -> STX $0D — clear data-type flag ($0D = 0 numeric).
  - TAY — copy length (A) into Y for the converter routine.
  - JMP $B3A2 (from LEN) — convert Y into FAC1 byte form and return.

## Source Code
```asm
        ; *** perform LEN()
.,B77C 20 82 B7    JSR $B782       ; evaluate string, get length in A (and Y)
.,B77F 4C A2 B3    JMP $B3A2       ; convert Y to byte in FAC1 and return

        ; *** evaluate string, get length in Y
.,B782 20 A3 B6    JSR $B6A3       ; evaluate string
.,B785 A2 00       LDX #$00        ; set data type = numeric
.,B787 86 0D       STX $0D         ; clear data type flag, $FF = string, $00 = numeric
.,B789 A8          TAY             ; copy length to Y
.,B78A 60          RTS
```

## References
- "asc_function" — expands on ASC which also calls the same evaluate-string routine (JSR $B782)
- "pull_string_and_byte_param" — expands on related descriptor handling for string expressions (JSR $B6A3 called to evaluate string)
