# NMOS 6510 — SAX practical examples: masked store and sprite-pointer update

**Summary:** Two compact NMOS 6510 SAX usage examples: 1) using LDX to set a mask and SAX to store A & X (masking write); 2) a compact sequence to update eight sprite pointers with alternating SAX/STA writes. Searchable terms: SAX, LDX, LDA, STA, sprite pointers, $1000, screen + $3f8.

**Masked store example**
Shows how to set a persistent mask in X and then store A combined with that mask into memory using SAX (SAX stores A AND X to memory). The example loads X with the mask, loads A from memory, then performs SAX with an indexed store.

**Update Sprite Pointers example**
Compact pattern to set up eight sprite-pointer bytes using SAX (A & X) to write masked values and STA to write the raw A value where needed. The listing interleaves SAX and STA writes; inline comments in the source show the resulting stored byte values for each target address.

## Source Code
```asm
; Example: store values with mask
LDX #$AA         ; set up mask in X
LDA $1000,Y      ; load A from memory (indexed by Y)
SAX $0080,Y      ; store (A AND X) into memory at $0080+Y

; Example: update Sprite Pointers (compact sequence)
; This demonstrates setting eight consecutive bytes starting at (screen + $03F8)
; Comments indicate the resulting stored byte values at each address.

    LDA #$01        ; A = %00000001
    LDX #$FE        ; X = %11111110  (mask)
    SAX screen+$03F8 ; store A & X -> resulting byte $00
    STA  screen+$03F9 ; store A      -> resulting byte $01

    LDA #$03        ; A = %00000011
    SAX screen+$03FA ; store A & X -> resulting byte $02
    STA  screen+$03FB ; store A      -> resulting byte $03

    LDA #$05        ; A = %00000101
    SAX screen+$03FC ; store A & X -> resulting byte $04
    STA  screen+$03FD ; store A      -> resulting byte $05

    LDA #$07        ; A = %00000111
    SAX screen+$03FE ; store A & X -> resulting byte $06
    STA  screen+$03FF ; store A      -> resulting byte $07
```

## References
- "sax_overview_and_operation" — expands on SAX semantics and effects used by these examples  
- "sax_alternative_sprite_method" — describes an alternative approach that swaps roles of A and X

## Mnemonics
- SAX
- AXS
