# ca65: Deleting macros (.DELMACRO vs .UNDEFINE)

**Summary:** Explains ca65 macro deletion: classic macros use .DELMACRO/.DELMACRO-style names and .DEFINE-style macros use .UNDEFINE; .UNDEFINE must disable macro replacement at scan time so its argument cannot come from another .DEFINE.

## Deleting macros
- Classic (".macro / .endmacro") macros are removed with .DELMACRO (also written .delmacro). Deleting a classic macro while it is currently being expanded will fail.
- .DEFINE-style macros (simple text replacements) must be removed with .UNDEFINE (also written .undefine). .UNDEFINE reads its argument with macro replacement switched off (scanner-level), so the name passed to .UNDEFINE cannot itself be produced by another .DEFINE.
- Rationale: .DEFINE replacements occur at a very low scanner level, so the assembler must suppress replacement when determining which .DEFINE to remove; this is unnecessary for classic macros, hence two separate commands.

Example behavior:
- Attempting to .DELMACRO/.delmacro a macro from inside that macro's own expansion does not work.
- After .UNDEFINE of a .DEFINE name and .DELMACRO of a classic macro, references to those names become unknown identifiers (errors).

## Source Code
```asm
; Non-working example: deleting a macro while it's being expanded
.macro  notworking
        .delmacro       notworking
.endmacro

        notworking              ; Will not work
```

```asm
; Example showing .DEFINE and classic .macro, then removal
.define value   1
.macro  mac
        .byte   2
.endmacro

        .byte   value           ; Emit one byte with value 1
        mac                     ; Emit another byte with value 2

.undefine value
.delmacro mac

        .byte   value           ; Error: Unknown identifier
        mac                     ; Error: Missing ":"
```

## References
- "c_style_macros" — expands on why .UNDEFINE differs from .DELMACRO
