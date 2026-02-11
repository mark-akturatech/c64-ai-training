# ca65: Structs, unions, enums and explicit scope specification

**Summary:** ca65: named structs/unions/enums open nested scopes (like .SCOPE); unnamed declarations add members to the enclosing scope. Use the namespace token (::) for explicit scope access and a leading :: to refer to the global scope.

## Structs, unions and enums
If a struct, union, or enum is declared with a name, it opens a nested scope (behaviorally similar to .SCOPE). If no name is specified, no new scope is opened and symbols declared within the struct/union/enum are added to the enclosing scope instead.

## Explicit scope specification
Accessing symbols from other scopes requires the target scope to have a name. Use the namespace token (::) to qualify symbols in named scopes (example: foo::bar). Preceding a symbol with :: forces lookup in the global scope.

The only way to deny access to a scope from the outside is to declare a scope without a name (using the .SCOPE command).

## Source Code
```asm
        .scope  foo
        bar:    .word   0
        .endscope

                ...
                lda     #foo::bar        ; Access bar in scope foo
```

```asm
        bar     = 3

        .scope  foo
                bar     = 2
                lda     #::bar  ; Access the global bar (which is 3)
        .endscope
```

## References
- "scopes_generic_and_nested_scopes" — expands on scope naming and lookup