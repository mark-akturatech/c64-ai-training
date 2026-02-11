# ca65: .PROC (Nested procedures)

**Summary:** .PROC creates a named nested procedure (ca65 assembler) that introduces a symbol in the enclosing scope and is equivalent to emitting a label plus a .SCOPE with the same name; contrasts with unnamed .SCOPE. Searchable terms: .PROC, .SCOPE, nested procedure, label, symbol, enclosing scope.

## Nested procedures
.proc creates a named nested lexical level and adds a symbol with that name into the enclosing scope. Semantically, a .PROC block is equivalent to emitting a label of the same name and opening a .SCOPE with that name. Unlike .SCOPE, .PROC requires a name because it must create the symbol in the enclosing scope.

Key points:
- .PROC <name> ... .ENDPROC == <name>: .SCOPE <name> ... .ENDSCOPE
- Use .SCOPE when you need a scope without introducing a symbol (unnamed scope).
- Scopes and symbols live in different namespaces: a symbol and a scope can share the same name without conflict (see "Scope search order" for lookup rules).

## Source Code
```asm
        .proc   foo
                ...
        .endproc
```

Equivalent form:
```asm
        foo:
        .scope  foo
                ...
        .endscope
```

## References
- "scopes_generic_and_nested_scopes" — expands on generic scopes and scoping rules