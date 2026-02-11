# Hexadecimal primer (Commodore 64)

**Summary:** Primer on hexadecimal (base 16) notation for C64 machine-language work: hex digits 0–F, conversion examples between decimal/hex/binary, positional notation (powers of 16), address range up to $FFFF, use of $ prefix, and examples of viewing memory and registers with 64MON commands (SYS, B*, .M memory dump format).

## Hexadecimal notation
Hexadecimal (hex, base 16) is the common numeric notation used by machine-language programmers to represent byte and address values. Hex digits run 0–15; digits 10–15 are written A–F. Hex values on the C64 are conventionally prefixed with a dollar sign ($) to distinguish them from decimal.

Range of addressable memory on the C64 is 0–65535 decimal, which equals 0–$FFFF in hex.

## Positional notation and conversion
Hexadecimal is positional like decimal; each digit position is a power of 16:

- 16^0 = 1
- 16^1 = 16
- 16^2 = 256
- 16^3 = 4096

Example decimal-to-hex conversion (preserving the book's worked example):
- Decimal 4569 = hex 11D9 because 11D9 = 1*4096 + 1*256 + 13*16 + 9.
- In other words: 4569 (base 10) = 11D9 (base 16).

Binary equivalence is useful to inspect bit patterns; bytes are often written as two hex digits (00–FF) corresponding to 8 binary bits.

## Digit mapping (0–15)
Hex digits map to decimal and binary as follows (table in Source Code section). Key mapping: 10→A, 11→B, 12→C, 13→D, 14→E, 15→F.

## Viewing memory and registers with 64MON
64MON (monitor) on the C64 accepts hex-style addresses and shows memory/register dumps in hex. Typical examples from the source:

- Enter the machine monitor by executing a SYS to the monitor entry point:
  - SYS 8*4096  (or SYS 12*4096) — launches the monitor depending on setup.
- Use B* to display CPU registers (example labels shown in Source Code).
  - Example register line shown in source: .;0401 32 04 5E 00 F6  (values vary).
- Use the memory dump command:
  - .M 0000 0020 — prints a block of memory starting at $0000 for 0x20 (32) bytes.
  - Output format: rows of nine hex values — first is the 4-digit start address, followed by eight byte values (hex) representing memory contents at that address and the next seven addresses.

The monitor output and hex addressing make it easier to work without converting values back to decimal — think and reason in hex.

## Source Code
```text
+---------+-------------+----------+
| DECIMAL | HEXADECIMAL |  BINARY  |
+---------+-------------+----------+
|    0    |      0      | 00000000 |
|    1    |      1      | 00000001 |
|    2    |      2      | 00000010 |
|    3    |      3      | 00000011 |
|    4    |      4      | 00000100 |
|    5    |      5      | 00000101 |
|    6    |      6      | 00000110 |
|    7    |      7      | 00000111 |
|    8    |      8      | 00001000 |
|    9    |      9      | 00001001 |
|   10    |      A      | 00001010 |
|   11    |      B      | 00001011 |
|   12    |      C      | 00001100 |
|   13    |      D      | 00001101 |
|   14    |      E      | 00001110 |
|   15    |      F      | 00001111 |
|   16    |     10      | 00010000 |
+---------+-------------+----------+
```

```text
Example positional construction (decimal):
Base raised by increasing powers: 10^3 10^2 10^1 10^0
Equals:                                1000  100   10    1
Consider 4569 (base 10) = 4*1000 + 5*100 + 6*10 + 9

Example positional construction (hex):
Base raised by increasing powers: 16^3 16^2 16^1 16^0
Equals:                                4096  256   16    1
Consider 11D9 (base 16) = 1*4096 + 1*256 + 13*16 + 9
Therefore 4569 (base 10) = 11D9 (base 16)
```

```basic
;; 64MON usage examples (BASIC input shown as in source)
SYS 8*4096        ; enter monitor (example)
B*                ; display CPU registers (format varies)
.M 0000 0020      ; memory dump from $0000 length $0020 (32 bytes)
```

```text
Sample monitor output showing registers/memory (from source - actual values vary):
PC  SR AC XR YR SP
.;0401 32 04 5E 00 F6
```

## References
- "writing_machine_language_and_assemblers" — expands on assembler support for hex/decimal/binary input and display
- "lda_immediate_absolute_and_address_representation" — expands on hex usage for instruction tokens and operands
