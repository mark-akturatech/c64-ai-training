# Kick Assembler — .filenamespace (file namespaces and root exports)

**Summary:** Demonstrates Kick Assembler's .filenamespace directive for scoping labels to a file (avoids name collisions), calling namespaced labels like part1.init from other files, and using the @ prefix to place newly defined labels/.label/.var/.const into the root scope.

## Description
.filenamespace placed at the top of a file makes subsequent labels and definitions belong to that file's namespace (example: .filenamespace part1). Other files can refer to those symbols using namespace-qualified names (e.g. part1.init). This prevents label collisions across multi-file projects.

From within a namespace you can still create symbols in the global/root scope by prefixing the symbol name with @ when defining it (for labels, .label, .var, .const). That lets a file-local block export specific symbols to the root while keeping most identifiers namespaced.

A .filenamespace affects labels and definitions that follow it. The @-prefix syntax explicitly writes the symbol into the root scope instead of the current namespace.

## Source Code
```asm
/* FILE 0 */
/* calls into other files' namespaces */
    jsr part1.init
    jsr part2.exec
```

```asm
/* FILE 1 */
.filenamespace part1

init:
    ; init code for part1
    rts

exec:
    ; exec code for part1
    rts
```

```asm
/* FILE 2 */
.filenamespace part2

exec:
    ; exec code for part2
    rts
```

```asm
; Example: creating a root-scoped label from inside a block/namespace
jsr outside_label
rts

{
@outside_label:
    lda #$00
    sta $D020
    sta $D020
    rts
}
```

```text
; Example: defining root-scope .label,.var,.const from inside a block
{
.label @x = 1234
.var   @y = "Hello world"
.const @z = true
}
.print "x="+x
.print "y="+y
.print "z="+z
```

## References
- "namespace_usage_and_filenamespace_intro" — expands on intro to .filenamespace
