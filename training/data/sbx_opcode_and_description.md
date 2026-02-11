# NMOS 6510 undocumented opcode $CB — SBX (aka AXS / SAX / XMA)

**Summary:** NMOS 6510 undocumented immediate opcode $CB (commonly called SBX / AXS) computes X = (A & X) - imm (immediate). It is an immediate-mode combined A/X operation; sets N and Z according to the resulting X and is reported not to be affected by decimal mode.

**Description**
SBX is an undocumented combined immediate opcode on NMOS 6502-family CPUs used in the C64 (6510). Its observable effect in immediate form is:

- Compute temp = (A AND X)
- Subtract the immediate operand from temp, writing the result to X

Characteristics from NMOS behavior:
- Opcode byte: $CB
- Addressing: immediate (two bytes total: opcode + immediate)
- Operation (semantic summary): X := (A & X) - imm
- Flags:
  - N and Z reflect the result in X.
  - C is set if the subtraction does not require a borrow (i.e., if (A & X) >= imm); otherwise, C is cleared.
  - V is unaffected.
- The operation is not affected by the decimal mode flag.

Because SBX implicitly ANDs A with X before the subtraction, a common usage pattern is to set A to #$FF when you want X to be decremented by an immediate value (so A&X == X).

## Source Code
```asm
; Basic examples showing opcode byte + immediate
; opcode $CB followed by immediate byte $5A
; CB 5A
SAX #$5A        ; SAX example (store A&X to memory variants)
; CB 5A
SBX #$5A        ; SBX immediate example

; Attempted equivalent sequences using legal opcodes (illustrative, not identical)
; Simple save/restore approach (modifies memory location $02)
    STA $02         ; save A
    TXA
    AND $02         ; A <- A & (value at $02)  ; (attempt to get A&X, hacky)
    SEC
    SBC #$5A
    TAX
    LDA $02         ; restore A

; More complete approach preserving flags / avoiding decimal-mode effects
    STA $02
    TXA
    AND $02
    CMP #$5A        ; set flags like CMP
    PHP             ; save flags
    SEC
    CLD             ; ensure binary subtraction
    SBC #$5A
    LDA $02
    PLP             ; restore flags

; Decrement X by more than 1: traditional method (uses A as temp)
; takes 8 cycles (5 bytes)
    TXA
    SEC
    SBC #$xx
    TAX

; Using SBX (faster): set A = #$FF so A & X == X, then subtract immediate directly
    LDA #$FF
    SBX #$xx        ; X := (A & X) - xx  -> effectively X := X - xx
```

## References
- "lorenz-2.15/sbxb.prg" — test program for SBX
- "64doc/sbx.prg" — SBX test/example
- "64doc/vsbx.prg" — SBX validation test
- "64doc/sbx-c100.prg" — SBX test at $C100 address

## Mnemonics
- SBX
- AXS
- SAX
- XMA
