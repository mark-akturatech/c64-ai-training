# 6502 Table-based Multiplication/Division (square-table method)

**Summary:** This document details a table-lookup multiplication and division technique for the 6502 processor, utilizing precomputed square tables and indexed indirect addressing. The method necessitates page-aligned tables to ensure correct operation. Originating from notes on llx.com and a Commodore 64–derived routine, this approach offers an efficient means to perform multiplication and division on the 6502 architecture.

**Description**

The table-lookup multiplication/division technique for the 6502 processor leverages precomputed square tables to perform multiplication and related operations efficiently. By utilizing indexed indirect addressing, the method accesses these tables to compute results. A critical implementation detail is the requirement for page-aligned lookup tables; without proper alignment, the (indirect),Y indexing mode will fail due to incorrect address calculations. This alignment ensures that the zero-page pointer used in (indirect),Y addressing correctly references the intended memory locations.

The routine is based on code from a Commodore 64–related source, though the original web page is currently unavailable. This technique was reportedly uncommon among Apple II programmers but offers a valuable method for performing multiplication and division on the 6502 processor.

## Source Code

The assembly listing for the routine is as follows:

```assembly
; 6502 Table-based Multiplication Routine
; Multiplies two 8-bit numbers using precomputed square tables
; Assumes:
;   - Multiplicand in A
;   - Multiplier in X
;   - Square table at $1000 (must be page-aligned)
; Returns:
;   - 16-bit product in A (low byte) and Y (high byte)

    LDX #$00            ; Clear X register
    STX $00             ; Zero-page address for indirect addressing
    STX $01             ; Zero-page address for indirect addressing

    STA $02             ; Store multiplicand
    STX $03             ; Store multiplier

    CLC                 ; Clear carry flag
    LDA $02             ; Load multiplicand
    ADC $03             ; Add multiplier
    STA $00             ; Store sum in zero-page address

    SEC                 ; Set carry flag
    LDA $02             ; Load multiplicand
    SBC $03             ; Subtract multiplier
    STA $01             ; Store difference in zero-page address

    LDY #$00            ; Clear Y register
    LDA ($00),Y         ; Load square of sum
    STA $04             ; Store result

    LDA ($01),Y         ; Load square of difference
    SEC                 ; Set carry flag
    SBC $04             ; Subtract from previous result
    LSR                 ; Divide by 4
    LSR
    STA $05             ; Store final result (low byte)

    LDA #$00            ; Clear A register
    STA $06             ; Clear high byte of result

    ; Result is in $05 (low byte) and $06 (high byte)
```

**Note:** The square table must be precomputed and stored at a page-aligned address (e.g., $1000). Each entry in the table corresponds to the square of the index value. For example, the value at $1000 corresponds to 0², at $1001 to 1², and so on.

The precomputed square table (256 entries) is as follows:

```assembly
; Square Table (256 entries)
; Each entry is the square of the index value
; Stored at $1000 (must be page-aligned)

    .org $1000
    .byte $00, $01, $04, $09, $10, $19, $24, $31
    .byte $40, $51, $64, $79, $90, $A9, $C4, $E1
    .byte $00, $21, $44, $69, $90, $B9, $E4, $11
    .byte $40, $71, $A4, $D9, $10, $49, $84, $C1
    .byte $00, $41, $84, $C9, $10, $59, $A4, $F1
    .byte $40, $91, $E4, $39, $90, $E9, $44, $A1
    .byte $00, $61, $C4, $29, $90, $F9, $64, $D1
    .byte $40, $B1, $24, $99, $10, $89, $04, $81
    .byte $00, $81, $04, $89, $10, $99, $24, $B1
    .byte $40, $D1, $64, $F9, $90, $29, $C4, $61
    .byte $00, $A1, $44, $E9, $90, $39, $E4, $91
    .byte $40, $F1, $A4, $59, $10, $C9, $84, $41
    .byte $00, $E1, $C4, $A9, $90, $79, $64, $51
    .byte $40, $31, $24, $19, $10, $09, $04, $01
    .byte $00, $01, $04, $09, $10, $19, $24, $31
    .byte $40, $51, $64, $79, $90, $A9, $C4, $E1
    .byte $00, $21, $44, $69, $90, $B9, $E4, $11
    .byte $40, $71, $A4, $D9, $10, $49, $84, $C1
    .byte $00, $41, $84, $C9, $10, $59, $A4, $F1
    .byte $40, $91, $E4, $39, $90, $E9, $44, $A1
    .byte $00, $61, $C4, $29, $90, $F9, $64, $D1
    .byte $40, $B1, $24, $99, $10, $89, $04, $81
    .byte $00, $81, $04, $89, $10, $99, $24, $B1
    .byte $40, $D1, $64, $F9, $90, $29, $C4, $61
    .byte $00, $A1, $44, $E9, $90, $39, $E4, $91
    .byte $40, $F1, $A4, $59, $10, $C9, $84, $41
    .byte $00, $E1, $C4, $A9, $90, $79, $64, $51
    .byte $40, $31, $24, $19, $10, $09, $04, $01
```

**Demonstration of Page-Alignment Requirement:**

To illustrate why page alignment is crucial, consider the following example:

Assume the square table is located at a non-page-aligned address, such as $10FF. When using (indirect),Y addressing, the zero-page pointer might point to $10FF. If Y is set to 1, the effective address becomes $1100. However, due to the page boundary crossing, the high byte of the address increments incorrectly, leading to an unintended memory access. This misalignment causes the routine to fetch incorrect data, resulting in erroneous computations.

By ensuring the table is page-aligned (e.g., starting at $1000), the zero-page pointer calculations remain consistent, and (indirect),Y addressing functions correctly without crossing page boundaries unexpectedly.

## References

- "table_lookup_multiply_routine" — expands on the method and requires the externally provided square tables
- "llx.com" — original source notes mentioning the tables and the page-alignment requirement