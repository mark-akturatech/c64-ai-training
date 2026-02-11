# KERNAL ROM: BSIT table of cassette IRQ indirect pointers ($FD9B)

**Summary:** KERNAL ROM table at $FD9B containing little-endian 16-bit indirect pointers used by cassette IRQ handlers (labels: WRTZ, WRTN, KEY, READ). Searchable terms: $FD9B, KERNAL, cassette IRQ, indirect pointers, little-endian.

## Details
This entry is a small pointer table in the Commodore 64 KERNAL ROM used by the cassette interrupt (IRQ) handling logic. The bytes at $FD9B..$FDA2 form a sequence of little-endian 16-bit addresses; the runtime cassette IRQ code uses these entries as indirect vectors to call or JMP to the handler routines referenced by the labels WRTZ, WRTN, KEY, and READ.

- Location: $FD9B (KERNAL ROM)
- Size: 8 bytes (four 16-bit pointers)
- Format: low byte first / high byte second (6502 little-endian pointers)
- Purpose: indirection table for cassette IRQ handlers (labels listed in the disassembly: WRTZ, WRTN, KEY, READ)

## Source Code
```asm
.; FD9B: table of indirect pointers for cassette IRQ's
.:FD9B 6A FC CD FB 31 EA 2C F9  BSIT   .WOR WRTZ,WRTN,KEY,READ ;TABLE OF INDIRECTS FOR CASSETTE IRQ'S
```

Pointer decoding (bytes interpreted little-endian):
```text
Address  Bytes        Pointer value  Label (from disasm)
$FD9B    6A FC       -> $FC6A        WRTZ? / first entry
$FD9D    CD FB       -> $FBCD        WRTN? / second entry
$FD9F    31 EA       -> $EA31        KEY?  / third entry
$FDA1    2C F9       -> $F92C        READ? / fourth entry
```

(Labels as shown in the disassembly line: WRTZ, WRTN, KEY, READ — table label or assembler token ".WOR" appears before them in the original line.)

## References
- "ramtas_memory_initialization_and_top_detection" — tape buffer allocation and cassette routines referenced by this table
- "ioinit_configure_io_devices_and_ports" — broader I/O initialization including cassette I/O

## Labels
- WRTZ
- WRTN
- KEY
- READ
