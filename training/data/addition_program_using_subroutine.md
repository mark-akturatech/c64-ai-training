# Simple single-digit addition using the numeric-input subroutine

**Summary:** A 6502 assembly program placed at $0352 that calls the numeric-input subroutine at $033C, stores the first digit at $03C0, prints '+' and '=' via KERNAL CHROUT ($FFD2), uses TAX/TXA to save/restore the second digit, performs ADC $03C0 with CLC, converts the 0–9 result to ASCII with ORA #$30, and prints the result; run with BASIC SYS 850.

## Description
This program implements a minimal two-digit addition where each operand is a single numeric key returned by the numeric-input subroutine at $033C (returns binary 0–9 in A and echoes the digit). Sequence:

- Start execution at $0352 (SYS 850).
- JSR $033C to get first digit (A = 0–9, digit already echoed).
- STA $03C0 saves the first binary digit in RAM.
- LDA #$2B / JSR $FFD2 prints '+' (KERNAL CHROUT).
- JSR $033C to get second digit (A = 0–9, echoed).
- TAX copies the second digit to X (TAX/TXA affect Z and N flags).
- LDA #$3D / JSR $FFD2 prints '='.
- TXA restores second digit into A.
- CLC then ADC $03C0 adds the saved first digit into A (result 0–18 assumed).
- ORA #$30 converts a 0–9 binary result to ASCII (works only for results 0–9).
- JSR $FFD2 prints the result character.
- LDA #$0D / JSR $FFD2 prints carriage return.
- RTS returns control.

Caveats:
- The program assumes the sum is 0–9; two-digit results (>=10) will not be displayed correctly.
- $03C0 is used as temporary storage for the first operand; ensure your environment does not require that location.

## Source Code
```asm
; Assemble at $0352 and SYS 850 from BASIC to run
        .org $0352
$0352:   JSR $033C        ; get and echo first numeric key (A = 0-9)
$0355:   STA $03C0        ; save first operand
$0358:   LDA #$2B         ; ASCII '+'
$035A:   JSR $FFD2        ; CHROUT - print '+'
$035D:   JSR $033C        ; get and echo second numeric key (A = 0-9)
$0360:   TAX              ; save second operand in X (sets Z/N)
$0361:   LDA #$3D         ; ASCII '='
$0363:   JSR $FFD2        ; CHROUT - print '='
$0366:   TXA              ; restore second operand to A
$0367:   CLC
$0368:   ADC $03C0        ; add first operand (result in A)
$036B:   ORA #$30         ; convert 0-9 binary to ASCII digit
$036D:   JSR $FFD2        ; CHROUT - print result
$0370:   LDA #$0D         ; ASCII CR
$0372:   JSR $FFD2        ; CHROUT - print CR
$0375:   RTS              ; return
```

## Key Registers
- $0352 - RAM - program start (SYS 850)
- $033C - ROM/Routine - numeric-input subroutine entry (returns binary 0–9 in A, echoes digit)
- $03C0 - RAM - temporary storage for first operand (binary 0–9)
- $FFD2 - KERNAL - CHROUT (print character)

## References
- "subroutines_intro_and_example" — expands on the numeric-input subroutine used here
- "immediate_mode" — expands on use of immediate ASCII constants like #$2B and #$3D

## Labels
- CHROUT
