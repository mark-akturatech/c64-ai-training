# Kick Assembler — Data Directives (.byte, .word, .dword, .text, .fill, .fillword, .lohifill)

**Summary:** Covers Kick Assembler data generation directives .byte/.by, .word/.wo, .dword/.dw, .text; pattern and numeric fills via .fill and .fillword (variable i), interleaved lo/hi table generation with .lohifill, and the performance note that .fill is faster than .for + .byte.

## Data directives
.byte, .word and .dword generate byte, word (2 bytes, little-endian) and dword (4 bytes, little-endian repeated) data respectively. .text emits a sequence of character bytes (see encoding options for alternate encodings).

- .byte accepts comma-separated expressions and emits each expression as one byte.
- .word emits two bytes per expression in little-endian order (low byte first).
- .dword emits 4 bytes per expression (repeated little-endian ordering as shown in examples).
- .text emits character bytes from a string (encoding options available separately).

The assembler provides short aliases: .by == .byte, .wo == .word, .dw == .dword.

## .fill and .fillword (pattern and computed fills)
.fill N, expr
- Generates N bytes. The iteration variable i is set automatically to the loop index (0..N-1) and can be used in expr.
- expr may be a single expression, a list with a repeat pattern ([...]) or computed expressions (including math and trig functions).

.fillword N, expr
- Like .fill but emits words (.word) per iteration (N words). Use for generating 16-bit sequences; output is little-endian per word.

Pattern fills:
- Use [a,b,c] to repeat the pattern across the requested count.
- Lists may contain character literals to repeat textual sequences.

Examples and patterns are provided in the Source Code section.

## .lohifill (interleaved lo/hi table generator)
.lohifill count, expr
- Generates two contiguous lists: first the low bytes for each expression, immediately followed by the high bytes for each expression.
- Intended to produce separate lo/hi tables that are addressable via label.lo and label.hi (label.lo and label.hi are syntactic helpers to access the respective table halves).
- Useful when the code prefers separate low-byte and high-byte tables instead of word lists.

Usage example (see Source Code for full snippet):
- Generate tables with .lohifill $100, 40*i to get low-byte list (<0,<40,<80,...) followed by high-byte list (>0,>40,>80,...).
- Access via label.lo,x and label.hi,x in indexed addressing.

## Performance note
- Generating repeated bytes using .fill is faster at assembly time than using a .for loop that emits .byte each iteration. For heavy table generation consider .fill/.fillword or alternative define/.lock strategies (see referenced "functions_define").

## Source Code
```asm
; Basic data directives
.byte 1,2,3,4
; Generates the bytes 1,2,3,4

.word $2000,$1234
; Generates the bytes $00,$20,$34,$12

.dword $12341234
; Generates the bytes $34,$12,$34,$12

.text "Hello World"

; Aliases
; .by, .wo and .dw are aliases for .byte, .word and .dword

; .fill examples
.fill 5, 0
; Generates byte 0,0,0,0,0

.fill 5, i
; Generates byte 0,1,2,3,4

.fill 256, 127.5 + 127.5*sin(toRadians(i*360/256))
; Generates a sine curve (256 samples)

; Use [,,] to fill with a repeat pattern
.fill 4, [$10,$20]
; Generates .byte $10,$20,$10,$20,$10,$20,$10,$20

.fill 3, ['D','E','M','O','!']
; Generates the same bytes as .text "DEMO!DEMO!DEMO!"

.fill 3, [i,i*$10]
; Generates .byte 0,0,1,$10,2,$20

; .fillword examples
.fillword 5, i*$80
; Generates .word $0000,$0080,$0100,$0180,$0200

.fillword 2, [$100,0]
; Generates .word $0100,$0000,$0100,$0000

; .lohifill example + usage
; Draw routine snippet showing table access:
ldx #20            ; ychar coord
ldy #15            ; xchar coord
clc
lda mul40.lo,x     ; Access lo byte table
sta $fe
lda mul40.hi,x     ; Access hi byte table
ora #$04
sta $ff
lda #'x'
sta ($fe),y        ; Draws 'x' at screenpos x,y
rts

mul40: .lohifill $100, 40*i
; Generates lo/hi table:
; .byte <0, <40, <80, <120, ....
; .byte >0, >40, >80, >120, ....
```

## References
- "encoding_and_charset_options" — expands on .text encoding impact and available encodings
- "functions_define" — recommendations for heavy table generation and define/.lock usage