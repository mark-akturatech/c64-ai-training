# NMOS 6510 undocumented mnemonic SAX (opcode mapping)

**Summary:** Undocumented NMOS 6510/6502 mnemonic SAX (also seen as AAX/AXS in some assemblers) stores A & X into memory; common opcode bytes include $87, $83, $97, and $8F. This chunk lists known opcode bytes, addressing modes, typical cycle/length info, and notes on assembler-name variations.

**Description**
SAX is an undocumented 6502 instruction that writes the bitwise AND of the accumulator (A) and the X register to memory: M ← A & X. It does not affect processor status flags. Behavior and available addressing modes depend on the NMOS 6502 illegal-opcode decoding; some variants have odd behavior on non-NMOS or later CMOS derivatives.

Common addressing modes implemented by documented opcode bytes:
- **Zero Page ($87):** Writes (A & X) to a zero-page address.
- **Zero Page,Y ($97):** Writes (A & X) to zero-page address plus Y (wrap-around in zero page).
- **(Indirect,X) ($83):** Writes (A & X) to the effective address formed by (zp + X) indirect addressing.
- **Absolute ($8F):** Writes (A & X) to an absolute address.

Assembler/disassembler naming:
- The mnemonic is variously called SAX, AAX, or AXS in different assemblers/disassemblers and community references. There is no universally enforced name in source listings; search for any of these terms when looking for the behavior or opcode byte.

Caveats:
- As an undocumented opcode, exact behavior may vary across 6502-family variants (NMOS vs later CMOS chips); test on target hardware/emulator.
- Some references also list an absolute form (opcode $8F) for SAX.

## Source Code
```text
; Known SAX (A & X -> M) opcode mapping -- reference table
; Opcode  | Mnemonic | Addressing Mode | Bytes | Typical Cycles | Notes
; ---------------------------------------------------------------
; $87     | SAX/AAX  | Zero Page       |  2    | 3              ; write zp <- A & X
; $83     | SAX/AAX  | (Zero Page,X)   |  2    | 6              ; write (zp+X indirect) <- A & X
; $97     | SAX/AAX  | Zero Page,Y     |  2    | 4              ; write (zp + Y, wrap in zp) <- A & X
; $8F     | SAX/AAX  | Absolute        |  3    | 4              ; write abs <- A & X
;
; Notes:
; - Cycles and lengths given are the commonly reported NMOS timings (matches similar STA opcodes).
; - Behavior: performs a store of (A & X) to the computed effective memory address. No flags affected.
; - Assemblers may use SAX, AAX, AXS or other names for these opcodes.
```

## References
- "rra_mnemonic_mapping" — expands on the previous undocumented mnemonic (RRA)
- "lax_lax_mnemonic_mapping" — expands on the next group (LAX)

## Mnemonics
- SAX
- AAX
- AXS
