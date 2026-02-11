# KERNAL: Initialize filename/state variables ($FB97)

**Summary:** Compact KERNAL initializer at $FB97 that sets zero-page $A3 to #$08, clears $A4, $A8, $9B, $A9 and returns (used before name/directory operations; LDA/STA/RTS).

## Description
This small KERNAL routine (entry $FB97) performs a compact initialization of zero-page variables used by filename/directory handling. It:

- Loads immediate #$08 into $A3.
- Clears zero-page locations $A4, $A8, $9B and $A9 (stores #$00).
- Returns to the caller with RTS.

Used as a prelude to routines that store pointer bytes or prepare DMA/IO pointers (see referenced routines). No branching or side effects beyond these stores.

## Source Code
```asm
.,FB97 A9 08    LDA #$08
.,FB99 85 A3    STA $A3
.,FB9B A9 00    LDA #$00
.,FB9D 85 A4    STA $A4
.,FB9F 85 A8    STA $A8
.,FBA1 85 9B    STA $9B
.,FBA3 85 A9    STA $A9
.,FBA5 60       RTS
```

## Key Registers
- $00A3 - Zero page - initialized to #$08 (filename/state variable)
- $00A4 - Zero page - cleared to #$00
- $00A8 - Zero page - cleared to #$00
- $009B - Zero page - cleared to #$00
- $00A9 - Zero page - cleared to #$00

## References
- "store_c1_c2_into_ad_ac" — expands on initialization used before storing pointer bytes  
- "setup_dc_pointers_and_status_flag" — follows this init when preparing DMA/IO pointers