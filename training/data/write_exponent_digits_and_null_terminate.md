# Exponent formatting and storage (ROM disassembly $BED9-$BF02)

**Summary:** Disassembly of ROM routine that writes an exponent field into a buffer at $0100-$0104,Y using 6502 mnemonics (BPL, SBC, TAX, LDX, ADC, STA). Handles negative exponent conversion (SBC $5E), stores exponent sign ('E' and '-' / '+'), extracts tens/ones by repeated SBC #$0A, and writes a null terminator.

## Description
This code writes a five-byte exponent substring into the output buffer addressed as $0100..$0104 with index Y: the layout becomes:
- $0100,Y = 'E' (exponent letter)
- $0101,Y = '-' (negative sign, present if the exponent was negative)
- $0102,Y = tens digit ASCII
- $0103,Y = ones digit ASCII
- $0104,Y = $00 (null terminator)

Behavior and steps (in order of execution):

1. BPL $BEE3 checks the sign of the exponent count in the processor flags (branch if plus). If the exponent is positive the code skips the two's-complement conversion; if negative, the conversion executes so the numeric count becomes positive for digit extraction.
2. Negative-to-positive conversion: LDA #$00 / SEC / SBC $5E computes 0 - ($5E) with carry to negate the stored (negative) exponent count. TAX copies the resulting positive count into X for later use (the value ends up also being used for digit extraction).
3. Write sign characters:
   - LDA #$2D (ASCII '-') and STA $0101,Y saves the minus sign into the buffer (at offset $0101,Y).
   - LDA #$45 (ASCII 'E') and STA $0100,Y saves the exponent letter at $0100,Y.
4. Tens extraction loop:
   - The routine sets X = #$2F (one less than ASCII '0') and prepares the carry flag (SEC).
   - Loop: INX increments the tens-character candidate, SBC #$0A subtracts 10 from the exponent count in A. BCS loops back to INX while the subtraction result stays >= 0 (carry set). Each loop iteration represents removing one 10 from the count while incrementing the tens character.
   - After the loop, A contains a negative two's-complement remainder; ADC #$3A converts that remainder into the ASCII code for the ones digit (this is a non-obvious constant trick: adding $3A yields the correct ASCII for the ones digit given the remainder representation).
5. Store digits and terminate:
   - STA $0103,Y stores the ones digit.
   - TXA / STA $0102,Y stores the tens digit (X was built up to ASCII '0' + tens).
   - LDA #$00 / STA $0104,Y writes the null terminator.
6. Final branch (BEQ $BF0C) transfers flow to finalization that sets the (A,Y) pointer and returns (see referenced chunk "finalize_string_pointer_and_return").

The routine relies on the interplay of SBC with the carry flag and the X register initialized to one less than ASCII '0' to extract tens and ones without division. The pattern (SEC / INX / SBC #$0A / BCS loop) is the repeated-subtract-ten technique to compute decimal digits on 6502.

## Source Code
```asm
.,BED9 10 08    BPL $BEE3       ; branch if exponent count +ve
.,BEDB A9 00    LDA #$00        ; clear A
.,BEDD 38       SEC             ; set carry for subtract
.,BEDE E5 5E    SBC $5E         ; subtract exponent count adjust (convert -ve to +ve)
.,BEE0 AA       TAX             ; copy exponent count to X
.,BEE1 A9 2D    LDA #$2D        ; character "-"
.,BEE3 99 01 01 STA $0101,Y     ; save to output string
.,BEE6 A9 45    LDA #$45        ; character "E"
.,BEE8 99 00 01 STA $0100,Y     ; save exponent sign to output string
.,BEEB 8A       TXA             ; get exponent count back
.,BEEC A2 2F    LDX #$2F        ; one less than "0" character
.,BEEE 38       SEC             ; set carry for subtract
.,BEEF E8       INX             ; increment 10's character
.,BEF0 E9 0A    SBC #$0A        ; subtract 10 from exponent count
.,BEF2 B0 FB    BCS $BEEF       ; loop while still >= 0
.,BEF4 69 3A    ADC #$3A        ; add character ":" ($30+$0A, result is 10 less that value)
.,BEF6 99 03 01 STA $0103,Y     ; save to output string
.,BEF9 8A       TXA             ; copy 10's character
.,BEFA 99 02 01 STA $0102,Y     ; save to output string
.,BEFD A9 00    LDA #$00        ; set null terminator
.,BEFF 99 04 01 STA $0104,Y     ; save to output string
.,BF02 F0 08    BEQ $BF0C       ; go set string pointer (AY) and exit, branch always
```

## References
- "trim_trailing_zeroes_and_prepare_exponent" — continues from trimming and exponent count loading
- "finalize_string_pointer_and_return" — sets the (A,Y) pointer to the result and returns