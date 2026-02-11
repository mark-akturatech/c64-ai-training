# Selection-like sprite sorting — find next lowest Y (sprite multiplexing)

**Summary:** Selection-like O(N^2) sprite-sorting for C64 sprite multiplexing: copy spry[] into a temporary (zeropage for speed), repeatedly scan to find the lowest Y (destroying entries by setting 255), append to sorted list or store index, and optionally perform sprite rejection at append time.

## Finding the next lowest Y-coordinate
This method repeatedly finds the lowest Y in a temporary Y table (no swapping), marks that entry as used (set to 255), and appends the corresponding sprite to the sorted output. Execution time is O(N^2) (quadratic) but the algorithm exposes a clear insertion point for sprite-rejection logic when each sprite is appended. The inner compare loop is amenable to complete unrolling for speed; the temporary array may be placed on the zeropage for faster access. If spry[] is recomputed each frame, using a temporary table is unnecessary; otherwise copy spry[] into temp_y[] before sorting.

Variants when appending:
- Copy all sprite state into sorted arrays (sortspry, sortsprx, sortsprf, sortsprc).
- Or store only an index (sortorder[]) and reference original arrays later.

Termination: an illegal sentinel value (255) is used for lowest_spritenumber; when no candidate is found the loop exits.

Algorithmic notes:
- Time complexity: O(N^2).
- Useful when per-sprite rejection/filtering must run at append time.
- Inner loop unrolling is a common speed optimization on the 6502.

## Source Code
```text
;Initialize temp array

for (sprite = 0; sprite < maximum_sprites; sprite++)
{
  temp_y[sprite] = spry[sprite];
}

;Do the sorting

sorted_sprites = 0;       ;Counter of sprites that passed the sorting

while (true)          ;Indefinite loop
{
  lowest_found_y = 255;      ;Maximum Y-coord value found so far
  lowest_spritenumber = 255; ;This is an illegal value used to
                             ;terminate the loop when no more
                     ;sprites are found

  for (sprite = 0; sprite < maximum_sprites; sprite++)
  {
    if (temp_y[sprite] < lowest_found_y)
    {
      lowest_found_y = temp_y[sprite];
      lowest_spritenumber = sprite;
    }
  }

  if (lowest_spritenumber > maximum_sprites) break; ;Sorting finished,
                            ;break out of the loop
  temp_y[lowest_spritenumber] = 255; ;Now make this sprite unavailable for the
                                    ;next round of sorting

  if (sprite_not_rejected)          ;Here we can do sprite rejection if wanted
  {
    ;Next we can either copy the sprite variables to the sorted table,
    ;or just use an index

    ;Copying to sorted table
    sortspry[sorted_sprites] = spry[lowest_spritenumber];
    sortsprx[sorted_sprites] = sprx[lowest_spritenumber];
    sortsprf[sorted_sprites] = sprf[lowest_spritenumber];
    sortsprc[sorted_sprites] = sprc[lowest_spritenumber];
    sorted_sprites++;

    ;Using an index
    sortorder[sorted_sprites] = lowest_spritenumber;
    sorted_sprites++;
  }
}
```

## References
- "bubblesort_for_sprites" — expands on another simple O(N^2) method
- "y_div_8_bucket_sort_incorrect" — expands on bucket methods offering faster O(N) alternatives