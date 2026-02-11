# Zero Page: LDA/STA Cycle Optimization

**Summary:** Zero page addressing ($0000-$00FF) on the 6502/C64 reduces LDA/STA cycle cost: zero page LDA/STA take 3 cycles vs 4 cycles for absolute addressing; use zero page for frequently accessed variables and counters.

**Use the Zero Page**

LDA/STA to zero page addresses ($00nn) execute in 3 clock cycles on the 6502, while the same instructions using absolute addressing ($nnnn) take 4 clock cycles. Reserve zero page locations for frequently accessed variables, pointers, loop counters, or temporaries to save cycles and reduce code size (zero page addressing also uses a shorter opcode encoding).

Do not duplicate zero page use for large data blocks — it is limited to 256 bytes and may conflict with system/OS vectors; plan allocation accordingly.

## Source Code

```asm
; Example: zero page variables (faster)
; Assume $10 and $11 are reserved in zero page
LDA $10      ; Zero page addressing — 3 cycles
STA $11      ; Zero page addressing — 3 cycles

; Example: absolute addresses (slower)
LDA $C000    ; Absolute addressing — 4 cycles
STA $C001    ; Absolute addressing — 4 cycles
```

## References

- "An Introduction to Programming C-64 Demos" — zero page performance tip (LDA/STA cycles)

## Mnemonics
- LDA
- STA
