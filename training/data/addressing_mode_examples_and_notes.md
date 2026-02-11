# 6502 Addressing Modes — immediate, zero-page, absolute, indexed, indirect, and relative (branches)

**Summary:** Covers 6502 addressing modes: immediate, zero-page (benefits), absolute (little-endian 3-byte format), indexed (absolute,X / absolute,Y with page-cross penalty; zero-page,X / zero-page,Y wraparound), pre-indexed indirect (LDA (zp,X)) and post-indexed indirect (LDA (zp),Y) behavior and timing, and relative branch range and cycle costs. Includes JMP (indirect) NMOS page-boundary bug and example encodings.

## Immediate and Zero-Page (brief)
- Immediate: operand is a byte encoded in the instruction (e.g., LDA #$07). Instruction length: 2 bytes. Typical timing (LDA): 2 cycles.
- Zero-page: operand is a single-byte address in page $00 (0..$FF). Uses 2-byte instruction encoding (opcode + zp). Benefits: smaller code bytes and fewer cycles (typical LDA zp: 3 cycles). Zero-page,X / zero-page,Y addressing wraps within the zero-page (no page-cross penalty).

## Absolute addressing (little-endian)
- Absolute addressing encodes a full 16-bit address in little-endian order: low byte first, then high byte (3 bytes total: opcode + lo + hi).
- Absolute instructions are larger than zero-page but access full 64KB memory. Typical cycle counts (example LDA): absolute = 4 cycles.
- For indexed absolute addressing (absolute,X or absolute,Y): the base instruction takes the same base cycles (typical LDA abs,X/Y = 4), but an extra cycle is incurred if adding the index crosses a page boundary (i.e., high byte of effective address differs from base address high byte).

## JMP indirect and the NMOS page-boundary bug
- Indirect addressing (parentheses) uses a memory-stored 16-bit pointer. Example: JMP ($FF82) reads two bytes at $FF82/$FF83 (lo,hi) and jumps to that target address.
- Encoding example: JMP ($FF82) = 6C 82 FF
- On NMOS 6502: when the pointer address low byte is $FF, the high byte is fetched from the same page (i.e., the high byte is read from address $xx00), not from the next page — this is the classic 6502 indirect JMP bug.
  - Example: JMP ($11FF) will fetch low = M[$11FF], high = M[$1100] (not M[$1200]). This yields an incorrect resolved vector if software expects cross-page reads.
- CMOS 65C02 fixes this behavior (fetches high byte from the next page as expected) but the fixed implementation requires one extra cycle.
**[Note: Source text contained a contradictory example/typo for the page-wrap behavior; corrected above to the standard NMOS 6502 behavior.]**

## Pre-indexed indirect (Indexed Indirect) — (Zero-Page,X)
- Syntax: LDA (zp,X), STA (zp,X), etc.
- Operation: add X to the zero-page base address (wraps within $00..$FF), then read a 16-bit pointer from that zero-page location (low byte at computed address, high byte at next zero-page address), then access the resolved full address.
- Instruction length: 2 bytes (opcode + zero-page base).
- The pointer lookup does not cross pages — zero-page wrap applies to the pointer fetch (address wraps at $FF).
- Timing: the instruction must fetch the 16-bit effective address first (additional cycles compared to direct zero-page addressing). Typical LDA (zp,X) cycle count: 6 cycles (standard NMOS 6502).
- Use case: tables of 16-bit pointers stored in zero page to indirect to various addresses.

## Post-indexed indirect (Indirect Indexed) — (Zero-Page),Y
- Syntax: LDA (zp),Y
- Operation: read 16-bit pointer from zero-page base (low byte at zp, high byte at zp+1 — wraps in zero-page), then add Y to the 16-bit pointer to form the effective address.
- Instruction length: 2 bytes.
- Timing: typical LDA (zp),Y = 5 cycles on NMOS 6502, plus 1 extra cycle if the final indexed effective address crosses a page boundary.
- Use case: follow a pointer (from zero page) then index by Y to reference elements inside the pointed memory block.

## Relative addressing (branches)
- Branch instructions encode an 8-bit signed offset relative to the next instruction (range -128..+127).
- The offset is added to the program counter after the branch instruction and is a signed displacement.
- Cycle costs (standard NMOS 6502 behavior):
  - Branch not taken: 2 cycles.
  - Branch taken (no page crossed): 3 cycles.
  - Branch taken and page crossed (target in a different page than the next instruction): 4 cycles.
- Useful for short loops and conditional flow where code size and cycles are minimized; limited by the ±128-byte range.

## Source Code
```asm
; JMP indirect example (pointer lookup little-endian)
; Assume memory: $FF82 = $C4, $FF83 = $80  -> target $80C4
        JMP ($FF82)        ; bytes: 6C 82 FF

; Encoded bytes shown:
; 6C 82 FF      ; JMP ($FF82)
; memory: $FF82: C4 80 -> effective target $80C4

; Example demonstrating NMOS indirect bug:
; If pointer is at $11FF:
;   low  = M[$11FF]
;   high = M[$1100]   ; high byte fetched from same page (wrap), NOT $1200

; Pre-indexed indirect example (LDA (zp,X)):
; X = $05
; zero-page data at $0075 = $23, $0076 = $30  -> pointer $3023
        LDA ($70,X)        ; opcode bytes: A1 70
; With X=$05: lookup at $0075: 23 30  -> effective address $3023
; Then A := M[$3023]

; Mnemonic examples:
; LDA ($70,X)   ; load A from 16-bit pointer at $00(+$70+X)
; STA ($A2,X)   ; store A using pointer at $00A2+X
; EOR ($BA,X)   ; EOR A with memory pointed by $00BA+X

; Post-indexed indirect example:
; LDA ($70),Y   ; read pointer at $0070 (low) and $0071 (high), then add Y to that 16-bit address
```

## References
- "6502_address_modes_in_detail" — expands on mode summaries and NMOS quirks
- "branch_addressing_modes" — expands on relative branch cycle penalties

## Mnemonics
- LDA
- JMP
