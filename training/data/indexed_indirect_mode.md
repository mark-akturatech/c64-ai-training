# Indexed Indirect Addressing ((zp,X))

**Summary:** Indexed indirect addressing ((zp,X)) adds the X register to a zero-page pointer address; the CPU fetches a 16-bit pointer from (zp+X) and uses that pointer as the effective absolute address (e.g. LDA ($02,X)). Contrast with indirect-indexed (Y) addressing which is more widely used.

## Description
- Only the X register may be used for indexed indirect addressing.
- Operation sequence (byte reads from zero page):
  1. Compute pointer address = (zero_page_address + X) & $FF (zero-page wrap).
  2. Low byte of effective address = contents of pointer address.
  3. High byte of effective address = contents of (pointer address + 1) & $FF (wrap in zero page).
  4. CPU performs the memory access at the formed 16-bit effective address.

- Example (from source):
  - Suppose zero page $02 = $45 and $03 = $10, and X = $00.
  - LDA ($02,X) will fetch low = contents($02+$00) = $45, high = contents($03+$00) = $10, forming effective address $1045; the accumulator is loaded from $1045.

- Practical note:
  - This mode is useful for zero-page tables of pointers where X selects which pointer (pointer = two consecutive zero-page bytes).
  - Indirect-indexed (zp),Y (indexing the fetched pointer by Y) is the more commonly used indirect addressing variant on 6502 systems.

## Source Code
```asm
; Example memory setup (descriptive):
; $02 = $45
; $03 = $10
; X = #$00
; LDA ($02,X) -> loads from $1045

; Example listing from source:
    LDA #$00    ; load low order actual base address
    STA $06     ; set the low byte of the indirect address
    LDA #$16    ; load high order indirect address
    STA $07     ; set the high byte of the indirect address
    LDX #$05    ; set the indirect index (X)
    LDA ($02,X) ; load indirectly indexed by X
```

## References
- "indirect_indexed_mode" — contrast with indirect-indexed (Y) mode
- "indexed_addressing_and_indexing" — overview of indexed addressing variants
