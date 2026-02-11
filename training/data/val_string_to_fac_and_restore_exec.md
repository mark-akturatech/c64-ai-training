# VAL() implementation and FAC1 load ($B7AD-$B7EA)

**Summary:** Implements VAL() entry at $B7AD: evaluates a BASIC string (JSR $B782), handles empty-string (jump to $B8F7 to clear FAC1), temporarily patches BASIC execute pointer ($7A-$7B) to point at the string, NULL-terminates the string in-place via ($24),Y, calls the scan and string->FAC1 converter (JSR $0079 and JSR $BCF3), restores the original byte and execute pointer, leaving the parsed numeric value in FAC1.

## Implementation details
- Entry point $B7AD calls the string evaluator (JSR $B782) which returns the evaluated string length in A (and Y). If the length is zero (A == 0) the code jumps to $B8F7 which clears FAC1 exponent and sign (result zero) and returns.
- To allow the string-parsing routines to operate in-place, the code saves the current BASIC execute pointer ($7A/$7B) into temporary zero-page slots $71/$72, then overwrites $7A/$7B with the string pointer from $22/$23.
- The string end address is computed by adding the length (A) to the string pointer low byte (ADC $22) with carry cleared first; the resulting low/high are stored in $24/$25 and used as an indirect Y base pointer.
- The byte at the computed string end (LDA ($24),Y) is pushed (PHA), replaced with $00 (STA ($24),Y) to NULL-terminate the string, enabling the in-place scanner to treat it as a C-style zero-terminated string.
- JSR $0079 is invoked to "scan memory" (presumably perform lexical pre-scan or set up scanning state), then JSR $BCF3 performs the core string -> FAC1 conversion (parsing ASCII to the floating accumulator FAC1).
- After conversion, the saved end-byte is pulled (PLA) and written back to the string end (STA ($24),Y), restoring the original memory contents.
- The original BASIC execute pointer is restored from $71/$72 back into $7A/$7B, and the routine returns (RTS).
- Key calls: JSR $B782 (evaluate string), JSR $0079 (scan memory/setup), JSR $BCF3 (string to FAC1 conversion). The code relies on indirect,Y addressing through $24/$25 to operate on the string end byte.

## Source Code
```asm
                                *** perform VAL()
.,B7AD 20 82 B7 JSR $B782       evaluate string, get length in A (and Y)
.,B7B0 D0 03    BNE $B7B5       branch if not null string
                                string was null so set result = $00
.,B7B2 4C F7 B8 JMP $B8F7       clear FAC1 exponent and sign and return
.,B7B5 A6 7A    LDX $7A         get BASIC execute pointer low byte
.,B7B7 A4 7B    LDY $7B         get BASIC execute pointer high byte
.,B7B9 86 71    STX $71         save BASIC execute pointer low byte
.,B7BB 84 72    STY $72         save BASIC execute pointer high byte
.,B7BD A6 22    LDX $22         get string pointer low byte
.,B7BF 86 7A    STX $7A         save BASIC execute pointer low byte
.,B7C1 18       CLC             clear carry for add
.,B7C2 65 22    ADC $22         add string length
.,B7C4 85 24    STA $24         save string end low byte
.,B7C6 A6 23    LDX $23         get string pointer high byte
.,B7C8 86 7B    STX $7B         save BASIC execute pointer high byte
.,B7CA 90 01    BCC $B7CD       branch if no high byte increment
.,B7CC E8       INX             increment string end high byte
.,B7CD 86 25    STX $25         save string end high byte
.,B7CF A0 00    LDY #$00        set index to $00
.,B7D1 B1 24    LDA ($24),Y     get string end byte
.,B7D3 48       PHA             push it
.,B7D4 98       TYA             clear A
.,B7D5 91 24    STA ($24),Y     terminate string with $00
.,B7D7 20 79 00 JSR $0079       scan memory
.,B7DA 20 F3 BC JSR $BCF3       get FAC1 from string
.,B7DD 68       PLA             restore string end byte
.,B7DE A0 00    LDY #$00        clear index
.,B7E0 91 24    STA ($24),Y     put string end byte back

                                *** restore BASIC execute pointer from temp
.,B7E2 A6 71    LDX $71         get BASIC execute pointer low byte back
.,B7E4 A4 72    LDY $72         get BASIC execute pointer high byte back
.,B7E6 86 7A    STX $7A         save BASIC execute pointer low byte
.,B7E8 84 7B    STY $7B         save BASIC execute pointer high byte
.,B7EA 60       RTS             
```

## Key Registers
- $7A-$7B - BASIC - BASIC execute pointer (current BASIC PC, low/high)
- $71-$72 - BASIC - temporary storage for saved BASIC execute pointer (low/high)
- $22-$23 - BASIC - string pointer (low/high) used as source for VAL()
- $24-$25 - BASIC - computed string end pointer (low/high) used with indirect,Y addressing

## References
- "parse_string_to_fac_and_exponent_handling" — expands on ASCII-to-FAC1 parsing invoked by VAL()
- "fac_to_ascii_conversion_and_number_formatting" — covers inverse FAC1->ASCII used by STR$ and printing

## Labels
- VAL
