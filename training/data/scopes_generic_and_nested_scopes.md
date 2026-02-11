# ca65 Scopes: global, cheap locals, nested scopes, lookup and address-size overrides

**Summary:** Explains ca65 scope types (.SCOPE/.ENDSCOPE, global, cheap locals), symbol lookup rules (local first, then upward), and the address-size override technique (example uses a: to force absolute addressing) to avoid "Range error" when an inner scope redefines a symbol with a larger address size.

## Overview
ca65 supports several scope kinds:

- Global scope  
  - All non-cheap-local symbols declared outside any nested scopes belong to global scope.

- Cheap locals  
  - A special, short-lived scope that "lasts from one non-local symbol to the next one" automatically; the programmer does not explicitly open/close it. Cheap locals are intended for very local temporary symbols.

- Generic nested scopes (.SCOPE / .ENDSCOPE)  
  - Open with .SCOPE and close with .ENDSCOPE. Scopes may be named; named scopes are addressable from outside using explicit scope qualifiers. Unnamed scopes make symbols local and inaccessible from outside.
  - A nested scope may reference symbols from its own or any enclosing scope without explicit scope qualifiers.

## Lookup rules and common pitfall
- When the assembler sees a symbol reference, it resolves the symbol by searching first in the current (local) scope, then upward through enclosing scopes until a definition is found.  
- The assembler uses the address-size (zeropage vs absolute) of the symbol it finds at translation time to choose the instruction addressing mode.  
- If a symbol is later redefined in an inner scope with an address requiring a different addressing mode (e.g., previously resolved as zeropage, later redefined as absolute), the assembler will attempt to change the already-translated instruction to the new addressing mode. If that change is impossible, a "Range error" is raised.

Practical consequence:
- Define symbols before use where possible. If that is not possible, use an address-size override to force the assembler to choose the desired addressing mode at translation time so later redefinitions cannot cause range errors.

## Address-size override operators
- ca65 provides address-size override prefixes (see the dedicated "address_size_overrides" reference).  
- The example below uses the prefix a: to force absolute addressing at translation time; doing this prevents a later redefinition from causing a range error because the instruction was already encoded as absolute.

## Source Code
```asm
; Example 1: inner redefinition overrides lookup -> lda loads value 3
.scope  outer
        foo     = 2
        .scope  inner
                lda     #foo
                foo     = 3
        .endscope
.endscope
```

```asm
; Example 2: inner redefinition is smaller (zeropage) but outer had absolute
; Here lda will load from $12,x; assembler treats foo as zeropage when translating
.scope  outer
        foo     = $1234
        .scope  inner
                lda     foo,x
                foo     = $12
        .endscope
.endscope
```

```asm
; Example 3: lookup finds zeropage in outer, later inner redefinition is absolute
; Assembler initially encodes zeropage mode; when foo is redefined to absolute,
; assembler cannot convert the already-translated instruction -> Range error
.scope  outer
        foo     = $12
        .scope  inner
                lda     foo,x
                foo     = $1234
        .endscope
.endscope
```

```asm
; Solution: force absolute addressing at translation time with a:
.scope  outer
        foo     = $12
        .scope  inner
                lda     a:foo,x
                foo     = $1234
        .endscope
.endscope
; Using a: forces absolute mode for the lda, avoiding a later range error.
```

## References
- "scopes_procedures_and_enclosing" — expands on procedures (.PROC) as named scopes  
- "address_size_overrides" — expands on forcing addressing mode with prefixes (e.g., a:)
