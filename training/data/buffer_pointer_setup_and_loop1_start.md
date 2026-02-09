# MRITE/send-to-disk — buffer pointer setup and LOOP1 entry

**Summary:** Continuation of the MRITE/send-to-disk sequence showing buffer pointer/index initialization and the start of the per-buffer data loop (LOOP1). Contains assembly lines with STA, LDY, LDA, and the LOOP1 label; fragment has OCR/artifact errors and missing operands.

**Description**

This chunk continues from the header-transmit stage into the buffer setup and the top of the per-buffer processing loop used by the MRITE/send-to-disk routine. The fragment shows a short sequence of accumulator/index operations and a LOOP1 label, implying transition from sending the M-W header to initializing buffer pointers/indices and entering the per-buffer loop.

Observed elements:

- **LDA #$00**: This instruction loads the accumulator with the immediate value $00, initializing it to zero.

- **STA $01**: This stores the accumulator's value into memory location $01. In the Commodore 1541 disk drive, address $01 is used to set the data direction register for port A of the 6522 VIA chip, which controls the direction (input or output) of the port's pins.

- **LDY #$01**: This loads the Y register with the immediate value $01, setting up an initial index or counter value.

- **LOOP1**: A label marking the top of the per-buffer loop. The body of the loop is not included in this fragment.

This fragment is partial and contains OCR artifacts and missing operands; it cannot be executed as-is. Use this chunk as an indexable description of where buffer-pointer initialization and the LOOP1 entry occur in the full MRITE routine.

## Source Code

```asm
; Fragment of MRITE/send-to-disk routine
; Note: This code contains OCR artifacts and is incomplete

LDA #$00        ; Load immediate value 0 into the accumulator
STA $01         ; Store accumulator to memory location $01 (data direction register)
LDY #$01        ; Load Y register with immediate value 1

LOOP1:
; Loop body missing
```

## References

- "mw_entry_mrite_and_header_transmit" — expands on the previous chunk that sends the M-W header and parameters; this chunk initializes buffer pointers and begins the LOOP1 data handling that follows.