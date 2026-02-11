# Kick Assembler — Math Library

**Summary:** Kick Assembler's math library is implemented on top of Java's Math library, providing access to nearly all Java Math constants and functions (e.g., PI, E, abs, sin, log, pow). Additionally, Kick Assembler introduces a non-Java function: mod (modulo).

**The Math Library**

Kick Assembler exposes Java's Math library APIs to assembly-time expressions and macros. Nearly every constant and function provided by Java Math is usable inside Kick Assembler expressions. Below is a list of available constants and functions:

**Constants:**

- **PI**: 3.141592653589793
- **E**: 2.718281828459045

**Functions:**

- **abs(x)**: Returns the absolute (positive) value of x.
- **acos(x)**: Returns the arc cosine of x.
- **asin(x)**: Returns the arc sine of x.
- **atan(x)**: Returns the arc tangent of x.
- **atan2(y, x)**: Returns the angle of the coordinate (x, y) relative to the positive x-axis. Useful when converting to polar coordinates.
- **cbrt(x)**: Returns the cube root of x.
- **ceil(x)**: Rounds up to the nearest integer.
- **cos(r)**: Returns the cosine of r.
- **cosh(x)**: Returns the hyperbolic cosine of x.
- **exp(x)**: Returns e^x.
- **expm1(x)**: Returns e^x - 1.
- **floor(x)**: Rounds down to the nearest integer.
- **hypot(a, b)**: Returns sqrt(a² + b²).
- **IEEEremainder(x, y)**: Returns the remainder of the two numbers as described in the IEEE 754 standard.
- **log(x)**: Returns the natural logarithm of x.
- **log10(x)**: Returns the base 10 logarithm of x.
- **log1p(x)**: Returns log(x + 1).
- **max(x, y)**: Returns the larger of x and y.
- **min(x, y)**: Returns the smaller of x and y.
- **mod(a, b)**: Converts a and b to integers and returns the remainder of a divided by b.
- **pow(x, y)**: Returns x raised to the power of y.
- **random()**: Returns a random number x where 0 ≤ x < 1.
- **round(x)**: Rounds x to the nearest integer.
- **signum(x)**: Returns 1 if x > 0, -1 if x < 0, and 0 if x = 0.
- **sin(r)**: Returns the sine of r.
- **sinh(x)**: Returns the hyperbolic sine of x.
- **sqrt(x)**: Returns the square root of x.
- **tan(r)**: Returns the tangent of r.
- **tanh(x)**: Returns the hyperbolic tangent of x.
- **toDegrees(r)**: Converts a radian angle to degrees.
- **toRadians(d)**: Converts a degree angle to radians.

For exact semantics, numeric behavior (floating-point rules), and complete function names, consult the Java SE Math documentation; Kick Assembler follows those definitions except for the added mod function.

**mod Function:**

The `mod` function in Kick Assembler computes the remainder of the division of two numbers. It converts both arguments to integers and returns the remainder of the division. The behavior of `mod` with negative operands follows the same rules as the `%` operator in Java, where the sign of the result is the same as the dividend.

For example:

- `mod(5, 3)` returns `2`
- `mod(-5, 3)` returns `-2`
- `mod(5, -3)` returns `2`
- `mod(-5, -3)` returns `-2`

This behavior aligns with the standard modulus operation in many programming languages, where the result's sign matches the dividend.

## References

- "math_constants" — lists available math constants (PI, E) with values.
- "math_functions_basic" — begins the list of math functions (abs, acos, asin, atan, atan2, cbrt, ceil, cos, cosh, exp, expm1).
- "math_functions_extended" — continues the list of math functions (floor, hypot, IEEEremainder, log*, max/min, mod, pow).
