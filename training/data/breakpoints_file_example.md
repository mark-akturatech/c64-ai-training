# Kick Assembler: breakpoints (VICE) and modifiers (.filemodify / .modify)

**Summary:** Kick Assembler examples for creating a breakpoint file via createFile/.var/.macro and invoking VICE with -moncommands, plus usage of modifiers (.filemodify and .modify) to post-process assembled bytes with a Java plugin modifier.

## Breakpoint file generation for VICE
Kick Assembler can create and write user files at assemble time. The example shows creating a plaintext breakpoint file and emitting "break" monitor commands containing the current assembly address (using *). The generated file can be passed to VICE with the -moncommands option so the emulator will execute those monitor commands (for example: run until the breakpoint and enter the monitor).

Key points:
- createFile(filename) returns a file handle you can use in assembly-time code.
- .var stores the handle for later use in macros or .eval.
- .macro/.eval can be used to write lines containing computed values such as the current origin (*).
- toHexString(*) converts the current assembly address to a hex string appropriate for VICE monitor commands.
- Run VICE with -moncommands breakpoints.txt to load the file and execute the listed monitor commands.

## Modifiers (.filemodify and .modify)
Modifiers let you change assembled output bytes before they are written to the target file (useful for encryption, packing, crunching, etc.). Currently, creating a modifier requires implementing a Java plugin.

- .filemodify ModifierName(params)
  - Placed at the top of the source file to apply the modifier to the entire assembled file.
  - Example: .filemodify MyModifier(25)

- .modify ModifierName(params) { ... }
  - Applies the modifier only to the bytes assembled inside the block.
  - Example block sets origin and then labels/bytes which would be modified by MyModifier.

Note: Implementation of the modifier itself is outside Kick Assembler script — it must be written as a Java plugin per the plugin chapter.

## Source Code
```asm
; Breakpoint file creation example
.var brkFile = createFile("breakpoints.txt")

.macro break() {
    .eval brkFile.writeln("break " + toHexString(*))
}

; use break() inside code to emit breakpoint entries
; e.g.
    *= $0800
main:
    lda #$01
    break()     ; writes "break $0802" (address shown as example)
    jmp main

; Run VICE with:
; x64 -moncommands breakpoints.txt
```

```asm
; Modifiers examples

; modify the whole assembled file with MyModifier called with parameter 25
.filemodify MyModifier(25)

; modify a limited block
.modify MyModifier() {
    *= $8080
main:
    ; assembled bytes here are passed to MyModifier for modification
}
```

## References
- "writing_to_user_defined_files_createfile" — file creation security and usage