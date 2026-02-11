# Kick Assembler: escaping namespace scope with @

**Summary:** Demonstrates the use of the `@` prefix in Kick Assembler to call root-scope functions, macros, and pseudocommands from within a `.namespace` when a same-named symbol exists in the namespace. For example, `.print @myFunction()` calls the root-level `myFunction()` even if a namespaced version exists. Terms: Kick Assembler, `.namespace`, `@` (escape-to-root), `.function`, `.macro`, pseudocommand.

**Description**

In Kick Assembler, the `@` prefix allows invocation of symbols from the root (global) scope, bypassing any same-named symbols defined within the current `.namespace`. This functionality applies to functions, macros, and pseudocommands. By prefixing the identifier with `@`, you can ensure that the root-level definition is called, avoiding namespace shadowing.

Example behavior:

- If a root-scope `.function myFunction()` returns `"root"` and a namespaced `.function myFunction()` returns `"mySpace"`, then inside `.namespace mySpace { .print @myFunction() }` prints `"root"` because `@` forces the root-scope function to be called.
- The same `@` prefix can be applied to `.macro` and pseudocommand names to call their root-scope definitions.

## Source Code

```asm
; Example 1: Root vs. namespaced function
.function myFunction() {
    .return "root"
}
.namespace mySpace {
    .function myFunction() {
        .return "mySpace"
    }
    .print @myFunction()    ; prints 'root'
}

; Example 2: Root-scope macros and pseudocommands
.macro myMacro() {
    .print "Macro Called"
}
.pseudocommand myPseudoCommand {
    .print "PseudoCommand Called"
}

.namespace mySpace {
    .macro myMacro() {
        .print "Namespaced Macro Called"
    }
    .pseudocommand myPseudoCommand {
        .print "Namespaced PseudoCommand Called"
    }

    ; Invoking root-scope macro and pseudocommand using @
    @myMacro()              ; prints 'Macro Called'
    @myPseudoCommand        ; prints 'PseudoCommand Called'
}
```

## References

- [Kick Assembler Manual: Scoping hierarchy](https://www.theweb.dk/KickAssembler/webhelp/content/ch09s03.html)
- [Kick Assembler Manual: Pseudo Commands](https://theweb.dk/KickAssembler/webhelp/content/ch07s03.html)
- [Kick Assembler Manual: Macros](https://theweb.dk/KickAssembler/webhelp/content/ch07s02.html)