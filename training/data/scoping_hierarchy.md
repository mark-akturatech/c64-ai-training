# Kick Assembler — Scoping and Namespace Hierarchy

**Summary:** Describes Kick Assembler scoping and namespace hierarchy (System namespace, Root namespace, user namespaces, bracket/user scopes), and the symbol-resolution algorithm (lookup in current scope then walk parent scopes/namespaces). Includes an assembly example showing nested bracket scopes and how labels are resolved.

## Scoping hierarchy
Namespaces and scopes form a strict hierarchy. Every namespace (and every scope) has a parent except the System namespace, which contains Kick Assembler built-ins (mnemonics, constants, functions, macros, pseudocommands). The Root namespace/scope is the child of the System namespace and is the top-level namespace/scope for user source.

Typical hierarchy (top to bottom):
1. System namespace & scope — contains assembler built-ins.
2. Root namespace & scope — top-level user code.
3. User-defined namespaces & scopes — created by namespace directives.
4. User-defined scopes — created by macros, functions, for-loops, bracket blocks ({ ... }).
5. Nested user scopes — arbitrarily deep.

Namespaces mirror scopes for resolution: an entity not found in the current namespace is searched for in the parent namespace, and so on up to the System namespace.

## Symbol resolution algorithm
When resolving an identifier (label, constant, macro, function name, etc.) Kick Assembler:
- Checks the current scope first.
- If not found, checks the parent scope.
- Repeats walking up parent scopes until the symbol is found or the Root/System scope is reached.
- Namespace resolution follows the same parent-walking mechanism as scope resolution.

Practical consequence: identically named symbols are permitted in different nested scopes; the innermost (closest) definition is used for unqualified references. If no user namespace is defined, namespace lookup reduces to Root ← System.

## Example (nested bracket scopes and label resolution)
The following assembly demonstrates nested bracket scopes and label resolution. The code defines three label instances named "loop" in different nested scopes and a "start" label in the root scope. The jmp/bne instructions resolve according to the innermost available definition when assembled.

## Source Code
```asm
* = $1000
start:
loop:   ; <-- 'loop' defined in the root scope
{
    ; <-- bracket scope 1
    loop:
    {   ; <-- bracket scope 2
        ldx #0
    loop:   stx $d020
        inx
        bne loop
        jmp start
    }
}
```

Notes from the example:
- The scope chain created is: System scope <- Root scope <- BracketScope1 <- BracketScope2.
- The "jmp loop" (if present in BracketScope2) resolves to the "loop" label defined inside BracketScope2.
- The "start" label is not defined in BracketScope2 or BracketScope1, so it resolves to the label in the Root scope.
- No namespaces were declared in the example, so the namespace chain is System namespace <- Root namespace.

## References
- "scopes_and_namespaces_namespaces" — expands on namespace resolution parallels to scope resolution  
- "labels_argument_labels_and_multi_labels" — examples of label resolution across nested scopes