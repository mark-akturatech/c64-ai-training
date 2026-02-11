# Kick Assembler — Ternary operator (condition ? trueExpr : falseExpr)

**Summary:** Covers Kick Assembler's ternary operator syntax (condition ? trueExpr : falseExpr) with examples for strings, numbers, and assembler-time conditional arguments; shows usage with registers like $D020 (VIC-II) and the inc mnemonic.

## Ternary operator usage
The ternary operator selects one of two expressions based on a condition: condition ? trueExpr : falseExpr. It is evaluated at assemble-time when used in .var definitions or as assembler arguments.

- Conditions may be boolean expressions or expressions that evaluate to true/false.
- trueExpr and falseExpr can be strings, numbers, register addresses, or other expressions.
- Useful to compactly replace simple .if/.else structures in assembler-time code generation. See "if_directive" for relationship to .if/.else.

Examples show common uses: string selection, numeric selection, choosing an assembler argument (register address) depending on a flag, and inline null handling.

## Source Code
```asm
.var x= true ? "hello" : "goodbye"
.var y= [20<10] ? 1 : 2

// Sets x = "hello"
// Sets y=2

.var max = a>b ? a:b
.var debug=true
inc debug ? $d020:$d013

// Increases $d020 since debug=true

.var boolean = max(x,minLimit==null?0:minLimit) // Takes care of null limit
```

## Key Registers
- $D020 - VIC-II - Border color register (used in example inc debug ? $D020:$D013)

## References
- "if_directive" — expands on relationship to standard .if/.else control structures

## Labels
- D020
