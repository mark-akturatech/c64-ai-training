# Multidirectional Scrolling Techniques (Cadaver)

**Summary:** Track the screen top-left edge in block-coordinates and the X/Y position within a block to determine which map blocks/columns/rows must be drawn on the newly revealed screen edges during multidirectional scrolling. Includes examples showing how blocks line up before/after a left scroll and how within-block offsets change the result.

## Drawing new data on the sides
When the visible screen is shifted (panned) you must fill the newly exposed side(s) with map data. Practically this requires two tracked values:
- the screen top-left edge expressed in block-coordinates (how many blocks from the map origin), and
- the position inside the current top-left block (X and Y offsets within that block).

From those two values you can compute which whole blocks, partial blocks, columns or rows must be fetched/drawn on each side depending on scroll direction. For example, when scrolling left the visible contents shift left and new data must be drawn at the right edge; which block(s) appear there depends both on the block index (which column of blocks is now visible) and the within-block X offset (how characters/tiles of a block are split across the screen boundary).

There is no shortcut: for each scroll direction you must reason which block-columns/rows intersect the newly visible strip and draw them (or parts of them) appropriately. Once you have a working routine for one direction (left), adapting for the other directions is straightforward but must also account for Y within-block offsets when scrolling vertically or diagonally.

The complexity increases with multidirectional scrolling because X and Y within-block offsets interact: a horizontal scroll may expose columns whose vertical alignment differs depending on Y offset inside blocks, and likewise for vertical scrolls exposing rows that depend on X offsets.

## Source Code
```text
Example 1 (three block types: lengths 1,2,3 characters)

Before:
111122223333111122223333111122223333
111122223333111122223333111122223333
111122223333111122223333111122223333
111122223333111122223333111122223333
222233331111222233331111222233331111
222233331111222233331111222233331111
222233331111222233331111222233331111
222233331111222233331111222233331111
333311112222333311112222333311112222
333311112222333311112222333311112222
333311112222333311112222333311112222
333311112222333311112222333311112222

After (scrolled left):
111222233331111222233331111222233331
111222233331111222233331111222233331
111222233331111222233331111222233331
111222233331111222233331111222233331
222333311112222333311112222333311112
222333311112222333311112222333311112
222333311112222333311112222333311112
222333311112222333311112222333311112
333111122223333111122223333111122223
333111122223333111122223333111122223
333111122223333111122223333111122223
333111122223333111122223333111122223

Example 2 (same blocks, different Y/X within-block alignment)

Before:
111122223333111122223333111122223333
111122223333111122223333111122223333
222233331111222233331111222233331111
222233331111222233331111222233331111
222233331111222233331111222233331111
222233331111222233331111222233331111
333311112222333311112222333311112222
333311112222333311112222333311112222
333311112222333311112222333311112222
333311112222333311112222333311112222
111122223333111122223333111122223333
111122223333111122223333111122223333

After (scrolled left):
111222233331111222233331111222233331
111222233331111222233331111222233331
222333311112222333311112222333311112
222333311112222333311112222333311112
222333311112222333311112222333311112
222333311112222333311112222333311112
333111122223333111122223333111122223
333111122223333111122223333111122223
333111122223333111122223333111122223
333111122223333111122223333111122223
111222233331111222233331111222233331
111222233331111222233331111222233331
```

## References
- "map_row_storage_and_precalculation" — accessing map rows/blocks to fetch new side data
- "screen_memory_shifting_doublebuffered_copying_direction_handling" — performing the hidden-screen copy and direction handling before drawing new sides
