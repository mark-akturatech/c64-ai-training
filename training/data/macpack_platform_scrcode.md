# ca65 .MACPACK scrcode (apple2, atari, cbm)

**Summary:** The ca65 assembler provides `.MACPACK` macro packages for `apple2`, `atari`, and `cbm`, each defining a `scrcode` macro. This macro accepts a string argument and emits the corresponding platform-specific screen codes into memory, facilitating the use of readable string literals in source code while ensuring correct screen code representation for each platform.

**Description**

Each `.MACPACK`—`apple2`, `atari`, and `cbm`—defines a `scrcode` macro that:

- **Accepts a single string argument:** The string should be enclosed in double quotes.
- **Translates each character:** Converts the string's characters into the target platform's screen code representation.
- **Emits the translated bytes into memory:** Places the resulting screen codes at the current location in the assembled output.

This approach centralizes the character-to-screen-code translation, allowing developers to write clear and maintainable source code without manually handling platform-specific screen code mappings.

**Example Usage:**

To use the `scrcode` macro, include the appropriate `.MACPACK` directive for your target platform:


Then, invoke the `scrcode` macro with your desired string:


This will emit the platform-specific screen codes corresponding to the string "HELLO, WORLD!" into the assembled output.

**Platform-Specific Screen Code Mappings:**

- **Apple II:** The Apple II uses a screen code system where uppercase letters are represented by their ASCII values minus 64. For example, 'A' (ASCII 65) becomes 1, 'B' (ASCII 66) becomes 2, and so on. Lowercase letters are not natively supported in the original Apple II text mode.

- **Atari:** Atari 8-bit computers utilize the ATASCII character set, which is similar to ASCII but includes specific control characters and graphical symbols. Uppercase letters 'A' to 'Z' are represented by decimal values 65 to 90, matching standard ASCII. Lowercase letters and additional symbols have their own specific codes.

- **Commodore (CBM):** Commodore computers use the PETSCII character set. In PETSCII, uppercase letters 'A' to 'Z' are represented by decimal values 65 to 90, while lowercase letters 'a' to 'z' are represented by 193 to 218. Special graphical symbols and control characters are also included in the PETSCII set.

**Behavior Details:**

- **Non-Printable Characters and Control Codes:** The `scrcode` macro does not process non-printable characters or control codes. Including such characters in the string argument may lead to assembler errors or unintended behavior.

- **Character Case Conversion:** The macro performs necessary case conversions based on the target platform's screen code requirements. For instance, on the Apple II, lowercase letters in the source string are typically converted to their uppercase equivalents, as the original text mode does not support lowercase characters.

**Macro Output:**

- **Byte Sequence Format:** The macro emits a sequence of bytes corresponding to the translated screen codes of the input string.

- **Termination:** The `scrcode` macro does not append a null terminator or any other termination character to the emitted byte sequence. If a specific terminator is required (e.g., a null byte for C-style strings), it must be added explicitly:


- **Alignment and Label/Offset Handling:** The macro does not perform any alignment adjustments. It emits bytes sequentially from the current location counter. If alignment is necessary, it should be managed separately using appropriate assembler directives.

**Assembly Snippet Demonstrating Emitted Bytes and Resulting Screen Output:**


For a Commodore 64 target, this would emit the following byte sequence:

- 'H' → 72
- 'E' → 69
- 'L' → 76
- 'L' → 76
- 'O' → 79
- ',' → 44
- ' ' → 32
- 'W' → 87
- 'O' → 79
- 'R' → 82
- 'L' → 76
- 'D' → 68
- '!' → 33

When these bytes are written to the screen memory, they will display "HELLO, WORLD!" on the screen.

## Source Code

```assembly
.macpack apple2
; or
.macpack atari
; or
.macpack cbm
```

```assembly
scrcode "HELLO, WORLD!"
```

  ```assembly
  scrcode "HELLO, WORLD!"
  .byte 0 ; Null terminator
  ```

```assembly
.macpack cbm
scrcode "HELLO, WORLD!"
```


## References

- [ca65 Users Guide](https://cc65.github.io/doc/ca65.html)
- [PETSCII Character Set](https://en.wikipedia.org/wiki/PETSCII)
- [Atari ST Character Set](https://en.wikipedia.org/wiki/Atari_ST_character_set)