# Kick Assembler: exporting with '@' and filenamespace library examples

**Summary:** Examples for Kick Assembler demonstrating the use of the '@' operator to place variables/definitions into the root scope from inside another scope (.label @x, .var @y, .const @z), and a library file using .filenamespace with exported .function/.macro/.pseudo-commands. Also illustrates label directive usage for a fill byte inside a scoped subroutine (clearScreen2).

**Description**
This chunk demonstrates two related Kick Assembler techniques:

- Using '@' to place definitions into the root (global) scope from within another scope:
  - Examples: `.label @x = 1234`, `.var @y = "Hello world"`, `.const @z = true`
  - Useful when a library or nested scope must export names to the top-level namespace.

- Writing a library file that exports root-level entities:
  - Example pattern: `.filenamespace MyLibrary` followed by `.function @myFunction()`, `.macro @MyMacro()`, and `.macro @MyPseudoCommand` to make those available at the root scope when the library is included.

- Label directive technique inside a scoped subroutine to expose a nearby data byte (fillbyte):
  - The subroutine block defines `.label fillbyte = *+1` so callers can write to the byte using the fully-qualified name (e.g., `clearScreen2.fillbyte`) before jumping to the routine.

The provided assembly examples show a basic screen-clear loop that fills character memory pages, and an alternative that uses a named fill byte defined inside the subroutine block.

## Source Code
```asm
; Examples of using '@' to export to root scope from inside another scope:
.label @x = 1234
.var @y = "Hello world"
.const @z = true

; Library file example (mylib.lib):
.filenamespace MyLibrary
.function @myFunction()
    ; function body...
.endfunction
.macro @MyMacro()
    ; macro body...
.endmacro
.macro @MyPseudoCommand
    ; pseudo-command body...
.endmacro
; End of library

; Basic clear loop (fills screen with black spaces)
loop:
    sta $0400,x
    sta $0500,x
    sta $0600,x
    sta $0700,x
    inx
    bne loop
    rts

; Caller that uses a fillbyte label defined inside the subroutine
lda #'a'
sta clearScreen2.fillbyte
jsr clearScreen2
rts

; Scoped clear routine that defines a fillbyte label inside the block
clearScreen2: {
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

## References
- "filenamespace_example_files" — expands on library and .filenamespace usage and examples