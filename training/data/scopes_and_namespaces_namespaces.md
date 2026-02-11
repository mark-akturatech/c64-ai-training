# Kick Assembler — Namespaces (Section 9.2)

**Summary:** Namespaces are containers for functions, macros, and pseudocommands (.namespace, .filenamespace); each namespace creates its own scope so symbols (labels, functions, macros) inside do not collide with identically named symbols in other namespaces. Use getNamespace() to query the current namespace.

**Namespaces — behavior and rules**
- **Purpose:** Namespaces group related functions, macros, and pseudocommands and provide an associated scope for isolated symbol visibility.
- **Scope:** Each .namespace declaration establishes (or re-enters) a scope automatically. Symbols defined inside a namespace live in that namespace's scope and do not collide with identical names in other namespaces or the global scope.
- **Unique-definition rule:** You cannot define the same function, macro, or pseudocommand more than once inside the same namespace; attempting to redefine an already-defined entity in the same namespace produces an error.
- **Re-opening a namespace:** Declaring the same .namespace name again continues the existing namespace (adds to it) rather than creating a new, separate namespace. This lets you split namespace contents across file regions.
- **Labels:** Labels declared inside a namespace do not collide with labels of the same name outside the namespace (they are scoped).
- **File-level convenience:** The .filenamespace directive (covered elsewhere) is often more convenient when you want the contents of an entire file placed in a namespace.
- **Querying:** getNamespace() returns the name of the current namespace (string).

(Example cases are included in the Source Code section below.)

## Source Code
```asm
; Simple namespace declarations and scope isolation
.function myFunction() { .return 1 }
label1:

.namespace mySpace {
    .function myFunction() { .return 1 }  // <- This won't collide with global myFunction
    label1:                               // <- This label won't collide with global label1
}

; Re-opening a namespace continues it; redefining an already-defined entity is an error
.namespace repeatedSpace {
    endless: jmp *
    .function myFunc() { .return 1 }
}

.namespace repeatedSpace {   ; re-enter same namespace — allowed, contents continue
    jmp endless
    .function myFunc() { .return 2 }  ; <-- This will give an error: myFunc is already defined
}

; Querying current namespace
.print "Namespace = " + getNamespace()
.namespace MySpace {
    .print "Namespace = " + getNamespace()
    .namespace MySubSpace {
        .print "Namespace = " + getNamespace()
    }
}
```

## References
- "scopes_and_namespaces_scopes" — expands on how namespaces are tied to scope hierarchy
- "namespace_directives_and_filenamespace" — expands on .filenamespace usage to place file content in a namespace
