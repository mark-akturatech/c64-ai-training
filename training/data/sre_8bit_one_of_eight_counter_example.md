# 8-bit 1-of-8 counter using SRE to shift a mask and EOR with A

**Summary:** Example 6510 assembly using the undocumented SRE opcode (LSR memory + EOR A,mem) to implement a 1-of-8 shifting mask (pix) stored in memory, EOR it with a screen byte loaded via (zp),Y, branch on the LSR carry to detect underflow, ROR to restore the mask, ORA #$80 to set the first pixel, and an ADC/INC sequence to advance a 16-bit column pointer.

**Description**
This example uses the undocumented NMOS 6502/6510 SRE opcode to combine a right-shift of a memory byte (pix) with an immediate EOR into A in one instruction. SRE performs an LSR on the memory operand (updating the memory and the processor Carry from the bit shifted out) and then EORs the accumulator with the shifted memory (updating A and the N/Z flags). The Carry from the LSR is used to detect when the single-bit mask under-runs (the 1 fell out at bit0); a BCS (branch on carry) transfers control to an advance routine when that happens.

Behavioral summary:
- pix starts at %1000_0000 ($80) and is shifted right each time SRE pix executes.
- After SRE pix, A contains the previous screen byte EORed with the shifted mask; store A back to (zp),Y to write the modified pixels.
- If the mask under-runs (LSR produced a carry = 1), BCS advance_column is taken:
  - advance_column uses ROR pix to rotate the Carry back into bit7 (restoring $80).
  - ORA #$80 sets the first pixel in A before storing.
- The 16-bit column pointer at zero page (zp / zp+1) is advanced by 8 using CLC / ADC #$08 / STA zp / BCC / INC zp+1.

Note: SRE is an undocumented opcode (illegal in official 6502 documentation) — it modifies memory (LSR) and then updates A via EOR. Carry reflects the LSR result (bit shifted out); A/N/Z reflect the EOR result.

## Source Code
```asm
; Example: 8-bit 1-of-8 counter using SRE (undocumented opcode)
; Variables:
;   pix        = byte holding 1-of-8 mask (must be in zero page, e.g., $02)
;   zp / zp+1  = zero-page 16-bit pointer to screen byte (e.g., $00 and $01)
;   Y          = index (row offset)
;
; Initialize mask
    LDA #$80
    STA pix        ; pix = %1000_0000

main_loop:
    LDA (zp),Y     ; load screen byte
    .byte $47, pix ; SRE pix: LSR pix -> set Carry; EOR A,shifted_pix -> update A
                   ; (SRE modifies memory; Carry = old bit0 of pix)
    BCS advance_column  ; if Carry=1 then mask under-run -> advance column
    STA (zp),Y     ; store modified byte back to screen (no underflow)
    ; fall through to advance column pointer

advance_pointer:
    LDA zp
    CLC
    ADC #$08       ; add 8 to low byte
    STA zp
    BCC no_inc_hi  ; if no overflow, skip increment high byte
    INC zp+1       ; increment high byte on carry from ADC
no_inc_hi:
    JMP main_loop

advance_column:
    ROR pix        ; rotate carry (1) into bit7 -> restore pix to $80
    ORA #$80       ; set first pixel (bit7) in A
    STA (zp),Y     ; store with first pixel set
    ; then advance pointer same as above
    LDA zp
    CLC
    ADC #$08
    STA zp
    BCC no_inc_hi2
    INC zp+1
no_inc_hi2:
    JMP main_loop

; End
```

## References
- "sre_opcode_and_addressing_modes" — Detailed SRE opcode behaviors and addressing modes used by the example
- "sre_parity_example_and_lsr_addressing_simulation" — Other example uses of SRE, including parity computation and LSR-addressing simulation

## Mnemonics
- SRE
- LSE
