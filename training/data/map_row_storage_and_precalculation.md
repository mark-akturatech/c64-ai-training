# Multidirectional Scrolling — Map data layout (Cadaver)

**Summary:** Map data is stored as horizontal rows (top-to-bottom) of 8-bit block numbers; a map header holds the row length in blocks, and the starting address of each map row and each block is precalculated into low/high tables (maptbllo/hi and blktbllo/hi) to avoid runtime multiplications. Searchable terms: map header, maptbllo/hi, blktbllo/hi, 8-bit blocks, precalc row addresses, multidirectional scrolling.

## Map memory layout
- Map is organized as consecutive horizontal rows. Each row holds N block numbers (one byte each) and rows are stored sequentially from the top row to the bottom row.
- A map header precedes the map data and contains, at minimum, the row length in blocks (the number of block entries per row). This row length is required to interpret the linear row data as 2D.
- Block entries are 8-bit values (0–255). This design limits the number of distinct block types to 256 unless a multi-level block scheme is introduced (not used here).

## Addressing and why precalculated tables are used
- To index into map data you need the starting address of a given row and then an offset inside that row. Computing row_start = map_base + (row_index * row_length) requires multiplication by row_length at runtime.
- On 6502/C64 systems where integer multiplication is expensive, Cadaver avoids runtime multiplication by precalculating and storing the starting address of each map row in a pair of low/high byte tables (referred to here as `maptbllo` and `maptblli` / `maptbllo`/`maptbhi`).
- Similarly, the starting address of each block’s data is precalculated and stored in `blktbllo`/`blktblli` (low/high) tables so block lookups require only table indirection and 16-bit address assembly, not multiplication.
- Typical access sequence (conceptual):
  1. Read row start low/high from `maptbllo`/`maptbhi` using row_index.
  2. Compute within-row offset (a small addition) to get the byte address of the desired block number.
  3. Read block number (8-bit).
  4. Read block start low/high from `blktbllo`/`blktblli` using block number.
  5. Use block start address to fetch block graphic/tile data.

## Block model and limitations
- Blocks are the unit referenced in the map rows; each block may point to tile/character data located elsewhere in memory.
- Because block numbers are stored as single bytes, there are up to 256 unique blocks.
- Cadaver notes no multi-level block indirection is used (blocks built from smaller blocks); multi-level schemes allow larger virtual maps but add indirection and bookkeeping.

## Practical implications (concise)
- Precalculated row- and block-start tables trade memory for CPU time: they consume 2 bytes per row and 2 bytes per block (low/high) but remove the need for multiplications during scrolling updates.
- Row length must be stored (map header) and must match the layout used when the maptbl entries were generated.
- Any change to row length or block layout requires regenerating the corresponding address tables.

## References
- "map_data_block_data_overview" — expands on concept of 8-bit block numbers and block data layout  
- "block_size_choice_and_character_codes" — discusses how block size choice affects indexing and addressing

## Labels
- MAPTBLLO
- MAPTBLHI
- BLKTBLLO
- BLKTBLHI
