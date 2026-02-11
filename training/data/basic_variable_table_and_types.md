# BASIC Variable Table (7-byte entries)

**Summary:** Describes the Commodore BASIC variable table layout: each variable entry is exactly 7 bytes (2-byte name + 5-byte value area), the SOV pointer ($002A/$002B on PET/CBM, $002D/$002E on VIC/C64/Plus/4) locates the table start, and name high-bits encode type (integer, string, function, floating). Covers string descriptor format and numeric variable storage.

## Variable table layout and types
- Every BASIC variable entry is exactly 7 bytes long:
  - Bytes 0–1: two name bytes (only the first two characters of the name are kept).
  - Bytes 2–6: five-byte value/definition area (usage depends on type).
- Variable entries are stored sequentially in the variable table in the order they are created/used. The start-of-VARIABLE table pointer (SOV) is a two-byte pointer in zero page:
  - PET/CBM: $002A/$002B
  - VIC / Commodore 64 / PLUS/4: $002D/$002E

## Name byte high-bit encoding (type flags)
Type is encoded in the high (bit 7) of the two name bytes:
- Floating numeric variable (no trailing type char): no high bits set on either name byte.
- Integer variable (trailing %): high bit set on both name bytes.
- String variable (trailing $): high bit set on the second name byte only.
- Function (DEF FN...): high bit set on the first name byte only.

(High-bit map summary)
- name byte 0 (first char): bit7 set => function or integer
- name byte 1 (second char): bit7 set => string or integer

## String variable descriptor
- String variables use only 3 of the 5 value bytes (bytes 2–4 of the 7-byte record):
  - Byte 2: string length (1 byte)
  - Bytes 3–4: 16-bit address of the string storage (2 bytes; address order shown in raw dumps)
- Remaining two bytes of the 5-byte area are unused for strings.

## Numeric variables
- Two numeric kinds:
  - Floating point: uses all five value bytes (bytes 2–6).
  - Integer: uses only the first two value bytes of the value area (bytes 2–3) to store a 16-bit integer.
- Integer storage: value stored directly in those two bytes (byte order details discussed in Note below).
- Floating format: occupies all five bytes (the BASIC floating format used by the interpreter). Extracting a floating value is non-trivial (see original reference for conversion).

## Examples (raw memory dumps)
- Floating variable A (example from source):
  - 41 00 83 20 00 00 00
    - Name bytes: 0x41 ('A'), 0x00 (no second char)
    - Value bytes: 83 20 00 00 00 — the 5-byte floating representation containing the numeric value 5
- Integer variable B% (example from source):
  - C2 80 00 05 00 00 00
    - Name bytes: 0xC2 (0x42|'B' with bit7 set), 0x80 (0x00 with bit7 set => no second char)
    - Value bytes: 00 05 00 00 00 — first two value bytes contain the integer 5 in the source example

**[Note: Source byte-order ambiguity]** — The source example shows the integer value bytes as 00 05 and states the value is 5. That byte order is inconsistent with a little-endian interpretation (which would be 05 00 for value 5). Many 6502/C64 multi-byte values are little-endian; verify on target interpreter/runtime. If following little-endian convention, the two integer bytes are low-byte then high-byte. The original text and example appear contradictory; confirm by observing an actual system dump.

## How to locate the variable table
- Use the SOV pointer (start-of-VARIABLES) in zero page to find the table:
  - PET/CBM SOV: $002A/$002B
  - VIC/C64/PLUS4 SOV: $002D/$002E
- From SOV, the variable table entries follow sequentially; display memory to inspect entries.

## Source Code
```text
Example dumps (from source):

Floating variable A:
41 00 83 20 00 00 00

Integer variable B%:
C2 80 00 05 00 00 00

Figure diagrams (conceptual):

NAME (2 bytes) | VALUE (5 bytes)
+--------------+-----------------+
|byte0|byte1   | b2 b3 b4 b5 b6  |
(high-bit flags over name bytes indicate type)

String descriptor (3 bytes of value area):
[length][addr low?][addr high?]    ; address bytes shown in raw dumps (verify order)
```

## Key Registers
- $002A-$002B - PET/CBM - SOV pointer (start of BASIC variable table)
- $002D-$002E - VIC / Commodore 64 / PLUS/4 - SOV pointer (start of BASIC variable table)

## References
- "data_exchange_methods_between_basic_and_machine_language" — discusses scanning the variable table (starting at SOV) for ML/BASIC data exchange and reading variable entries.

## Labels
- SOV
