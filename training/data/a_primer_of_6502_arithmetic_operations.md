# ADC / SBC, multi-byte arithmetic, two's complement, and W65C02 behavioral notes

**Summary:** ADC and SBC use the processor carry flag for unsigned borrow/carry propagation; use CLC before ADC and SEC before SBC for multi-byte arithmetic. Use CLD to force binary mode. Two's complement (invert+1) represents signed bytes (-128..+127); overflow (V) indicates signed overflow while carry (C) indicates unsigned overflow. Notes on W65C02 fixes: indirect JMP page-wrap, decimal-flag reset on reset, RMW and BRK behavior changes.

## ADC / SBC and multi-byte arithmetic
- ADC performs A := A + M + C (C is 0 or 1); SBC performs A := A - M - (1 - C). Because SBC treats C as "not-borrow", set C (SEC) before SBC to subtract without borrow, clear C (CLC) before ADC to start without a carry (or to propagate a borrow into SBC).
- For multi-byte (little-endian) addition/subtraction, operate on the low byte first, then chain ADC/SBC into the high byte. Always prepare the carry appropriately:
  - 16-bit addition: CLC; ADC low; ADC high
  - 16-bit subtraction: SEC; SBC low; SBC high
- Decimal (BCD) mode affects ADC/SBC. Use CLD to force binary arithmetic (CLD clears the decimal flag). On many WDC/Rockwell variants the decimal flag is cleared by reset; on original NMOS the reset state could differ.

Important flag meanings for ADC/SBC:
- C (carry) — set when unsigned result >= base (for add) or when no borrow occurred (for subtract). For multi-byte arithmetic, C propagates between bytes.
- V (overflow) — set when signed result does not fit in signed 8-bit range (i.e., when adding two operands of the same sign produces a result of opposite sign).
- N (negative) — set if bit 7 of the result is 1 (signed negative).
- Z (zero) — set if result is zero.

## Two's complement signed representation and examples
- 8-bit two's complement range: -128..+127.
- To form -X from X: invert all bits and add 1 (bitwise NOT then +1). Equivalent assembly idiom:
  - EOR #$FF ; invert
  - CLC
  - ADC #$01 ; add 1
- Signed vs unsigned interpretation:
  - Carry (C) indicates unsigned overflow/borrow.
  - Overflow (V) indicates signed overflow (result sign incorrect).
- Examples (all values in hex and decimals in parentheses):
  - Unsigned carry example: 0xC8 (200) + 0x64 (100) = 0x12C -> low byte 0x2C (44), C=1, V=0.
  - Signed overflow example: 0x50 (80) + 0x50 (80) = 0xA0 (-96) -> result sign changed from positive to negative so V=1; C=0 (no unsigned carry past 8 bits).
  - Edge signed example: 0x7F (127) + 0x01 (1) = 0x80 (-128) -> V=1 (signed overflow), N=1, C=0.
  - Subtraction signed overflow: 0x80 (-128) - 0x01 (1) = 0x7F (127) -> V=1 (signed overflow). For SBC, prepare SEC to subtract without borrow if appropriate.

## W65C02 / Rockwell behavioral changes (summary)
- Indirect JMP page-wrap fixed: JMP ($11FF) on W65C02 fetches low byte at $11FF and high byte at $1200 (NMOS bug fetched high byte from $1100). An extra cycle is added when the operand crosses a page boundary.
- Reset/interrupt sequence: decimal flag (D) is cleared on reset (binary mode).
- ADC/SBC: N, V, and Z are set correctly in decimal mode on W65C02, but certain decimal-mode instructions may have an extra cycle penalty.
- Undefined opcodes: W65C02 maps formerly undefined opcodes to NOPs (no illegal opcodes).
- Indexed addressing: crossing a page boundary now causes an extra read of the last instruction byte instead of an extra read from an invalid address (NMOS behavior).
- Read-modify-write (RMW) instructions: perform a dummy read then the modify and write; they do not write back the original value as the NMOS did. This results in two reads and one write (instead of two writes and one read on NMOS). For indexed addressing, the dummy read is on the base address before indexing.
- BRK: fully executed before any interrupt handling; an interrupt occurring during BRK vector fetch will not overwrite BRK's vector.
- RDY pin: bidirectional on W65C02 (WAI can pull it low).
- Rockwell R65000/11/12/15 extensions: added bit-manipulation instructions (BBR/BBF family) and additional I/O/counter registers (see respective datasheets).

## Source Code
```asm
; 16-bit unsigned addition (little-endian): result = A_word + B_word
; Inputs:
;  A_low  = low byte of first operand (in memory or accumulator as shown)
;  A_high = high byte
;  B_low, B_high similar
; Example using accumulator as temporary and memory for result:

        CLC             ; clear carry to start fresh
        LDA A_low
        ADC B_low
        STA RES_low

        LDA A_high
        ADC B_high
        STA RES_high

; 16-bit subtraction: result = A_word - B_word
        SEC             ; set carry to indicate no borrow into LSB subtraction
        LDA A_low
        SBC B_low
        STA RES_low

        LDA A_high
        SBC B_high
        STA RES_high

; Negate a byte (two's complement): A := -A
        LDA value
        EOR #$FF
        CLC
        ADC #$01
        STA neg_value

; Examples with expected flags (comments):
; Example 1: 0x7F + 0x01
        LDA #$7F
        CLC
        ADC #$01   ; A = $80, N=1, V=1, C=0

; Example 2: 0xC8 + 0x64
        LDA #$C8
        CLC
        ADC #$64   ; A = $2C, N=0, V=0, C=1

; Example 3: signed overflow example 0x50 + 0x50
        LDA #$50
        CLC
        ADC #$50   ; A = $A0 (-96), V=1, C=0

; SBC example (0 - 1) using SEC then SBC to compute -1:
        SEC
        LDA #$00
        SBC #$01   ; A = $FF, C=0 (borrow occurred), V=0
```

## References
- "decimal_mode_bcd" — BCD/decimal mode behavior and W65C02 differences
- "flags_with_adc_and_sbc" — detailed flag behavior for ADC and SBC (N, V, Z, C)