# Expressions and Operators (Commodore 64 BASIC)

**Summary:** Describes Commodore 64 BASIC expressions (constants, variables, arrays) and operator classes: arithmetic, string, relational, and logical. Lists arithmetic operators (+, -, *, /, ^) and notes arithmetic expressions yield integer or floating‑point results.

**Expressions and Operators**

Expressions are formed from constants, variables, and/or arrays. An expression may be:

- A single constant
- A simple variable
- An array variable of any type

Expressions can also be combinations of constants and variables using operators to produce a single value. Expressions are commonly classified into two classes:

1. Arithmetic
2. String

Typical expressions consist of two or more data items (operands) separated by operators. Operators are special symbols recognized by the Commodore 64 BASIC interpreter that specify operations to be performed on operands. Commodore 64 BASIC recognizes arithmetic, relational, and logical operators. Expressions are often evaluated and assigned to a variable name.

**Arithmetic Expressions**

Arithmetic expressions evaluate to either integer or floating‑point values. The arithmetic operators recognized by Commodore 64 BASIC are:

- `+` — Addition
- `-` — Subtraction
- `*` — Multiplication
- `/` — Division
- `^` — Exponentiation

### Operator Precedence and Associativity

In expressions with multiple operators, the order of evaluation is determined by operator precedence and associativity:

1. **Exponentiation (`^`)**: Highest precedence, evaluated first.
2. **Negation (`-`)**: Unary minus, evaluated next.
3. **Multiplication (`*`) and Division (`/`)**: Evaluated from left to right.
4. **Addition (`+`) and Subtraction (`-`)**: Evaluated from left to right.

All binary arithmetic operators are left-associative, meaning they are evaluated from left to right when they have the same precedence.

**Example:**


This evaluates as `2 + (3 * 4)`, resulting in `14`.

To override the default precedence, use parentheses:


This evaluates as `(2 + 3) * 4`, resulting in `20`.

**Relational Operators**

Relational operators compare two values and return `-1` (true) if the condition is met, or `0` (false) otherwise. The relational operators in Commodore 64 BASIC are:

- `<`  — Less than
- `=`  — Equal to
- `>`  — Greater than
- `<=` — Less than or equal to
- `>=` — Greater than or equal to
- `<>` — Not equal to

**Examples:**


Relational operators can also compare strings, evaluating character codes from left to right.

**Example:**


**Logical Operators**

Logical operators perform bitwise operations on integer operands or combine relational expressions. The logical operators are:

- `AND` — Returns `-1` if both operands are true; otherwise, returns `0`.
- `OR`  — Returns `-1` if either operand is true; otherwise, returns `0`.
- `NOT` — Returns the bitwise complement of the operand.

**Examples:**


**Hierarchy of Operations**

The hierarchy of operations in Commodore 64 BASIC, from highest to lowest precedence, is:

1. **Exponentiation (`^`)**
2. **Negation (`-`)** (Unary minus)
3. **Multiplication (`*`) and Division (`/`)**
4. **Addition (`+`) and Subtraction (`-`)**
5. **Relational Operators (`=`, `<`, `>`, `<=`, `>=`, `<>`)**
6. **Logical NOT (`NOT`)**
7. **Logical AND (`AND`)**
8. **Logical OR (`OR`)**

Operations are performed from left to right when operators have the same precedence, except for exponentiation, which is right-associative.

**Example:**


This evaluates as `2 ^ (3 ^ 2)`, resulting in `512`.

## Source Code

```basic
PRINT 2 + 3 * 4
```

```basic
PRINT (2 + 3) * 4
```

```basic
PRINT 5 < 10   : REM Returns -1 (true)
PRINT 5 = 5    : REM Returns -1 (true)
PRINT 5 > 10   : REM Returns 0 (false)
```

```basic
PRINT "APPLE" < "BANANA"   : REM Returns -1 (true)
```

```basic
PRINT (5 > 3) AND (10 < 20)   : REM Returns -1 (true)
PRINT (5 > 10) OR (10 < 20)   : REM Returns -1 (true)
PRINT NOT 0                   : REM Returns -1 (true)
```

```basic
PRINT 2 ^ 3 ^ 2
```


## References

- "arithmetic_operations" — expands on arithmetic operators (+, -, *, /, ^)
- "string_operations_and_concatenation" — expands on string concatenation using +