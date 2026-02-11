# 6502 — Indexed and Zero-page Indexed Addressing

**Summary:** Absolute indexed and zero-page indexed addressing add X or Y to a base address to form the effective address; zero-page indexing wraps (8-bit). Opcode selection determines which index (X or Y) is used (examples: LDA abs,X $BD, LDA abs,Y $B9, LDA zp,X $B5).

## Description
- Absolute indexed addressing: the 16-bit base address in the instruction is added to X or Y to form the 16-bit effective address used to access the operand (e.g., LDA address,X or LDA address,Y). The CPU performs full 16-bit addition (carry from low byte may change high byte).
- Zero-page indexed addressing: the instruction contains an 8-bit zero-page base address; that base is added to the X or Y register, and only the low 8 bits of the result are used (wrap-around within $00–$FF). Effective address = (base + index) & $FF.
- X vs Y: many zero-page indexed instructions are only defined with X (zero-page,X). The choice of opcode encodes whether X or Y is used for absolute-indexed forms.
- Pre-indexed indirect vs post-indexed indirect: conventionally, pre-indexed indirect modes use X to add to the zero-page pointer before indirection; post-indexed indirect modes use Y to add after the pointer is fetched (see referenced topics).
- Opcode selection: the operation code (opcode byte) determines which index register is applied. For LDA on a standard 6502:
  - LDA absolute,Y = $B9 (bytes: $B9 low-byte high-byte)
  - LDA absolute,X = $BD (bytes: $BD low-byte high-byte)
  - LDA zero-page,X = $B5 (bytes: $B5 zero-page-address)
- Zero-page wrap example (behavior): LDA $FF,X with X = $02 will access zero-page address $01 ( ($FF + $02) & $FF = $01 ).

**[Note: Source may contain an error — the example opcodes shown as $D9/$DD for LDA abs,Y / LDA abs,X are incorrect for the 6502; correct opcodes are $B9 (abs,Y) and $BD (abs,X).]**

## Source Code
```asm
; Original source examples (as given)
;   LDA $31F6, Y
;   $D9 $31F6
;   LDA $31F6, X
;   $DD $31F6
;   LDA $20, X
;   $B5 $20

; Correct 6502 encodings (little-endian address bytes)
LDA $31F6,Y    ; opcode: $B9  $F6 $31
LDA $31F6,X    ; opcode: $BD  $F6 $31

LDA $20,X      ; opcode: $B5  $20

; Zero-page wrap example: effective address = (base + X) & $FF
; If X = $02:
LDA $FF,X      ; opcode: $B5  $FF  ; accesses zero-page $01
```

## References
- "addressing_modes_pre_indexed_indirect" — pre-indexed indirect uses X for zero-page addition
- "addressing_modes_post_indexed_indirect" — post-indexed indirect uses Y for adding after indirection

## Mnemonics
- LDA
