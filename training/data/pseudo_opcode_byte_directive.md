# BYTE (pseudo-opcode)

**Summary:** The BYTE pseudo-opcode in the Commodore Macro Assembler reserves one or more bytes of data at the current location counter; a data‑reservation directive used in assembler listings.

**Description**

The `BYTE` directive is used to reserve one or more bytes of data starting at the current location counter value. It allows for the initialization of these bytes with specific values or strings.

**Syntax:**

- **value**: An 8-bit constant, character, or string. Constants can be specified in decimal, hexadecimal (prefixed with `$`), binary (prefixed with `%`), or as character literals enclosed in single quotes. Strings are enclosed in single quotes and can include up to 40 ASCII characters. To include a single quote within a string, use two consecutive single quotes.

**Examples:**

**Interaction with the Location Counter:**

The `BYTE` directive affects the program counter (PC) by advancing it by the number of bytes defined. If the number of bytes causes the PC to cross a page boundary (e.g., from $0FFF to $1000), the assembler handles this automatically. However, programmers should be aware of potential page crossings, especially when absolute addressing is used, as it may affect instruction timing.

**Behavior with Expressions and Forward References:**

Expressions used within the `BYTE` directive are evaluated at assembly time. Forward references (symbols defined later in the code) are resolved during the assembly process. The assembler requires that expressions resolve to 8-bit values; otherwise, an error is generated.

**Limitations:**

- The `BYTE` directive can include up to 40 ASCII characters in a single string.
- Arithmetic operations within the `BYTE` directive are not supported in this version of the assembler.

## Source Code

```
.BYTE value1 [, value2, ...]
```

```assembly
.BYTE 1, $F, %101, 'A'  ; Defines four bytes with values 1, 15, 5, and ASCII 'A'
.BYTE 'HELLO'           ; Defines five bytes with ASCII values of 'H', 'E', 'L', 'L', 'O'
.BYTE 'JIM''S CYCLE'    ; Defines bytes for 'JIM'S CYCLE'
```

(none)

## References

- "using_an_assembler_overview" — expands on Context and assembler used for examples
- "pseudo_opcode_word_directive" — expands on Related data-reservation directives (WORD)
