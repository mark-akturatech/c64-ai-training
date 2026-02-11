# Kick Assembler: Math Functions — random(), round(), signum(), sin/sinh/sqrt/tan/tanh, toDegrees/toRadians

**Summary:** Kick Assembler math functions: random(), round(), signum(), sin(r), sinh(x), sqrt(x), tan(r), tanh(x), toDegrees(r), toRadians(d). Includes usage examples (lda #random()*256, .fill with sine table). Functions return floating-point results where appropriate and work in expressions inside assembler directives.

## Function Descriptions

random()
- Returns a random number x where 0 ≤ x < 1 (floating-point).

round(x)
- Rounds x to the nearest integer (returns numeric integer value).

signum(x)
- Returns 1 if x > 0, -1 if x < 0, and 0 if x = 0.

sin(r)
- Returns the sine of r. (r in radians)

sinh(x)
- Returns the hyperbolic sine of x.

sqrt(x)
- Returns the square root of x. (x ≥ 0 expected)

tan(r)
- Returns the tangent of r. (r in radians; undefined where cosine is zero)

tanh(x)
- Returns the hyperbolic tangent of x.

toDegrees(r)
- Converts a radian angle r to degrees.

toRadians(d)
- Converts a degree angle d to radians.

Notes:
- These functions are usable in Kick Assembler expressions and directives (e.g., .fill, immediate operands).
- Numeric return types are used directly in expressions; combine with integer contexts using round() or implicit conversion where appropriate.

## Source Code
```asm
; Load A with a random number (0-255)
; random() returns 0 ≤ x < 1, so multiply by 256 and use immediate load
lda #random()*256

; Generate a 256-byte sine curve table (0..255)
; Uses i (current index) inside .fill expression
.fill 256,round(127.5+127.5*sin(toRadians(i*360/256)))
```

## References
- "math_functions_extended" — expands on numeric utilities (mod, pow) used alongside random and trig functions
- "math_library_overview" — general description of Kick Assembler's math support and Java-based functions