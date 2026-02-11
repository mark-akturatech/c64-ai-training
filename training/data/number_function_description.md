# Kick Assembler: .number() function

**Summary:** The `.number()` function in Kick Assembler converts various value types into their numeric representations, facilitating numeric operations and expressions. Example usage: `.print 'x'.number()`.

**Description**

The `.number()` function is a versatile conversion utility that returns the numeric representation of its operand. It accepts various value types and produces their corresponding numeric forms, enabling their use in expressions, `.print` statements, or operator contexts.

- **Supported Input Types and Numeric Formats Returned:**
  - **Character (`Char`):** Converts a character to its ASCII code (integer).
    - Example: `'A'.number()` returns `65`.
  - **String (`String`):** Converts a string representing a number to its numeric value.
    - Example: `"123".number()` returns `123.0`.
  - **Number (`Number`):** Returns the number itself.
    - Example: `123.number()` returns `123.0`.
  - **Boolean (`Boolean`):** Converts `true` to `1.0` and `false` to `0.0`.
    - Example: `true.number()` returns `1.0`.
  - **Null (`Null`):** Converts to `0.0`.
    - Example: `null.number()` returns `0.0`.

- **Example Outputs for Different Input Types:**
  - **Character:**
  - **String:**
  - **Number:**
  - **Boolean:**
  - **Null:**

- **Operator Contexts:**
  - The `.number()` function is particularly useful when performing operations that require numeric operands. For instance, when adding a character's ASCII value to a number:
  - In operator contexts, Kick Assembler performs implicit conversions to ensure operands are numeric. The `.number()` function can be used explicitly to clarify conversions.

## Source Code

    ```asm
    .print 'x'.number()  // Outputs: 120.0
    ```

    ```asm
    .print "42".number()  // Outputs: 42.0
    ```

    ```asm
    .print 3.14.number()  // Outputs: 3.14
    ```

    ```asm
    .print true.number()  // Outputs: 1.0
    ```

    ```asm
    .print null.number()  // Outputs: 0.0
    ```

    ```asm
    .var result = 'A'.number() + 10  // result is 75.0
    ```

```asm
.print 'x'.number()  // Outputs: 120.0
.print "42".number()  // Outputs: 42.0
.print 3.14.number()  // Outputs: 3.14
.print true.number()  // Outputs: 1.0
.print null.number()  // Outputs: 0.0
```

## References

- [Kick Assembler Manual: Numeric Values](https://www.theweb.dk/KickAssembler/webhelp/content/ch04s04.html)
- [Kick Assembler Manual: Value Types](https://www.theweb.dk/KickAssembler/webhelp/content/apas05.html)
