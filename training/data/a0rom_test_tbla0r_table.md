# A0INT — KERNAL ROM test for $8000 signature ("CBM80")

**Summary:** Tests for an $8000-resident ROM by comparing bytes at $8003+X against an in-ROM table (TBLA0R..TBLA0E). Uses LDX #TBLA0E-TBLA0R (5) and loops LDA TBLA0R-1,X / CMP $8003,X; returns with Z set only when all bytes match. Table bytes: $C3,$C2,$CD,$38,$30.

## Routine behavior
A0INT verifies whether an alternate ROM at $8000 contains the signature sequence encoded in TBLA0R. Operation:

- LDX #$05 — load loop counter with TBLA0E-TBLA0R (5 bytes).
- Loop:
  - LDA TBLA0R-1,X (address-coded as $FD0F,X in the listing) — fetches the table byte in ROM.
  - CMP $8003,X — compare that table byte with the byte in memory at $8003+X.
  - If CMP != (BNE) branch to RTS (mismatch → return with Z clear).
  - DEX; if X != 0 loop back and continue.
- If loop completes (all five bytes matched) execution falls through to RTS with Z set (final CMP equality and DEX producing zero leave Z set on return). Thus Z indicates presence of the $8000 ROM signature.

Byte/order mapping during comparisons (as implemented with LDA $FD0F,X and CMP $8003,X, starting X=$05 down to $01):
- X = $05: compare TBLA0R+4 ($30) with $8008
- X = $04: compare TBLA0R+3 ($38) with $8007
- X = $03: compare TBLA0R+2 ($CD) with $8006
- X = $02: compare TBLA0R+1 ($C2) with $8005
- X = $01: compare TBLA0R   ($C3) with $8004
If all five comparisons equal, routine returns with Z set.

**[Note: Source annotation shows '.BYT $C3,$C2,$CD,'80''; the actual byte sequence in the listing is $C3,$C2,$CD,$38,$30 (ASCII '8'=$38, '0'=$30).]**

## Source Code
```asm
        ; A0INT - TEST FOR AN $8000 ROM
        ;  RETURNS Z - $8000 IN
        ;
.,FD02  A2 05       LDX #$05        ; A0INT  LDX #TBLA0E-TBLA0R ;CHECK FOR $8000
.,FD04  BD 0F FD    LDA $FD0F,X     ; A0IN1  LDA TBLA0R-1,X
.,FD07  DD 03 80    CMP $8003,X     ;       CMP $8004-1,X
.,FD0A  D0 03       BNE $FD0F       ;       BNE A0IN2
.,FD0C  CA          DEX
.,FD0D  D0 F5       BNE $FD04       ;       BNE A0IN1
.,FD0F  60          RTS            ; A0IN2  RTS
        ;
.;FD10  C3 C2 CD 38 30
TBLA0R  .BYT $C3,$C2,$CD,$38,$30   ; ..CBM80..
TBLA0E
```

## References
- "system_start_reset_sequence" — called early in startup to decide whether to jump to an alternate ROM
- "restore_and_vector_initialization" — vector/table initialization that follows the ROM test in startup
