# Screen-line character flip loop using indirect indexed addressing (LDA ($BB),Y / STA ($BB),Y)

**Summary:** Routine that scans a single screen line using LDA ($BB),Y and STA ($BB),Y, starting Y=#$04 (column 5), skipping space (CMP #$20 / BEQ), flipping the high bit with EOR #$80, advancing Y until CPY #$12, then adding a per-line stride from $03A0 to the indirect pointer at $BB/$BC and repeating for X up to #$0E; finishes with RTS.

## Description
This routine processes one screen line character-by-character via an indirect indexed pointer at zero-page $BB/$BC:

- Setup: LDY #$04 (start at column 5 — offset 4).
- Per-character loop:
  - LDA ($BB),Y — read screen character from the effective address formed by the 16-bit pointer at $BB/$BC plus Y.
  - CMP #$20 / BEQ — skip processing if the character is a space (ASCII/charset value $20).
  - EOR #$80 — flip the high bit of the character (changes the displayed attribute/code as defined by the character set).
  - STA ($BB),Y — write the (possibly modified) character back to screen memory at the same effective address.
  - INY / CPY #$12 / BCC — increment column offset Y and loop while Y < $12 (hex 18), i.e., process the columns from offset 4 up to 17 inclusive.
- End of line:
  - CLC; LDA $BB; ADC $03A0; STA $BB — add the low-byte line stride (value stored at $03A0) to pointer low byte.
  - LDA $BC; ADC #$00; STA $BC — add carry into the high byte (ADC #$00 used to propagate carry).
  - INX; CPX #$0E; BNE $034C — increment X (line counter) and repeat for up to 14 lines (X < $0E).
- Exit: RTS when the line count is complete.

Notes and specifics preserved from source:
- $BB/$BC contain the 16-bit base address for screen memory (on PET/CBM example the base might be $8000).
- $03A0 holds the per-line byte offset (stride) to move the indirect pointer to the start of the next screen line (values mentioned: 22, 40, or 80 decimal — depends on hardware/screen layout).
- Branch targets in the listing were chosen to match addresses shown; if assembled elsewhere the branch offsets must be adjusted.

## Source Code
```asm
.A 034C  LDY #$04
.A 034E  LDA ($BB),Y
.A 0350  CMP #$20
.A 0352  BEQ $0356
.A 0354  EOR #$80
.A 0356  STA ($BB),Y
.A 0358  INY
.A 0359  CPY #$12
.A 035B  BCC $034E
.A 035D  CLC
.A 035E  LDA $BB
.A 0360  ADC $03A0
.A 0363  STA $BB
.A 0365  LDA $BC
.A 0367  ADC #$00
.A 0369  STA $BC
.A 036B  INX
.A 036C  CPX #$0E
.A 036E  BNE $034C
.A 0370  RTS
```

## Key Registers
- $BB-$BC - zero page 16-bit indirect pointer to screen memory base (low/high)
- $03A0 - memory byte holding per-line stride (add to $BB to advance pointer to next line)

## References
- "indirect_indexed_addressing" — LDA ($BB),Y and STA ($BB),Y practical use and details

## Labels
- $BB
- $BC
- $03A0
