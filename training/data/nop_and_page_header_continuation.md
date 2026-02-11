# NMOS 6510 — Undocumented NOP (table header + NOP row)

**Summary:** Continuation of the NMOS 6510 opcode table showing the header for addressing modes and the undocumented NOP-like opcodes section; contains the NOP entry with its listed opcode bytes ($1A, $3A, $5A, $7A, $DA, $FA, $80, $04, $14, $0C, $1C, $3C, $5C, $7C, $DC, $FC). Searchable terms: undocumented NOP, opcode bytes $1A, $3A, $5A, $7A, $DA, $FA, $80, $04, $14, $0C, $1C, $3C, $5C, $7C, $DC, $FC, 6510, opcode table.

**Undocumented NOP-like opcodes (page header and NOP entry)**

This chunk is the page header of the opcode table (addressing-mode columns) and the start of the following section that lists undocumented NOP variants. It contains a single row labeled NOP and the sequence of opcode bytes as printed on the page. The addressing-mode column headings shown are: implied (imp), immediate (imm), zero page (zp), zero page,X (zpx), zero page,Y (zpy), (indirect,X) (izx), (indirect),Y (izy), absolute (abs), absolute,X (abx), absolute,Y (aby). This row is a continuation from the previous page, which contained single-byte undocumented opcodes (see referenced chunk).

No register addresses or bitfields are present in this chunk — it is opcode reference data only.

## Source Code

```text
Opc.  imp imm zp  zpx zpy izx izy abs abx aby

Function

NOP

$1A $3A $5A $7A $DA $FA $80 $04 $14 $0C $1C $3C $5C $7C $DC $FC
```

## References

- "lax_and_ane_single_byte_variants" — expands on previous-page single-byte undocumented opcodes.

## Mnemonics
- NOP
