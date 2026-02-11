# 6502 SED (Set Decimal Flag)

**Summary:** The SED instruction sets the processor status register's decimal flag (D = 1). This enables Binary-Coded Decimal (BCD) mode for subsequent ADC and SBC instructions. SED has the opcode $F8, uses implied addressing, is 1 byte in length, and executes in 2 clock cycles. It affects only the decimal flag; all other flags remain unchanged.

**Operation**

The SED instruction sets the Decimal Mode flag in the 6502 processor's status register (P). When this flag is set, the ADC and SBC instructions perform arithmetic operations in BCD mode. SED does not read or write memory and does not alter any other status flags.

- **Operation (semantic):** P.D := 1
- **Addressing mode:** Implied
- **Instruction length:** 1 byte
- **Opcode:** $F8
- **Cycle count:** 2 cycles
- **Affected flags:** Decimal (D) set to 1; other flags unchanged

## Source Code

```asm
; 6502 assembly example
        .org $0800
        SED         ; opcode $F8, sets Decimal flag (D = 1)
        BRK

; Machine code bytes
; $F8    ; SED

; Pseudocode (formal)
; SED:
;     P.D = 1     ; set Decimal flag in status register

; Opcode table entry (text reference)
; Mnemonic: SED
; Opcode: $F8
; Mode: Implied
; Bytes: 1
; Cycles: 2
```

## References

- "6502 Instruction Set" — detailed information on 6502 instructions
- "6502 Reference" — comprehensive guide to 6502 instructions

## Mnemonics
- SED
