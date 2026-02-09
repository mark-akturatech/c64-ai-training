# Prepare colour-RAM pointer for next screen line ($E9E0)

**Summary:** Helper routine at $E9E0 that prepares a colour-RAM pointer for a given screen line pointer: calls $EA24 to compute the base colour pointer, copies the source line pointer low byte ($AC) into $AE, masks the source high byte ($AD) with AND #$03, ORA #$D8 to map to the colour-RAM page, and stores the result into $AF. Returns with RTS.

## Operation
This ROM helper builds a two-byte pointer in zero page ($AE/$AF) that points to the colour RAM line corresponding to the "next" screen line whose pointer is held in zero page $AC/$AD.

Step-by-step:
- JSR $EA24 — compute the pointer to the current screen line colour RAM (caller comment / related routine).
- LDA $AC; STA $AE — copy the low byte of the source screen-line pointer into the low byte of the colour-RAM pointer.
- LDA $AD; AND #$03 — mask the high byte to keep only the low two bits (page within 0-3).
- ORA #$D8 — set the high byte to the colour-RAM page (binary 1101 01xx, i.e. $D8-$DB depending on masked bits).
- STA $AF — store the constructed high byte into $AF.
- RTS — return to caller.

Effect: ($AE/$AF) now points to the colour RAM line corresponding to the source screen line pointer in $AC/$AD (mapped into the $D8-$DB page range). The routine overwrites the accumulator and zero-page locations $AE/$AF; it does not preserve A/X/Y or zero-page contents beyond those explicitly used.

## Source Code
```asm
.,E9E0 20 24 EA JSR $EA24       ; calculate the pointer to the current screen line colour RAM
.,E9E3 A5 AC    LDA $AC         ; get the next screen line pointer low byte
.,E9E5 85 AE    STA $AE         ; save the next screen line colour RAM pointer low byte
.,E9E7 A5 AD    LDA $AD         ; get the next screen line pointer high byte
.,E9E9 29 03    AND #$03        ; mask 0000 00xx, line memory page
.,E9EB 09 D8    ORA #$D8        ; set  1101 01xx, colour memory page
.,E9ED 85 AF    STA $AF         ; save the next screen line colour RAM pointer high byte
.,E9EF 60       RTS              ; return
```

## Key Registers
- $E9E0 - ROM - routine entry: prepare colour-RAM pointer for next screen line
- $EA24 - ROM - called routine: calculates base colour pointer (see referenced chunk)
- $AC - Zero Page - source screen line pointer low byte
- $AD - Zero Page - source screen line pointer high byte
- $AE - Zero Page - destination colour-RAM pointer low byte (result)
- $AF - Zero Page - destination colour-RAM pointer high byte (result)

## References
- "calculate_colour_ram_pointer_ea24" — expands on JSR $EA24 which computes the current screen line colour-RAM pointer
- "shift_screen_line_up_down" — shows usage: called by the line-shift routine to set colour-RAM pointers before copying bytes