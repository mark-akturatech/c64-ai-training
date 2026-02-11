# ca65: .TAG keyword (reserve space for a struct/union inside another)

**Summary:** .TAG/.tag reserves space for an already defined struct or union inside another struct or when declaring a variable; members remain offsets (use + and :: to compute field addresses), and .tag allocation does not perform initialization.

## Description
.TAG (in structural declarations) and .tag (when allocating) are used to reserve actual storage for a previously defined struct or union.

- Within a .struct declaration, use ".tag TypeName" to reserve the space of an existing struct/union as a member:
  - The member is treated as an offset from the start of the enclosing struct; no automatic initialization occurs.
- When allocating a variable you use ".tag TypeName" to place the full size of that struct/union into the object layout (actual memory is reserved).
- Members of structs/unions are accessed by adding the member offset(s) to the base address of the struct variable:
  - Syntax: <variable> + Type::Member
  - For nested members: add offsets together, e.g., Variable + Outer::Inner + InnerType::field

Nested structures/unions:
- If a nested struct/union inside an enclosing struct is given a name, it becomes a new structure definition within the enclosing scope; its offsets begin at 0 (it is a distinct sub-structure).
- If the nested struct/union is anonymous, its members are merged into the enclosing scope and their offsets continue through the enclosing struct.

## Source Code
```asm
; Define a Point struct
.struct Point
    xcoord  .word
    ycoord  .word
.endstruct

; Define a Circle struct containing a Point via .tag
.struct Circle
    Origin  .tag    Point
    Radius  .byte
.endstruct

; Allocate space for a Circle variable C
C:  .tag    Circle

; Access examples (compute field address by adding member offsets)
        lda    C + Circle::Radius                    ; Load circle radius
        lda    C + Circle::Origin + Point::ycoord    ; Load circle origin.ycoord
```

## References
- "structs_and_unions_overview_and_declaration" — expands on basic struct/union definitions and member offsets
