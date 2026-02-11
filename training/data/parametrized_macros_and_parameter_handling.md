# ca65 Parametrized Macros (.macro/.endmacro, .IFBLANK/.IFNBLANK, .PARAMCOUNT)

**Summary:** Parameterized ca65 macros using .macro/.endmacro support named parameter substitution, multiple parameters separated by commas, explicitly empty parameters, conditional emission with .IFBLANK/.IFNBLANK, counting with .PARAMCOUNT, and grouping parameters containing commas or parentheses with curly braces.

## Parameter substitution and calling
A macro parameter name in the .macro definition is textually replaced by the argument given at the call site. Multiple parameters are separated by commas. You may supply fewer arguments than the macro declares; explicitly empty parameters (adjacent commas) are replaced by nothing at expansion time. Avoid using parameter names "a", "x", or "y" because they typically conflict with 6502 register names.

(See Source Code for the inc16 example and its expansion.)

## Variable parameter lists and conditional emission
Use .IFBLANK and .IFNBLANK inside macro bodies to test whether the remainder of the current parameter is blank (empty) or not, allowing macros to emit code conditionally depending on which arguments were supplied.

**[Note: Source may contain an error — .IFBLANK semantics are often misstated in the original text. Correct behavior: .IFBLANK is true when the tested remainder is empty; .IFNBLANK is true when it is not empty.]**

.PARAMCOUNT is replaced by the count of parameters in the invocation, including explicitly-empty parameters (i.e., "1,,3" yields a count of 3). This can be used for dispatch within a macro.

(See Source Code for the ldaxy examples and .PARAMCOUNT replacements.)

## Parameter grouping with curly braces
Wrap a parameter in curly braces to prevent commas or other tokens inside it from being treated as parameter separators. Without braces, commas split parameters; with braces the entire braced expression becomes a single parameter.

(See Source Code for the foo/{...} example.)

## Source Code
```asm
; inc16 macro definition
.macro  inc16   addr
        clc
        lda     addr
        adc     #<$0001
        sta     addr
        lda     addr+1
        adc     #>$0001
        sta     addr+1
.endmacro

; Example call:
        inc16   $1000

; Expanded result (what the assembler emits after macro expansion):
        clc
        lda     $1000
        adc     #<$0001
        sta     $1000
        lda     $1000+1
        adc     #>$0001
        sta     $1000+1
```

```asm
; ldaxy macro: conditional emission depending on which parameters are present
.macro  ldaxy   i, j, k
.ifnblank       i
        lda     #i
.endif
.ifnblank       j
        ldx     #j
.endif
.ifnblank       k
        ldy     #k
.endif
.endmacro

; Calls and effects:
        ldaxy   1, 2, 3         ; emits: lda #1 / ldx #2 / ldy #3
        ldaxy   1, , 3          ; emits: lda #1 /        / ldy #3 (ldx omitted)
        ldaxy   , , 3           ; emits:                   / ldy #3 (only ldy)
```

```asm
; .PARAMCOUNT examples (the assembler replaces .PARAMCOUNT with the numeric count)
        ; inside a macro expansion, these examples show resulting .PARAMCOUNT value:
        ; ldaxy   1       ; .PARAMCOUNT = 1
        ; ldaxy   1,,3    ; .PARAMCOUNT = 3
        ; ldaxy   1,2     ; .PARAMCOUNT = 2
        ; ldaxy   1,      ; .PARAMCOUNT = 2
        ; ldaxy   1,2,3   ; .PARAMCOUNT = 3
```

```asm
; Grouping parameters with curly braces
.macro  foo     arg1, arg2
        ; ...
.endmacro

        foo     ($00,x)         ; Two parameters: '($00' and 'x)'
        foo     {($00,x)}       ; One parameter: '($00,x)'
```

## References
- "macros_intro_and_basic_no_params" — Basic macros without parameters and simple expansion examples
- "parameter_type_detection_match_functions" — Detecting parameter types (.MATCH, .LEFT, .RIGHT)
- "recursive_macros_and_exitmacro" — Using parameter tests in recursive macros and termination with .EXITMACRO
