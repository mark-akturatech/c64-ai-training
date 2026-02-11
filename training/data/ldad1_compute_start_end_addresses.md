# LDAD1 — Compute and store start/end addresses for tape header blocks (KERNAL $F7D7)

**Summary:** KERNAL ROM subroutine LDAD1 ($F7D7) calls ZZZ ($F7D0) to obtain the cassette buffer pointer (returns low in X, high in Y), saves start low/high to STAL/STAH ($C1/$C2), computes the end pointer by adding BUFSZ (#$C0) to the low byte with ADC (propagating carry into the high byte), and stores end low/high to EAL/EAH ($AE/$AF).

## Function / Details
- Entry: JSR $F7D0 (ZZZ) — obtains cassette buffer pointer (low in X, high in Y).
- TXA / STA $C1 saves the start low byte into STAL ($C1).
- CLC / ADC #$C0 adds BUFSZ ($C0) to the accumulator (start low) to compute the end low byte; result stored to EAL ($AE).
- TYA / STA $C2 saves the start high byte into STAH ($C2).
- ADC #$00 adds only the carry from the low-byte addition to compute the end high byte; result stored to EAH ($AF).
- On return, STAL/STAH hold the start pointer and EAL/EAH hold the end pointer (ready for header writing). RTS returns to caller.

Behavioral notes:
- BUFSZ is added to the low byte first; ADC #$00 is used to fold the carry into the high byte.
- The routine expects ZZZ to return the pointer in X (low) and Y (high) — LDAD1 transfers those into zero page for later use.

## Source Code
```asm
.,F7D7 20 D0 F7 JSR $F7D0       LDAD1  JSR ZZZ         ;GET PTR TO CASSETTE
.,F7DA 8A       TXA             TXA
.,F7DB 85 C1    STA $C1         STA    STAL            ;SAVE START LOW
.,F7DD 18       CLC             CLC
.,F7DE 69 C0    ADC #$C0        ADC    #BUFSZ          ;COMPUTE POINTER TO END
.,F7E0 85 AE    STA $AE         STA    EAL             ;SAVE END LOW
.,F7E2 98       TYA             TYA
.,F7E3 85 C2    STA $C2         STA    STAH            ;SAVE START HIGH
.,F7E5 69 00    ADC #$00        ADC    #0              ;COMPUTE POINTER TO END
.,F7E7 85 AF    STA $AF         STA    EAH             ;SAVE END HIGH
.,F7E9 60       RTS             RTS
```

## Key Registers
- $C1 - Zero Page - STAL (start address low)
- $C2 - Zero Page - STAH (start address high)
- $AE-$AF - Zero Page - EAL/EAH (end address low/high)
- BUFSZ (#$C0) - constant added to start low to compute end pointer

## References
- "zzz_get_tape_buffer_pointer" — expands on uses ZZZ to obtain tape buffer pointer
- "tape_header_write_tapeh" — shows TAPEH calling LDAD1 to set header start/end before writing

## Labels
- LDAD1
- STAL
- STAH
- EAL
- EAH
- BUFSZ
