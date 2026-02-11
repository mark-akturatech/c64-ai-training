# 6502 Decimal (BCD) Arithmetic — Examples and Behavior

**Summary:** Examples and notes for 6502 BCD (decimal) arithmetic: byte-format BCD ($14 = 14, $98 = 98), ADC/SBC sequences under decimal mode (SED/SEC, CLC), multi-byte chaining with ADC/SBC, flag semantics in decimal mode, and a WDC/65C02 compatibility note.

**Behavior and Rules (Summary)**

- **BCD on the 6502:** Each byte holds two decimal digits in packed BCD (high nibble = tens, low nibble = ones). Example bytes: $14 represents decimal 14, $98 represents decimal 98.
- **Entering Decimal Mode:** Use `SED` (Set Decimal Flag). Decimal mode affects `ADC` and `SBC` by performing BCD-adjusted arithmetic.
- **Addition in Decimal Mode:**
  - Clear carry (`CLC`) before the low-byte `ADC`.
  - `ADC` performs BCD addition and sets carry if the result ≥ 100 (decimal).
  - Chain higher bytes by performing `ADC` on high bytes without clearing the carry between bytes.
- **Subtraction in Decimal Mode:**
  - Set carry (`SEC`) before the low-byte `SBC`.
  - `SBC` performs BCD subtraction and clears the carry if a borrow occurred.
  - Chain higher bytes by `SBC` on high bytes without changing the carry between bytes.
- **Flag Semantics in Decimal Mode:**
  - **Carry (C):** Indicates decimal carry/borrow between byte boundaries for multi-byte BCD chaining.
  - **Zero (Z):** Set when the result is zero.
  - **Negative (N):** Set from the binary result sign bit; less meaningful for signed interpretation of BCD results.
  - **Overflow (V):** Reflects the binary overflow of the internal binary operation, not decimal correctness; essentially meaningless for BCD arithmetic.
- **Multi-byte BCD Arithmetic:** Perform `ADC`/`SBC` on low byte then high byte(s) without resetting the carry between them.
- **WDC/65C02 Note:** The WDC 65C02 clears the decimal flag automatically on interrupts, differing from the NMOS 6502 behavior.

**[Note: The original source contained an error — it used the mnemonic `ADD #n`; the correct 6502 mnemonic is `ADC #n`. This has been corrected in the examples below.]**

**Examples and Explanation**

- **BCD Byte Examples:**
  - `$14` = decimal 14 (high nibble `$1` = 10, low nibble `$4` = 4)
  - `$98` = decimal 98

- **Decimal `ADC` Example (Single-byte BCD Addition Crossing 99 → Carry Set):**
  - **Operation:** 14 + 98 = 112 decimal → result low byte 12, carry set.
  - **Sequence (Decimal Mode):**
    - `SED`      ; set decimal mode
    - `CLC`      ; clear carry before addition
    - `LDA #$14`
    - `ADC #$98`
    - *After `ADC`:* A = `$12` (BCD 12), C = 1 (carry out = 1)

- **Decimal `SBC` Example (Single-byte BCD Subtraction):**
  - **Required:** `SEC` before subtraction to indicate no initial borrow.
  - **Sequence (Decimal Mode):**
    - `SED`      ; set decimal mode
    - `SEC`      ; set carry before subtraction
    - `LDA #$50`
    - `SBC #$37`
    - *After `SBC`:* A = `$13` (BCD 13), C = 1 (no borrow)

- **Multi-byte (16-bit) BCD Addition Chaining:**
  - **Storage:** Store 16-bit packed BCD values as low/high bytes; perform `ADC` on low bytes then `ADC` on high bytes without resetting carry.
  - **Example Addresses:**
    - First operand low byte = `$1000`, high byte = `$1001`
    - Second operand low byte = `$1002`, high byte = `$1003`
    - Result low byte = `$1004`, high byte = `$1005`
  - **Important:** Use `SED` before `ADC` if performing decimal BCD addition.

## Source Code

```asm
; Corrected binary examples (non-decimal) from source
CLC           ; clear carry for addition (binary)
LDA #$02
ADC #$03      ; A = 2 + 3 + C -> A = $05

SEC           ; set carry for subtraction (binary)
LDA #$0F
SBC #$08      ; A = 15 - 8 - (not C) -> A = $07

; Decimal addition example (single-byte BCD)
SED           ; set decimal mode
CLC           ; clear carry before addition
LDA #$14      ; decimal 14
ADC #$98      ; add decimal 98
; Result: A = $12 (decimal 12), Carry set (1) since 14+98 = 112

; Decimal subtraction example (single-byte BCD)
SED
SEC           ; set carry before subtraction (no initial borrow)
LDA #$50      ; decimal 50
SBC #$37      ; subtract decimal 37
; Result: A = $13 (decimal 13), Carry set (no borrow)

; 16-bit binary addition chaining example (source showed low-byte only;
; completed here to demonstrate chaining across bytes)
; Addresses:
;  first low  = $1000
;  first high = $1001
;  second low = $1002
;  second high= $1003
;  result low = $1004
;  result high= $1005

CLC
LDA $1000      ; low byte of first arg
ADC $1002      ; low byte of second arg
STA $1004      ; store low byte of result

LDA $1001      ; high byte of first arg
ADC $1003      ; add high byte of second arg + carry from low-byte addition
STA $1005      ; store high byte of result

; For multi-byte BCD addition, set SED before the low-byte ADC to enable BCD mode;
; do NOT clear carry between the low- and high-byte ADC instructions.
```

## References

- "a_primer_of_6502_arithmetic_operations" — expands on binary arithmetic primer and multi-byte chaining
- "w65c02_nops_and_behavioral_changes" — covers W65C02 differences, including clearing decimal flag on interrupts

## Mnemonics
- ADC
- SBC
- SED
- SEC
- CLC
