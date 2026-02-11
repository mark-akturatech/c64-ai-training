# Kick Assembler — Table 4.1: Numeric Values

**Summary:** This section provides an overview of numeric operators in Kick Assembler, including their syntax, examples, and descriptions.

**Numeric Operators**

Kick Assembler supports a variety of numeric operators for performing arithmetic and bitwise operations. These operators can be combined and will obey standard precedence rules. The following table summarizes these operators:

| Name             | Operator | Examples             | Description                                           |
|------------------|----------|----------------------|-------------------------------------------------------|
| Unary minus      | -        | -5                   | Inverts the sign of a number.                         |
| Plus             | +        | 10 + 2 = 12          | Adds two numbers.                                     |
| Minus            | -        | 10 - 8 = 2           | Subtracts two numbers.                                |
| Multiply         | *        | 2 * 3 = 6            | Multiplies two numbers.                               |
| Divide           | /        | 10 / 2 = 5           | Divides two numbers.                                  |
| High byte        | >        | >$1020 = $10         | Returns the second byte of a number.                  |
| Low byte         | <        | <$1020 = $20         | Returns the first byte of a number.                   |
| Bitshift left    | <<       | 2 << 2 = 8           | Shifts the bits by a given number of spaces to the left. |
| Bitshift right   | >>       | 2 >> 1 = 1           | Shifts the bits by a given number of spaces to the right. |
| Bitwise and      | &        | $3F & $0F = $0F      | Performs bitwise AND between two numbers.             |
| Bitwise or       | \|       | $0F \| $30 = $3F     | Performs bitwise OR between two numbers.              |
| Bitwise eor      | ^        | $FF ^ $F0 = $0F      | Performs bitwise exclusive OR between two numbers.    |
| Bitwise not      | ~        | ~%11 = %...11111100  | Performs bitwise negation of the bits.                |

In practical use, these operators can be combined to form complex expressions. For example:


In this example, the `+` and `*` operators are used to calculate memory addresses dynamically.

Bitwise operators can be used to manipulate individual bits within numbers. For instance:


Here, the `&` (bitwise AND) and `>>` (bitshift right) operators are used to extract specific bytes from a larger number.

Special operators for 65xx assemblers include the high and low-byte operators (`>` and `<`), which are typically used as follows:


In this example, the `<` and `>` operators extract the low and high bytes of the `interrupt1` address, respectively.

**The .number() Utility**

Kick Assembler provides the `.number()` function to obtain the numeric representation of an arbitrary value. For example:


In this case, the `.number()` function converts the character `'x'` to its ASCII numeric value, which is 120.

This function is particularly useful when you need to perform numeric operations on values that are not inherently numeric, such as characters or strings.

## Source Code

```assembly
.var charmem = $0400
ldx #0
lda #0
loop:   sta charmem + 0 * $100, x
        sta charmem + 1 * $100, x
        sta charmem + 2 * $100, x
        sta charmem + 3 * $100, x
        inx
        bne loop
```

```assembly
.var x = $12345678
.word x & $00FF, [x >> 16] & $00FF  // Outputs .word $0078, $0034
```

```assembly
lda #<interrupt1   // Takes the low byte of the interrupt1 value
sta $0314
lda #>interrupt1   // Takes the high byte of the interrupt1 value
sta $0315
```

```assembly
.print 'x'.number()  // Outputs 120
```


## References

- [Kick Assembler Manual: Numeric Values](https://www.theweb.dk/KickAssembler/webhelp/content/ch04s04.html)