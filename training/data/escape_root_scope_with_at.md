# Kick Assembler: '@' root-scope escape

**Summary:** Shows Kick Assembler's '@' prefix to escape the current scope and reference the root (top-level) symbol, with examples using .label and a library file (.filenamespace, #import/#importonce). Searchable terms: @myLabel, .label, .filenamespace, #import, #importonce, .print.

## Escaping the current scope with '@'
In Kick Assembler the '@' prefix forces symbol lookup in the root (top-level) scope, bypassing the current/local scope. Use this when a nested scope or redefinition shadows a root symbol and you need the original value.

Example behavior:
- Define a symbol in the root scope with `.label myLabel = 1`.
- Inside a nested scope re-declare `.label myLabel = 2`.
- `myLabel` resolves to the inner (scoped) value (2).
- `@myLabel` resolves to the root (top-level) value (1).

Note: `.filenamespace` creates a file-level namespace for library symbols (separate symbol namespace). The example below also shows an imported library file; the root-scope escape operator is the same `@` prefix (root scope = top-level symbol namespace).

## Source Code
```asm
; Example: escaping current scope to reference root scope
.label myLabel = 1
{
    .label myLabel = 2
    .print "scoped myLabel="+ myLabel    ; (.-> 2)
    .print "root myLabel="+ @myLabel    ; (.-> 1)
}

; Example top-level file using a library
#import "mylib.lib"
.print myFunction()
MyMacro()
MyPseudoCommand

; File: mylib.lib
#importonce
.filenamespace MyLibrary
```

## References
- "scope_hierarchy_and_symbol_resolution" — expands on scope resolution and escaping (symbol lookup rules)
