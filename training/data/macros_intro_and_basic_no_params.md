# ca65: .macro/.endmacro — Macros without parameters

**Summary:** ca65 .macro/.endmacro defines token-sequence macros (assembly-time textual expansion). This node covers parameterless macros: definition, expansion semantics (tokens inserted into output), and a minimal example (ASR).

## Overview
A ca65 macro is a named sequence of tokens that is expanded at assembly time: whenever the macro name appears in the source the assembler replaces that name with the tokens from the macro body. In the simplest form a macro has no parameters — it is a fixed token sequence.

Macro expansion is literal/token-level insertion into the code (not a runtime subroutine). Use the macro name where you want the tokens emitted.

## Macros without parameters
- Definition: start with .macro <name> and end with .endmacro.
- No parameters: the body is a fixed set of tokens/instructions.
- Expansion: writing the macro name in the code causes the assembler to replace the name with the macro body tokens; the resulting instructions are assembled in-place as if they were written directly.

Example semantics shown: an ASR (arithmetic shift right) macro that captures bit 7 into carry via CMP #$80 and performs ROR.

## Source Code
```asm
.macro  asr             ; Arithmetic shift right
        cmp     #$80    ; Put bit 7 into carry
        ror             ; Rotate right with carry
.endmacro

        lda     $2010
        asr
        sta     $2010
```

## References
- "parametrized_macros_and_parameter_handling" — parameterized macros, empty parameters, and control commands (.IFBLANK/.IFNBLANK)
- "c_style_define_macros" — single-line .DEFINE C-style macros and differences