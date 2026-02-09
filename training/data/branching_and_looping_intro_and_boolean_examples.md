# Kick Assembler — Branching and Looping (Chapter 5): Boolean Values (Section 5.1)

**Summary:** Describes boolean values in Kick Assembler used by control directives (.if/.repeat/etc.), with .var boolean assignments and comparison expressions using operators (==, !=, >, <, >=, <=). Mentions logical operators (!, &&, ||) and references operator tables.

**Boolean Values**
Boolean values in Kick Assembler are binary flags (true/false) used as conditions for control directives (e.g., .if, .else, .repeat). They behave like booleans in Java/C# and can be stored in variables with the .var directive or produced by comparison expressions.

- Booleans can be assigned directly: `.var name = true` or `.var name = false`.
- Comparison expressions produce boolean results using standard comparison operators: `==`, `!=`, `>`, `<`, `>=`, `<=`.
- Logical boolean operators (negation, AND, OR) are available: `!`, `&&`, `||`.

Examples of typical boolean expressions include equality/inequality tests, numeric comparisons, and negation of comparisons. These boolean variables are then usable wherever Kick Assembler expects a condition for a control directive.

## Source Code
```asm
.var myBoolean1 = true
// Set the variable to true
.var myBoolean2 = false
// Set the variable to false
.var fourHigherThanFive = 4>5 // Sets fourHigherThanFive = false
.var aEqualsB = a==b
// Sets true if a is the same as b
.var xNot10 = x!=10
// Sets true if x doesn't equal 10
```

**Comparison Operators**
The following table lists the standard comparison operators in Kick Assembler:

| Name           | Operator | Example | Description                                      |
|----------------|----------|---------|--------------------------------------------------|
| Equal          | `==`     | a == b  | Returns true if a equals b, otherwise false.     |
| Not Equal      | `!=`     | a != b  | Returns true if a doesn't equal b, otherwise false. |
| Greater        | `>`      | a > b   | Returns true if a is greater than b, otherwise false. |
| Less           | `<`      | a < b   | Returns true if a is less than b, otherwise false. |
| Greater or Equal | `>=`   | a >= b  | Returns true if a is greater than or equal to b, otherwise false. |
| Less or Equal  | `<=`     | a <= b  | Returns true if a is less than or equal to b, otherwise false. |

**Logical Boolean Operators**
The following table lists the logical boolean operators in Kick Assembler:

| Name | Operator | Example | Description |
|------|----------|---------|-------------|
| Not  | `!`      | !a      | Returns true if a is false, otherwise false. |
| And  | `&&`     | a && b  | Returns true if both a and b are true, otherwise false. |
| Or   | `||`     | a || b  | Returns true if either a or b is true, otherwise false. |

## References
- "boolean_generating_operators" — expands Table 5.1: comparison operators (==, !=, >, <, >=, <=) with examples.
- "boolean_logical_operators" — expands Table 5.2: logical operators (!, &&, ||) with examples.