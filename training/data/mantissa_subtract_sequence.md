# FAC1 mantissa subtraction (ROM B8B0..B8D0)

**Summary:** 6502 assembly snippet (ROM $B8B0–$B8D0) that forms a two's-complement adjustment by ones-complementing A and ADCing a rounding byte, saves rounding, then performs an SBC chain across mantissa bytes to produce FAC1 mantissa bytes ($62–$65). Uses indexed addressing with X and Y ($0001–$0004 offsets).

## Description
This code implements magnitude subtraction when two floating-point values have opposite signs: it forms the two's-complement adjustment of one operand (via ones-complement + ADC rounding), stores the rounding byte, then subtracts the other operand's mantissa bytes using SBC across four mantissa bytes, storing the result into FAC1.

Behavior and important details:
- EOR #$FF performs a ones-complement of A.
- ADC $56 adds the rounding byte at $56 to A (and uses the processor carry), producing the two's-complement adjustment; the ADC result's carry becomes the initial carry/borrow for the subsequent SBC chain.
- STA $70 saves the rounding/adjustment byte for FAC1.
- The code then loads each FACY mantissa byte (indexed by Y at $0004..$0001) into A, performs SBC with the corresponding FACX mantissa byte (indexed by X at $04..$01), and stores the result into FAC1 mantissa bytes:
  - FAC1 mantissa 4 -> $65
  - FAC1 mantissa 3 -> $64
  - FAC1 mantissa 2 -> $63
  - FAC1 mantissa 1 -> $62
- SBC uses the carry flag as (NOT borrow). The carry set/clear from the ADC step and each SBC determines the borrow propagation between bytes.
- Addressing summary:
  - LDA $000n,Y — reads FACY mantissa byte n (n = 4..1)
  - SBC $0n,X  — subtracts FACX mantissa byte n (n = 4..1)
  - STA $6(5..2) — stores FAC1 mantissa bytes 4..1

No hardware registers are referenced; this is pure RAM/ROM arithmetic for the floating-point accumulator (FAC) structures used by the ROM floating-point routines.

## Source Code
```asm
.,B8B0 49 FF    EOR #$FF        ones complement A
.,B8B2 65 56    ADC $56         add FAC2 rounding byte
.,B8B4 85 70    STA $70         save FAC1 rounding byte
.,B8B6 B9 04 00 LDA $0004,Y     get FACY mantissa 4
.,B8B9 F5 04    SBC $04,X       subtract FACX mantissa 4
.,B8BB 85 65    STA $65         save FAC1 mantissa 4
.,B8BD B9 03 00 LDA $0003,Y     get FACY mantissa 3
.,B8C0 F5 03    SBC $03,X       subtract FACX mantissa 3
.,B8C2 85 64    STA $64         save FAC1 mantissa 3
.,B8C4 B9 02 00 LDA $0002,Y     get FACY mantissa 2
.,B8C7 F5 02    SBC $02,X       subtract FACX mantissa 2
.,B8C9 85 63    STA $63         save FAC1 mantissa 2
.,B8CB B9 01 00 LDA $0001,Y     get FACY mantissa 1
.,B8CE F5 01    SBC $01,X       subtract FACX mantissa 1
.,B8D0 85 62    STA $62         save FAC1 mantissa 1
```

## References
- "sign_compare_and_select_add_subtract" — triggered by sign compare choosing subtraction
- "abs_and_normalise_fac1" — followed by absolute-value and normalization of FAC1
