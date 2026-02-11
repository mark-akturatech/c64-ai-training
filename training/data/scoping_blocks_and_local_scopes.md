# Kick Assembler — Scoping with {..} (local scopes, nested scopes, shadowing)

**Summary:** Describes Kick Assembler's user-defined local scopes using braces {..}; explains that variables (.var) and labels declared inside a scope are local (not visible outside), scopes may be nested arbitrarily, and inner scopes can shadow outer names.

## Scoping rules
- A pair of braces { .. } creates a local scope. Everything declared between the braces (labels, .var declarations, etc.) is local to that scope and is not visible outside it.
- Labels and variables declared inside a scope do not collide with identical names in other scopes; each scope has its own namespace.
- Scopes are lexically nested: an inner scope can read names from outer scopes unless the inner scope redeclares (shadows) the same name.
- You may nest scopes to any depth. Inner scopes inherit outer bindings until they declare a local name that shadows an outer binding.
- Common use: wrap function bodies or helper labels/variables in a scope to avoid global name collisions.

## Source Code
```asm
; Example: two functions with identical local names that do not collide
Function1: {
    .var length = 10
    ldx #0
    lda #0
loop:
    sta table1,x
    inx
    cpx #length
    bne loop
}

Function2: {
    .var length = 20 // doesn’t collide with the previous ‘length’

    ; (line number "15" in original source appears to be stray — omitted)
loop:
    ldx #0
    lda #0
    sta table2,x
    inx
    cpx #length
    bne loop

    ; the label doesn’t collide with the previous ‘loop’
}
```

```asm
; Nested-scope example demonstrating shadowing and lexical lookup
.var x = 10
{
    .var x = 20
    {
        .print "X in 2nd level scope read from 3rd level scope is " + x
        .var x = 30
        .print "X in 3rd level scope is " + x
    }
    .print "X in 2nd level scope is " + x
}
.print "X in first level scope is " + x
```

```text
; Expected output from the nested-scope example:
X in 2nd level scope read from 3rd level scope is 20.0
X in 3rd level scope is 30.0
X in 2nd level scope is 20.0
X in first level scope is 10.0
```

## References
- "scopes_and_namespaces_scopes" — detailed scope & namespace resolution rules (Chapter 9)
