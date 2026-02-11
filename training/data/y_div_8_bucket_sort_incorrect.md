# Sprite Multiplexing — Bucket Sort by Character Row (Y Divided by 8) — Cadaver (Lasse Oorni)

**Summary:** This technique groups sprites into buckets based on their character row (Y coordinate divided by 8) for sprite multiplexing on the Commodore 64. It operates in O(N) time, storing sprites in character-row buckets without ensuring strict Y ordering within each 8-pixel bucket, resulting in partial ordering. The implementation uses a two-pass, contiguous-bucket memory layout to avoid two-dimensional arrays in C64 assembly. This method was employed in MW1-3 but was later deemed "incorrect" by the author due to its insufficient ordering.

**Description**

This method organizes sprites by their character row (Y coordinate divided by 8) into buckets and then processes these buckets to generate a sorted sprite order. The algorithm runs in linear time O(N) because each sprite is assigned to a bucket once, and each bucket is traversed once. However, it only ensures that sprites are grouped by 8-pixel character rows; sprites within the same bucket are not ordered by their exact Y coordinate, resulting in a partially sorted final order.

Typical algorithm flow:

- Initialize `amount_in_bucket[b] = 0` for every bucket (one bucket per character row in the visible sprite range).
- For each sprite `s`:
  - Compute `bucket_number = spry[s] / 8`.
  - Append `s` to `bucket[bucket_number]`.
  - Increment `amount_in_bucket[bucket_number]`.
- Traverse buckets in ascending order and copy sprite data (Y/X/flags/color) into the sorted arrays in bucket order.

**C64 Assembly Implementation Note:** To avoid a true two-dimensional bucket array, the implementation first counts how many sprites fall into each bucket, computes each bucket's starting offset (prefix sums), and then writes sprites into contiguous memory regions using those base offsets. This results in contiguous buckets in memory and allows a single linear pass to produce the final sorted arrays without multi-dimensional indexing. Variations of this approach were used in MW1-3 but were later abandoned in favor of more precise sorting methods, such as radix-sorting refinements.

**Caveat:** Since each bucket spans 8 Y-pixels, sprites within the same bucket but at different Y positions may require an additional intra-bucket sort (or a stable multi-pass radix variant) if strict vertical ordering is necessary for correct sprite priority and overlap resolution.

**Note:** The author labeled this method "incorrect" due to its lack of strict Y ordering within an 8-pixel bucket.

## Source Code

Below is the C64 assembly implementation of the contiguous-bucket two-pass memory layout for sprite multiplexing:

```assembly
; Initialize the amount of sprites in each bucket to 0
; There are as many buckets as there are character rows in the visible sprite range

ldx #0
init_buckets:
    lda #0
    sta amount_in_bucket,x
    inx
    cpx #MAX_BUCKETS
    bne init_buckets

; First pass: Count sprites per bucket

ldx #0
count_sprites:
    lda spry,x
    lsr
    lsr
    lsr
    sta bucket_number
    inc amount_in_bucket,bucket_number
    inx
    cpx #MAX_SPRITES
    bne count_sprites

; Compute starting offsets for each bucket (prefix sums)

ldx #0
lda #0
sta bucket_start,x
inx
compute_offsets:
    lda bucket_start-1,x
    clc
    adc amount_in_bucket-1,x
    sta bucket_start,x
    inx
    cpx #MAX_BUCKETS
    bne compute_offsets

; Second pass: Place sprites into buckets

ldx #0
place_sprites:
    lda spry,x
    lsr
    lsr
    lsr
    sta bucket_number
    lda bucket_start,bucket_number
    sta sprite_index
    lda #0
    sta amount_in_bucket,bucket_number
    ldy amount_in_bucket,bucket_number
    lda sprx,x
    sta bucket_sprx,sprite_index,y
    lda spry,x
    sta bucket_spry,sprite_index,y
    lda sprf,x
    sta bucket_sprf,sprite_index,y
    lda sprc,x
    sta bucket_sprc,sprite_index,y
    iny
    sty amount_in_bucket,bucket_number
    inx
    cpx #MAX_SPRITES
    bne place_sprites

; Walk through all buckets to get the sprite order

ldx #0
sorted_sprites = 0
walk_buckets:
    ldy #0
    check_bucket:
        cpy amount_in_bucket,x
        beq next_bucket
        lda bucket_spry,x,y
        sta sortspry,sorted_sprites
        lda bucket_sprx,x,y
        sta sortsprx,sorted_sprites
        lda bucket_sprf,x,y
        sta sortsprf,sorted_sprites
        lda bucket_sprc,x,y
        sta sortsprc,sorted_sprites
        inc sorted_sprites
        iny
        jmp check_bucket
    next_bucket:
    inx
    cpx #MAX_BUCKETS
    bne walk_buckets
```

In this implementation:

- `amount_in_bucket` stores the count of sprites in each bucket.
- `bucket_start` holds the starting index for each bucket in the contiguous memory.
- `bucket_sprx`, `bucket_spry`, `bucket_sprf`, and `bucket_sprc` are arrays storing the X coordinates, Y coordinates, frame numbers, and colors of sprites within each bucket, respectively.
- `sortsprx`, `sortspry`, `sortsprf`, and `sortsprc` are the final sorted arrays.

This approach ensures that sprites are grouped by character rows, facilitating efficient sprite multiplexing on the C64.

## References

- "radix_sorting_for_sprites" — expands the bucket idea into a radix sort that guarantees correct ordering
- "continuous_insertion_sort_ocean_algorithm" — practical high-performance alternative used in games
