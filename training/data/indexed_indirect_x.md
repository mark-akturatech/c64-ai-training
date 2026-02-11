# 6502 Addressing Modes — Indexed Indirect (aa,X)

**Summary:** Indexed Indirect (syntax: (aa,X)) is a zero-page based indirect addressing mode that adds the X register to a one-byte zero-page operand (wraps in zero page), fetches a 16-bit address from that zero-page location and the following byte, then accesses the memory at that effective address (used with LDA, LDX setup, etc.).

## Operation
The operand is a single byte zero-page address aa. The effective-address calculation proceeds as follows:
1. Compute zp_addr = (aa + X) & $FF (addition wraps within zero page).
2. Read the low byte of the target address from memory location $00|zp_addr.
3. Read the high byte from $00|((zp_addr + 1) & $FF) (high byte read also wraps in zero page).
4. Form the 16-bit effective address = (high << 8) | low.
5. Perform the requested memory access at that 16-bit effective address.

This mode is "add then fetch" (contrast: indirect-indexed (aa),Y is "fetch then add"). Common use: tables of 16-bit addresses placed in zero page, with X selecting which entry to use.

## Source Code
```asm
; Example: load A using an indexed-indirect pointer
        LDX #$11
        LDA ($36,X)

; Zero page and memory contents for this example:
; Zero page:
; $0036 = ...        ; base operand
; ...
; After LDX #$11, operand $36 + X = $47 (wraps in zero page)
; $0047 (low byte)  = $49
; $0048 (high byte) = $A3

; Effective 16-bit address = $A349
; Contents at $A349 are loaded into A by LDA ($36,X)
```

## References
- "zero_page_indexed_addressing" — expands on zero page addressing and indexing
- "indirect_indexed_y" — contrasts 'add then fetch' vs 'fetch then add' behavior
