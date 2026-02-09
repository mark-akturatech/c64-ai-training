# Bubble-sort Sprite Y-sorting (Cadaver / Lasse Oorni)

**Summary:** Bubble-sort (O(N^2)) approach for sprite Y-sorting used in Commodore 64 sprite multiplexing; requires carrying an index array so sprite properties remain associated with Y values, and has no clear cheap rejection point for >8 sprites-on-a-row.

## Bubble-sort (O(N^2)) description
The algorithm sorts sprite Y-coordinates by repeatedly swapping out-of-order entries until the list is ordered ascending by Y. Because sprites must keep their associated properties (X, pattern, color, pointers), an index array must travel with each Y entry so the sprite identity is preserved.

Performance: worst-case O(N^2) time — fast for small N, becomes expensive as the number of sprites grows.

Drawbacks:
- Slow for larger numbers of sprites (quadratic scaling).
- No obvious cheap point to reject more-than-8-sprites-on-a-row: removing a sprite from the sorted array requires moving memory blocks (slow).
- Alternative implementation (index-only) removes Y swaps but makes each Y compare reference the unsorted table via the index table, slowing compares.

Use cases: simple and straightforward for small sprite counts or when CPU time is available; not ideal for high-sprite or real-time-critical multiplexing.

## Source Code
```text
; Initialize arrays for sorting
for (sprite=0; sprite < maximum_sprites; sprite++)
{
  sortspry[sprite] = spry[sprite];
  sortorder[sprite] = sprite;
}

; Do the actual sorting (simple bubble/insertion style with nested loops)
for (outer = 0; outer < maximum_sprites-1; outer++)
{
  for (inner = outer+1; inner < maximum_sprites; inner++)
  {
    if (sortspry[inner] < sortspry[outer])
    {
      swap(sortspry[inner], sortspry[outer]);
      swap(sortorder[inner], sortorder[outer]);
    }
  }
}

; Note: Alternative approach mentioned — do not copy Y table; keep unsorted table and only swap/operate on the index table.
```

## Key Registers
- (none) — this chunk documents an algorithm and does not reference specific C64 hardware register addresses.

## References
- "find_next_lowest_y_sort" — expands on another O(N^2) approach with a clear rejection point for >8 sprites on a row
- "continuous_insertion_sort_ocean_algorithm" — describes a faster practical alternative used in commercial games