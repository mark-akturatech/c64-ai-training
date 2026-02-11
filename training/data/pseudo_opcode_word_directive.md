# WORD pseudo-opcode

**Summary:** The `WORD` pseudo-opcode reserves 16-bit (two-byte) data values in low-byte then high-byte order (little-endian) for the target machine's data definitions. See related directives `BYTE` and `.DBYTE` for alternate byte-reservation forms.

**Description**

The `WORD` directive is used to define 16-bit data values, storing them in memory with the low-order byte first, followed by the high-order byte. This little-endian format aligns with the 6502 microprocessor's expectations for 16-bit addresses and data.

**Syntax:**


**Usage Example:**


In this example, `DATA_TABLE` will contain the following bytes in memory:

- `$34 $12`
- `$CD $AB`
- `$78 $56`

**Assembler Behavior:**

- **Alignment:** The `WORD` directive does not inherently enforce any alignment constraints. If specific alignment is required (e.g., aligning data on even addresses), the assembler's `.ALIGN` directive should be used prior to `WORD` declarations. ([cc65.github.io](https://cc65.github.io/doc/ca65.html?utm_source=openai))

- **Expression Evaluation:** Expressions provided to the `WORD` directive are evaluated at assembly time. If an expression exceeds 16 bits, the assembler will typically truncate the value to the lower 16 bits without issuing a warning. For example, `WORD $123456` would store `$56 $34` in memory.

- **Byte Emission:** Each `WORD` directive emits exactly two bytes per expression, corresponding to the 16-bit value specified.

**Comparison with `.DBYTE`:**

The `.DBYTE` directive also reserves 16-bit data values but stores them in high-byte then low-byte order (big-endian). This format is less common in 6502 assembly, as the processor natively uses little-endian ordering. Therefore, `WORD` is generally preferred for defining 16-bit values that will be used as addresses or in operations expecting little-endian format. ([library.defence-force.org](https://library.defence-force.org/books/content/6502_assembly_language_programming.pdf?utm_source=openai))

## Source Code

```
WORD expression[, expression ...]
```

```
DATA_TABLE:
    WORD $1234, $ABCD, $5678
```


## References

- "BYTE pseudo-opcode" — expands on other byte-reservation directives
- "DBYTE pseudo-opcode" — expands on alternative 16-bit ordering