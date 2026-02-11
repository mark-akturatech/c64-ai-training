# Kick Assembler — Operators (Table 4.1)

**Summary:** Compact reference for Kick Assembler operators from Table 4.1: unary minus (-), binary arithmetic (+ - * /), byte extraction (> <), bit shifts (<< >>), and bitwise operations (& | ^ ~) with short descriptions and examples.

## Operators
- Unary minus (-)  
  Inverts the sign of a number (arithmetic negation).

- Addition (+)  
  Adds two numbers. Example: 10 + 2 = 12.

- Subtraction (-)  
  Subtracts the second operand from the first. Example: 10 - 8 = 2.

- Multiplication (*)  
  Multiplies two numbers. Example: 2 * 3 = 6.

- Division (/)  
  Divides the first operand by the second. Example: 10 / 2 = 5.

- High byte (>)  
  Returns the high (second) byte of a word. Example: >$1020 = $10.

- Low byte (<)  
  Returns the low (first) byte of a word. Example: <$1020 = $20.

- Bitshift left (<<)  
  Shifts bits to the left by the given count. Example: 2 << 2 = 8.

- Bitshift right (>>)  
  Shifts bits to the right by the given count. Example: 2 >> 1 = 1.

- Bitwise AND (&)  
  Bit-by-bit logical AND between two values. Example: $3f & $0f = $0f.

- Bitwise OR (|)  
  Bit-by-bit logical OR between two values. Example: $0f | $30 = $3f.

- Bitwise exclusive-or (^)  
  Bit-by-bit XOR between two values. Example: $ff ^ $f0 = $0f.

- Bitwise NOT (~)  
  Bitwise negation (one's complement). Example: ~%11 = %...11111100.

## Source Code
```text
Unary minus
-

Plus
+
10+2 = 12

Adds two numbers.

Minus
-
10-8=2

Subtracts two numbers.

Multiply
*
2*3 =6

Multiply two numbers.

Divide
/
10/2 = 5

Divides two numbers.

High byte
>

>$1020 = $10

Returns the second byte of
a number.

Low byte
<

<$1020 = $20

Returns the first byte of a
number.

Bitshift left

<<

2<<2 = 8

Shifts the bits by a given number of spaces to the
left.

Bitshift right

>>

2>>1=1

Shifts the bits by a given number of spaces to the
right.

Bitwise and

&

$3f & $0f = $f

Performs bitwise and between two numbers.

Bitwise or

|

$0f | $30 = $3f

Performs a bitwise or between two numbers.

Bitwise eor

^

$ff ^ $f0 = $0f

Performs a bitwise exclusive or between two numbers.

Bitwise not

~

~%11 = %...11111100

Performs bitwise negation
of the bits.

Inverts the sign of a number.
```

## References
- "numeric_values_table_header" — expands on Table heading and column labels for Table 4.1  
- "number_function_description" — expands on converting arbitrary values to numeric form using .number()