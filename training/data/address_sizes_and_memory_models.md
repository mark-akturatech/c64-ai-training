# ca65 — Address sizes and memory models

**Summary:** ca65 assigns address sizes (ZEROPAGE/DIRECT/ZP 8-bit, ABSOLUTE/ABS/NEAR 16-bit, FAR 24-bit, LONG/DWORD 32-bit) to segments and symbols; use the keywords DIRECT/ZP, ABS/NEAR, FAR, LONG/DWORD or the symbol prefixes z:, a:, f: to override defaults. Labels inherit the address size of their declaring segment.

## Address sizes
ca65 uses four discrete address-size/value-range types:
- Zeropage / Direct (8 bit)
- Absolute (16 bit)
- Far (24 bit)
- Long / DWORD (32 bit)

These address sizes are assigned to each segment and to each symbol even if the symbol is not used as an address (i.e., the assembler treats symbols as having a value range).

Override keywords:
- DIRECT, ZEROPAGE, ZP — zeropage (8 bits)
- ABSOLUTE, ABS, NEAR — absolute (16 bits)
- FAR — far (24 bits)
- LONG, DWORD — long (32 bits)

Typically the assembler's segment defaults are sufficient and overrides are rarely necessary.

## Address sizes of segments
Each segment has an address size. A symbol defined within a segment is represented as "segment start + offset", so labels declared in a segment inherit that segment's address size. The segment address size can be changed with an address-size modifier on the .SEGMENT/.segment directive (see segment_directive).

## Address sizes of symbols
You can override a symbol's address size with a single-letter prefix placed before the symbol name:
- z: — force zeropage (8 bit)
- a: — force absolute (16 bit)
- f: — force far (24 bit)

Use cases:
- z: ensures the assembler emits optimal zeropage instructions or resolves cases where the size isn't known yet due to single-pass assembly.
- a:, f:, LONG/DWORD keywords can promote a smaller value to absolute or far addressing instead of allowing the assembler to automatically fit it to a smaller addressing type.

## References
- "scopes_generic_and_nested_scopes" — expands on when symbol addressing matters for lookups  
- "segment_directive" — details .SEGMENT/.segment and how to assign a segment's address size