# Kick Assembler — Chapter 9.1: Scopes (containers for symbols)

**Summary:** Scopes are containers for symbols (variables, constants, labels). Kick Assembler creates automatic scopes when you execute a macro and lets you define manual scopes with braces `{ }`; symbols in an inner scope do not collide with identical names in outer scopes.

## Scopes
Scopes are containers of symbols (variables, constants and labels). There can only be one symbol of a given name inside a single scope. Scopes prevent name collisions by isolating symbols; an inner scope may define a symbol with the same name as an outer scope without overwriting it.

- Automatic scopes: A new scope is automatically created in several situations (for example, when you execute a macro). This prevents internal labels or symbols defined inside the macro from colliding if the macro is executed multiple times.
- Manual scopes: You can explicitly create a scope with braces `{ ... }`. Symbols declared inside the braces are local to that scope.
- Resolution: When the assembler resolves a symbol it checks the current (innermost) scope first, then outer scopes (parent scopes), then global scope. (short parenthetical clarification)

Example behavior: .var x in an inner scope hides .var x in an outer scope; the outer symbol remains unchanged and accessible outside the inner scope.

## Source Code
```asm
.var x = 1
{
    .var x = 2
}
// <- this x won't collide with the previous
```

Also from source text (descriptive statement):
"A scope is set up when you execute a macro. This prevent the internal labels to collide if you execute the macro twice."

## References
- "scopes_and_namespaces_namespaces" — expands on namespaces for functions/macros/pseudocommands
- "labels_argument_labels_and_multi_labels" — expands on labels interplay with scopes
