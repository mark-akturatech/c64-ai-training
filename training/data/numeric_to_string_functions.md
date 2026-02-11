# Kick Assembler — Numbers-to-String Conversion Functions (Table 4.4)

**Summary:** Describes Kick Assembler functions to convert numbers to strings: toIntString, toBinaryString, toOctalString, toHexString with optional minSize; covers space-padding (toIntString) and zero-padding (binary/octal/hex) behaviors.

## Function reference
- toIntString(x)
  - Return x as an integer string (decimal). Example from source: toIntString(16.0) => "16".
- toIntString(x, minSize)
  - Return x as an integer string space-padded on the left to reach minSize characters (minimum width).
  - Example from source: toIntString(16,5) => " 16" (source example shown; see note below about source inconsistency).
- toBinaryString(x)
  - Return x as an unpadded binary string. Example: toBinaryString(16.0) => "10000".
- toBinaryString(x, minSize)
  - Return x as a binary string left-zero-padded to reach minSize bits. Example: toBinaryString(16,8) => "00010000".
- toOctalString(x)
  - Return x as an octal string. Example: toOctalString(16.0) => "20".
- toOctalString(x, minSize)
  - Return x as an octal string left-zero-padded to reach minSize digits.
  - Source example (appears mis-typed): shows toBinaryString(16,4) => "0020" (see note).
- toHexString(x)
  - Return x as a hexadecimal string. Example: toHexString(16.0) => "10".
- toHexString(x, minSize)
  - Return x as a hexadecimal string left-zero-padded to reach minSize digits.
  - Source example (appears mis-typed): shows toBinaryString(16,4) => "0010" (see note).

**[Note: Source may contain an error — several example lines for the octal/hex minSize cases reference toBinaryString instead of toOctalString/toHexString; also the displayed spacing in the toIntString(minSize) example may not show the full padding expected for minSize=5.]**

## Source Code
```text
Table 4.4. Numbers to Strings
Function                       Description

toIntString(x)                 Return x as an integer string (eg x=16.0 will return "16").

toIntString(x,minSize)         Return x as an integer string space-padded to reach the given minsize. (eg toIntString(16,5) will return " 16").

toBinaryString(x)              Return x as a binary string (eg x=16.0 will return "10000").

toBinaryString(x,minSize)      Return x as a binary string zero-padded to reach the given minSize (eg toBinaryString(16,8) will return "00010000").

toOctalString(x)               Return x as an octal string (eg x=16.0 will return "20").

toOctalString(x,minSize)       Return x as an octal string zero-padded to reach the given minSize (eg toBinaryString(16,4) will return "0020").

toHexString(x)                 Return x as a hexadecimal string (eg x=16.0 will return "10").

toHexString(x,minSize)         Return x as an hexadecimal string zero-padded to reach the given minSize (eg toBinaryString(16,4) will return "0010").
```

## References
- "string_methods_overview" — expands on String methods for working with the resulting strings (size, substring, etc.)
- "string_concatenation_printing_and_examples" — expands on use of toHexString when printing labels or numeric values
- "generic_stringification_string_function" — expands on alternative: using .string() to stringify arbitrary values