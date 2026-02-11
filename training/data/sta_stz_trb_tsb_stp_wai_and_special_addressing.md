# Kick Assembler: STA / STZ / TRB / TSB / STP / WAI entries and special addressing-mode opcodes

**Summary:** Quick-reference fragment listing 6502/65C02 store and bit-manipulation mnemonics, opcode bytes, and addressing-mode tokens. Relevant to 6502-family (65C02) instruction encodings and Kick Assembler opcode tables.

**Description**

This chunk is a compact Quick Reference listing of several store and bit-test/store instructions, along with addressing-mode tokens and opcode bytes. It includes mnemonic names and associated opcode bytes but is not a complete opcode table.

- **STA** — Store Accumulator to memory. Opcode bytes:
  - Zero Page: `$85`
  - Zero Page,X: `$95`
  - Absolute: `$8D`
  - Absolute,X: `$9D`
  - Absolute,Y: `$99`
  - (Indirect,X): `$81`
  - (Indirect),Y: `$91`
  - (Indirect): `$92` (65C02 only)

- **STZ** — Store Zero (clear memory to 0). Opcode bytes (65C02 only):
  - Zero Page: `$64`
  - Zero Page,X: `$74`
  - Absolute: `$9C`
  - Absolute,X: `$9E`

- **TRB** — Test and Reset Bits. Opcode bytes (65C02 only):
  - Zero Page: `$14`
  - Absolute: `$1C`

- **TSB** — Test and Set Bits. Opcode bytes (65C02 only):
  - Zero Page: `$04`
  - Absolute: `$0C`

- **STP** — Stop the processor. Opcode byte (65C02 only): `$DB`

- **WAI** — Wait for Interrupt. Opcode byte (65C02 only): `$CB`

- **Addressing-mode tokens**:
  - `ind` — Indirect
  - `rel` — Relative
  - `izp` — Indirect Zero Page
  - `zprel` — Zero Page Relative
  - `indx` — Indexed Indirect

- **Additional opcode bytes**:
  - `$92` — Corresponds to `STA (indirect)` (65C02 only)
  - `$DB` — Corresponds to `STP` (65C02 only)
  - `$CB` — Corresponds to `WAI` (65C02 only)

This fragment is intended as a quick mapping but omits some common encodings and lacks explicit chip/variant annotation. Several of the listed mnemonics (STZ, TRB, TSB, STP, WAI) are 65C02 extensions and are not present in the original NMOS 6502 instruction set.

## Source Code

```text
sta

$85

$95

$8d

$9d

$99

$81

$91

$92

stz

$64

$74

$9c

$9e

trb

$14

$1c

tsb

$04

$0c

stp

$db

wai

$cb

ind

rel

izp

zprel

indx

$92

$db

$cb
```

## References

- "smb_set_memory_bit_instructions" — expands on single-bit set/reset instructions (SMB/RMB) related to TRB/TSB
- "jmp_instruction_variants" — expands on special addressing modes like rel/ind used by control-flow instructions

## Mnemonics
- STA
- STZ
- TRB
- TSB
- STP
- WAI
