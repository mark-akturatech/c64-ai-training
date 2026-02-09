# LDA (zp,X) — Pre-indexed Indirect Addressing

**Summary:** LDA (zp,X) — pre-indexed indirect addressing mode for 6502: add zero-page operand and X (wrap-around) to form a zero-page pointer, fetch two bytes at that zero-page address (low, high — high wraps at $FF→$00) to form the 16-bit effective address, then load A. Use terms: zero-page, wrap-around, X-register, LDA ($nn,X).

## Operation
- The instruction takes a single zero-page operand (one byte) in the instruction stream and adds the X register to it using 8-bit wrap-around arithmetic (sum & $FF). The result is a zero-page address P.
- The low byte of the effective 16-bit address is read from zero-page address P; the high byte is read from zero-page address (P+1) & $FF (wrap inside zero page).
- The 16-bit effective address is formed as (high<<8) | low. The accumulator is loaded from that effective address.
- Only the X register is used by this mode; Y is not involved.

## Source Code
```asm
; Example: LDA ($3E,X)
; Instruction bytes:
;   $A1 $3E        ; LDA ($3E,X)

; Assume:
;   X       = $05
;   $0043   = $15   ; zero-page $43 contains low byte
;   $0044   = $24   ; zero-page $44 contains high byte
;   $2415   = $6E   ; memory at effective address

; Execution:
; (i)   $3E + X = $3E + $05 = $43        ; wrap-around within zero page ($00-$FF)
; (ii)  low  = mem[$0043] = $15
;       high = mem[$0044] = $24         ; (P+1) wraps to $00 if P == $FF
;       effective = $2415
; (iii) A = mem[$2415] = $6E

; Note: if P == $FF, high is read from $00 (zero-page wrap).
```

## Key Registers
- (none) — This chunk documents an addressing mode, not specific C64 I/O registers.

## References
- "instruction_tables_lda" — expands on LDA (Oper,X) opcode and cycles