# Initialization: zero-page setup (LDA/STA/LDX/STX/INX)

**Summary:** Zero-page initialization routine using 6502 instructions LDA/STA/LDX/STX/INX to set variables at $007F, copy values from $000C/$000D into $0051/$0080/$0043, and load A with $01. Preserves original listing numbers and blank lines.

**Initialization overview**
This small initialization sequence performs zero-page variable setup (zero-page indicated by $00xx). Steps performed (in order):

- Clear a flag/byte at $007F with LDA #$00 / STA $007F.
- Load X from $000C and store that value into $0051 and $0080 (two zero-page locations) via LDX $000C / STX $0051 / STX $0080.
- Load X from $000D, increment X, then store X into $0043 (LDX $000D / INX / STX $0043).
- Next instruction begins LDA #$01 (immediate $01 loaded into A).

No additional subroutines or device registers are referenced in this chunk; it appears to be preparatory zero-page setup before subsequent sector/tail/gap routines.

## Source Code
```asm
200  ;*  INITIALIZATION  * 
210  ; 

220  LDA  #$00
230  STA  $7F
240  LDX  $0C
250  STX  $51
260  STX  $80
270  LDX  $0D
280  INX
290  STX  $43
300  LDA  #$01
```

## Key Registers
- $007F - Zero Page - byte cleared to $00 (flag/variable)
- $000C - Zero Page - source for LDX (copied to $0051 and $0080)
- $0051 - Zero Page - receives copy of $000C
- $0080 - Zero Page - receives copy of $000C
- $000D - Zero Page - source for LDX (incremented then stored)
- $0043 - Zero Page - receives (LDX $000D ; INX) result

## References
- "assembler_directives_and_org" — assembly origin and org directives relevant to this initialization
- "tail_gap_and_sector_variables" — subsequent sector/tail/gap setup that follows the zero-page initialization