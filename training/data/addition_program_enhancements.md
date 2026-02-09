# Simple two-digit addition (SYS 850) — machine routine for two single-digit keys (0–9 → 0–18)

**Summary:** 6502 machine routine (at $0352 / SYS 850) that reads two numeric PETSCII keys using KERNAL CHRIN ($FFE4), adds them, checks for result ≥ 10 (CMP #$0A), prints a leading '1' via CHROUT ($FFD2) when needed, subtracts ten (SBC #$0A) and prints the final digit. Uses ADC/SBC/CLC/SEC; ends with RTS so BASIC returns.

## Main routine
Algorithm (concise):
- JSR $FFE4 to read first key (PETSCII in A), convert digit to binary by subtracting $30, store.
- JSR $FFE4 to read second key, convert and store.
- Add the two binary digits (0–9 each). Store sum.
- If sum < 10: convert sum back to PETSCII (add $30) and JSR $FFD2 to print single digit.
- If sum ≥ 10: JSR $FFD2 to print PETSCII '1' ($31), subtract 10 from the sum (SBC #$0A), convert remainder to PETSCII (add $30) and JSR $FFD2 to print second digit.
- RTS to return to BASIC. Run from BASIC with: SYS 850

(Uses KERNAL input/output: CHRIN = $FFE4, CHROUT = $FFD2.)

## Source Code
```asm
        * = $0352         ; load address decimal 850 (SYS 850)

        ; Read two numeric keys, add, handle 2-digit result (max 18)
START:
        JSR $FFE4         ; CHRIN - get first PETSCII char -> A
        SEC
        SBC #$30          ; convert PETSCII '0'..'9' -> 0..9
        STA NUM1

        JSR $FFE4         ; CHRIN - get second PETSCII char -> A
        SEC
        SBC #$30          ; convert to 0..9
        STA NUM2

        LDA NUM1
        CLC
        ADC NUM2          ; A = sum (0..18)
        STA SUM

        CMP #$0A          ; compare with 10
        BCC PrintSingle   ; if sum < 10 -> single-digit print

        ; sum >= 10 -> print leading '1', subtract 10, print remainder
        LDA #$31          ; PETSCII '1'
        JSR $FFD2         ; CHROUT - print '1'

        LDA SUM
        SEC
        SBC #$0A          ; subtract 10 -> remainder 0..8
        CLC
        ADC #$30          ; convert to PETSCII digit
        JSR $FFD2         ; CHROUT - print second digit
        JMP Done

PrintSingle:
        LDA SUM
        CLC
        ADC #$30          ; convert to PETSCII
        JSR $FFD2         ; CHROUT - print single digit

Done:
        RTS               ; return to BASIC

; zero-page variables
NUM1    = $FB
NUM2    = $FC
SUM     = $FD
```

## Key Registers
- (none) — this chunk uses KERNAL entry points ($FFE4 / $FFD2) for I/O, not direct VIC/CIA/SID registers.

## References
- "addition_program_using_subroutine" — expands on extension to handle multi-digit output and carry