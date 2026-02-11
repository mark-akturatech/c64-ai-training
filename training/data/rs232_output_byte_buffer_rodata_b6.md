# RODATA ($B6) — RS-232 Output Byte Buffer

**Summary:** RODATA is a zero-page buffer at $B6 (182) used by the RS-232 transmit routines; bytes fetched from the transmission buffer pointed to by $F9 (249) are disassembled here into serial bits for shifting out.

**Description**
RODATA ($B6) holds the output byte currently being prepared for RS-232 transmission. RS-232 transmit routines read the next byte from the transmission buffer (pointer stored at $F9) and disassemble that byte into RODATA so the bit-timer/shift logic can output each serial bit in turn. This location is part of the zero page workspace used by the serial output code; it is referenced by related routines that handle bit counting, parity/stop-bit insertion, and producing the next bit for the transmitter.

## Source Code
```assembly
; RS-232 Transmit Routine (excerpt)
; This routine fetches a byte from the transmission buffer and prepares it for serial transmission.

LDY $029D        ; Load the current output buffer index
CPY $029E        ; Compare with the end of the output buffer
BEQ NoData       ; If equal, no data to send

LDA ($F9),Y      ; Load the next byte from the transmission buffer
STA $B6          ; Store it in RODATA for bit-wise transmission

INC $029D        ; Increment the output buffer index
RTS

NoData:
; Handle the case where there is no data to send
RTS
```

## Key Registers
- $00B6 - Zero Page - RS-232 output byte buffer (RODATA): holds the disassembled byte bits for serial transmission
- $00F9 - Zero Page - Pointer to transmission buffer (transmit queue); RS-232 routines fetch the next byte via this pointer

## References
- "rs232_output_bit_count_BITTS_B4" — expands on bit counting and parity/stop-bit handling for output  
- "rs232_next_bit_or_tape_eot_NXTBIT_B5" — expands on holding/generating the next bit from RODATA for transmission

## Labels
- RODATA
