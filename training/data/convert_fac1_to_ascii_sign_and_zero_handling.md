# FAC1 → ASCII (start of conversion): setup, sign, zero check

**Summary:** Start of the FAC1-to-ASCII conversion routine (6502 assembly) that initializes the output index (Y), detects and writes a leading sign or space into the output buffer (STA $00FF,Y), preserves the FAC1 sign byte ($66), and handles the FAC1==0 special case by writing "0", sending [EOT] and exiting (branches using $61 exponent check and JMP $BF04).

## Description
This code block performs the initial setup for converting the floating-point accumulator FAC1 into an ASCII string result (buffer written via absolute address $00FF + Y). Steps and behaviour:

- LDY #$01: initialize output index Y = 1 (the routine uses Y as the current output buffer index).
- LDA #$20: prepare ASCII space (' ') as the default leading character (assume positive).
- BIT $66: test the FAC1 sign byte at $66 (bit 7 indicates sign). The BIT instruction checks that sign bit without modifying memory.
- BPL $BDE7: if the sign bit indicates positive (bit 7 clear), skip to saving the default space.
- A9 $2D: if negative, set A = '-' (ASCII 0x2D).
- STA $00FF,Y: store the leading character (space or '-') into the output buffer at absolute address ($00FF + Y).
- STA $66: write A back to $66 (comment in source: "save FAC1 sign (b7)"). (This line stores the chosen leading character into $66 according to the original listing.)
- STY $71: save the current index Y into zero page $71 (preserve output index).
- INY: increment Y (advance buffer index after writing leading char).
- LDA #$30: set up ASCII '0' in A as the next character candidate.
- LDX $61: load FAC1 exponent from $61 (exponent byte of FAC1).
- BNE $BDF8: if exponent ≠ 0, FAC1 is non-zero — branch to main conversion/scale path.
- JMP $BF04: if exponent == 0 then FAC1 == 0: jump to the special-case handler that writes the final '0', issues [EOT], and exits.

Notes:
- The output buffer writes use absolute addressing STA $00FF,Y (bytes 99 FF 00), so the effective store address is $00FF + Y.
- $61 holds FAC1 exponent; $66 is used to test/sign-hold FAC1 sign (source comments refer to bit 7). $71 is used to hold the saved index.
- The special-case zero path is handled immediately (no scaling/notation decisions), jumping to $BF04 which finalizes the string with "0" and EOT.

## Source Code
```asm
                                *** convert FAC1 to ASCII string result in (AY)
.,BDDD A0 01    LDY #$01        set index = 1
.,BDDF A9 20    LDA #$20        character = " " (assume +ve)
.,BDE1 24 66    BIT $66         test FAC1 sign (b7)
.,BDE3 10 02    BPL $BDE7       branch if +ve
.,BDE5 A9 2D    LDA #$2D        else character = "-"
.,BDE7 99 FF 00 STA $00FF,Y     save leading character (" " or "-")
.,BDEA 85 66    STA $66         save FAC1 sign (b7)
.,BDEC 84 71    STY $71         save index
.,BDEE C8       INY             increment index
.,BDEF A9 30    LDA #$30        set character = "0"
.,BDF1 A6 61    LDX $61         get FAC1 exponent
.,BDF3 D0 03    BNE $BDF8       branch if FAC1<>0
                                exponent was $00 so FAC1 is 0
.,BDF5 4C 04 BF JMP $BF04       save last character, [EOT] and exit
```

## References
- "choose_notation_and_scale_fac1_to_get_digit_count" — expands the next steps: determine scaling/division/multiplication of FAC1 and choice of scientific vs normal notation
- "finalize_string_pointer_and_return" — expands the special-case zero path that jumps to final string pointer setup and routine return
