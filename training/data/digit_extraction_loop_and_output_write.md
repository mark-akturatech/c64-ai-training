# ROM: prepare output buffer and extract digits (decimal point, padding, digit loop) ($BE53-$BEB2)

**Summary:** C64 ROM routine (entry $BE53) that writes a decimal point and optional leading zero, then iteratively extracts decimal digits from FAC1 mantissa ($62-$65) by adding precomputed powers-of-ten bytes (table at $BF16-$BF19), using ADC/CLC and carry testing to determine digit sign, converting digits to ASCII, writing them to the output buffer (base $00FF,Y), and decrementing the digits-before-decimal counter ($5D).

## Description
This ROM fragment performs the final steps of converting a fixed-point FAC1 value into ASCII digits in the output string. It:
- Writes the decimal point ('.') into the output string (using STA $00FF,Y).
- Optionally pads with a leading '0' (writes ASCII '0') depending on X tested via TXA/BEQ.
- Initializes a pointer/index (Y=0) to the digit-table entries ($BF16-$BF19) and sets X=$80 as the digit counter/sign-test seed.
- For each digit: adds the 4 table bytes (one per FAC1 mantissa byte) to FAC1 mantissa bytes ($65,$64,$63,$62) using CLC/ADC for multi-byte addition. The sequence is least-significant mantissa byte first so carries propagate correctly.
- Uses the processor carry/negative flags after the multi-byte add + an INX to test whether the addition produced a positive or negative result and whether the digit should be accepted or the loop should continue (re-add the table to count another unit).
- When the loop finishes for a digit, prepares the digit in A:
  - TXA moves the loop counter X into A (the digit value candidate).
  - If the carry test indicates a negative result, the code forms the two's-complement result to obtain the decimal digit value (EOR #$FF followed by ADC #$0A), then adds ASCII offset (ADC #$2F) to turn the numeric digit into ASCII.
  - If the carry indicates a simple positive result, the code skips two's-complement and proceeds to ASCII conversion (ADC #$2F).
- Advances the table pointer by 4 bytes (four INY instructions) to point to the next lower power-of-ten for the next digit.
- Saves the table pointer (STY $47), updates the output-string index (LDY $71, INY), masks the top bit of the ASCII byte (AND #$7F) then stores the ASCII digit (STA $00FF,Y).
- Decrements the integer-digit counter ($5D); if it reaches zero, emits the decimal point (again) and continues for fractional digits as per higher-level logic.

Behavioral/technical notes preserved from code:
- FAC1 mantissa bytes are at $62 (most-significant) through $65 (least-significant) and are updated in-place by per-byte ADCs.
- The digit table is laid out so each digit's 4 bytes (one per mantissa byte) are contiguous; the routine indexes into it using Y and advances by 4 to move to the next digit's table entry.
- Multi-byte adds use CLC before the least-significant-byte ADC, and ADCs propagate carry through the mantissa bytes; the carry after the most-significant ADC is used to decide digit sign/termination.
- ASCII conversion uses a combined sequence that handles both positive and negative (two's-complement) digit results; the result is masked (AND #$7F) before storing.

This routine is part of the ROM number-to-string conversion chain (see related chunks for table/index bounds, rounding, trimming of trailing zeros, and exponent handling).

## Source Code
```asm
.,BE53 A4 71    LDY $71         get output string index
.,BE55 A9 2E    LDA #$2E        character "."
.,BE57 C8       INY             increment index
.,BE58 99 FF 00 STA $00FF,Y     save to output string
.,BE5B 8A       TXA             
.,BE5C F0 06    BEQ $BE64       
.,BE5E A9 30    LDA #$30        character "0"
.,BE60 C8       INY             increment index
.,BE61 99 FF 00 STA $00FF,Y     save to output string
.,BE64 84 71    STY $71         save output string index
.,BE66 A0 00    LDY #$00        clear index (point to 100,000)
.,BE68 A2 80    LDX #$80        
.,BE6A A5 65    LDA $65         get FAC1 mantissa 4
.,BE6C 18       CLC             clear carry for add
.,BE6D 79 19 BF ADC $BF19,Y     add byte 4, least significant
.,BE70 85 65    STA $65         save FAC1 mantissa4
.,BE72 A5 64    LDA $64         get FAC1 mantissa 3
.,BE74 79 18 BF ADC $BF18,Y     add byte 3
.,BE77 85 64    STA $64         save FAC1 mantissa3
.,BE79 A5 63    LDA $63         get FAC1 mantissa 2
.,BE7B 79 17 BF ADC $BF17,Y     add byte 2
.,BE7E 85 63    STA $63         save FAC1 mantissa2
.,BE80 A5 62    LDA $62         get FAC1 mantissa 1
.,BE82 79 16 BF ADC $BF16,Y     add byte 1, most significant
.,BE85 85 62    STA $62         save FAC1 mantissa1
.,BE87 E8       INX             increment the digit, set the sign on the test sense bit
.,BE88 B0 04    BCS $BE8E       if the carry is set go test if the result was positive
                                else the result needs to be negative
.,BE8A 10 DE    BPL $BE6A       not -ve so try again
.,BE8C 30 02    BMI $BE90       else done so return the digit
.,BE8E 30 DA    BMI $BE6A       not +ve so try again
                                else done so return the digit
.,BE90 8A       TXA             copy the digit
.,BE91 90 04    BCC $BE97       if Cb=0 just use it
.,BE93 49 FF    EOR #$FF        else make the 2's complement ..
.,BE95 69 0A    ADC #$0A        .. and subtract it from 10
.,BE97 69 2F    ADC #$2F        add "0"-1 to result
.,BE99 C8       INY             increment ..
.,BE9A C8       INY             .. index to..
.,BE9B C8       INY             .. next less ..
.,BE9C C8       INY             .. power of ten
.,BE9D 84 47    STY $47         save current variable pointer low byte
.,BE9F A4 71    LDY $71         get output string index
.,BEA1 C8       INY             increment output string index
.,BEA2 AA       TAX             copy character to X
.,BEA3 29 7F    AND #$7F        mask out top bit
.,BEA5 99 FF 00 STA $00FF,Y     save to output string
.,BEA8 C6 5D    DEC $5D         decrement # of characters before the dp
.,BEAA D0 06    BNE $BEB2       branch if still characters to do
                                else output the point
.,BEAC A9 2E    LDA #$2E        character "."
.,BEAE C8       INY             increment output string index
.,BEAF 99 FF 00 STA $00FF,Y     save to output string
.,BEB2 84 71    STY $71         save output string index
```

## Key Registers
- $0062-$0065 - FAC1 mantissa bytes 1..4 (most-significant $62 → $65 least-significant)
- $0047 - variable pointer low byte (saved STY $47)
- $0071 - output string index (loaded/stored LDY/ STY $71)
- $005D - number of characters before decimal point (counter decremented via DEC $5D)
- $00FF - output buffer base (stores use STA $00FF,Y)
- $BF16-$BF19 - ROM digit table (powers-of-ten bytes; indexed by Y and advanced by +4 per digit)

## References
- "round_convert_and_prepare_digits" — relies on fixed representation and digits-before-decimal computed earlier
- "digit_table_index_checks_and_loop_control" — index bounds checks and loop control for the digit extraction table
- "trim_trailing_zeroes_and_exponent_handling" — trailing zero suppression and exponent writing after digit emission