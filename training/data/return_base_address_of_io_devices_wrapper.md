# Wrapper at $FFF3 — JMP to $E500 (I/O base address in X:Y)

**Summary:** Contains a one-instruction wrapper at $FFF3 (JMP $E500) that transfers control to the routine at $E500, which sets the X and Y registers to the base address of the memory-mapped I/O devices. This allows programs to access I/O registers using the base address stored in X:Y plus an offset. Searchable terms: $FFF3, $E500, JMP, memory-mapped I/O, X/Y.

**Description**

This chunk documents a ROM entry point located at $FFF3. The byte sequence at $FFF3 is an absolute JMP to $E500; the actual work of returning the I/O base address is performed by the code at $E500. The routine at $E500 sets the X register to $00 and the Y register to $DC, corresponding to the base address $DC00 of the memory-mapped I/O area in the Commodore 64. This address can then be used with an offset to access specific I/O registers.

This routine exists to provide compatibility between the Commodore 64, VIC-20, and future models. By calling this routine, programs can determine the starting address of the I/O registers dynamically, ensuring compatibility across different systems. For example, on the VIC-20, the routine returns X = $10 and Y = $91, corresponding to the I/O base address $9110. ([pagetable.com](https://www.pagetable.com/c64ref/kernal/?utm_source=openai))

## Source Code

```asm
.,FFF3 4C 00 E5 JMP $E500       ; Jump to routine that sets X and Y to I/O base address

; Routine at $E500
.,E500 A2 00      LDX #$00      ; Load X with low byte of I/O base address
.,E502 A0 DC      LDY #$DC      ; Load Y with high byte of I/O base address
.,E504 60         RTS           ; Return from subroutine
```

## Key Registers

- **X Register:** Low byte of the I/O base address ($00).
- **Y Register:** High byte of the I/O base address ($DC).

## References

- Commodore 64 Programmer's Reference Guide, Chapter 5: BASIC to Machine Language - User Callable KERNAL Routines ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_5/page_284.html?utm_source=openai))
- Ultimate Commodore 64 Reference - KERNAL API ([pagetable.com](https://www.pagetable.com/c64ref/kernal/?utm_source=openai))