# NMOS 6510 — Alternate sprite-pointer update by swapping A and X (SAX + STX interleave)

**Summary:** Example assembly showing an alternate method to update sprite pointers by swapping the roles of A and X and interleaving the undocumented SAX opcode with STX writes; stores pointer low bytes as A&X and high bytes as X (addresses shown as offsets like screen + $3f8). (SAX = undocumented NMOS 6502 opcode storing A AND X.)

## Explanation
This snippet uses LDX as the evolving index/counter and LDA to supply a mask so that SAX (A&X -> (mem)) produces the desired low bytes, while STX writes the high bytes. The writes are interleaved so that each pair of writes produces a 16-bit little-endian pointer: (low = A&X), (high = X). For the shown values this results in stored words: (0,4), (1,5), (2,6), (3,7) at the consecutive target locations.

Key points:
- LDX is initialized to #$04 and incremented with INX each iteration.
- LDA is set to #$FB (binary 11111011); bit 2 in A is zero, so A&X maps X values $04–$07 down to low bytes $00–$03.
- SAX writes A&X to the low-byte locations; STX writes X to the high-byte locations.
- The sequence produces four pointer pairs stored at the block starting "screen + $3f8".."+$3ff".
- The author notes this saves 3 bytes of code size compared to the original approach, but does not save cycles.

## Source Code
```asm
LDX #$04

; X = %00000100

LDA #$fb

; A = %11111011

SAX screen + $3f8 ; $00
STX screen + $3fc ; $04
INX

; X = %00000101

SAX screen + $3f9 ; $01
STX screen + $3fd ; $05
INX

; X = %00000110

SAX screen + $3fa ; $02
STX screen + $3fe ; $06
INX

; X = %00000111

SAX screen + $3fb ; $03
STX screen + $3ff ; $07
```

## References
- "sax_examples_mask_and_sprite_primary" — expanded comparison with the original sprite-pointer example
- "sax_overview_and_operation" — detailed SAX opcode semantics and behavior

## Mnemonics
- SAX
