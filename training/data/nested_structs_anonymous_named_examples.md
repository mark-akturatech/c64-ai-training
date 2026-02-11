# ca65: nested .struct scopes (named vs anonymous)

**Summary:** ca65 .struct nesting rules: named nested structures create a new zero-based scope (use the nested struct name with ::), while anonymous nested structures fold their members into the enclosing scope and continue offsets. Example shows offsets, tagging (.tag), and correct addressing using the :: operator.

## Explanation
- Outer .struct members are assigned sequential offsets from 0.
- Named nested struct (".struct Name") creates a separate scope whose members start at offset 0. The enclosing field holds the nested struct as a single member (an offset into the outer struct). To address a named nested member you add the outer tag plus the outer field offset and the nested-scope member offset (e.g., O + Object::target + Object::Point::ycoord).
- Anonymous nested struct (".struct" with no struct name) does not create a new scope; its members are added directly into the enclosing struct and offsets continue from the enclosing struct's current offset (they are referenced as Object::member).
- A label immediately before .struct (e.g., "cost .struct") creates an outer-field at that offset; if the .struct that follows is anonymous (no name given) its members are promoted into the outer scope (Object::price, Object::tax).

Offsets from the example (relative to the struct base):
- Object::id = 0
- Object::target = 1 (this field is a named nested struct "Point"; Point's members start at 0)
  - Object::Point::xcoord = 0 (within Point)
  - Object::Point::ycoord = 2 (within Point)
- Object::price = 5 (from an anonymous struct following the "cost" label)
- Object::tax = 7
- Object::radius = 9 (from a final anonymous .struct with one member)

Correct addressing examples shown:
- lda O + Object::target + Object::Point::ycoord  ; access named nested struct member
- lda O + Object::tax                             ; access anonymous struct member folded into Object
- lda O + Object::radius                          ; access anonymous struct member

(Incorrect usage — treat named nested members as if they belonged to the enclosing scope — will not reference the correct offset and is therefore wrong.)

## Source Code
```asm
      .struct Object
              id .byte                ; Object::id = 0
              target .struct Point    ; Object::target = 1
                      xcoord  .word   ; Object::Point::xcoord = 0
                      ycoord  .word   ; Object::Point::ycoord = 2
              .endstruct
               cost .struct           ; Object::cost = 5
                      price  .word    ; Object::price = 5
                      tax  .word      ; Object::tax = 7
              .endstruct
              .struct
                      radius  .word   ; Object::radius = 9
              .endstruct
      .endstruct

O:    .tag   Object
      lda    O + Object::target + Object::Point::ycoord  ; Named struct
      lda    O + Object::tax                             ; Anonymous
      lda    O + Object::radius                          ; Anonymous
```

## References
- "struct_tag_keyword" — expands on accessing nested members and use of :: operator