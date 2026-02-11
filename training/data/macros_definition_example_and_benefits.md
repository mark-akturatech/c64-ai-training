# Macros — DBINC two-byte increment example

**Summary:** Introduces assembler macros (.MAC) with a DBINC example that increments a two-byte (little-endian) value using 6502 instructions (LDA, ADC, STA, CLC). Shows macro parameters (?1, ?2), a usage example (DBINC SCORE,$20), and the assembler-expanded instruction sequence.

**Macro description**
A macro is shorthand that expands to a sequence of assembly instructions. The DBINC example shows a macro that adds an 8-bit immediate to a 16-bit (two-byte, little-endian) value in memory. Parameters used here:

- ?1 — address (label) of the low byte (macro parameter)
- ?2 — 8-bit immediate value to add (macro parameter)

Operation summary: load the low byte, clear carry, add the immediate with ADC (sets carry if low-byte overflow), store low byte, load high byte, ADC #$00 (adds the carry into the high byte), store high byte. This preserves correct 16-bit addition via the 6502 ADC/C flag.

**Note:** The original source shows the end-of-macro marker as ',MND', which appears to be a typographical error. Common assemblers use '.ENDM' or '.MEND' to denote the end of a macro definition. ([mads.atari8.info](https://mads.atari8.info/mad-assembler-mkdocs/en/?utm_source=openai))

**Usage and expanded code**
Use the macro with a label and an immediate:

DBINC SCORE,$20

Assembler expansion (what the macro produces):

LDA SCORE
CLC
ADC #$20
STA SCORE
LDA SCORE+1
ADC #$00
STA SCORE+1

This avoids repeatedly typing the same instruction sequence, improving readability and speeding development when macros are gathered into a library.

## Source Code
```asm
; Macro definition (corrected)
.MAC DBINC   ; DBINC ?1, ?2  ; ?1 = low-byte address, ?2 = immediate byte
    LDA ?1          ; load lower byte
    CLC             ; clear carry
    ADC #?2         ; add immediate to lower byte
    STA ?1          ; store lower byte
    LDA ?1+1        ; load upper byte
    ADC #$00        ; add carry into upper byte
    STA ?1+1        ; store upper byte
.ENDM              ; end of macro (corrected from ',MND')
```

```asm
; Example usage
DBINC SCORE,$20

; Expanded by assembler:
LDA SCORE
CLC
ADC #$20
STA SCORE
LDA SCORE+1
ADC #$00
STA SCORE+1
```

## References
- "symbolic_names_and_program_readability" — expands on symbolic names and program readability
- "macros_vs_subroutines_memory_tradeoff" — expands on when to use subroutines instead of macros (memory tradeoffs)
