# VPRTY ($FB72) — Compute Block BCC (parity) over loaded block

**Summary:** KERNAL ROM routine VPRTY ($FB72) computes the block checksum (BCC) by XOR-ing bytes fetched via the SAL/SAH pointer ($AC-$AD) into SHCNH ($AB), increments the source address with INCSAL, checks CMPSTE for end-of-block, and compares the computed BCC to OCHAR ($BD); on mismatch it signals CKERR via UDST ($FE1C) and returns to PREND ($FEBC).

## Routine purpose and flow
This routine computes a running parity (BCC) over a loaded block and verifies it against the expected checksum byte:

- Entry: VPRTY at $FB72. Uses the zero-page pointer pair SAL/SAH ($AC-$AD) with an index Y to fetch bytes from the current source buffer via LDA (SAL),Y.
- Parity accumulate: Each fetched byte is XOR-ed into SHCNH ($AB), then stored back to SHCNH. SHCNH holds the running parity / computed BCC for the block.
- Address increment: JSR $FCDB (INCSAL) increments the SAL/SAH pointer to advance through the block.
- End test: JSR $FCD1 (CMPSTE) checks whether the end-of-block condition has been reached; BCC back to VPRTY loops while more bytes remain.
- Final compare: After the loop, SHCNH is loaded and XOR-ed with OCHAR ($BD) (the expected BCC). If the result is zero (BEQ), the checksums match and execution jumps to RD180 which JMPs PREND ($FEBC).
- On checksum mismatch: LDA #$20 (CKERR code) and JSR $FE1C (UDST) — UDST is invoked to report/handle the checksum error — then execution falls through to RD180 which JMPs PREND.

Registers/variables used:
- SAL/SAH ($AC-$AD): source address pointer used with indirect indexed addressing (LDA (SAL),Y).
- SHCNH ($AB): running parity accumulator (computed BCC).
- OCHAR ($BD): expected checksum byte to compare against computed BCC.
- INCSAL ($FCDB): increments SAL/SAH pointer.
- CMPSTE ($FCD1): tests for end-of-block; loop control.
- UDST ($FE1C): called with A=$20 (CKERR) on checksum failure.
- PREND ($FEBC): return target on routine exit (via RD180).

Behavior notes:
- The parity is computed by XOR accumulation: SHCNH := SHCNH XOR fetched_byte.
- Looping continues until CMPSTE indicates the end of the block; branching uses BCC back to VPRTY.
- A zero result from XORing SHCNH with OCHAR indicates a successful checksum match.

## Source Code
```asm
        ;COMPUTE PARITY OVER LOAD
        ;
.,FB72  B1 AC    LDA ($AC),Y     ; VPRTY  LDA (SAL)Y      ; CALC BLOCK BCC
.,FB74  45 AB    EOR $AB         ;        EOR    SHCNH
.,FB76  85 AB    STA $AB         ;        STA    SHCNH
.,FB78  20 DB FC JSR $FCDB       ;        JSR    INCSAL          ; INCREMENT ADDRESS
.,FB7B  20 D1 FC JSR $FCD1       ;        JSR    CMPSTE          ; TEST AGAINST END
.,FB7E  90 F2    BCC $FB72       ;        BCC    VPRTY           ; NOT DONE YET...
.,FB80  A5 AB    LDA $AB         ;        LDA    SHCNH           ; CHECK FOR BCC CHAR MATCH...
.,FB82  45 BD    EOR $BD         ;        EOR    OCHAR
.,FB84  F0 05    BEQ $FB8B       ;        BEQ    RD180           ; ...YES, EXIT
        ;CHKSUM ERROR
.,FB86  A9 20    LDA #$20        ;        LDA    #CKERR
.,FB88  20 1C FE JSR $FE1C       ;        JSR    UDST
.,FB8B  4C BC FE JMP $FEBC       ; RD180  JMP PREND
```

## Key Registers
- $AB - Zero Page - SHCNH (running parity / computed BCC)
- $AC-$AD - Zero Page - SAL/SAH pointer (source address for LDA (SAL),Y)
- $BD - Zero Page - OCHAR (expected BCC / checksum byte)
- $FB72-$FB8B - KERNAL ROM - VPRTY compute-parity routine
- $FCDB - KERNAL ROM - INCSAL (increment address pointer)
- $FCD1 - KERNAL ROM - CMPSTE (test for end-of-block)
- $FE1C - KERNAL ROM - UDST (report/handle CKERR with A=$20)
- $FEBC - KERNAL ROM - PREND (return/exit target)

## References
- "store_or_verify_and_address_increment" — expands on SAL/SAH pointer usage and store/verify management
- "restore_addresses_and_newch_init" — expands on RD300/NEWCH restore and init routines used after reads or on exit