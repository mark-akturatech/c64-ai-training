# ca65: Anonymous vs Named Nested Structures — Offsets and Cautions

**Summary:** ca65 anonymous nested structs inject their members into the enclosing structure (no extra offset), while named nested structs require adding the nested-structure offset when computing member addresses (e.g. O + Object::Point::ycoord vs O + Object::target + Object::Point::ycoord). Watch for redundant/overlapping offsets when using anonymous structs.

## Details
- Anonymous nested structures do not add a new level of offset: their members are appended directly to the enclosing structure's layout. Therefore referring to an anonymous member uses only the enclosing-structure member offset.
- Named nested structures introduce a separate offset equal to the nested structure's start within the enclosing structure. When accessing a member of a named nested struct you must include that nested-structure's offset in the effective address.
- Common mistake: omitting the named nested-structure offset. Example shown in Source Code demonstrates an incorrect and a correct addressing form.
- Overlapping/redundant offsets: an anonymous nested structure can create members that occupy the same offset as an earlier member (e.g. "cost" being redundantly the same offset as "price") — this is expected behavior for anonymous nesting and must be accounted for in layout planning.

## Source Code
```asm
; Be careful not to use a named nested structure without also adding the
; offset to the nested structure itself.
lda    O + Object::Point::ycoord                   ; Incorrect!
lda    O + Object::target + Object::Point::ycoord  ; Correct
; In this example, the first nested structure is named "Point", and its member offsets begin at 0.
; On the other hand, the two anonymous structures simply continue to add members to the enclosing "Object" structure.
; Note that an anonymous structure does not need a member name, since all of its members become part of the enclosing structure.
; The "cost" member in the example is redundantly the same offset as its first member "price".
```

## References
- "nested_structs_anonymous_named_examples" — expanded examples showing anonymous vs named nested structs