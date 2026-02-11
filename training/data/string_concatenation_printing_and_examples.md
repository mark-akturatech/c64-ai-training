# Kick Assembler: string concatenation and .print (assembly-time output)

**Summary:** Kick Assembler supports string concatenation with the `+` operator and assembly-time output via `.print`; use `.var` for compile-time variables, `toHexString` to format numeric/label values, and print label addresses (e.g., `.print "int1=$"+toHexString(int1)`).

**Description**

Every Kick Assembler object has a string representation and may be concatenated using the `+` operator. Numeric values are converted to strings when concatenated (numeric values converted to decimal strings). Use `.var` to define assembly-time variables and `.print` to emit text to the assembler console for debugging.

- **Concatenation:**
  - `"string" + value` concatenates, coercing non-strings to their string representation.
  - Example: `.var x=25` followed by `.var myString = "X is " + x` yields `myString` as `"X is 25"`.

- **`.print` directive:**
  - Emits a string to the assembler console during assembly. Useful for verifying computed values, offsets, or label addresses.
  - You can combine literal text and variables: `.print "x="+x`

- **Printing labels:**
  - Labels can be printed to see their assembled addresses. Prefer formatting with `toHexString()` to display them in hex: `.print "int1=$"+toHexString(int1)`
  - `toHexString` is a helper function that converts a number to its hexadecimal string representation. It can also accept a second argument to specify the minimum size of the resulting string, padding with zeros if necessary. For example, `toHexString(16,4)` returns `"0010"`. ([theweb.dk](https://theweb.dk/KickAssembler/webhelp/content/ch04s06.html?utm_source=openai))

Keep `.print` statements limited to debugging output; they appear during assembly, not at runtime.

**Functions and Operators Defined on Strings**

Kick Assembler provides several functions and operators for string manipulation:

- **`+`**: Appends two strings.
- **`asBoolean()`**: Converts the string to a boolean value (e.g., `"true".asBoolean()`).
- **`asNumber()`**: Converts the string to a number value (e.g., `"35".asNumber()`).
- **`asNumber(radix)`**: Converts the string to a number value with the given radix (16=hexadecimal, 2=binary, etc.). For example, `"f".asNumber(16)` returns `15`.
- **`charAt(n)`**: Returns the character at position `n`.
- **`size()`**: Returns the number of characters in the string.
- **`substring(i1, i2)`**: Returns the substring beginning at `i1` and ending at `i2` (character at `i2` not included).
- **`toLowerCase()`**: Returns the lowercase version of the string.
- **`toUpperCase()`**: Returns the uppercase version of the string. ([theweb.dk](https://theweb.dk/KickAssembler/webhelp/content/ch04s06.html?utm_source=openai))

**Functions for Converting Numbers to Strings**

Kick Assembler provides functions to convert numeric values to their string representations:

- **`toIntString(x)`**: Returns `x` as an integer string (e.g., `toIntString(16.0)` returns `"16"`).
- **`toIntString(x, minSize)`**: Returns `x` as an integer string, space-padded to reach the given `minSize` (e.g., `toIntString(16, 5)` returns `"   16"`).
- **`toBinaryString(x)`**: Returns `x` as a binary string (e.g., `toBinaryString(16.0)` returns `"10000"`).
- **`toBinaryString(x, minSize)`**: Returns `x` as a binary string, zero-padded to reach the given `minSize` (e.g., `toBinaryString(16, 8)` returns `"00010000"`).
- **`toOctalString(x)`**: Returns `x` as an octal string (e.g., `toOctalString(16.0)` returns `"20"`).
- **`toOctalString(x, minSize)`**: Returns `x` as an octal string, zero-padded to reach the given `minSize` (e.g., `toOctalString(16, 4)` returns `"0020"`).
- **`toHexString(x)`**: Returns `x` as a hexadecimal string (e.g., `toHexString(16.0)` returns `"10"`).
- **`toHexString(x, minSize)`**: Returns `x` as a hexadecimal string, zero-padded to reach the given `minSize` (e.g., `toHexString(16, 4)` returns `"0010"`). ([theweb.dk](https://theweb.dk/KickAssembler/webhelp/content/ch04s06.html?utm_source=openai))

## Source Code

```asm
; Simple variable concatenation
.var x = 25
.var myString = "X is " + x    ; myString -> "X is 25"

; Printing variables during assembly
.print "x="+x
.print "y="+y                  ; (y must be defined earlier)

; Printing a label address (recommended: convert to hex)
.print "int1=$"+toHexString(int1)

int1:
    sta regA+1
    stx regX+1
    sty regY+1
    lsr $d019
    ; ... additional code ...
```

## References

- [Kick Assembler Manual: String Values](https://theweb.dk/KickAssembler/webhelp/content/ch04s06.html)
- [Kick Assembler Manual: Numeric Values](https://theweb.dk/KickAssembler/webhelp/content/ch04s04.html)