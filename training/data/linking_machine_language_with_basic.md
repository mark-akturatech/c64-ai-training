# Linking machine language with BASIC (BRK → RTS; SYS 828 / $033C)

**Summary:** How to make a machine-language routine callable from BASIC by replacing BRK (00) with RTS (60) or re-assembling the final RTS line; use .X to return to BASIC, call via SYS 828 (address $033C), and combine BASIC FOR/NEXT loops with SYS calls. Mentions JSR $FFD2 (CHROUT) printing character in A.

## Linking overview
Machine-language programs assembled from the monitor typically end with a BRK (opcode $00) which returns to the monitor. To let BASIC call a machine routine and have the routine return control to BASIC, the end-of-routine must be RTS (opcode $60). Two ways to change BRK→RTS:

- Edit the disassembly: overwrite the single byte shown as 00 with 60 (press RETURN to accept).  
- Re-assemble the final instruction(s), e.g. assemble an RTS at the routine end.

After changing BRK to RTS, return to BASIC with the monitor command .X (the monitor will print READY). From BASIC call the machine routine with SYS <decimal address>. The example address used here is $033C (decimal 828): SYS 828 will jump to the machine routine at $033C.

The example routine loads ASCII $48 ('H') into A and calls the KERNAL CHROUT vector JSR $FFD2 to print it, then RTS to return to the caller (BASIC).

You can call the same machine routine repeatedly from BASIC (for example inside a FOR/NEXT loop). In the provided BASIC example the routine at $033C is called 10 times, printing 'H' 10 times on the same line (CHROUT prints a single character; it does not emit a newline).

Three subroutine-call types (distinct uses):
- GOSUB — call a BASIC subroutine from BASIC.
- SYS — call a machine-language subroutine from BASIC (SYS takes a decimal address).
- JSR — call a machine-language subroutine from machine language.

## Source Code
```asm
; Re-assemble example (addresses shown)
.A 033C  LDA #$48
.A 033E  JSR $FFD2
.A 0341  RTS

; Alternative: disassemble then edit byte at routine end
; Change the BRK byte (00) to RTS (60) in the disassembly listing
; (type over 00 with 60 and press RETURN)
```

```basic
100 FOR J=1 TO 10
110 SYS 828
120 NEXT J
```

## References
- "running_program_with_monitor" — expands on running from the monitor vs running from BASIC  
- "loops_introduction_indexed_addressing" — expands on building loops for longer output strings

## Labels
- CHROUT

## Mnemonics
- BRK
- RTS
