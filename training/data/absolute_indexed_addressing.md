# Absolute, indexed addressing (absolute,X and absolute,Y)

**Summary:** Absolute,X and Absolute,Y add the X or Y index register to a 16-bit absolute address to form the effective address (base + X/Y). This mode provides access to a 256-byte range, is for data instructions (loads/stores), and does not apply to branches/jumps or to CPX/CPY/STX/STY/BIT.

## Absolute, indexed addressing
Absolute, indexed addressing takes a full 16-bit absolute address supplied by the instruction and adds the contents of X or Y (0–255) to produce the effective address:
- Effective address = base address + X (for ,X) or base address + Y (for ,Y).
- The index value is always non‑negative; indexing only increases the address (no negative indexing).
- The mode can reach up to 256 consecutive locations starting at the base address (index range 0–255).
- This addressing form is available only for data-handling instructions (loads, stores, etc.). It is not available for branches or jumps.
- Some instructions allow either X or Y as the index; some instructions are limited to one index register. The compare/store instructions CPX, CPY, STX, and STY, and the BIT instruction, do not support absolute, indexed addressing.
- Wrap-around (effective address appearing in low memory) only occurs if the summed address crosses the top of memory: for example, if the base address is above $FF00 then a large index value can cause the effective address to wrap into the $0000 region.

## References
- "zero_page_indexed_addressing" — contrast with zero-page indexed addressing and its wrap-within-page behavior