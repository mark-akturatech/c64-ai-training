# .DBYTE

**Summary:** .DBYTE is a pseudo-opcode that reserves 16-bit data stored in HIGH-byte then LOW-byte order (opposite the assembler's WORD byte order). Searchable terms: .DBYTE, pseudo-opcode, 16-bit, high-byte low-byte, WORD, byte order.

**Description**

.DBYTE is a data reservation directive used in assembler listings to emit a 16-bit value with the high-order byte first followed by the low-order byte. It contrasts with the WORD directive, which emits 16-bit values in low-byte then high-byte order. The chunk contains the .DBYTE label and its concise description as used in assembler listings.

**Syntax:**

- `label` (optional): A symbolic name assigned to the data.
- `value`: A 16-bit numeric expression.

**Example:**

This directive reserves two consecutive memory locations, initializing them with the values 1 and 2, respectively (since 258 in hexadecimal is 0x0102). The high byte (0x01) is stored first, followed by the low byte (0x02).

**Assembler Variations:**

- **Atari Assembler/Editor:** Supports `.DBYTE` for high-byte first storage. ([atarimagazines.com](https://www.atarimagazines.com/analog/issue78/assembler_editor.php?utm_source=openai))
- **Other Assemblers:** Some assemblers may not support `.DBYTE` directly. Instead, they might offer directives like `.WORD` or `.DW` that store 16-bit values in low-byte then high-byte order. In such cases, manual byte swapping is necessary to achieve high-byte first storage.

**Endianness Considerations:**

- **6502 Microprocessor:** Uses little-endian format, storing the least significant byte at the lower memory address. Therefore, when using `.DBYTE`, the assembler emits the high byte first, which is contrary to the processor's default storage order. This discrepancy should be accounted for during data retrieval and processing.

## Source Code

```
label .DBYTE value
```

```
DATA .DBYTE 258
```

```assembly
; Example of .DBYTE usage
DATA .DBYTE 258  ; Stores 0x01 at DATA, 0x02 at DATA+1
```

## References

- "pseudo_opcode_word_directive" — expands on Contrasting 16-bit byte orders (WORD vs .DBYTE)
- "location_counter_and_lib" — expands on Other assembler directives affecting layout (location counter, .LIB)
