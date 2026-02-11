# Wrapper at $FFED: JMP to $E505 — return X,Y organisation of screen

**Summary:** Wrapper at $FFED (ROM) containing a JMP $E505 that forwards to the routine which returns the screen X,Y organisation in the 6502 X and Y registers. Searchable terms: $FFED, $E505, screen organisation, X/Y registers.

**Description**

This ROM entry is a single-instruction wrapper located at $FFED. Its only function is to jump to the implementation at $E505, which returns the screen's X and Y dimensions in the 6502 X and Y CPU registers, respectively. The wrapper itself does not modify registers—it transfers execution directly to $E505.

The routine at $E505 sets the X register to 40 (indicating 40 columns) and the Y register to 25 (indicating 25 rows), reflecting the standard text screen dimensions of the Commodore 64.

## Source Code

```asm
                                *** return X,Y organization of screen
                                this routine returns the x,y organisation of the screen in X,Y
.,FFED 4C 05 E5 JMP $E505       return X,Y organization of screen
.,E505 A2 28      LDX #$28      ; Load X with 40 (number of columns)
.,E507 A0 19      LDY #$19      ; Load Y with 25 (number of rows)
.,E509 60         RTS           ; Return
```

## References

- "screen_organisation" — expands on $E505 routine and the mapping returned in X and Y registers