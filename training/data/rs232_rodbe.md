# $029E RODBE — RS-232 Index to End of Transmit Buffer

**Summary:** $029E (RODBE) is a RAM byte holding the index of the ending byte within the 256-byte RS-232 transmit buffer; it is used by RS-232 code to add data to that buffer. Searchable terms: $029E, RODBE, RS-232, transmit buffer, 256-byte.

**Description**

RODBE at $029E contains the index that points to the last/ending byte in the RS-232 transmit buffer. When code appends data to the 256-byte transmit buffer, it consults or updates this index to determine where the next byte should be placed (or where the buffer currently ends). The corresponding start/index-of-buffer variable is referenced as RODBS at $029D, which holds the high byte of the transmit buffer's starting address.

The transmit buffer is allocated dynamically when an RS-232 channel is opened. The KERNAL routine `OPEN` ($FFC0) sets up the transmit buffer and initializes RODBS and RODBE accordingly. Specifically:

- **RODBS ($029D):** High byte of the transmit buffer's starting address.
- **RODBE ($029E):** Index to the end of the transmit buffer.

The actual starting address of the transmit buffer can be determined by combining RODBS with a low byte of $00, forming the 16-bit address `RODBS * 256`. For example, if RODBS contains $C0, the transmit buffer starts at $C000.

## Source Code

```assembly
; Example routine to add a byte to the RS-232 transmit buffer

; Input:
;   A - Byte to add to the buffer

; Assumes:
;   RODBS ($029D) - High byte of transmit buffer start address
;   RODBE ($029E) - Index to end of transmit buffer

    LDX $029E          ; Load current end index
    LDY $029D          ; Load high byte of buffer start address
    LDA #$00
    STA $FB            ; Temporary storage for low byte of buffer start address
    STY $FC            ; Temporary storage for high byte of buffer start address
    CLC
    ADC $FB            ; Add low byte (0) to end index
    STA $FB
    BCC NoCarry
    INC $FC            ; Increment high byte if carry occurred
NoCarry:
    STA ($FB),Y        ; Store byte in buffer
    INC $029E          ; Increment end index
    RTS
```

## Key Registers

- $029E - RAM - RODBE: RS-232 index to end of 256-byte transmit buffer
- $029D - RAM - RODBS: High byte of RS-232 transmit buffer start address

## References

- Commodore 64 Programmer's Reference Guide, Chapter 6: Input/Output Guide - RS-232 Interface Description
- Commodore 64 Memory Map

([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_6/page_349.html?utm_source=openai))

## Labels
- RODBE
- RODBS
