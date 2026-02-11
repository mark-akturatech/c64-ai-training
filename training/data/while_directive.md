# Kick Assembler: .while directive (Section 5.5)

**Summary:** Describes Kick Assembler's .while directive for assembly-time loops (boolean condition), with examples showing printing numbers and manual iteration using .eval. Also contrasts .while with .for for table generation and loop unrolling.

## Description
The .while directive repeats its block while a boolean expression evaluates true at assembly time. It is equivalent to a .for loop without the initializer and iteration expressions, so use .while when you need a condition-driven loop or when the iteration step is not a simple fixed update.

- Use .eval inside a .while body to perform manual iteration (modify loop variables at assembly time).
- Use .for for compact init/condition/iteration loops (handy for unrolling and table generation).
- .while is useful when the loop continuation depends on computed state or side effects performed inside the loop.

**[Note: Source may contain an error — the example inner conditional used "var y=0" (assignment) instead of an equality test. Examples below use an equality check (y==0).]**

## Source Code
```asm
; Blitter-fill example (table/unroll style using nested .for)
.var blitterBuffer = $3000
.var charset = $3800

.for (x = 0; x < 16; x++) {
    .for (y = 0; y < 128; y++) {
        .if (y == 0)
            lda blitterBuffer + x*128 + y
        .else
            eor blitterBuffer + x*128 + y
        .endif
        sta charset + x*128 + y
    }
}
```

```asm
; .while example: print numbers 0..9 at assembly time, using .eval to increment
.var i = 0
.while (i < 10) {
    .print i
    .eval i++
}
```

## References
- "for_directive" — comparison between .for and .while loop constructs
