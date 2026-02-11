# Remove trailing zeros from fractional part and prepare exponent (ROM $BEC4-$BED7)

**Summary:** 6502 code (Commodore 64 ROM) at $BEC4–$BED7 walks the output buffer backwards removing ASCII '0' digits from the fractional part, restores the last character if it is the decimal point, loads a '+' placeholder into A, reads the exponent count from zero page $5E, and tests for a zero exponent for an early exit.

## Description
This routine trims trailing zeros from the fractional portion of a formatted number already written into the output buffer, then sets up exponent handling:

- LDY $71 restores Y with the output-string index (zero page $71).
- LDA $00FF,Y reads the character at address $00FF + Y (absolute,Y) from the output buffer.
- DEY decrements the output-string index so the loop walks backward through the string.
- CMP #$30 compares the character with ASCII '0'; BEQ loops back to continue removing zeros.
- When a non-'0' is found, CMP #$2E tests for the decimal point '.' (ASCII $2E).
- If the non-'0' was the decimal point, INY restores the output-string index to keep the dot in the string.
- LDA #$2B loads ASCII '+' into A (placeholder for an exponent sign).
- LDX $5E loads the exponent digit count from zero page $5E.
- BEQ $BF07 tests X for zero and branches to the null-terminator/exit if there is no exponent to write.

This routine only scans and prepares state; the actual storing of the '+' character and formatting of exponent digits occurs in the subsequent code paths (see referenced chunks).

## Source Code
```asm
.,BEC4 A4 71    LDY $71         restore the output string index
.,BEC6 B9 FF 00 LDA $00FF,Y     get character from output string
.,BEC9 88       DEY             decrement output string index
.,BECA C9 30    CMP #$30        compare with "0"
.,BECC F0 F8    BEQ $BEC6       loop until non "0" character found
.,BECE C9 2E    CMP #$2E        compare with "."
.,BED0 F0 01    BEQ $BED3       branch if was dp
                                restore last character
.,BED2 C8       INY             increment output string index
.,BED3 A9 2B    LDA #$2B        character "+"
.,BED5 A6 5E    LDX $5E         get exponent count
.,BED7 F0 2E    BEQ $BF07       if zero go set null terminator and exit
```

## References
- "digit_extraction_loop_and_output_write" — expands on operations that produced the output buffer scanned here
- "write_exponent_digits_and_null_terminate" — expands on formatting and appending exponent digits when exponent != 0