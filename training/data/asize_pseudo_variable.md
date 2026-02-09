# .ASIZE (ca65 pseudo-variable)

**Summary:** .ASIZE returns the current Accumulator size in bits for ca65 macros (8 or 16 on the 65816 depending on current accumulator operand size; always 8 for other CPU instruction sets). Useful for selecting immediate operand sizes in assembler macros.

## Description
Reading the .ASIZE pseudo-variable yields the current Accumulator width in bits.

- On the 65816 instruction set, .ASIZE returns either 8 or 16 depending on the current accumulator operand size (affects immediate accumulator addressing).
- For all other CPU instruction sets supported by ca65, .ASIZE always returns 8.

Common use: branch on .ASIZE inside macros to emit correct-sized immediate operands (for example, choose between #$FF and #$FFFF).

See also .ISIZE for the equivalent pseudo-variable for the Index registers.

## Source Code
```asm
        ; Reverse Subtract with Accumulator
        ; A = memory - A
        .macro rsb param
                .if .asize = 8
                        eor     #$ff
                .else
                        eor     #$ffff
                .endif
                sec
                adc     param
        .endmacro
```

## References
- "isize_pseudo_variable" — expands on Index size (.ISIZE)
- "pseudo_variables_overview" — general pseudo variables introduction