# Commodore 64 BASIC — Arithmetic Operators (+, -, *, /, ^)

**Summary:** Commodore 64 BASIC arithmetic operators: addition (+), subtraction (binary and unary -), multiplication (*), division (/), and exponentiation (^). Examples and notation include variable forms (X%, A, AB), scientific notation (10E-2), and chained expressions (A+B+C, AB^CD).

## Overview
Commodore 64 BASIC supports the standard arithmetic operators:
- +  (addition)
- -  (subtraction; also unary negation)
- *  (multiplication)
- /  (division)
- ^  (exponentiation)

Expressions may use numeric literals, variables (e.g., X%, A, AB), and scientific notation (10E-2) in floating-point context.

## Addition
The plus sign (+) adds the operand on the right to the operand on the left. Addition is associative in evaluation order as parsed by BASIC.

## Subtraction
The minus sign (-) subtracts the right operand from the left operand (binary subtraction). Example forms include numeric and variable operands.

## Unary minus
A leading minus is a unary negation and represents the negative of the following value (equivalent to 0 minus that value). Unary minus may appear inside expressions (e.g., 4-(-2) equals 4+2).

## Multiplication
The asterisk (*) multiplies the left operand by the right operand. Operands may be literals, variables, or expressions.

## Division
The slash (/) divides the left operand by the right operand. Division follows floating-point semantics when applicable.

## Exponentiation
The caret (^) raises the left operand to the power of the right operand (the exponent). The exponent may be positive, negative, or fractional provided the result is a valid floating-point number. Examples include squaring (2^2) and negative exponents (3^-2, equivalent to 1/(3*3)).

## Source Code
```basic
EXAMPLES:
    2+2
    A+B+C
    X%+1
    BR+10E-2

SUBTRACTION:
    4-1
    100-64
    A-B
    55-142

UNARY MINUS:
    -5
    -9E4
    -B
    4-(-2)   REM same as 4+2

MULTIPLICATION:
    100*2
    50*0
    A*X1
    R%*14

DIVISION:
    10/2
    6400/4
    A/B
    4E2/XR

EXPONENTIATION:
    2^2        REM Equivalent to: 2*2
    3^3        REM Equivalent to: 3*3*3
    4^4        REM Equivalent to: 4*4*4*4
    AB^CD
    3^-2       REM Equivalent to: 1/3*1/3
```

## References
- "arithmetic_operations" — expands on operator definitions and conversion rules