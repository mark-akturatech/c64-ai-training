# UMULT ($B34C) — Compute the Size of a Multidimensional Array

**Summary:** UMULT at $B34C (BASIC ROM) multiplies the dimensions of a multidimensional array to compute the total element count, informing storage and descriptor sizing. Searchable terms: $B34C, UMULT, array size, multiply dimensions, ISARY, ARYGET.

**Description**

UMULT is a BASIC-ROM utility routine that computes the size of a multidimensional array by multiplying the individual dimension extents together. This routine is utilized during array creation and size calculation to determine the total number of elements, thereby informing the allocation of appropriate space for the array descriptor and element storage.

Contextual usage:

- **ISARY**: Called during array lookup/creation to determine the total number of elements.
- **ARYGET**: Results from UMULT inform descriptor and storage allocation.

## Source Code

```assembly
; UMULT: Compute the total number of elements in a multidimensional array
; Entry: Y = Offset into the array descriptor pointing to the last dimension
;        $5F/$60 = Pointer to the array descriptor
; Exit:  X/Y = Total number of elements (16-bit result)
;        A = High byte of the result
;        Registers affected: A, X, Y, $22, $28, $29, $5D

UMULT:
    STY $22           ; Save Y register
    LDA ($5F),Y       ; Load low byte of the current dimension size
    STA $28           ; Store in $28
    DEY               ; Decrement Y to point to the high byte
    LDA ($5F),Y       ; Load high byte of the current dimension size
    STA $29           ; Store in $29
    LDA #$10          ; Set bit count for 16-bit multiplication
    STA $5D           ; Store in $5D
    LDX #$00          ; Clear X register (low byte of result)
    LDY #$00          ; Clear Y register (high byte of result)

UMULT_LOOP:
    TXA               ; Transfer X to A
    ASL               ; Shift left (multiply by 2)
    TAX               ; Transfer A back to X
    TYA               ; Transfer Y to A
    ROL               ; Rotate left through carry
    TAY               ; Transfer A back to Y
    BCS UMULT_OVERFLOW; Branch if carry set (overflow)
    ASL $71           ; Shift left $71 (low byte of multiplier)
    ROL $72           ; Rotate left $72 (high byte of multiplier)
    BCC UMULT_NEXT    ; Branch if carry clear
    CLC               ; Clear carry
    TXA               ; Transfer X to A
    ADC $28           ; Add $28 (low byte of multiplicand)
    TAX               ; Transfer A back to X
    TYA               ; Transfer Y to A
    ADC $29           ; Add $29 (high byte of multiplicand)
    TAY               ; Transfer A back to Y
    BCS UMULT_OVERFLOW; Branch if carry set (overflow)

UMULT_NEXT:
    DEC $5D           ; Decrement bit count
    BNE UMULT_LOOP    ; Loop until all bits processed
    RTS               ; Return

UMULT_OVERFLOW:
    ; Handle overflow (not implemented in this routine)
    RTS
```

## Key Registers

- **$5F/$60**: Pointer to the array descriptor.
- **$28/$29**: Temporary storage for the current dimension size.
- **$5D**: Bit count for multiplication loop.
- **$71/$72**: Multiplier storage during multiplication.

## References

- "array_lookup_and_creation_isary" — Details on how UMULT is used during array creation and size calculation in ISARY.
- "ary_descriptor_allocation_aryget" — Explains how UMULT results inform descriptor and storage allocation in ARYGET.

## Labels
- UMULT
