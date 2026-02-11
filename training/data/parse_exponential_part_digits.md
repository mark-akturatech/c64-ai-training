# Parse next ASCII exponent digit (ROM $BD91-$BDB0)

**Summary:** Handles one more ASCII digit of a numeric exponent: reads exponent count byte ($5E), checks overflow (10 digits), multiplies the count by 10 (shifts/adds), adds the new ASCII digit via ADC ($7A),Y then converts it to binary by SBC #$30, tests/handles negative-exponent flag ($60) and stores the updated exponent in $5E before looping to fetch the next character.

## Routine purpose
This ROM fragment evaluates the next character of the exponential part of a number (consumes one ASCII digit and accumulates it into the exponent value in $5E). It also enforces a 10-digit exponent limit, handling overflow differently for negative exponents.

## Operation (step-by-step)
- Load current exponent count byte from $5E (LDA $5E).
- Compare with 10 (CMP #$0A). If less than 10, proceed to accumulate; otherwise handle overflow.
- Overflow path:
  - LDA #$64 sets accumulator to $64 (100 decimal) — the sentinel value for “all negative exponents = -100” (causes underflow later).
  - BIT $60 tests the negative-exponent flag stored in $60.
  - If the negative-exponent flag is set (BMI), the code skips the error and continues (stores $64 into $5E and continues input). If not set, jump to the overflow error handler (JMP $B97E).
- Accumulation path (multiply-by-10 and add digit):
  - A contains the old exponent count.
  - ASL; ASL — shift left twice to form 4 * count.
  - CLC; ADC $5E — add original count to get 5 * count.
  - ASL — multiply that by 2 to get 10 * count.
  - CLC; LDY #$00; ADC ($7A),Y — add the ASCII value of the next input character (indirect indexed via zero page pointer at $7A). The comment notes this will be $30 too large because it is ASCII.
  - SEC; SBC #$30 — subtract ASCII '0' to convert the ASCII digit to its 0–9 binary value and complete: new_count = old_count * 10 + digit.
  - STA $5E — save the updated exponent count byte.
- JMP back to the input routine to fetch the next character (JMP $BD30).

## Source Code
```asm
.,BD91 A5 5E    LDA $5E         ; get exponent count byte
.,BD93 C9 0A    CMP #$0A        ; compare with 10 decimal
.,BD95 90 09    BCC $BDA0       ; branch if less
.,BD97 A9 64    LDA #$64        ; make all -ve exponents = -100 decimal (causes underflow)
.,BD99 24 60    BIT $60         ; test exponent -ve flag
.,BD9B 30 11    BMI $BDAE       ; branch if -ve
.,BD9D 4C 7E B9 JMP $B97E       ; else do overflow error then warm start
.,BDA0 0A       ASL             ; *2
.,BDA1 0A       ASL             ; *4
.,BDA2 18       CLC             ; clear carry for add
.,BDA3 65 5E    ADC $5E         ; *5
.,BDA5 0A       ASL             ; *10
.,BDA6 18       CLC             ; clear carry for add
.,BDA7 A0 00    LDY #$00        ; set index
.,BDA9 71 7A    ADC ($7A),Y     ; add character (will be $30 too much!)
.,BDAB 38       SEC             ; set carry for subtract
.,BDAC E9 30    SBC #$30        ; convert character to binary
.,BDAE 85 5E    STA $5E         ; save exponent count byte
.,BDB0 4C 30 BD JMP $BD30       ; go get next character
```

## Key Registers
- $5E - Zero page - exponent count/accumulated exponent byte
- $60 - Zero page - exponent negative flag (tested with BIT $60)
- $7A - Zero page pointer (indirect,Y) - points to current input character (ADC ($7A),Y reads the ASCII digit)

## References
- "scientific_mode_limits_constants" — expands on limits used later to choose scientific notation
- "convert_fac1_to_ascii_sign_and_zero_handling" — expands on main FAC1 -> ASCII routine that consumes the exponent value