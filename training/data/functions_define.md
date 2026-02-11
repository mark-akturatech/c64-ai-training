# Kick Assembler: .function (Chapter 7 / §7.1)

**Summary:** Defines Kick Assembler script functions with .function/.return, non-byte-generating directives (.eval, .for, .var, .if), return semantics (expression or null if no expression or no .return reached), and examples (area, oddEven, clearList). Full code examples are in Source Code.

**Syntax and behavior**
- Define a script function with .function name(params) { ... } and return a value with .return <expression>. Functions are evaluated at assembly time (script-level), not as emitted bytecode.
- Functions may contain non-byte-generating directives such as .eval, .for, .var, and .if. Byte-generating directives (e.g., lda, sta, .byte) are not permitted within function bodies. ([theweb.dk](https://www.theweb.dk/KickAssembler/webhelp/content/cpt_FunctionsAndMacros.html?utm_source=openai))
- When the assembler evaluates a .return directive, it returns the value of the following expression. If .return is given with no expression, or if execution reaches the end of the function without encountering any .return, the function yields a null value.
- Functions can be used in expressions and directives just like built-in library functions. Example usages (see Source Code): .var x = area(3,2) and lda #10+area(4,8).
- Empty functions (no statements and no .return) always return null.

**Function overloading**
- Multiple functions can share the same name if they have different numbers of parameters. The assembler differentiates these functions based on the number of arguments provided during the function call. For example:
  In this case, calling polyFunction() returns 0, polyFunction(1) returns 1, and polyFunction(1,2) returns 2. ([theweb.dk](https://www.theweb.dk/KickAssembler/webhelp/content/cpt_FunctionsAndMacros.html?utm_source=openai))

**Variable scoping and lifetime**
- Variables declared within a function using .var are local to that function and cannot be accessed outside its scope. This encapsulation ensures that variables inside a function do not interfere with variables outside or in other functions. ([theweb.dk](https://www.theweb.dk/KickAssembler/webhelp/content/cpt_FunctionsAndMacros.html?utm_source=openai))

**Evaluation timing and side effects**
- Kick Assembler operates in two modes: 'Function Mode' and 'Asm Mode'. 'Function Mode' is used when directives are placed inside a function or .define directive. In this mode, only script commands (.var, .const, .for, etc.) are allowed, and it executes faster but does not record side effects. 'Asm Mode' is used elsewhere and can handle all directives, recording side effects as described. Evaluation starts in 'Asm Mode' and enters 'Function Mode' when inside a function or .define directive. ([theweb.dk](https://www.theweb.dk/KickAssembler/webhelp/content/apbs03.html?utm_source=openai))

**Examples (described)**
- area(width,height): returns width*height for use in expressions.
- oddEven(number): returns the string "even" if number is even, otherwise "odd".
- clearList(list): iterates over a list and sets every element to null; returns immediately if the list argument is null.
- emptyFunction(): demonstrates a function with no .return (returns null).

## Source Code

  ```assembly
  .function polyFunction() { .return 0 }
  .function polyFunction(a) { .return 1 }
  .function polyFunction(a,b) { .return 2 }
  ```

```assembly
; Example: area function
.function area(width,height) {
    .return width*height
}
.var x = area(3,2)
; Usage in an assembler expression
lda #10+area(4,8)

; Returns a string telling if a number is odd or even
.function oddEven(number) {
    .if ([number&1] == 0) .return "even"
    else .return "odd"
}

; Inserts null in all elements of a list
.function clearList(list) {
    ; Return if the list is null
    .if (list==null) .return
    .for(var i=0; i<list.size(); i++) {
        list.set(i,null)
    }
}

; Empty function – always returns null
.function emptyFunction() {
}
```

## References
- "macros" — difference between .function (script functions) and .macro (assembler macros)