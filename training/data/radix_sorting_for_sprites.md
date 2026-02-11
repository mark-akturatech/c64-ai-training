# Sprite multiplexing — Two-pass radix sort (Cadaver / Lasse Oorni)

**Summary:** Two-pass radix (bucket) sort for sprites that guarantees correct Y-order by first bucketing on (Y & 15) and then on (Y / 16); near-linear execution time O(N) but memory-hungry due to multiple bucket arrays and counters.

## Radix sorting
This algorithm sorts sprites by Y-coordinate in two stable passes to guarantee correct ascending Y order.

- Pass 1: bucket sprites by the remainder of Y divided by 16 (Y & 15). This groups sprites by their low 4 bits (0–15).
- Pass 2: iterate buckets from pass 1 in order and place sprites into second-pass buckets keyed by Y divided by 16 (high bits). This preserves ordering within the low-bit groups while grouping by high bits.
- Final output: walk pass-2 buckets in order and copy sprite data (Y, X, flags, color, or sprite index) to the final sorted arrays.

Properties:
- Stable two-pass radix sort — guarantees correct total ordering by full Y value.
- Time complexity proportional to N (three main loops + bucket walks), so near-linear in sprite count.
- Memory cost: multiple bucket arrays and per-bucket counters (first-pass buckets, second-pass buckets, counters for each); additional temporary storage for sprite indices.
- Implementation complexity: code size and setup/teardown of many buckets can be substantial; requires enough RAM to hold bucket tables and counters.

Typical parameters:
- Because the first pass uses remainder mod 16, the number of buckets per pass is 16 (0–15) for an 8-bit Y range (0–255). maximum_buckets is therefore typically 16, but may be adapted for other ranges.

## Source Code
```text
; Clear buckets for both passes.

for (bucket = 0; bucket < maximum_buckets; bucket++)
{
  amount_in_bucket1[bucket] = 0;
  amount_in_bucket2[bucket] = 0;
}

; Store sprites to the first pass buckets, according to remainder of
; Y divided by 16.

for (sprite = 0; sprite < maximum_buckets; sprite++)
{
  bucket1_number = spry[sprite] & 15;
  bucket1[bucket1_number][amount_in_bucket1[bucket1_number]] = sprite;
  amount_in_bucket1[bucket1_number]++;
}

; Walk through all the first pass buckets to get the first pass sorting order.
; At the same time, put sprites to the second pass buckets according to Y
; divided by 16.

for (bucket = 0; bucket < maximum_buckets; bucket++)
{
  for (index = 0; index < amount_in_bucket1[bucket]; index++)
  {
    sprite = bucket[bucket][index];
    bucket2_number = spry[sprite] / 16;
    bucket2[bucket2_number][amount_in_bucket2[bucket2_number]] = sprite;
    amount_in_bucket2[bucket2_number]++;
  }
}

; Walk through the second pass buckets to get the final sprite order.
; In this example, the sprites are directly copied to the sorted table.

sorted_sprites = 0

for (bucket = 0; bucket < maximum_buckets; bucket++)
{
  for (index = 0; index < amount_in_bucket2[bucket]; index++)
  {
    sprite = bucket2[bucket][index];
    sortspry[sorted_sprites] = spry[sprite];
    sortsprx[sorted_sprites] = sprx[sprite];
    sortsprf[sorted_sprites] = sprf[sprite];
    sortsprc[sorted_sprites] = sprc[sprite];
    sorted_sprites++;
  }
}
```

## References
- "y_div_8_bucket_sort_incorrect" — related bucket approach (less precise)
- "continuous_insertion_sort_ocean_algorithm" — practical alternative used in several games