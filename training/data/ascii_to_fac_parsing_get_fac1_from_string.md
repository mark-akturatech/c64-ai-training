# VAL: ASCII numeric string -> FAC1 parser (C64 ROM $BCF3-$BD8E)

**Summary:** Parses an ASCII numeric string into the normalized floating accumulator FAC1 (handles sign, optional decimal point, digits, optional exponent 'E'/'e' with sign), using FAC multiply/divide helpers ($BAE2/$BAFE), rounding and accumulation. Key code addresses: $BCF3-$BD8E; temporary flags/bytes used: $5D, $5E, $5F, $60, $61, $66, $67, $6E, $6F.

## Purpose
This ROM routine scans an ASCII numeric token and converts it to the internal floating format stored in FAC1. It:
- Detects leading sign (+/-).
- Accumulates integer and fractional digits, tracking decimal position.
- Parses optional exponent with optional sign and adjusts FAC1 by multiplying/dividing by powers of ten.
- Performs rounding and combines digits into FAC1 using FAC multiply/add primitives.
- Sets negative flag and returns with FAC1 normalized.

## Flags, variables and temporary bytes
(Names inferred from usage in surrounding ROM)
- $5D: "numerator exponent" / digit exponent (counts decimal places to adjust)
- $5E: exponent count (parsed exponent magnitude)
- $5F: decimal-point-seen flag (bit used by BIT tests / ROR)
- $60: exponent-negative flag (set via ROR into bit7)
- $61: FAC1 exponent
- $66: FAC1 sign byte (used in comparison with FAC2 sign)
- $67: input negative flag (set to X value $FF when '-' seen)
- $6E: FAC2 sign byte (b7)
- $6F: sign compare result (FAC1 EOR FAC2)

These bytes are incremented/decremented and tested to determine whether to multiply or divide FAC1 by 10^n and to track decimal position while accumulating digits.

## Control flow overview
- Entry clears memory ($5D..$66 region) and sets up index.
- First scanned character is tested: digit, minus, plus, or decimal point.
- If a '-' is seen at start, $67 is set to indicate negative input.
- On encountering '.', decimal flag is set and further digits increment $5D (digit exponent).
- On encountering 'E'/'e', routine parses exponent sign and digits into $5E, supporting tokens 0xAA/0xAB as alternative +/- tokens.
- After exponent parsing, $5E is adjusted by subtracting $5D (numerator exponent) and then FAC1 is multiplied or divided by 10 repeatedly using JSR $BAE2 (multiply by 10) or JSR $BAFE (divide by 10).
- For each ASCII digit scanned: save digit to stack, call FAC rounding/copy routine ($BC0C) and FAC2 copy/save routine ($BC3C), compare FAC signs, fetch FAC1 exponent ($61), then jump to add FAC2 into FAC1 at $B86A.

## Exponent handling
- Exponent sign detection uses tokens and ASCII +/-; ROR on $60 places the sign into carry/bit7.
- If exponent is negative, the routine computes 0 - exponent (using SBC from $5E) to get positive count for division.
- $5E is set to the exponent magnitude; then loop either JSR $BAFE (FAC divide by 10) while incrementing $5E until zero, or JSR $BAE2 (FAC multiply by 10) while decrementing $5E until zero.
- After adjustment, if input negative flag ($67) is set, control jumps to negate FAC1 and return.

## Digit accumulation and rounding
- For each digit: multiply FAC1 by 10 (JSR $BAE2), convert ASCII to binary (SBC #$30), then:
  - Push digit, JSR $BC0C (round and copy FAC1 to FAC2), pull digit, JSR $BC3C (save A as integer byte).
  - Compare FAC2 and FAC1 signs (EOR/STA sequence) into $6F.
  - Load FAC1 exponent ($61) and branch to the routine that adds FAC2 to FAC1 (via $B86A).
- This sequence uses FAC multiply/add helpers to integrate the new digit into FAC1 while preserving normalization and sign.

## Return paths
- If no adjustment required after exponent processing and input negative flag clear, routine returns with FAC1 ready.
- If negative, it jumps to $BFB4 to negate FAC1 before returning.
- The primary add path proceeds via $B86A to add FAC2 into FAC1 and finish parsing.

## Source Code
```asm
.,BCF3 A0 00    LDY #$00        clear Y
.,BCF5 A2 0A    LDX #$0A        set index
.,BCF7 94 5D    STY $5D,X       clear byte
.,BCF9 CA       DEX             decrement index
.,BCFA 10 FB    BPL $BCF7       loop until numexp to negnum (and FAC1) = $00
.,BCFC 90 0F    BCC $BD0D       branch if first character is numeric
.,BCFE C9 2D    CMP #$2D        else compare with "-"
.,BD00 D0 04    BNE $BD06       branch if not "-"
.,BD02 86 67    STX $67         set flag for -ve n (negnum = $FF)
.,BD04 F0 04    BEQ $BD0A       branch always
.,BD06 C9 2B    CMP #$2B        else compare with "+"
.,BD08 D0 05    BNE $BD0F       branch if not "+"
.,BD0A 20 73 00 JSR $0073       increment and scan memory
.,BD0D 90 5B    BCC $BD6A       branch if numeric character
.,BD0F C9 2E    CMP #$2E        else compare with "."
.,BD11 F0 2E    BEQ $BD41       branch if "."
.,BD13 C9 45    CMP #$45        else compare with "E"
.,BD15 D0 30    BNE $BD47       branch if not "E"
                                was "E" so evaluate exponential part
.,BD17 20 73 00 JSR $0073       increment and scan memory
.,BD1A 90 17    BCC $BD33       branch if numeric character
.,BD1C C9 AB    CMP #$AB        else compare with token for -
.,BD1E F0 0E    BEQ $BD2E       branch if token for -
.,BD20 C9 2D    CMP #$2D        else compare with "-"
.,BD22 F0 0A    BEQ $BD2E       branch if "-"
.,BD24 C9 AA    CMP #$AA        else compare with token for +
.,BD26 F0 08    BEQ $BD30       branch if token for +
.,BD28 C9 2B    CMP #$2B        else compare with "+"
.,BD2A F0 04    BEQ $BD30       branch if "+"
.,BD2C D0 07    BNE $BD35       branch always
.,BD2E 66 60    ROR $60         set exponent -ve flag (C, which=1, into b7)
.,BD30 20 73 00 JSR $0073       increment and scan memory
.,BD33 90 5C    BCC $BD91       branch if numeric character
.,BD35 24 60    BIT $60         test exponent -ve flag
.,BD37 10 0E    BPL $BD47       if +ve go evaluate exponent
                                else do exponent = -exponent
.,BD39 A9 00    LDA #$00        clear result
.,BD3B 38       SEC             set carry for subtract
.,BD3C E5 5E    SBC $5E         subtract exponent byte
.,BD3E 4C 49 BD JMP $BD49       go evaluate exponent
.,BD41 66 5F    ROR $5F         set decimal point flag
.,BD43 24 5F    BIT $5F         test decimal point flag
.,BD45 50 C3    BVC $BD0A       branch if only one decimal point so far
                                evaluate exponent
.,BD47 A5 5E    LDA $5E         get exponent count byte
.,BD49 38       SEC             set carry for subtract
.,BD4A E5 5D    SBC $5D         subtract numerator exponent
.,BD4C 85 5E    STA $5E         save exponent count byte
.,BD4E F0 12    BEQ $BD62       branch if no adjustment
.,BD50 10 09    BPL $BD5B       else if +ve go do FAC1*10^expcnt
                                else go do FAC1/10^(0-expcnt)
.,BD52 20 FE BA JSR $BAFE       divide FAC1 by 10
.,BD55 E6 5E    INC $5E         increment exponent count byte
.,BD57 D0 F9    BNE $BD52       loop until all done
.,BD59 F0 07    BEQ $BD62       branch always
.,BD5B 20 E2 BA JSR $BAE2       multiply FAC1 by 10
.,BD5E C6 5E    DEC $5E         decrement exponent count byte
.,BD60 D0 F9    BNE $BD5B       loop until all done
.,BD62 A5 67    LDA $67         get -ve flag
.,BD64 30 01    BMI $BD67       if -ve do - FAC1 and return
.,BD66 60       RTS             

                                *** do - FAC1 and return
.,BD67 4C B4 BF JMP $BFB4       do - FAC1
                                do unsigned FAC1*10+number
.,BD6A 48       PHA             save character
.,BD6B 24 5F    BIT $5F         test decimal point flag
.,BD6D 10 02    BPL $BD71       skip exponent increment if not set
.,BD6F E6 5D    INC $5D         else increment number exponent
.,BD71 20 E2 BA JSR $BAE2       multiply FAC1 by 10
.,BD74 68       PLA             restore character
.,BD75 38       SEC             set carry for subtract
.,BD76 E9 30    SBC #$30        convert to binary
.,BD78 20 7E BD JSR $BD7E       evaluate new ASCII digit
.,BD7B 4C 0A BD JMP $BD0A       go do next character
                                evaluate new ASCII digit
                                multiply FAC1 by 10 then (ABS) add in new digit
.,BD7E 48       PHA             save digit
.,BD7F 20 0C BC JSR $BC0C       round and copy FAC1 to FAC2
.,BD82 68       PLA             restore digit
.,BD83 20 3C BC JSR $BC3C       save A as integer byte
.,BD86 A5 6E    LDA $6E         get FAC2 sign (b7)
.,BD88 45 66    EOR $66         toggle with FAC1 sign (b7)
.,BD8A 85 6F    STA $6F         save sign compare (FAC1 EOR FAC2)
.,BD8C A6 61    LDX $61         get FAC1 exponent
.,BD8E 4C 6A B8 JMP $B86A       add FAC2 to FAC1 and return
```

## References
- "val_string_to_fac_parsing" — expands on VAL() routine uses this parser to get FAC1 from a string
- "multiply_divide_and_accumulator_algorithms" — expands on uses FAC multiplication/division primitives while building FAC1 from digits