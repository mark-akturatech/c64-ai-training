# 6502 Zero Page (Paged Memory)

**Summary:** Memory is organized as 256-byte pages; the Zero Page ($0000–$00FF) is accessed with the 6502 zero-page addressing mode which generates shorter, faster instructions and is ideal for frequently accessed tables and addresses.

## Zero Page / Paged Memory
Memory on the 6502 is viewed as a sequence of 256-byte pages. The first page, from $0000 to $00FF, is the Zero Page. The processor provides a zero-page addressing mode that encodes addresses within this page in a single byte (low byte only), resulting in smaller instruction encodings and slightly faster execution compared with absolute addressing.

Common uses:
- Frequently accessed variables (program flags, counters)
- Lookup tables and small data structures
- Pointers stored as low/high byte pairs with the low byte in zero page (for faster indirect access)

Behavioral note: zero-page addressing limits the addressable range to $00–$FF for the operand, so pointers or data placed here must live within that 256-byte page.

## Key Registers
- $0000-$00FF - Memory - Zero Page (special addressing mode: single-byte low address, shorter/faster instructions)

## References
- "stack_page" — expands on the reserved stack page ($0100–$01FF)
- "addressable_memory_and_endianness" — expands on overall memory size and byte ordering (endianness)
