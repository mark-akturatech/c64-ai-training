# Kick Assembler: .namespace and scope escaping

**Summary:** Describes Kick Assembler's .namespace directive and scope escaping with @ (root scope). Covers symbol placement in parent scope, field access (vic.borderColor), and that @ escapes to the root for labels, functions, macros, and pseudo-commands.

**Description**
.namespace creates a named scope whose name is also declared as a symbol in the parent (enclosing) scope. Symbols defined inside the namespace become fields of that namespace and are referenced with the namespace name as a qualifier (namespace.field).

- Declaring a namespace places the namespace identifier in the parent scope.
- Labels declared inside the namespace are accessed as fields: vic.borderColor, vic.backgroundColor0, etc.
- The @ prefix escapes the current scope and references the root scope symbol directly. This works for labels, functions, macros, and pseudo-commands.

Example behaviors:
- Inside a nested scope, an unqualified symbol name resolves to the nearest enclosing definition.
- @myLabel always refers to myLabel defined in the root (top-level) scope, regardless of inner shadowing.

**Examples**
- Namespace declaration: the namespace symbol (vic) exists in the parent scope; labels inside are accessed as vic.borderColor, etc.
- Root escape: .label myLabel defined at top level can be shadowed by an inner .label myLabel; use @myLabel to access the top-level value from inside the inner scope.
- The root-escape behavior applies equally to functions, macros, and pseudo-commands; an example in the source states this will print 'root' instead of 'mySpace' when using @, but that specific example is missing below.

## Source Code
```asm
.namespace vic {
    .label borderColor = $d020
    .label backgroundColor0 = $d021
    .label backgroundColor1 = $d022
    .label backgroundColor2 = $d023
}

; Usage: access as vic.borderColor, vic.backgroundColor0, etc.

; Escaping current scope to root example:
.label myLabel = 1
{
    .label myLabel = 2
    .print "scoped myLabel=" + myLabel   ; <-- Returns 2
    .print "root myLabel=" + @myLabel    ; <-- Returns 1
}

; Root escape with functions:
.function myFunction() { .return "root" }
.namespace mySpace {
    .function myFunction() { .return "mySpace" }
    .print @myFunction()   ; <-- Prints "root"
}

; Root escape with macros:
.macro myMacro() { .print "root" }
.namespace mySpace {
    .macro myMacro() { .print "mySpace" }
    @myMacro()   ; <-- Prints "root"
}

; Root escape with pseudo-commands:
.pseudocommand myCommand {
    .print "root"
}
.namespace mySpace {
    .pseudocommand myCommand {
        .print "mySpace"
    }
    :@myCommand   ; <-- Prints "root"
}
```

## References
- "scope_hierarchy_and_symbol_resolution" — expands on scope resolution behavior
- "filenamespace_example_files" — expands on filenamespace for file-level namespaces

## Labels
- VIC
- BORDERCOLOR
- BACKGROUNDCOLOR0
- BACKGROUNDCOLOR1
- BACKGROUNDCOLOR2
