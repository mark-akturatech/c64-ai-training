# C64 internal BASIC block — disk header bytes and load address (track $10 sector $0B, load $0401)

**Summary:** Explains disk block header bytes 0–3 for a C64/PET PRG block: forward (track/sector) pointer ($10,$0B), little‑endian load address ($0401), and LOAD/VERIFY behavior for a PET‑created internal BASIC file (use LOAD "DIR",8; VERIFY will fail after relocation).

## Block header interpretation
This is a C64 internal BASIC file block (not a BASIC source listing). The first four bytes of the block have the standard CBM disk PRG header meaning:

- Bytes 0–1: forward link — track and sector of the next block in the file (here: track $10, sector $0B).
- Bytes 2–3: load address — 16‑bit little‑endian address where the file was intended to be loaded (here: $0401, i.e. low byte $01 then high byte $04).

Because the load address is $0401, the file was originally written on a PET (PET BASIC/PRG files commonly start BASIC at $0401). This block is the first data block of the file so bytes 2–3 are the file's declared load address.

## Machine compatibility and load behavior
- C64 internal BASIC start address is $0801.
- VIC‑20 BASIC start addresses (varies by RAM/configuration): $1001, $1201, or $0401.
- To load this PET‑origin PRG on a C64 as a relocating load use: LOAD "DIR",8 (the source advises a "straight relocating load").
- Using LOAD "DIR",8,1 (as the source warns) would load the file into the C64's screen RAM in this case.
- VERIFY will not succeed after proper load/relocation because internal BASIC link pointers inside the file were changed when the program was relocated.

## Source Code
```text
; First 4 bytes of the PRG data block (disk order, offset 0..3)
; offset 0: forward link track
; offset 1: forward link sector
; offset 2: load address low byte
; offset 3: load address high byte

Offset 0: $10    ; next block track = $10 (16)
Offset 1: $0B    ; next block sector = $0B (11)
Offset 2: $01    ; load address low byte  = $01
Offset 3: $04    ; load address high byte = $04
; => load address = $0401
```

## References
- "raw_internal_basic_block_dumps_offsets_a0_to_f8" — expands on the raw internal BASIC byte listings and offsets
- "forward_chain_and_track16_sector11_dump" — follows the forward chain to the next block (track $10, sector $0B) and shows that block's contents