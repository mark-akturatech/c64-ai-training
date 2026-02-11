# ca65: Recursive macro examples (.ifnblank, .EXITMACRO)

**Summary:** Two ca65 recursive macro patterns demonstrating parameter detection with .ifnblank/.ifblank and early termination with .EXITMACRO (written as .exitmacro in examples). Includes a small fixed-arity recursive push and a larger variadic-style macro that stops when an empty parameter is encountered.

**Recursive macro behavior**

The examples illustrate two methods for constructing recursive macros that process a list of parameters:

- **Simple recursion using .ifnblank to test the next parameter and recurse:**
  - The macro processes the first parameter (using `lda` and `pha`), then employs `.ifnblank` on the second parameter to determine whether to recurse with the remaining parameters (`r2, r3`). This approach requires checking the subsequent parameter to decide if recursion should continue.

- **Early exit using .EXITMACRO (written as .exitmacro in the code example):**
  - The macro checks the current parameter with `.ifblank`; if it is empty, it calls `.EXITMACRO` to halt expansion immediately. Otherwise, it emits code for the current parameter and recurses with the remaining parameters (`r2..r7`). This results in variadic-like behavior where the macro expands for each non-empty parameter until an empty parameter is encountered.

**Behavioral note:** In the second example, the macro is designed to process up to seven parameters; when invoked with fewer arguments, expansion stops as soon as an empty parameter is detected.

## Source Code

```asm
.macro  push    r1, r2, r3
        lda     r1
        pha
.ifnblank       r2
        push    r2, r3
.endif
.endmacro
```

```asm
.macro  push    r1, r2, r3, r4, r5, r6, r7
.ifblank        r1
        ; First parameter is empty
        .exitmacro
.else
        lda     r1
        pha
.endif
        push    r2, r3, r4, r5, r6, r7
.endmacro
```

**Example calls:**

```asm
        push    $20, $21, $32   ; Push 3 ZP locations
        push    $21             ; Push one ZP location
```

## References

- "macro_detect_parameter_types" — expands on other advanced macro examples (.MATCH usage)
- "local_symbols_in_macros" — expands on use of .LOCAL to avoid duplicate labels in recursive macro expansions