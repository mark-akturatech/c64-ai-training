# CBM BASIC — Data conversion rules (arithmetic, relational, logical, assignment, truncation)

**Summary:** Describes CBM BASIC data-conversion behavior: arithmetic and relational operations are evaluated in floating-point (integers promoted), logical operations convert operands to integers and return integer results, assignment converts values to the declared variable type, floating-point to integer conversion truncates the fractional part, and out-of-range results produce a ?ILLEGAL QUANTITY error.

**Data conversion rules (concise)**

- **Arithmetic and relational operations:** Evaluated in floating-point format. Integer operands are converted to floating point for evaluation; the result is then converted back to an integer if the context requires (see assignment rules).
- **Logical operations (AND, OR, NOT, etc.):** Convert operands to integer form and return an integer result.
- **Assignment:** When a numeric variable of one type is assigned a numeric value of a different type, the value is converted and stored in the variable's declared type (see variable naming conventions for % and $ in referenced chunks).
- **Floating-point to integer conversion:** The fractional portion is truncated (removed). The integer result is less than or equal to the original floating-point value.
- **Range and type checks:** When a conversion or assignment produces a value outside the allowable range for the destination type, the interpreter signals ?ILLEGAL QUANTITY (error).

(Short parenthetical: variable type characters % and $ denote integer/string naming — see referenced "variables_types_and_naming".)

## Source Code
```basic
10 A$="FILE": B$="NAME"
20 NAM$=A$+B$                      (gives the string: FILENAME)
30 RES$="NEW "+A$+B$               (gives the string: NEW FILENAME)
                ^
                |       +-----------------+
                +-------+ Note space here.|
                        +-----------------+
```

```text
When necessary, the CBM BASIC Interpreter will convert a numeric
data item from an integer to floating-point, or vice-versa, according to
the following rules:

o All arithmetic and relational operations are performed in floating
  point format. Integers are converted to floating-point form for
  evaluation of the expression, and the result is converted back to
  integer. Logical operations convert their operands to integers and
  return an integer result.
o If a numeric variable name of one type is set equal to a numeric
  data item of a different type, the number will be converted and
  stored as the data type declared in the variable name.
o When a floating-point value is converted to an integer, the frac-
  tional portion is truncated (eliminated) and the integer result is
  less than or equal to the floating-point value. If the result is
  outside the allowable range for the integer type (-32768 to 32767),
  the interpreter signals ?ILLEGAL QUANTITY ERROR.
```

## References
- "variables_types_and_naming" — expands on type-declaration characters (%) and ($) and naming rules.
- "arithmetic_operations" — expands on floating-point conversion behavior during arithmetic and relational evaluations.