# ca65: .STRUCT and .UNION (overview and declaration examples)

**Summary:** .STRUCT and .UNION define scoped storage layouts in ca65; named members yield constant offsets and have sizes accessible via .SIZEOF; unions overlay members at offset 0 and have size equal to the largest member; anonymous structs/unions inject members into the current scope. Examples use .word and .addr and show nesting and storage allocators.

## Structs and unions Overview
Structs and unions are special forms of scopes (similar to C). Each contains a list of members; each member allocates storage and may be named.

- Named members have a constant value equal to their storage offset from the structure start.
- For unions, all members share the same offset (typically 0).
- Each named member has a storage size accessible with the .SIZEOF operator.
- The struct/union itself has a .SIZEOF indicating total allocated size.
- Storage allocators may contain a multiplier (see "struct_storage_allocators").
- Anonymous structs/unions do not open a local scope; their member identifiers are placed into the current scope.

## Declaration and examples
- .struct ... .endstruct declares a structure; members allocate storage sequentially.
- .union ... .endunion declares a union; members overlap and the union size equals its largest member.
- Members can be nested structs/unions; nesting contributes to the outer .SIZEOF.
- Member declarations may use allocators like .word and .addr (details in allocator docs).

Example outcomes:
- A struct with two .word members has total size 4 bytes (.SIZEOF = 4).
- A union with .word and .addr members has size equal to whichever member is larger.
- In the nested example below (Circle contains Point which allocates two words, plus Radius .word) the Circle .SIZEOF is 6 bytes (three words).

## Source Code
```asm
; Simple struct with two word members (total size 4 bytes)
.struct Point
    xcoord  .word
    ycoord  .word
.endstruct

; Union: members share same offset (0); size is largest member
.union Entry
    index   .word
    ptr     .addr
.endunion

; Nested structs: inner anonymous struct allocates two words,
; outer struct then adds Radius .word -> total 3 words (6 bytes)
.struct Circle
    .struct Point
        .word   2         ; Allocate two words
    .endstruct
    Radius  .word
.endstruct
```

## References
- "struct_storage_allocators" — expands on storage allocator keywords used inside struct/union member declarations  
- "struct_tag_keyword" — expands on reserving space for structs via .TAG
