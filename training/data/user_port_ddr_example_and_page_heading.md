# Set User Port DDR to 0 via (POINT),Y

**Summary:** Demonstrates an assembly snippet to set the user port Data Direction Register (DDR) to zero using indirect indexed addressing with a zero-page pointer (POINT) and Y offset.

**Description**

This code sequence writes 0 to the memory location addressed by the zero-page pointer (POINT) plus Y, targeting the user port's DDR. Writing $00 to the DDR configures all pins of that port as inputs.

Requirements and notes:

- **POINT Initialization:** POINT must be a zero-page pointer (two bytes: low/high) that references the base address of the I/O memory page. This can be set up using the `IOBASE` KERNAL routine, which returns the base address of the I/O area in the X and Y registers. Store these registers into POINT:


  ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_5/page_284.html?utm_source=openai))

- **Y Offset:** The Y register should be set to the offset of the DDR within the I/O page. For the user port, which corresponds to Port B of CIA #2, the DDR is located at offset $03. Therefore, set Y to $03:


- **Addressing Mode:** The code uses the (POINT),Y addressing mode—indirect indexed store—to write to the DDR.

## Source Code

  ```asm
      JSR IOBASE
      STX POINT       ; Store low byte of I/O base address
      STY POINT+1     ; Store high byte of I/O base address
  ```

  ```asm
      LDY #$03        ; Offset for DDR of the user port
  ```


```asm
    JSR IOBASE        ; Get base address of I/O area
    STX POINT         ; Store low byte of I/O base address
    STY POINT+1       ; Store high byte of I/O base address
    LDY #$03          ; Offset for DDR of the user port
    LDA #$00          ; Value to set DDR to input
    STA (POINT),Y     ; Set DDR to 0
```

## Key Registers

- **POINT (Zero-Page Pointer):** Holds the base address of the I/O memory page.
- **Y Register:** Offset to the DDR within the I/O page (set to $03 for user port DDR).

## References

- Commodore 64 Programmer's Reference Guide: [User Callable KERNAL Routines - IOBASE](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_5/page_284.html)
- Commodore 64 Programmer's Reference Guide: [Input/Output Guide - User Port](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_6/page_361.html)

## Labels
- POINT
