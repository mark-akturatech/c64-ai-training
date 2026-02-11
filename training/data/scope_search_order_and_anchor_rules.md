# ca65: Scope search order and anchoring (::)

**Summary:** Describes ca65 .scope search order and explicit-scope (::) anchoring rules: the assembler searches the current scope then enclosing scopes for the first scope name; once an anchor is chosen the remaining scope chain is resolved exactly under that anchor. Scopes cannot be used forward unless anchored with a leading :: and a full scope path.

## Scope search algorithm (concise)
- When resolving an explicit scope specification (e.g. outer::inner::sym), ca65 first attempts to find the first scope name (outer) by searching:
  1. the current scope,
  2. then each enclosing scope, walking outward until the global scope.
- Once a matching scope (the anchor) is found, the assembler resolves the remaining scopes (inner, etc.) strictly inside that anchor — there is no further tree search for them.
- If the first scope name is not found in the current/enclosing scopes, and you used a leading :: (e.g. ::outer::inner::sym), the search is anchored at the global/root scope — the assembler looks for outer only in the global namespace.
- Important distinction: individual symbols may be referenced before they are defined (forward symbol references are allowed), but a scope name used without being previously defined in the search path is not considered visible (i.e., you cannot rely on a later-defined local scope unless you anchor via :: and give the full scope path).

## Behavior and caveats (explicit)
- Unanchored chain (no leading ::):
  - The assembler finds the first scope name by searching upward from the current scope. That first match becomes the anchor.
  - After that anchor is chosen, every subsequent scope name in the chain must exist exactly as a child scope of that anchor, otherwise it's an error — the assembler will not search other parts of the scope tree for later names.
- Anchored chain (leading ::):
  - A leading :: forces the first scope name to be resolved in the global/root scope. This removes the ambiguity from multiple similarly named nested scopes elsewhere.
  - Anchoring also allows referring to scopes that are defined later in the file (forward scopes), because the assembler can create/resolve the full global path.
- Practical consequence:
  - If you have identically named nested scopes in different branches of the scope tree, an unanchored chain may resolve to a different branch than you expect depending on where the reference appears.
  - Use :: to explicitly target the global branch and avoid accidental matches to nearer, unintended scopes.

## Examples

## Source Code
```asm
; Example 1: local scope is not visible when referenced earlier
.scope  foo
        bar     = 3
.endscope

.scope  outer
        lda     #foo::bar  ; Will load 3, not 2!
        .scope  foo
                bar     = 2
        .endscope
.endscope
```

```asm
; Example 2: multi-level chain — first found scope anchors the rest
.scope  foo
        .scope  outer
                .scope  inner
                        bar = 1
                .endscope
        .endscope
        .scope  another
                .scope  nested
                        lda     #outer::inner::bar      ; resolves to 1
                .endscope
        .endscope
.endscope

.scope  outer
        .scope  inner
                bar = 2
        .endscope
.endscope
```

```asm
; Example 3: anchor in global scope to pick the other branch
.scope  foo
        .scope  outer
                .scope  inner
                        bar = 1
                .endscope
        .endscope
        .scope  another
                .scope  nested
                        lda     #::outer::inner::bar    ; resolves to 2
                .endscope
        .endscope
.endscope

.scope  outer
        .scope  inner
                bar = 2
        .endscope
.endscope
```

## References
- "structs_unions_enums_and_explicit_scope_spec" — expands on explicit scope syntax (::) and namespace usage