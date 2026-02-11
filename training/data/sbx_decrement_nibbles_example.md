# NMOS 6510 — Example: decrement two packed 4-bit nibbles in one byte

**Summary:** Two methods to decrement both 4-bit nibbles inside a single byte (low nibble causes borrow into high nibble). Shows a conventional BIT/ADC/SBC sequence and a shorter unsigned SBX trick. Searchable terms: SBX, SBC, ADC, BIT, $0400,Y, zero page $02, nibbles, 6510.

## Technique
This chunk shows two sequences that decrement both nibbles (low and high) of a packed byte at $0400,Y. When the low nibble underflows, the high nibble must be decremented (borrow). The first sequence uses BIT/ADC/SBC to detect underflow and adjust with proper carry handling. The second uses the undocumented/illegal SBX trick to test the low nibble quickly (with X used as a mask) and then performs manual wrap-around and decrement with SBC, saving cycles.

Notes preserved from source:
- The conventional sequence applies a mask from zero page to test the low nibble without destroying A, sets/clears carry as needed, then uses ADC/SBC to perform adjustments.
- The SBX sequence sets X = $0F, executes SBX #$00 to produce a quick test of the low nibble (the source comment shows "-> X = A & $0f"), branches if fine, otherwise performs manual wrap-around and SBC-based decrement. The source also notes the SBX leaves the carry set for the following arithmetic.

Do not assume further undocumented SBX semantics beyond the original comments; behavior of illegal opcodes can vary between 6502 implementations.

## Source Code
```asm
; Conventional: use BIT/ADC/SBC to detect low-nibble underflow and adjust high nibble
    LDA #$0F        ; 2  set up mask beforehand (can be reused)
    STA $02         ; 2
    LDA $0400,Y     ; 4  load value
    BIT $02         ; 2  apply mask without destroying A
    BNE Fine        ; 2
    CLC             ; 2
    ADC #$10        ; 2
    SEC             ; 2  we need to set carry
    SBC #$11        ; 2
Fine:
    ; = 20 cycles total (as given)

; Alternative: use SBX trick with X = mask to test low nibble, shorter sequence
    LDA $0400,Y     ; 4  load value
    LDX #$0F        ; 2  set up mask
    SBX #$00        ; 2  check if low nibble underflows
                    ; -> X = A & $0F  (comment from source)
    BNE OK          ; 2  all fine, decrement both nibbles (cheap way, carry is set!)
    SBC #$F0        ; 2  do wrap-around by hand (adjust low nibble)
    SEC             ; 2
    SBC #$11        ; 2  decrement both nibbles
OK:
    ; carry is set already by SBX (comment from source)
    ; = 16 cycles total (as given)
```

## References
- "sbx_txa_disarm_trick" — expands on the TXA trick to prepare A/X before using SBX
- "sbx_apply_mask_to_index_example" — expands on another SBX trick that uses masking of A/X to set up indices

## Mnemonics
- SBX
