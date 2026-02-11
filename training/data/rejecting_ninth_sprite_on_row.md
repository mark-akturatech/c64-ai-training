# Rejecting sprites that would become the 9th sprite on a rasterline

**Summary:** Sprite multiplexing technique for the C64/VIC-II: while mapping virtual→physical sprites using round-robin assignment, reject a virtual sprite if its Y is within 21 pixels of the virtual sprite previously mapped to the same physical sprite (prevents the 9th hardware sprite on a rasterline).

## Description
When multiplexing more than eight logical (virtual) sprites onto the VIC-II's eight hardware (physical) sprite channels, sprites are typically walked in sorted-Y order and assigned to physical sprite slots in a round-robin fashion (physical = count_accepted mod 8). To ensure the hardware limit of eight visible sprites per rasterline is not violated, any virtual sprite that would be the ninth overlapping sprite on the same rasterline for a given physical slot must be rejected.

The practical test is to compare the Y of the candidate virtual sprite against the Y of the previously accepted virtual sprite that mapped to the same physical sprite. Because the mapping cycles every 8 accepted sprites, that "previous" sprite is the one accepted 8 positions earlier in the accepted list. If the Y-difference is less than 21 pixels, the candidate would overlap too closely and must be rejected.

Notes:
- The test is not applicable for the first 8 accepted sprites (there is no prior sprite for the same physical slot).
- 21 pixels is the vertical spacing threshold used here (equal to standard sprite height in single-height mode).
- This method assumes the accepted-sprites array (sortspry) holds Y positions in the same order as they were accepted and that the mapping uses an 8-slot round-robin (physical sprite count = 8). (Round-robin: physical_index = accepted_count % 8.)

## Source Code
```text
; Pseudocode for sprite acceptance loop (sorted by Y)
accepted = 0
for each next_sprite in order_sorted_by_Y:
    if accepted >= 8:
        ; compare against the sprite that mapped to the same physical slot
        if spry[next_sprite] - sortspry[accepted - 8] < 21:
            reject(next_sprite)
            continue
    accept(next_sprite)         ; copy to sortsprx/sortspry etc.
    accepted += 1

; Example single-line test (as given)
if (spry[next_sprite] - sortspry[sorted_sprites - 8] < 21) then reject();
```

## References
- "mapping_virtual_to_physical_sprites" — expands on using mapping order to determine which previous virtual sprite corresponds to the same physical sprite
