# Kick Assembler — Numeric values and arithmetic

**Summary:** Numeric values in Kick Assembler include integers and floats; standard arithmetic operators (+, -, *, /) are supported with normal precedence (multiplication/division before addition/subtraction). Examples use hex literals ($0400, $100), variables (.var), expressions with registers/labels, and practical address arithmetic (e.g. STA charmem + n*$100,X).

## Numeric values and operators
Numeric values may be integers or floating-point numbers. The four standard arithmetic operators (+, -, *, /) behave as in common programming languages and may be combined in expressions. Expressions obey standard precedence rules (multiplication and division have higher precedence than addition and subtraction).

Examples (searchable/testable expressions):
- 25+3
- 5+2.5*3-10/2
- charmem + y * $100

Practical usage commonly mixes assembler variables, constants (including hex literals shown with $), and index/register offsets to compute addresses or offsets at assembly time.

## Source Code
```text
# Simple expressions (literal examples)
25+3
5+2.5*3-10/2
charmem + y * $100
```

```asm
; Practical assembler example using arithmetic to compute addresses
.var charmem = $0400
    ldx #0
    lda #0
loop:
    sta charmem + 0*$100,x
    sta charmem + 1*$100,x
    sta charmem + 2*$100,x
    sta charmem + 3*$100,x
    inx
    bne loop
```

## References
- "bitwise_operations_example" — Shows how bitwise ops extend numeric expressions
- "high_low_byte_operators" — Related special 65xx high/low byte operators
- "numeric_values_table_and_number_function" — Detailed operator reference and examples