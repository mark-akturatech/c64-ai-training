# Kick Assembler: .for directive (Section 5.4)

**Summary:** Describes Kick Assembler's .for directive syntax: an init expression list, a boolean condition, and an iteration list (separated by semicolon). Covers multiple expressions in init/iteration and examples for printing, table generation (sine wave), accumulation, nested loops for table generation and loop unrolling, and comparison with .fill directive for data generation.

**Syntax**
.for(init-list ; boolean-expression ; iteration-list) body

- init-list and iteration-list are comma-separated expression lists and may be omitted.
- The boolean-expression is evaluated before each iteration; while it evaluates to true, the body and the iteration-list are executed.
- init-list is executed once before the loop begins.

**Notes on usage**
- You can initialize variables outside the loop (e.g., with .var) and leave init-list empty.
- Multiple expressions can be provided in init-list or iteration-list, separated by commas.
- Body may be a single directive or a block enclosed in braces { ... }.

## Source Code
```asm
// Prints the numbers from 0 to 9
.for(var i=0;i<10;i++) .print "Number " + i

// Make data for a sine wave (256 samples)
.for(var i=0;i<256;i++) .byte round(127.5+127.5*sin(toRadians(360*i/256)))

// Alternative: initialize variable outside the loop and update inside
.var i=0
.for (;i<10;) {
    .print i
    .eval i++
}

// Sum the numbers from 0 to 9 and print the sum at each step
.for(var i=0, var sum=0;i<10;sum=sum+i,i++)
    .print "The sum at step " + i + " is " + sum

// Nested .for loops for table generation and loop unrolling
.var blitterBuffer=$3000
.var charset=$3800
.for (var x=0;x<16;x++) {
    .for(var y=0;y<128;y++) {
        if (y==0)  lda blitterBuffer+x*128+y
        else       eor blitterBuffer+x*128+y
        sta charset+x*128+y
    }
}

// Comparison of .for with .fill for data generation
// Using .for to generate a sine wave table
.for(var i=0;i<256;i++) .byte round(127.5+127.5*sin(toRadians(360*i/256)))

// Using .fill to generate the same sine wave table
.fill 256, round(127.5+127.5*sin(toRadians(i*360/256)))
```

## References
- "data_directives_and_fill" — expands on generating table data with .for vs .fill performance considerations
- "working_with_mutable_values" — expands on recommendation to use .define for heavy .for computations