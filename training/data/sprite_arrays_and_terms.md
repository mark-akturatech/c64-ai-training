# Sprite array naming and sorting (Cadaver / Lasse Oorni)

**Summary:** Defines unsorted sprite arrays (sprx, spry, sprc, sprf), sorted arrays (sortsprx, sortspry, sortsprc, sortsprf), and the sortorder index table (sorted list of indexes into the unsorted arrays, typically placed on zeropage). Discusses sorting algorithms (Ocean continuous insertion / bubble sort) used for Y-sorting sprites for multiplexing.

**Description**

This chunk documents the data structures and their purposes used when Y-sorting sprites for multiplexing on the C64.

Unsorted (virtual) sprite arrays — contain the raw sprite data produced by game logic:
- **sprx**  — unsorted X coordinates
- **spry**  — unsorted Y coordinates
- **sprc**  — unsorted colors
- **sprf**  — unsorted sprite frame numbers

Sorted sprite arrays — populated after sorting (one-to-one with visible sprite slots or used for rendering order):
- **sortsprx**  — sorted X coordinates
- **sortspry**  — sorted Y coordinates
- **sortsprc**  — sorted colors
- **sortsprf**  — sorted sprite frame numbers

Index/sort map:
- **sortorder** — sorted list of indexes into the unsorted tables (i.e., holds original unsorted indices in Y-sorted order). Using an index array lets you avoid moving full records during sort; copy or indirect-reference sorted data into the sortspr* arrays as needed. Because some indexing modes on the 6502 require zeropage addressing for efficient indirect/indexing, sortorder is typically placed on the zeropage.

### Sorting Algorithms

**Ocean Algorithm (Continuous Insertion Sort):**

The "Ocean" algorithm, also known as continuous insertion sort, maintains an order array that is not reset each time. Each sorting operation continues from the previous state, making it efficient when sprites have minimal vertical movement. The algorithm proceeds as follows:

1. **Initialize the sortorder array** with indices corresponding to the initial order of sprites.
2. **For each frame:**
   - Traverse the sortorder array.
   - For each sprite, compare its Y-coordinate with the previous sprite in the sorted order.
   - If the current sprite's Y-coordinate is less than the previous sprite's, swap their positions in the sortorder array.
   - Continue this process until the current sprite is in the correct position or the beginning of the array is reached.

This method is particularly effective when sprite movements are small between frames, as it minimizes the number of comparisons and swaps needed.

**Bubble Sort with Index Tracking:**

Bubble sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. When applied to sprite sorting with index tracking:

1. **Initialize the sortorder array** with indices corresponding to the initial order of sprites.
2. **Repeat until no swaps are needed:**
   - Traverse the sortorder array.
   - For each pair of adjacent sprites:
     - Compare their Y-coordinates.
     - If the first sprite's Y-coordinate is greater than the second's, swap their positions in the sortorder array.

While straightforward, bubble sort is less efficient than the Ocean algorithm, especially when dealing with a larger number of sprites or significant vertical movements.

### Zeropage Layout and Suggested Addresses

Efficient sprite sorting and multiplexing often require the use of zeropage memory for faster access. A typical zeropage layout might include:

- **sortorder**: Starting at address `$FB` (251), an array of sprite indices in sorted order.
- **temp**: Temporary storage for swapping indices during sorting, e.g., at address `$FA` (250).

This placement allows for efficient indirect addressing modes, which are faster and require fewer cycles on the 6502 processor.

### Assembly Implementations and Optimized Routines

Optimized assembly routines for sprite sorting are crucial for performance in real-time applications. For instance, the Ocean algorithm can be implemented in assembly by maintaining a sortorder array and performing in-place swaps based on Y-coordinate comparisons. Detailed implementations can be found in resources like the Codebase64 wiki, which provides various sorting routines optimized for sprite multiplexers. ([codebase.c64.org](https://codebase.c64.org/doku.php?id=base%3Asprite_multiplexer_sorting&utm_source=openai))

### Performance Characteristics

The performance of sorting algorithms on the C64 depends on factors such as the number of sprites, their movement patterns, and the chosen algorithm:

- **Ocean Algorithm**: Offers efficient sorting with minimal changes between frames, making it suitable for scenarios with slight vertical sprite movements. Its performance degrades with significant sprite reordering.
- **Bubble Sort**: Simple but less efficient, with a time complexity of O(n²). It's generally not recommended for real-time applications with a large number of sprites due to its higher computational overhead.

Understanding these characteristics helps in selecting the appropriate sorting method based on the specific requirements of a project.

## Source Code

```text
; Example of Ocean Algorithm in 6502 Assembly
; Assumes sortorder array is initialized with sprite indices

; Pseudocode:
; for i = 1 to n-1
;     j = i
;     while j > 0 and spry[sortorder[j]] < spry[sortorder[j-1]]
;         swap(sortorder[j], sortorder[j-1])
;         j = j - 1

; Assembly Implementation:
    ldx #1                  ; Start with the second element
outer_loop:
    cpx #n                  ; Compare with number of sprites
    beq done                ; If all sprites are sorted, exit
    stx temp                ; Store current index in temp
inner_loop:
    cpx #0                  ; If at the beginning, exit inner loop
    beq next_outer
    lda sortorder,x         ; Load current sprite index
    tay                     ; Transfer to Y for indexing
    lda spry,y              ; Load Y-coordinate of current sprite
    ldy sortorder-1,x       ; Load previous sprite index
    cmp spry,y              ; Compare Y-coordinates
    bcs next_outer          ; If current Y >= previous Y, exit inner loop
    ; Swap sortorder[x] and sortorder[x-1]
    lda sortorder,x
    pha
    lda sortorder-1,x
    sta sortorder,x
    pla
    sta sortorder-1,x
    dex                     ; Move to previous element
    jmp inner_loop          ; Repeat inner loop
next_outer:
    ldx temp                ; Restore index
    inx                     ; Move to next element
    jmp outer_loop          ; Repeat outer loop
done:
    ; Sorting complete
```

## Key Registers

- **$FB**: Starting address of the sortorder array in zeropage.
- **$FA**: Temporary storage for swapping indices during sorting.

## References

- "continuous_insertion_sort_ocean_algorithm" — expands on using a sortorder index array for fast incremental sorting (the "Ocean" algorithm).
- "bubblesort_for_sprites" — expands on the alternative bubble-sort method that also uses index tracking.
- Codebase64 wiki on sprite multiplexing and sorting algorithms. ([codebase.c64.org](https://codebase.c64.org/doku.php?id=base%3Asprite_multiplexer_sorting&utm_source=openai))

## Labels
- SPRX
- SPRY
- SPRC
- SPRF
- SORTORDER
- TEMP
