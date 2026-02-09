# ca65 .DEFINE-style (C-style) macros

**Summary:** .DEFINE C-style macros in ca65 are single-line, scanner-level replacement macros that share the macro namespace with classic macros; they allow parameter lists in parentheses (required in the definition), require exact parameter counts, permit use anywhere in a line, and use {} to terminate the last argument when needed.

## Behavior and rules
- .DEFINE macros are single-line (no end-of-line tokens). You may use line continuation to break the source text across physical lines, but the macro expansion must not include EOL tokens or multiple logical instructions.
- Detection/replacement happens at the scanner level (before normal parsing). This allows .DEFINE macros to appear anywhere in a line, not only where mnemonics/directives are allowed (unlike classic macros).
- .DEFINE macros share the same namespace as classic macros; name collisions are not allowed.
- Formal parameter list:
  - When defining a macro with parameters, formal parameters must be enclosed in parentheses in the .DEFINE line: .define NAME(param1,param2)
  - If the macro takes no parameters, the empty parentheses may be omitted.
  - At invocation time, do NOT include parentheses around the actual arguments; arguments are passed by comma separation only. Parentheses typed at invocation become part of the replacement token.
  - Empty parameters are not permitted: the number of actual parameters must match exactly the number of formal parameters.
- To allow an expression to immediately follow the macro invocation (so the parser recognizes where the last argument ends), enclose the last parameter in curly braces {} in the definition; this marks the end of that argument in contexts where ambiguous trailing tokens exist.
- Because .DEFINE expansions are single-token replacements, they cannot expand into multiple processor instructions or contain EOL tokens; use classic macros for multi-statement expansions.
- Parentheses are significant in assembly (they can denote addressing modes). Wrapping the expansion or arguments in parentheses (a common C practice) can change the addressing mode (e.g., create indirect addressing). Exercise caution when including parentheses in either the macro body or invoking text.

## Source Code
```asm
; Example: emulate EQU using .DEFINE
.define EQU     =

foo     EQU     $1234           ; This is accepted now

; Define a string constant
.define VERSION "12.3a"

        ; ... and use it
        .asciiz VERSION

; Macro with one parameter
.define DEBUG(message)  .out    message

        DEBUG   "Assembling include file #3"

; COMBINE example (curly braces to terminate last arg)
.define COMBINE(ta,tb,tc) ta+tb*10+tc*100

.word COMBINE 5,6,7      ; -> 5+6*10+7*100 = 765
.word COMBINE(5,6,7)     ; -> (5+6*10+7)*100 = 7200 ; incorrect: parentheses became part of token
.word COMBINE 5,6,7+1    ; -> 5+6*10+7+1*100 = 172
.word COMBINE 5,6,{7}+1  ; -> 5+6*10+7*100+1 = 766 ; {} encloses the argument
.word COMBINE 5,6-2,7    ; -> 5+6-2*10+7*100 = 691
.word COMBINE 5,(6-2),7  ; -> 5+(6-2)*10+7*100 = 745
.word COMBINE 5,6,7+COMBINE 0,1,2    ; -> 5+6*10+7+0+1*10+2*100*100 = 20082
.word COMBINE 5,6,{7}+COMBINE 0,1,2  ; -> 5+6*10+7*100+0+1*10+2*100 = 975

; Parentheses affecting addressing mode
.define DUO(ta,tb) (ta+(tb*10))

        lda DUO(5,4), Y         ; LDA (indirect), Y  <-- parentheses in expansion imply indirect
        lda 0+DUO(5,4), Y       ; LDA absolute indexed, Y
```

## Key Registers
- (none) This chunk does not describe hardware registers.

## References
- "macro_parameters_and_curly_braces" — expands on classic macro parameter behavior vs .DEFINE behavior
- "macro_detect_parameter_types" — token/list handling considerations when mixing macros