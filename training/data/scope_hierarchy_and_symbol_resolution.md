# Kick Assembler: nested-scope symbol resolution (jmp label lookup)

**Summary:** Explains Kick Assembler symbol resolution through nested scopes (System <- Root <- BracketScope1 <- BracketScope2). Demonstrates that symbol lookup walks from the innermost scope outward so "jmp loop" picks the innermost label and "jmp start" picks the Root scope label; mentions .filenamespace usage.

**Scope resolution behavior**

Kick Assembler resolves symbols by searching the active scope first, then ascending through parent scopes until a match is found (System <- Root <- ...). Given a nested scope hierarchy:

- System (global built-ins)
- Root (file/global root scope)
- BracketScope1 (a nested bracket-created scope)
- BracketScope2 (an inner nested bracket scope)

A reference to a label is resolved in the innermost scope that contains the label. Examples stated in the source:

- "jmp loop" resolves to the label named loop that lives in BracketScope2 (the innermost matching scope).
- "jmp start" resolves to the label named start that lives in the Root scope (no closer match in inner scopes).

The .filenamespace directive (shown in FILE 2) places symbols in a named file namespace (here "part2") which is related to the same resolution mechanism. Namespaces are resolved similarly but are an orthogonal feature to nested bracket scopes.

## Source Code

```asm
; FILE 1
*=$1000

start:
    lda #$00
    sta $d020
    jmp exec

exec:
    ldx #$00
    loop:
        inx
        cpx #$10
        bne loop
    rts

; FILE 2
.filenamespace part2

init:
    lda #$01
    sta $d020
    rts

exec:
    ldx #$00
    loop:
        dex
        cpx #$f0
        bne loop
    rts
```

In this example, the `loop` label within each `exec` routine is resolved based on the innermost scope. The `start` label in FILE 1 is in the Root scope, so a `jmp start` within any nested scope in FILE 1 will resolve to this label.

## References

- "namespace_directive_and_namespace_field_access" — expands on namespaces and how they are resolved (related behavior).
