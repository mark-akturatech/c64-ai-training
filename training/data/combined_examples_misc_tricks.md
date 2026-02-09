# NMOS 6510 — Combined examples using undocumented opcodes (LAX / SBX / SAX)

**Summary:** Examples for using undocumented NMOS 6510 opcodes LAX, SBX and SAX to negate a 16-bit value, perform a "smart addition" (replace LDA/ADC/TAX), fast multiply by 8 for 16-bit table offsets, and read+clear the rightmost set bit (uses LAX/DEX/SAX/EOR).

## Negating a 16-bit number
Use LAX to load both A and X from memory, SBX to set X while establishing carry for SBC, then SBC to finish two‑byte two's‑complement negation. (LAX — undocumented load A and X from memory; SBX — undocumented A,X = A & X - imm with carry semantics used here.)

Behavior summary:
- LAX loads A and X with the low byte.
- SBX #lo sets X and sets the carry so a following SBC will perform a proper two's-complement negation across the low/high bytes.
- SBC #hi completes the negation; the negated 16-bit result appears in A/X.

## A "smart addition" replacing LDA/CLC/ADC/TAX
Instead of:
- LDA $02
- CLC
- ADC #$08
- TAX

You can do:
- LAX $02
- SBX #$F8

Explanation:
- LAX loads A and X with the memory operand.
- SBX #$F8 effectively yields X = (A & X) - -8 (using SBX's subtraction and carry behavior), saving cycles because SBX sets the required internal carry and avoids the separate CLC/ADC/TAX sequence.
- The AND is optional (A & X) but harmless; prepare A or X if an AND mask is needed.

Note: This uses SBX to "fake" an ADD/SUB where the carry state for earlier ADC is unnecessary.

## Multiply 8-bit * 2^n producing a 16-bit result (multiply by 8 example)
When indexing into a table of 8-byte objects (i.e., compute 16-bit byte offset = index * 8), use bit operations and SAX stores rather than repeated shifts:

- LAX Index,y      ; A,X = (index + Y)
- AND #%00000111   ; keep low 3 bits (index mod 8)
- STA AddressHi    ; store A & %00000111 -> high byte of 16-bit offset (bit-packed)
- LDA #%11111000   ; mask for low byte (multiply by 8)
- SAX AddressLo    ; store X & %11111000 -> low byte of 16-bit offset

Total cited cycle count: 14 cycles.

Notes:
- This is faster than numeric multiply by 8. It relies on storing values in a bit-rotated/funny order (mentioned as bit order 43210765 in source) so that separating bits into high/low bytes yields the correct 16-bit offset.
- The AND/STA stores the low-bit index into AddressHi; SAX writes the aligned low byte mask into AddressLo.

## Read the rightmost set bit and clear it in memory
To clear the rightmost set bit in a memory byte and also retrieve that bit into A:

Sequence:
- LAX addr    ; A = X = *addr
- DEX         ; X = X - 1
- SAX addr    ; *addr = A & X      ; clears rightmost set bit
- EOR addr    ; A = A ^ *addr     ; A now contains the isolated rightmost set bit

Explanation:
- A& (A-1) clears the least-significant set bit (classic idiom); using LAX/DEX/SAX implements that with undocumented opcodes.
- The EOR yields the bit that was cleared (original A xor new memory).

## Source Code
```asm
; Negating a 16bit number
LAX #$00
;should be safe, as #$00 is loaded
SBX #lo
;sets carry automatically for upcoming sbc
SBC #hi
; negated value is in A/X

; A smart addition
LAX $02
;A = X = M [$02]
SBX #$f8
;X = (A & X) - -8

; Multiply 8bit * 2 ^ n with 16bit result
LAX Index,y
; 4 A,X = (index+Y)
AND #%00000111
; 2
STA AddressHi
; 3 store A & %00000111
LDA #%11111000
; 2
SAX AddressLo
; 3 store X & %11111000
; = 14 cycles

; Read rightmost set bit, and set it to 0
; Set the rightmost set bit to zero:
; A = *addr;
; *addr &= *addr - 1
LAX addr       ; A = X = *addr;
DEX
; X--;
SAX addr       ; *addr = A & X
; Retrieve said bit:
; A = A ^ *addr
EOR addr
```

## Key Registers
(omitted — this chunk does not reference specific C64 hardware registers)

## References
- "opcode_naming_in_different_assemblers_matrix" — expands on mnemonics such as LAX and SBX from the opcode matrix
- "six_sprites_over_fli_routines" — the 6-sprites FLI routine uses similar undocumented R-M-W opcodes and side-effects