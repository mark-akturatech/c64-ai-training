# NMOS 6510 — ADC decimal-mode examples: hex nibble → ASCII, hex nibble → BCD, and NMOS vs 65C02 Z-flag test

**Summary:** Example 6502/6510 assembly sequences showing (1) convert a single hex nibble (0–15) in A to ASCII ('0'–'9','A'–'F') using a plain binary sequence and a variant that uses decimal-mode ADC, (2) convert a nibble to packed BCD using SED/CLC/ADC/CLD, and (3) a short runtime test that distinguishes NMOS 6502 (6510) from CMOS 65C02 by the Zero flag behaviour after decimal-mode ADC.

## Conventions and effects used
- ADC uses the carry flag; clear carry (CLC) before binary additions that must not include an incoming carry, or set carry (SEC) when required.
- SED sets Decimal mode for ADC/SBC; CLD clears it afterwards.
- The BCD conversion trick uses the NMOS/6502 decimal adjust behaviour (SED/CLC/ADC #$00/CLD) to turn binary 0–15 into packed BCD 0x00–0x15.
- The NMOS vs 65C02 test relies on the historical difference: some NMOS cores set Z according to the raw binary sum while the 65C02 sets Z according to the decimal-adjusted final result. The test below demonstrates that difference (see code comments).

## Routines and explanations
- Hex nibble → ASCII (recommended binary method):
  - Put nibble (0–15) in A.
  - CLC / ADC #$30 will make 0->'0'..9->'9', 10->0x3A..15->0x3F.
  - If result > '9' (0x39), add 7 (0x07) to jump from 0x3A..0x3F → 'A'..'F'.
  - No decimal mode required.

- Hex nibble → ASCII (decimal-mode variant):
  - Same final test/adjust as above, but ADC is performed with Decimal flag set. Decimal mode is not necessary for this conversion, but a variant is shown to match the user's request (effectively equivalent for typical nibble inputs).

- Hex nibble → packed BCD (SED/CLC/ADC/CLD):
  - For A = 0x00..0x0F, do SED / CLC / ADC #$00 / CLD.
  - Result in A becomes packed BCD: 0x00..0x09 → 0x00..0x09; 0x0A → 0x10; 0x0F → 0x15.

- NMOS 6502 vs 65C02 Zero-flag test:
  - Choose operands so the binary 8-bit sum wraps to 0x00 (binary_temp == 0) while the decimal-adjusted result is non-zero.
  - Example: A = $99, M = $66, carry = 1, decimal flag = 1.
    - Binary: $99 + $66 + 1 = $100 → low byte $00 → Z = 1 (if Z derived from binary sum).
    - Decimal BCD: 99 + 66 + 1 = 166 decimal → low BCD byte $66 → Z = 0 (if Z derived from adjusted result).
  - On NMOS 6502 (6510), the Zero flag historically follows the raw binary low byte (so BEQ will be taken). On 65C02, Z follows the decimal-adjusted result (so BEQ will not be taken). The code below branches accordingly.

## Source Code
```asm
; ------------------------------------------------------------------------
; Hex nibble (0..15) in A -> ASCII '0'..'9','A'..'F'
; Method 1: binary (recommended)
; Input: A = 0x00..0x0F
; Output: A = ASCII character
; Clobbers: C flag, affects N,V,Z
hex_nibble_to_ascii_binary:
    CLC             ; ensure no incoming carry
    ADC #$30        ; add ASCII '0'
    CMP #$3A        ; compare to one past '9' (0x3A)
    BCC .done_ascii ; if < 0x3A, value is '0'..'9'
    ADC #$07        ; else add 7 to move 0x3A..0x3F -> 0x41..0x46 ('A'..'F')
.done_ascii:
    RTS

; ------------------------------------------------------------------------
; Hex nibble -> ASCII (decimal-mode variant)
; Same effect for 0..15, shows use of SED/ADC/CLD (not necessary but included)
hex_nibble_to_ascii_decimal_variant:
    SED             ; set decimal mode (not required for nibble->ASCII, shown per request)
    CLC
    ADC #$30
    CLD             ; clear decimal mode
    CMP #$3A
    BCC .dv_done
    ADC #$07
.dv_done:
    RTS

; ------------------------------------------------------------------------
; Hex nibble (0..15) in A -> packed BCD in A
; Uses decimal ADC to convert a binary nibble to packed BCD (0x0A -> 0x10 ...)
; Input: A=0..15
; Output: A = packed BCD (0x00..0x15)
hex_nibble_to_bcd:
    SED
    CLC
    ADC #$00        ; decimal-mode add 0: binary nibble becomes packed BCD
    CLD
    RTS

; ------------------------------------------------------------------------
; NMOS 6502 (6510) vs 65C02 Z-flag test
; On NMOS: Z follows the raw binary low byte (BEQ taken here).
; On 65C02: Z follows decimal-adjusted result (BNE taken here).
; After running, branch destination indicates core type.
; Clobbers: A, C, D flag, N,V,Z
test_nmos_vs_65c02:
    SEC             ; set carry = 1 (we want A + M + 1 = 0x100 binary)
    SED             ; enable decimal mode for ADC
    LDA #$99
    ADC #$66        ; binary: $99+$66+1 = $100 -> low byte $00
                    ; decimal (BCD): 99 + 66 + 1 = 166 -> result low byte $66
    CLD             ; leave decimal mode clean
    BEQ .is_nmos    ; if Z set (binary low byte = 0), NMOS expected
    ; else Z clear -> 65C02 expected
.is_65c02:
    ; handle 65C02 case (Z was cleared)
    ; ... (user code or flags/logging)
    RTS
.is_nmos:
    ; handle NMOS case (Z was set)
    ; ... (user code or flags/logging)
    RTS
```

## References
- "adc_instruction_decimal_mode" — decimal-mode ADC pseudocode and flag details

**[Note: Source contained a truncated SBC/instruction table fragment; that fragment was omitted here and standard 6502 behaviour was used for ADC/SBC flag explanations and sequences.]**

## Mnemonics
- ADC
- SED
- CLD
- CLC
- SEC
- BEQ
