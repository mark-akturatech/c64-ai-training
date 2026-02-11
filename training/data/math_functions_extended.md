# Kick Assembler — Math Functions (middle portion)

**Summary:** Descriptions of math functions `floor(x)`, `hypot(a, b)`, `IEEEremainder(x, y)`, `log(x)`, `log10(x)`, `log1p(x)`, `max(x, y)`, `min(x, y)`, `mod(a, b)`, and `pow(x, y)` from the Kick Assembler script language.

**Function Descriptions**

**floor(x)**
- **Description:** Rounds down to the nearest integer.
- **Parameters:** `x` (floating-point)
- **Returns:** Floating-point
- **Domain and Error Behavior:** Returns the largest integer less than or equal to `x`. If `x` is NaN, returns NaN. If `x` is positive or negative infinity, returns the same infinity value.
- **Example:**
  - `floor(2.9)` returns `2.0`
  - `floor(-2.9)` returns `-3.0`

**hypot(a, b)**
- **Description:** Returns `sqrt(a^2 + b^2)`. (Euclidean hypotenuse)
- **Parameters:** `a`, `b` (floating-point)
- **Returns:** Floating-point
- **Domain and Error Behavior:** Computes the length of the hypotenuse of a right-angled triangle with sides `a` and `b`. If either argument is NaN, returns NaN. If either argument is infinity, returns positive infinity.
- **Example:**
  - `hypot(3.0, 4.0)` returns `5.0`

**IEEEremainder(x, y)**
- **Description:** Returns the remainder of the division of `x` by `y` as described in the IEEE 754 standard.
- **Parameters:** `x`, `y` (floating-point)
- **Returns:** Floating-point
- **Domain and Error Behavior:** Computes the remainder `r` such that `r = x - n*y`, where `n` is the integer nearest to the exact value of `x/y`. If `x/y` is exactly halfway between two integers, `n` is the even integer. If `y` is zero, returns NaN. If `x` is infinity or `y` is NaN, returns NaN.
- **Example:**
  - `IEEEremainder(5.0, 2.0)` returns `1.0`
  - `IEEEremainder(5.0, -2.0)` returns `1.0`
  - `IEEEremainder(-5.0, 2.0)` returns `-1.0`
  - `IEEEremainder(-5.0, -2.0)` returns `-1.0`

**log(x)**
- **Description:** Returns the natural logarithm of `x`.
- **Parameters:** `x` (floating-point)
- **Returns:** Floating-point
- **Domain and Error Behavior:** Defined for `x > 0`. If `x` is zero, returns negative infinity. If `x` is negative, returns NaN. If `x` is NaN, returns NaN.
- **Example:**
  - `log(1.0)` returns `0.0`
  - `log(Math.E)` returns `1.0`

**log10(x)**
- **Description:** Returns the base-10 logarithm of `x`.
- **Parameters:** `x` (floating-point)
- **Returns:** Floating-point
- **Domain and Error Behavior:** Defined for `x > 0`. If `x` is zero, returns negative infinity. If `x` is negative, returns NaN. If `x` is NaN, returns NaN.
- **Example:**
  - `log10(10.0)` returns `1.0`
  - `log10(100.0)` returns `2.0`

**log1p(x)**
- **Description:** Returns `log(x + 1)`.
- **Parameters:** `x` (floating-point)
- **Returns:** Floating-point
- **Domain and Error Behavior:** Defined for `x > -1`. If `x` is -1, returns negative infinity. If `x` is less than -1, returns NaN. If `x` is NaN, returns NaN.
- **Example:**
  - `log1p(0.0)` returns `0.0`
  - `log1p(1.0)` returns `log(2.0)`

**max(x, y)**
- **Description:** Returns the highest number of `x` and `y`.
- **Parameters:** `x`, `y` (floating-point)
- **Returns:** Floating-point
- **Domain and Error Behavior:** If either argument is NaN, returns NaN. If `x` equals `y`, returns `x`.
- **Example:**
  - `max(3.0, 5.0)` returns `5.0`
  - `max(-3.0, -5.0)` returns `-3.0`

**min(x, y)**
- **Description:** Returns the smallest number of `x` and `y`.
- **Parameters:** `x`, `y` (floating-point)
- **Returns:** Floating-point
- **Domain and Error Behavior:** If either argument is NaN, returns NaN. If `x` equals `y`, returns `x`.
- **Example:**
  - `min(3.0, 5.0)` returns `3.0`
  - `min(-3.0, -5.0)` returns `-5.0`

**mod(a, b)**
- **Description:** Converts `a` and `b` to integers and returns the remainder of `a/b`.
- **Parameters:** `a`, `b` (floating-point)
- **Returns:** Integer
- **Domain and Error Behavior:** Converts `a` and `b` to integers by truncating toward zero. If `b` is zero, behavior is undefined.
- **Example:**
  - `mod(5.5, 2.2)` returns `1`
  - `mod(-5.5, 2.2)` returns `-1`

**pow(x, y)**
- **Description:** Returns `x` raised to the power of `y`.
- **Parameters:** `x`, `y` (floating-point)
- **Returns:** Floating-point
- **Domain and Error Behavior:** If `x` is zero and `y` is less than or equal to zero, returns NaN. If `x` is negative and `y` is not an integer, returns NaN. If `x` is NaN or `y` is NaN, returns NaN.
- **Example:**
  - `pow(2.0, 3.0)` returns `8.0`
  - `pow(4.0, 0.5)` returns `2.0`

## References
- "math_functions_basic" — expands on preceding functions such as `exp`/`expm1` and trig basics.
- "math_functions_examples" — expands on examples showing use of `random()`, `sin(...)`, rounding, and `.fill` generation.