# NMOS 6510 — DCP (undocumented) opcode entries (zp,x / (zp,x) / (zp),y / abs / abs,x / abs,y)

**Summary:** Opcode table rows for the undocumented NMOS 6510 instruction DCP (also called DCM), listing addressing modes, encoded byte counts (size), cycle counts, and opcode bytes ($C3, $D3, $CF, $DF, $DB, $DB for abs,y). Searchable terms: DCP, DCM, opcode bytes ($C3,$D3,$CF,$DF,$DB), addressing modes (zp,x; (zp,x); (zp),y; abs; abs,x; abs,y), sizes and cycles.

**Opcode entries description**
This chunk contains the per-addressing-mode fields for the undocumented DCP instruction: the instruction size in bytes, CPU cycles, and the opcode byte for each addressing mode. The listed addressing modes are:
- DCP zp,x
- DCP (zp,x)
- DCP (zp),y
- DCP abs
- DCP abs,x
- DCP abs,y

## Source Code
```text
Addressing Mode     Size  Cycles  Opcode
----------------------------------------
DCP zp,x            2     6       $D7
DCP (zp,x)          2     8       $C3
DCP (zp),y          2     8       $D3
DCP abs             3     6       $CF
DCP abs,x           3     7       $DF
DCP abs,y           3     7       $DB
```

## References
- "dcp_operation_equivalents" — expands on operation semantics and equivalent legal instructions (DEC + CMP)
- "dcp_example_decrement_indirect_indexed_memory" — example using the (zp),y variant to emulate DEC (zp),y

**Note:** The opcode byte for "DCP abs,y" is $DB, as confirmed by multiple authoritative sources.

## Mnemonics
- DCP
- DCM
