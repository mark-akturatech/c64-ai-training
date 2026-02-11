# Tape loader checksum check subroutine (02D7–02E2)

**Summary:** Compares computed checksum in zero page $0005 with expected/read checksum in $0006; stores #$07 into $0001 as a side effect; returns (RTS) on match, otherwise jumps to $FCE2 (soft-reset). Addresses shown are code locations $02D7–$02E2.

## Checksum comparison routine
This is a minimal checksum-verify routine used by a tape loader. Behavior:

- LDA #$07 / STA $01 — stores immediate value #$07 into zero page location $0001 as a side effect of the subroutine (loader-specific variable).
- LDA $05 / CMP $06 — compares the calculated checksum at zero page $0005 with the expected/read checksum at zero page $0006.
- BNE $02E2 — if the two differ, branch to $02E2 which JMPs $FCE2 (KERNAL soft-reset entry).
- RTS — if equal, returns to caller.

Notes:
- The routine sets $0001 unconditionally before performing the comparison.
- On mismatch the code performs a JMP $FCE2 (soft-reset of the C64) rather than a local error handler.
- Zero page addresses $0005 and $0006 are used as the computed and expected checksum respectively (names inferred from usage in the listing).

## Source Code
```asm
; ********************************************
; * Checksum check subroutine                *
; * Description: Compares calculated and     *
; *              read checksum to detect a   *
; *              load error.                 *
; ********************************************

02D7  A9 07          LDA #$07
02D9  85 01          STA $01
02DB  A5 05          LDA $05
02DD  C5 06          CMP $06
02DF  D0 01          BNE $02E2
02E1  60             RTS

02E2  4C E2 FC       JMP $FCE2      ; On checksum error, reset C64
; ********************************************
; * Checksum check subroutine.END            *
; ********************************************
```

## Key Registers
- $0001 - Zero page variable — set to #$07 by this subroutine (loader-specific use)
- $0005 - Zero page variable — computed checksum (compared)
- $0006 - Zero page variable — expected/read checksum (compared)

## References
- "nonirq_cbm_header_block_listing" — expands on other checksum logic in non-IRQ loader header (XOR checksum)

## Labels
- $0001
- $0005
- $0006
