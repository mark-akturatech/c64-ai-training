# Set result string pointer and exit ($BF04–$BF10)

**Summary:** Handles routine exit paths by saving the last character or a null terminator into the output buffer (absolute,Y stores to $00FF/Y or $0100/Y), then returns the result string pointer in A (low byte) and Y (high byte) and executes RTS. Uses 6502 mnemonics STA/LDA/LDY/RTS; relevant for FAC1->ASCII and printing/conversion callers.

## Behavior
This small ROM fragment finalizes a string conversion/printing routine with two main actions:
- Store a final character (if present) into the output buffer using absolute,Y addressing: STA $00FF,Y (instruction at $BF04).
- Otherwise set a null terminator after the last character via STA $0100,Y (after LDA #$00 at $BF07).
After writing the terminator, the routine prepares the return pointer to the result string by loading A with the low byte and Y with the high byte of the pointer:
- LDA #$00 sets the returned low byte (A) to $00.
- LDY #$01 sets the returned high byte (Y) to $01.
The caller reads the returned pointer from A (low) and Y (high), pointing to $0100, then the routine returns with RTS.

Notes:
- Absolute,Y addressing (STA $00FF,Y / STA $0100,Y) writes to the base address plus Y; the exact target depends on the caller's Y at entry to the store instructions.
- The result pointer is returned in A/Y (A = low byte, Y = high byte) — caller expects the pointer in these registers.

## Source Code
```asm
                                save last character, [EOT] and exit
.,BF04 99 FF 00 STA $00FF,Y     save last character to output string
                                set null terminator and exit
.,BF07 A9 00    LDA #$00        set null terminator
.,BF09 99 00 01 STA $0100,Y     save after last character
                                set string pointer (AY) and exit
.,BF0C A9 00    LDA #$00        set result string pointer low byte
.,BF0E A0 01    LDY #$01        set result string pointer high byte
.,BF10 60       RTS             
```

## References
- "convert_fac1_to_ascii_sign_and_zero_handling" — expands on the FAC1->ASCII routine that ends here
- "print_in_and_convert_line_number_to_fac1" — expands on caller that prints the converted line number string