# MRITE — M-W (memory-to-disk / write) header transmit routine

**Summary:** MRITE initializes the PART pointer (TEMP), advances it by $20 per section, prepares IEC/printer channel 15 for output (LDX #$0F; JSR CHKOUT), and transmits a 6-byte "M-W" section header from the MW table via CHROUT (LDA MW,X; JSR CHROUT; INX; CPX #$06; BNE).

**Description**
This routine sends the "M-W" (memory-to-disk / write) section header and parameters for one PART. Operation:

- Initialize the PART index pointer (TEMP) to $00.
- L00P3: add $20 to TEMP (STA TEMP); if the result is zero (wrapped past $FF), branch to DONE to stop.
- Prepare logical/output channel 15 by loading X with $0F and calling CHKOUT (conventionally checks/opens the output channel).
- L00P4: send 6 bytes from the MW table starting at MW (LDA MW,X; JSR CHROUT), incrementing X until six bytes have been sent (CPX #$06; BNE L00P4).

Notes:
- TEMP, MW, CHKOUT, CHROUT, and DONE are referenced here but defined elsewhere.
- The BEQ after storing TEMP tests the zero flag from ADC; it detects a wrap to $00 (i.e., when adding $20 causes the 8-bit pointer to become zero).
- Channel number $0F is passed in X to CHKOUT (calling convention in this codebase).

## Source Code
```asm
; MRITE - send M-W section header (reconstructed from source)
MRITE:
    LDA #$00        ; initialize PART pointer (TEMP) to $00
    STA TEMP

L00P3:
    LDA TEMP
    CLC
    ADC #$20        ; increment PART pointer by $20
    STA TEMP
    BEQ DONE        ; if wrapped to $00, finish

ENTER:
    LDX #$0F        ; prepare channel 15 for output
    JSR CHKOUT

    LDX #$00
L00P4:
    LDA MW,X        ; send "M-W" header / parameters from table MW
    JSR CHROUT
    INX
    CPX #$06
    BNE L00P4

; (labels TEMP, MW, CHKOUT, CHROUT, DONE not defined in this snippet)
```

## Key Registers
- **TEMP**: Zero-page address $0016, used as the PART pointer.
- **MW**: Address of the 6-byte "M-W" header table, defined elsewhere.
- **CHKOUT**: KERNAL routine at $FFC9, opens a channel for output.
- **CHROUT**: KERNAL routine at $FFD2, outputs a character to the current output channel.
- **DONE**: Label for routine termination, defined elsewhere.

## References
- "send_to_disk_section_header" — Provides the section title and comment that introduce this MRITE entry
- "buffer_pointer_setup_and_loop1_start" — Continues with setup of buffer pointers/indices and the LOOP1 processing that follows the header transmit

## Labels
- TEMP
- MW
- CHKOUT
- CHROUT
