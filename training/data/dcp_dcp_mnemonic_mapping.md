# NMOS 6510 — DCP (undocumented) opcode bytes

**Summary:** Undocumented 6502/NMOS 6510 instruction DCP (also known as DCM) — a combined DEC (memory--) + CMP (A vs memory) operation — opcode bytes by addressing mode: $C7, $D7, $C3, $D3, $CF, $DF, $DB. Searchable terms: DCP, DCM, NMOS 6510, opcode bytes, $C7, $D7, $C3, $D3, $CF, $DF, $DB, zero page, absolute, (zp,X), (zp),Y.

**Description**

DCP is an undocumented 6502 family opcode that performs a memory decrement followed immediately by a compare with the accumulator (i.e., M := M - 1; then A - M sets N, Z, C flags). It is often listed in assembler tables under the mnemonic DCP or the alternate mnemonic DCM.

This chunk lists the opcode byte values associated with the standard addressing modes for the NMOS 6510 / 6502 family. The source shows multiple assembler entries (repeated "DCP") and at least one combined listing "DCP, DCM," indicating alternate mnemonic usage across assemblers.

(Short parenthetical: "compare" here refers to the CMP instruction semantics — A - M, affecting N/Z/C flags.)

## Source Code

```asm
; Raw opcode bytes for the undocumented DCP (DCM) instruction — NMOS 6510 / 6502
; Addressing mode -> opcode byte (hex)

; Zero Page
DCP $C7

; Zero Page,X
DCP $D7

; (Zero Page,X)
DCP $C3

; (Zero Page),Y
DCP $D3

; Absolute
DCP $CF

; Absolute,X
DCP $DF

; Absolute,Y
DCP $DB

; Original raw listing fragments (as provided):
; $C7 $D7
; $C3 $D3 $CF
; $DF
; $DB
; DCP
; DCP
; DCP
; DCP
; DCP, DCM
```

**Cycle Counts and Instruction Lengths**

The DCP instruction has the following cycle counts and instruction lengths for each addressing mode:

- **Zero Page**: Opcode $C7, 2 bytes, 5 cycles
- **Zero Page,X**: Opcode $D7, 2 bytes, 6 cycles
- **(Zero Page,X)**: Opcode $C3, 2 bytes, 8 cycles
- **(Zero Page),Y**: Opcode $D3, 2 bytes, 8 cycles
- **Absolute**: Opcode $CF, 3 bytes, 6 cycles
- **Absolute,X**: Opcode $DF, 3 bytes, 7 cycles
- **Absolute,Y**: Opcode $DB, 3 bytes, 7 cycles

*Note: For Absolute,X and Absolute,Y addressing modes, add 1 cycle if a page boundary is crossed.*

**Assembler Mnemonic Usage**

Different assemblers use varying mnemonics for the DCP instruction:

- **DCP**: Commonly used in assemblers like ACME and DASM.
- **DCM**: Alternate mnemonic used in some assemblers.

For example, the Millfork compiler supports both "DCP" and "DCM" as mnemonics for this instruction. ([millfork.readthedocs.io](https://millfork.readthedocs.io/en/v0.3.8/abi/undocumented/?utm_source=openai))

## References

- "lax_lax_mnemonic_mapping" — expands on previous mnemonic (LAX)
- "isc_isc_mnemonic_mapping" — expands on next group (ISC/ISB/INS)

## Mnemonics
- DCP
- DCM
