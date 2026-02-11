# SYNCHRONISE COLOUR TRANSFER (KERNAL $E9E0)

**Summary:** Sets up a temporary pointer in zero page ($AE/$AF) that points into the C64 colour RAM page ($D800-$DBFF) corresponding to the temporary screen address held in $AC/$AD; calls synchronise_colour_pointer (JSR $EA24) then maps the high byte to $D8-$DB to address colour RAM.

## Description
This KERNAL routine prepares a zero-page pointer to the colour RAM location that corresponds to the temporary screen address used for screen-scrolling/character moves.

Behavior step-by-step:
- JSR $EA24 — calls the helper "synchronise_colour_pointer" (resolves a colour RAM offset from the current temporary screen address).
- Copies the temporary screen pointer low byte ($AC) into $AE (EAL) to use as the low byte of the colour RAM pointer.
- Loads the temporary screen pointer high byte ($AD), masks it with #$03 (AND #$03) to keep only the low two bits, ORs with #$D8 to form a high byte in the range $D8-$DB, and stores that into $AF.
- After this, the zero-page word $AF:$AE points into $D800-$DBFF (colour RAM) at the same character index as the temporary screen address in $AD:$AC.
- RTS returns to the caller.

Technical notes:
- The AND #$03 limits the high byte to 2 bits because the colour RAM is a 1 KB region with 4 possible high-byte values: $D8, $D9, $DA, $DB.
- $AC/$AD are used here as the temporary screen address (SAL/SAH in the KERNAL variable naming). $AE/$AF become the temporary colour RAM pointer (EAL/EAH).
- This routine is typically used in conjunction with routines that move a screen line so that both character data and colour bytes are updated in sync.

## Source Code
```asm
.,E9E0 20 24 EA   JSR $EA24       ; synchronise colour pointer
.,E9E3 A5 AC      LDA $AC         ; SAL, pointer for screen scroll (low)
.,E9E5 85 AE      STA $AE         ; EAL = low byte for colour RAM pointer
.,E9E7 A5 AD      LDA $AD         ; SAL high (screen pointer high)
.,E9E9 29 03      AND #$03        ; mask to 2 low bits (1 KB banks)
.,E9EB 09 D8      ORA #$D8        ; set high byte to $D8-$DB (colour RAM page)
.,E9ED 85 AF      STA $AF         ; EAH = high byte for colour RAM pointer
.,E9EF 60         RTS
```

## Key Registers
- $AC - Zero Page (KERNAL) - Temporary screen pointer low byte (SAL low)
- $AD - Zero Page (KERNAL) - Temporary screen pointer high byte (SAL high)
- $AE - Zero Page (KERNAL) - Temporary colour RAM pointer low byte (EAL)
- $AF - Zero Page (KERNAL) - Temporary colour RAM pointer high byte (EAH)
- $D800-$DBFF - Colour RAM - per-character 4-bit colour memory (1 KB; pages at $D800, $D900, $DA00, $DB00)

## References
- "synchronise_colour_pointer" — derives the colour RAM pointer from the current screen address
- "move_a_screen_line" — called before moving characters so colour transfer is aligned

## Labels
- SYNCHRONISE_COLOUR_TRANSFER
- SAL
- SAH
- EAL
- EAH
