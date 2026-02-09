# NMOS 6510 — ADC decimal-mode examples: hex→ASCII, hex→BCD, and 6502 vs 65C02 Z-flag

**Summary:** Practical 6510 (NMOS 6502) examples using ADC in decimal mode (BCD arithmetic) to convert a hex nibble to ASCII or BCD, an alternative non-BCD ASCII conversion, and a compatibility test showing the difference in Z-flag behavior between NMOS 6502 and CMOS 65C02.

## Convert a hex digit (0x0–0xF) to ASCII using decimal ADC
This sequence uses decimal mode (BCD arithmetic) to map accumulator values 0x0–0x9 → "$30"–"$39" and 0xA–0xF → "$41"–"$46". CMP #$0A is used to set the carry for values >= 10, which the subsequent ADC (with decimal mode set) uses to select the correct ASCII range.

Brief rationale:
- CMP #$0A sets the carry if A >= $0A (i.e. hex digits A–F).
- With SED (decimal mode) active, ADC #$30 produces the intended ASCII results due to BCD correction behavior.
- CLD clears decimal mode afterwards.

(Decimal mode = BCD arithmetic.)

## Alternative non-BCD method (branch + ADC + EOR)
A binary (non-BCD) approach avoids using decimal mode. It branches on A < $0A; if A ≥ $0A it adds an offset (with carry assumed) to move the range into the ASCII letters, then XORs to finalize both ranges into the ASCII digits/letters. This variant uses two more bytes than the decimal-mode version but requires no SED/CLD; cycle count is the same in many cases (or one less if BCC is taken and stays on the same page).

## Convert a hex nibble (0x0–0xF) into BCD using ADC
Using ADC with decimal mode and C clear produces a BCD result across 0–15 in the accumulator (i.e. $00–$15 as packed BCD for single-digit values 0–9 and 10–15 mapped appropriately as two BCD digits).
- CLC before ADC ensures no incoming carry.
- ADC #$00 acts as a decimal "fixup" in SED mode.

## Distinguish NMOS 6502 from CMOS 65C02 using decimal ADC and Z flag
This short test demonstrates a known compatibility difference:
- On CMOS 65C02 the Z flag after a decimal-mode ADC reflects the actual zero result (Z valid).
- On NMOS 6502 the Z flag after decimal-mode ADC is not guaranteed to match the accumulator (Z is effectively invalid/undefined in this case), so the same code can return different Z flag states on the two chips.

## Source Code
```asm
; Example: convert a hex digit (0x0 - 0xF) in A to ASCII using decimal ADC
        SED         ; set decimal mode (BCD arithmetic)
        CMP #$0A    ; set carry if A >= 10 (hex A-F)
        ADC #$30    ; add ASCII '0' with decimal fixup → produces $30-$39 or $41-$46
        CLD         ; clear decimal mode

; Alternative non-BCD approach (no SED/CLD)
        CMP #$0A
        BCC SKIP
        ADC #$66    ; add $66 (carry assumed/set by CMP path), converts $0A-$0F -> $71-$76
SKIP    EOR #$30      ; maps $00-$09 and $71-$76 -> $30-$39 and $41-$46

; Comment: alternative uses 2 more bytes, cycles similar (or one less if BCC taken same page)

; Convert a hex nibble (0x0-f) in A into BCD (A becomes 0-15 in BCD/packed form)
        SED
        CLC
        ADC #$00
        CLD

; 6502 vs 65C02 Z flag test (decimal ADC Z-flag compatibility)
        SED
        CLC
        LDA #$99
        ADC #$01
        CLD
; On 65C02: Z flag set if result zero (Z valid). On NMOS 6502: Z may not match accumulator (Z invalid).
```

## Key Registers
(omitted — this chunk is about ADC and flag behavior, not memory-mapped registers)

## References
- "adc_opcode_table_and_decimal_flags" — expands on which ADC opcodes and flags the examples exercise
- "adc_decimal_mode_pseudocode" — explains underlying BCD fixup and flag-setting logic that produces the behaviors above