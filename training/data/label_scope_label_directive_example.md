# Kick Assembler: Scoped .label (fillbyte = *+1) and Loop Label Scopes

**Summary:** Kick Assembler label scopes allow exposing inner labels of a scoped block (e.g., a macro or a named scope) to external code. Example patterns include defining `.label fillbyte = *+1` inside a scoped label (ClearScreen2) so callers can write to `clearScreen2.fillbyte` directly, and using a label in front of `.for` / `.while` loops to create indexable label arrays (e.g., `loop2[i].color+1`).

**Overview**

- **Label scopes:** Placing a named label immediately before a block (macro, function, or loop) creates a label scope. Inner labels become members of that scope and can be referenced externally as `scopeName.innerLabel`.

- **Using `.label ... = *+1` inside a scope:** This sets the named label to the current assembly location plus one. This is useful when you want callers to write to a byte placed after some assembler data/ops without forcing callers to add an offset. Example use-case: inside a ClearScreen2 scope, define `.label fillbyte = *+1`; external code can then do `sta clearScreen2.fillbyte`, and the address resolves to the following byte.

- **Loop label arrays:** Prefixing a `.for` / `.while` loop with a label creates an array of scopes indexed by the loop counter. Inner labels can be accessed per-index using array syntax (`loopLabel[i].innerLabel`). This allows a loop body to assemble data into repeated structures and still have the labels addressable externally.

## Source Code

```asm
// Example: Using `.label fillbyte = *+1` inside a scoped label (ClearScreen2)
lda #'a'
sta clearScreen2.fillbyte
jsr clearScreen2
rts

ClearScreen2: {
    .label fillbyte = *+1
    lda #0
    ldx #0
loop:
    sta $0400,x
    sta $0500,x
    sta $0600,x
    sta $0700,x
    inx
    bne loop
    rts
}
```

```asm
// Example: Loop label arrays with `.for` loop
.for (var i=0; i<20; i++) {
    lda #i
    sta loop2[i].color+1
}

loop2: .for (var i=0; i<20; i++) {
color: lda #0
    sta $d020
}
```

## References

- [Kick Assembler Manual: Label Scopes](https://www.theweb.dk/KickAssembler/webhelp/content/ch09s06.html)
- [Kick Assembler Manual: Accessing Local Labels of For / While loops](https://theweb.dk/KickAssembler/webhelp/content/ch09s08.html)