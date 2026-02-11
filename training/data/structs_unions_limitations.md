# ca65: .TAG and struct/union limitations

**Summary:** ca65 implements structs/unions as nested symbol tables (no type system). The assembler's .TAG keyword only allocates space and cannot initialize .TAG-declared variables; embedding a structure with .TAG does not make it reachable via the `::` operator.

## Limitations
- Structs and unions are implemented as nested symbol tables only. There is no type information retained — ca65 has no type system.
- The `.TAG` directive only allocates space for a tagged (embedded) structure or variable. It does not perform initialization of those allocations.
- You cannot initialize variables declared with `.TAG`.
- Adding an embedded structure to another structure using `.TAG` will not make the added structure accessible via the `::` operator (the nested symbol-table mechanism does not create the linkage expected by `::`).

## References
- "struct_tag_keyword" — expands on limitations of `.TAG` usage
