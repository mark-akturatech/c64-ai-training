# Block Data Storage: Row-Major Layout for Multidirectional Scrolling (Cadaver)

**Summary:** Describes Cadaver's block storage format for multidirectional scrolling: each block is stored row-by-row (row-major order) so a 4x4 block ABCD / EFGH / IJKL / MNOP is laid out in memory as ABCDEFGHIJKLMNOP; useful for fast horizontal/vertical access and map precomputation.

## Row-major block storage
Each block is encoded by writing its horizontal rows sequentially into memory (row-major order). A block drawn as:

ABCD
EFGH
IJKL
MNOP

is stored in consecutive memory as the byte/string sequence:
ABCDEFGHIJKLMNOP

This layout means the memory index for a tile at coordinates (x, y) inside a block of width W can be computed as (index = y * W + x) — (row-major indexing).

The same approach is applied to every block in the tileset: blocks are contiguous in memory with their rows in order. This storage pattern simplifies reading entire rows (contiguous reads) and supports precomputed map-row techniques (see referenced chunk).

## References
- "map_row_storage_and_precalculation" — expands on similar storage approach for map rows and precomputed row operations
