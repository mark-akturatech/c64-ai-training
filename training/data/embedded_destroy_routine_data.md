# 1541 Sector Destroyer — BASIC DATA Payload (Assembled 6502 Bytes)

**Summary:** BASIC DATA statements containing the assembled 6502 opcode bytes for a routine uploaded to the Commodore 1541 drive; exact decimal/hex byte sequence used by the BASIC driver to write into drive memory and execute (1541, 6502, DATA, machine-code).

**Description**

This chunk is the BASIC payload titled "REM DESTROY A SECTOR" — a sequence of DATA statements listing the assembled 6502 opcodes/bytes. These bytes are read by a BASIC driver and uploaded to the 1541 drive RAM, then executed on the drive's 6502 to overwrite a disk sector. The listing below preserves the original DATA values.

The listing is intentionally the raw payload (decimal bytes). A hex representation is provided for quick inspection. No additional disassembly or runtime addresses are included in the source; the bytes are the exact payload the BASIC driver emits into the drive.

## Source Code

```basic
710 REM DESTROY A SECTOR

720 DATA 32,16,245,32,86,245,162,0
730 DATA 80,254,184,202,208,250,162,69
740 DATA 80,254,184,202,208,250,169,255
750 DATA 141,3,28,173,12,28,41,31
760 DATA 9,192,141,12,28,162,0,169
770 DATA 85,80,254,184,141,1,28,202
780 DATA 208,247,80,254,32,0,254,169
790 DATA 1,76,105,249,234,234,234,234
```

Decimal byte stream (concatenated, in order):

```text
32,16,245,32,86,245,162,0,80,254,184,202,208,250,162,69,
80,254,184,202,208,250,169,255,141,3,28,173,12,28,41,31,
9,192,141,12,28,162,0,169,85,80,254,184,141,1,28,202,
208,247,80,254,32,0,254,169,1,76,105,249,234,234,234,234
```

Hex byte stream:

```text
20 10 F5 20 56 F5 A2 00 50 FE B8 CA D0 FA A2 45
50 FE B8 CA D0 FA A9 FF 8D 03 1C AD 0C 1C 29 1F
09 C0 8D 0C 1C A2 00 A9 55 50 FE B8 8D 01 1C CA
D0 F7 50 FE 20 00 FE A9 01 4C 69 F9 EA EA EA EA
```

## References

- "read_buffer_write_and_execute" — expands on how these DATA bytes are read/assembled and sent to the 1541 drive for execution.