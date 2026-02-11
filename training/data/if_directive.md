# Kick Assembler: .if directive

**Summary:** .if directive — conditional assembly based on boolean expressions; supports short-circuited logical operators (&&, ||), single-directive or block {…} execution, optional .else branch, and use with .error for conditional error reporting. Examples show .var, .eval, and inline assembly statements.

## Behavior and syntax
- A following directive or a block { … } is executed only if the boolean expression evaluates true.
- The boolean operators && and || are short-circuited: for A && B, B is not evaluated if A is false; for A || B, B is not evaluated if A is true.
- The .if may be followed by:
  - a single directive on the same line: .if (cond) <directive>
  - a block of statements enclosed in braces on subsequent lines:
    .if (cond) {
      ...
    }
  - an optional else clause for an alternate single directive or block:
    .if (cond) <then> else <else> 
- Typical uses: conditional code emission, conditional .eval/.var assignment, conditional inclusion of assembly instructions, and triggering .error for fatal conditions during assembly.

## Examples (descriptions)
- Assign or clamp values conditionally with .eval:
  - .if (x>10) .eval x=10
- Use a boolean .var to conditionally emit instructions around a subroutine call:
  - .var showRasterTime = false
  - .if (showRasterTime) inc $d020
    jsr PlayMusic
    .if (showRasterTime) dec $d020
  (Note: the middle jsr is unconditional in this example — only the inc/dec are conditional.)
- Use blocks to group multiple statements executed together:
  - .if (irqNr==3) {
      inc $d020
      jsr music+3
      dec $d020
    }
- Use else for alternate single-expression or block actions:
  - .if (x>=0) adc zpXtable+x else sbc zpXtable+abs(x)
- Use .error inside an else block to abort assembly with a message when a condition is not met:
  - .if (i<tableLength) {
      lda #0
      sta offset1+i
      sta offset2+i
    } else {
      .error "Error!! I is too high!"
    }

## Source Code
```asm
// Set x to 10 if x is higher that 10
.if (x>10) .eval x=10

// Only show rastertime if the ‘showRasterTime’ boolean is true
.var showRasterTime = false
.if (showRasterTime) inc $d020
jsr PlayMusic
.if (showRasterTime) dec $d020

// If IrqNr is 3 then play the music
.if (irqNr==3) {
  inc $d020
  jsr music+3
  dec $d020
}

// Add the x’th entry of a table if x is positive or
// subtract it if x is negative
.if (x>=0) adc zpXtable+x else sbc zpXtable+abs(x)

// Init an offset table or display a warning if the table length is exceeded
.if (i<tableLength) {
  lda #0
  sta offset1+i
  sta offset2+i
} else {
  .error "Error!! I is too high!"
}
```

## References
- "ternary_if_question_mark" — short conditional expression form (condition ? trueExpr : falseExpr)
- "console_output_and_error_reporting" — using .error and .errorif with conditionals