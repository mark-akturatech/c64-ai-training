# BASIC Program Text Area ($0800-$9FFF)

**Summary:** Describes the Commodore 64 BASIC program text memory area (2048–40959 / $0800–$9FFF), the on-disk/token format for BASIC lines (next-line pointer low/high, line number low/high, tokenized keywords >= $80), memory layout of BASIC (program text, variable areas, arrays, FRE(0), string pool), and the NEW behavior that zeros the first link pointer.

## Layout and tokenization
The BASIC program is stored as a linked list of tokenized lines in RAM from $0800 up to $9FFF (subject to available memory). Each program line record contains, in order:

- A two-byte pointer to the next program line (low byte, then high byte). The final line is followed by a link pointer of two zero bytes to mark the end of the program.
- A two-byte line number (low byte, then high byte).
- The tokenized program text: BASIC keywords are stored as single bytes with values >= $80 (128 decimal). Non-keyword text — variable names, string literals (e.g. "HELLO"), numbers — is stored in plain ASCII bytes.
- A single 0 byte that terminates the line.

The very first byte of the BASIC text area (address $0800) must be 0 for BASIC to operate correctly.

Keywords are single-byte tokens; for example, the token value for PRINT is 151 (decimal).

Memory regions following the program text (in increasing addresses) are, in order:
- Non-array variables and string descriptors
- Array variables (if any)
- Free area (pointer exposed by FRE(0))
- String text area — this area grows downward from high addresses toward the free area
- BASIC ROM (mapped above the RAM regions)

NEW does not zero the entire BASIC text area; instead it replaces the first link pointer with two zeros, making the program appear empty while leaving the old tokenized text intact (allowing program recovery if needed).

## Source Code
```text
Memory range:
  2048 - 40959   $0800 - $9FFF   BASIC Program Text (tokenized linked lines)

Program line record (bytes at each line start):
  Offset +0..+1 : Next line pointer (2 bytes, low-byte then high-byte)
  Offset +2..+3 : Line number (2 bytes, low-byte then high-byte)
  Offset +4..+N : Tokenized program text:
                   - Keywords are single-byte tokens >= $80 (128 decimal)
                   - Other characters (variable names, numbers, string literals) are ASCII
  Offset +?     : 0x00 terminator (single byte) ends the line text

Notes:
  - After the last program line, the next-line pointer is two zero bytes.
  - The first byte at $0800 must be 0x00 for BASIC to initialize properly.
  - NEW: first link pointer (at $0800) is set to 0x00 0x00; tokenized text is not cleared.
  - Example token: PRINT = 151 (decimal)
```

## Key Registers
- $0800-$9FFF - BASIC - Tokenized BASIC program text area (linked line records, keywords >= $80)

## References
- "basic_indirect_vector_table_overview" — expands on BASIC's vectored routines for token handling and execution