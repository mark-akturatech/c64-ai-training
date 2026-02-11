# Parentheses (Kick Assembler — Section 4.5)

**Summary:** Explains Kick Assembler's use of soft parentheses () and hard brackets [] to control expression evaluation and grouping, and notes that soft parentheses in 65xx assembly also denote indirect addressing (e.g. jmp ($1000)).

## Parentheses and brackets — behavior
- Soft parentheses () and hard brackets [] are both used to control order of evaluation in expressions. They group sub-expressions and affect how the assembler evaluates arithmetic before assembling operands or immediates.
- Example with immediates:
  - lda #2+5*2 evaluates multiplication before addition (5*2 = 10; 2+10 = 12) → lda #12
  - lda #(2+5)*2 forces (2+5)=7, then *2 → lda #14
  - lda #[2+5]*2 uses hard brackets for grouping and yields the same numeric result as the previous example → lda #14
- Soft parentheses are also the conventional 65xx assembler syntax for indirect addressing:
  - jmp ($1000) — assembler generates a JMP (indirect) that reads the jump vector from memory at $1000
  - jmp [$1000] — using hard brackets here prevents the soft-parenthesis indirect interpretation and yields a plain absolute JMP operand (as described in this section)
- Nesting: any depth of nesting is allowed; complex nested expressions such as (([((2+4))])*3)+25.5 are legal and evaluated according to the normal arithmetic/grouping rules.

## Source Code
```asm
; Examples from section 4.5

lda #2+5*2     ; gives lda #12
lda #(2+5)*2   ; gives lda #14
lda #[2+5]*2   ; gives lda #14

jmp ($1000)    ; Creates a jmp indirect command
jmp [$1000]    ; Creates a jmp absolute command

; Nested example (legal expression):
; (([((2+4))])*3)+25.5
```

## References
- "argument_types_and_addressing_modes" — expands on indirect addressing syntax and assembly interpretation

## Mnemonics
- JMP
