# Compare FAC1 with 4-byte floating at (AY) ($BC5B-$BC98)

**Summary:** Compares the 4-byte floating-point value in FAC1 with the 4-byte value pointed to by the zero-page pointer ($24/$25) using (AY) addressing. Uses exponent, sign, normalized mantissa bytes, and the FAC1 rounding byte; returns A=$00 if equal, A=$01 if FAC1>(AY), A=$FF if FAC1<(AY).

## Operation
This ROM routine compares FAC1 (the accumulator-format floating-point workspace) with a 4-byte floating value stored in memory pointed to by the zero-page pointer ($24/$25). Steps:

- Save the pointer low/high in zero page ($24/$25) and clear Y for (AY) indexed indirect access.
- Load the target exponent from (AY) into A, copy to X (the FAC1 exponent is in $61). If the target exponent is zero, branch to the FAC1-sign return path (handles signed zero or special case).
  - On that path the routine returns A=$FF with Carry=1 for negative, or A=$01 with Carry=0 for positive — see referenced get_fac1_sign.
- Load the first mantissa byte from (AY) (which includes sign bit in b7). EOR with $66 (FAC1 sign byte) to detect sign differences:
  - If signs differ, branch to return path producing A=$FF/A=$01 with Carry set/clear based on FAC1 sign.
- Compare exponents (X vs $61). If different, branch to return path.
- For mantissa comparisons:
  - Load mantissa1 from (AY), ORA #$80 to normalise the top bit (ensures implied 1 for normalized numbers) and compare with FAC1 mantissa1 ($62).
  - Compare subsequent mantissa bytes 2 and 3 ($63, $64).
  - Load FAC1 rounding byte compare value: the routine sets A=#\$7F and CMPs $70 (FAC1 rounding byte). This sets carry appropriately for half-rounding conventions used when deciding equality for mantissa4.
  - Finally load mantissa4 from (AY) and subtract FAC1 mantissa4 ($65) with SBC; if result zero branch to equality exit (A=$00).
- If any compare shows a difference, the code prepares FAC1 sign and possibly toggles it (EOR #$FF) so that the final return at $BC31 sets A=$FF for FAC1<(AY) or A=$01 for FAC1>(AY). Carry is used to encode sign in the return (see perform_sgn).

Return values:
- A = $00  — FAC1 equals (AY)
- A = $01  — FAC1 > (AY) (Carry clear for positive convention)
- A = $FF  — FAC1 < (AY) (Carry set for negative convention)

References to helper routines:
- get_fac1_sign — determines sign-based comparison results
- round_fac1 — explains usage of the rounding byte ($70) in the mantissa4 comparison
- perform_sgn — explains sign-byte convention for comparison return values

## Source Code
```asm
.,BC5B 85 24    STA $24         save pointer low byte
.,BC5D 84 25    STY $25         save pointer high byte
.,BC5F A0 00    LDY #$00        clear index
.,BC61 B1 24    LDA ($24),Y     get exponent
.,BC63 C8       INY             increment index
.,BC64 AA       TAX             copy (AY) exponent to X
.,BC65 F0 C4    BEQ $BC2B       branch if (AY) exponent=0 and get FAC1 sign
                                A = $FF, Cb = 1/-ve A = $01, Cb = 0/+ve
.,BC67 B1 24    LDA ($24),Y     get (AY) mantissa 1, with sign
.,BC69 45 66    EOR $66         EOR FAC1 sign (b7)
.,BC6B 30 C2    BMI $BC2F       if signs <> do return A = $FF, Cb = 1/-ve
                                A = $01, Cb = 0/+ve and return
.,BC6D E4 61    CPX $61         compare (AY) exponent with FAC1 exponent
.,BC6F D0 21    BNE $BC92       branch if different
.,BC71 B1 24    LDA ($24),Y     get (AY) mantissa 1, with sign
.,BC73 09 80    ORA #$80        normalise top bit
.,BC75 C5 62    CMP $62         compare with FAC1 mantissa 1
.,BC77 D0 19    BNE $BC92       branch if different
.,BC79 C8       INY             increment index
.,BC7A B1 24    LDA ($24),Y     get mantissa 2
.,BC7C C5 63    CMP $63         compare with FAC1 mantissa 2
.,BC7E D0 12    BNE $BC92       branch if different
.,BC80 C8       INY             increment index
.,BC81 B1 24    LDA ($24),Y     get mantissa 3
.,BC83 C5 64    CMP $64         compare with FAC1 mantissa 3
.,BC85 D0 0B    BNE $BC92       branch if different
.,BC87 C8       INY             increment index
.,BC88 A9 7F    LDA #$7F        set for 1/2 value rounding byte
.,BC8A C5 70    CMP $70         compare with FAC1 rounding byte (set carry)
.,BC8C B1 24    LDA ($24),Y     get mantissa 4
.,BC8E E5 65    SBC $65         subtract FAC1 mantissa 4
.,BC90 F0 28    BEQ $BCBA       exit if mantissa 4 equal
                                gets here if number <> FAC1
.,BC92 A5 66    LDA $66         get FAC1 sign (b7)
.,BC94 90 02    BCC $BC98       branch if FAC1 > (AY)
.,BC96 49 FF    EOR #$FF        else toggle FAC1 sign
.,BC98 4C 31 BC JMP $BC31       return A = $FF, Cb = 1/-ve A = $01, Cb = 0/+ve
```

## Key Registers
- $0024-$0025 - Zero Page - pointer to target 4-byte float (used with LDA ($24),Y)
- $0061 - Zero Page - FAC1 exponent (compared against (AY) exponent)
- $0062-$0065 - Zero Page - FAC1 mantissa bytes 1-4 ($62 mant1, $63 mant2, $64 mant3, $65 mant4)
- $0066 - Zero Page - FAC1 sign byte (sign in bit 7)
- $0070 - Zero Page - FAC1 rounding byte used for half-rounding comparisons

## References
- "get_fac1_sign" — expands on used to determine sign-based comparison results
- "round_fac1" — expands on uses the rounding byte when comparing mantissa4
- "perform_sgn" — expands on provides the sign-byte convention used in comparison return values