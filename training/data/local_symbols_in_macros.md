# ca65: Local symbols inside macros (.LOCAL and lexical blocks)

**Summary:** Demonstrates ca65 macro symbol collision and solutions using .LOCAL (per-expansion unique names) and lexical blocks (.proc/.endproc) to hide labels, using the inc16 macro and the reusable label "Skip" as an example.

## Problem and solutions
Reusable labels inside macros (for example a label named Skip) produce "duplicate symbol" errors when the macro is expanded more than once because each expansion introduces the same global symbol name into the assembly. Two supported solutions in ca65:

- .LOCAL name[,name...] — declares one or more symbols local to the macro expansion; the assembler replaces each declared symbol with a unique name for every expansion, preventing collisions.
- .proc / .endproc — starts a new lexical block inside the macro; labels declared inside that block are not visible outside it, so repeated macro expansions do not create global duplicate labels.

Both techniques are demonstrated below with the inc16 macro (increments a 16-bit value stored at addr, low byte at addr, high byte at addr+1). The original implementation (ADC sequence), a compact but colliding variant (uses Skip), and two ways to fix it (.LOCAL and .proc) are provided.

## Source Code
```asm
; Original inc16 using ADC (no internal labels)
.macro  inc16   addr
        clc
        lda     addr
        adc     #<$0001
        sta     addr
        lda     addr+1
        adc     #>$0001
        sta     addr+1
.endmacro
```

```asm
; Compact version that collides if used multiple times (duplicate symbol "Skip")
.macro  inc16   addr
        inc     addr
        bne     Skip
        inc     addr+1
Skip:
.endmacro
```

```asm
; Solution 1: make the label local to each expansion
.macro  inc16   addr
        .local  Skip            ; Make Skip a local symbol (unique per expansion)
        inc     addr
        bne     Skip
        inc     addr+1
Skip:                           ; Not visible outside the expansion
.endmacro
```

```asm
; Solution 2: use a lexical block to hide labels
.macro  inc16   addr
.proc
        inc     addr
        bne     Skip
        inc     addr+1
Skip:
.endproc
.endmacro
```

## References
- "recursive_macros_and_exitmacro" — combining recursion with local labels to create reusable macros
- "c_style_define_macros" — contrast classic macros with .DEFINE-style macros and their different behavior
