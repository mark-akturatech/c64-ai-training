# Copy 40-column screen line (shift screen line up/down)

**Summary:** Copies a full 40-column screen line (characters + colour RAM) using zero-page indirect pointers; composes source pointer high byte by masking/OR'ing with $0288, saves it in $AD, calls $E9E0 to set up colour-RAM pointers, then loops LDY #$27 down to 0 performing LDA ($AC),Y -> STA ($D1),Y and LDA ($AE),Y -> STA ($F3),Y. Uses zero-page pointers ($AC-$AF, $D1-$D2, $F3-$F4) and helper JSR $E9E0.

## Description
This routine shifts a single 40-column screen line between adjacent lines (used for scrolling up/down). Operation steps:

- AND #$03: mask low two bits to select one of four 16KB pages (0000 00xx).
- ORA $0288: combine masked value with the system byte at $0288 to form the high byte of the source pointer (screen memory page).
- STA $AD: save that high byte into zero page ($AD), used by the indirect source pointers.
- JSR $E9E0: call helper that computes/sets up colour-RAM source pointers for the chosen line (see referenced chunk).
- LDY #$27: preload Y with $27 (39 decimal). The loop runs with Y from 39 down to 0 inclusive, giving 40 iterations (columns).
- Loop body:
  - LDA ($AC),Y -> STA ($D1),Y : copy character bytes from source line pointer at ($AC),Y to destination line pointer at ($D1),Y.
  - LDA ($AE),Y -> STA ($F3),Y : copy colour bytes from source line colour pointer at ($AE),Y to destination colour pointer at ($F3),Y.
- DEY / BPL loop back until Y underflows past 0.
- RTS: return when done.

Pointers used are zero-page indirect word pointer pairs:
- ($AC),Y — source screen-character pointer (low byte at $AC, high saved in $AD).
- ($AE),Y — source colour-RAM pointer (low byte at $AE, high set by helper JSR $E9E0).
- ($D1),Y — destination/current screen-character pointer (low byte at $D1, high at $D2).
- ($F3),Y — destination/current colour-RAM pointer (low byte at $F3, high at $F4).

Count and addressing notes:
- LDY #$27 / DEY / BPL uses signed branch; starting at $27 (39) and looping down to -1 performs exactly 40 stores.
- $0288 provides a page/offset used to form the high byte for the source pointers (must contain the base page for screen memory).

## Source Code
```asm
                                *** shift screen line up/down
.,E9C8 29 03    AND #$03        mask 0000 00xx, line memory page
.,E9CA 0D 88 02 ORA $0288       OR with screen memory page
.,E9CD 85 AD    STA $AD         save next/previous line pointer high byte
.,E9CF 20 E0 E9 JSR $E9E0       calculate pointers to screen lines colour RAM
.,E9D2 A0 27    LDY #$27        set the column count
.,E9D4 B1 AC    LDA ($AC),Y     get character from next/previous screen line
.,E9D6 91 D1    STA ($D1),Y     save character to current screen line
.,E9D8 B1 AE    LDA ($AE),Y     get colour from next/previous screen line colour RAM
.,E9DA 91 F3    STA ($F3),Y     save colour to current screen line colour RAM
.,E9DC 88       DEY             decrement column index/count
.,E9DD 10 F5    BPL $E9D4       loop if more to do
.,E9DF 60       RTS             
```

## Key Registers
- $0288 - RAM - screen memory page byte used to form source pointer high byte
- $AC-$AF - Zero Page - source pointer pairs (characters at $AC/$AD, colours at $AE/$AF). $AD is written here after ORA.
- $D1-$D2 - Zero Page - destination/current screen line character pointer (used by STA ($D1),Y)
- $F3-$F4 - Zero Page - destination/current colour-RAM pointer (used by STA ($F3),Y)

## References
- "calc_screen_line_colour_pointers_e9e0" — computes colour-RAM pointers for the source line (JSR $E9E0)
- "fetch_screen_address" — uses and updates the indirect pointers ($AC/$AE / $D1/$D2) that are fetched/initialized elsewhere