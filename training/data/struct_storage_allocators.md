# ca65 Users Guide — Storage allocator keywords (struct/union members)

**Summary:** Lists ca65 storage-allocation keywords used inside .STRUCT/.UNION definitions: .BYTE, .RES, .DBYT, .WORD, .ADDR, .FARADDR, .DWORD, .TAG, .STRUCT, .UNION. Describes size units (1/2/3/4 bytes), .RES operand requirement, .TAG behavior, and nested .STRUCT/.UNION offset rules.

## Storage allocator keywords
- .BYTE, .RES  
  - Allocates multiples of 1 byte.  
  - .RES requires an operand (explicit size).

- .DBYT, .WORD, .ADDR  
  - Allocate multiples of 2 bytes.

- .FARADDR  
  - Allocates multiples of 3 bytes.

- .DWORD  
  - Allocates multiples of 4 bytes.

- .TAG  
  - Allocates storage corresponding to a previously defined struct (i.e., allocates the size/layout of that struct).

- .STRUCT, .UNION  
  - Begin a nested .STRUCT or .UNION definition and allocate it.  
  - Member offset values inside the nested structure start at 0.  
  - If the nested structure is anonymous, its members become members of the enclosing scope instead of remaining nested.

## References
- "structs_and_unions_overview_and_declaration" — expands on examples of using these allocators inside .STRUCT/.UNION