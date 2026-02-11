# Continuous insertion sorting (Ocean / SWIV variants)

**Summary:** Continuous insertion sort for sprites using a persistent sortorder index array (sortorder[], spry[], sortsprx/sortspry). Initialize sortorder once (0..N-1) and perform localized swaps each frame so cost is proportional to how much sprites move relative to each other; very fast when order changes little but can produce occasional heavy frames.

## Overview
This algorithm maintains a persistent index array sortorder[] that represents the current Y-sorted ordering of sprite indices. The array is initialized once (e.g. sortorder[i] = i). Each frame the routine scans the array and, when it finds an adjacent pair that is out of order by Y (using spry[sortorder[*]]), it performs localized swaps moving the out-of-order entry toward its correct position (insertion sort style). Because the array is preserved between frames, work per frame is proportional to how much sprites cross each other in Y since the last frame — often minimal in typical gameplay.

Unused/disabled sprites can be represented by setting their Y to the maximum value (255) so they fall to the end of the sorted list and are ignored by the sprite display walker.

Behavior notes:
- Amortized very fast when sprites move little relative to each other.
- Worst-case cost: a frame where many sprites cross will require many swaps and become expensive.
- The result is a sorted index array you can traverse to fill sortsprx/sortspry and optionally reject sprites as you walk.

## Algorithm details
- Initialization (one-time): fill sortorder with sprite indices 0..MAX_SPR-1.
- Per-frame main loop: scan sortorder from one end (top-to-bottom or bottom-to-top depending on variant). For each index position i, compare spry[sortorder[i+1]] vs spry[sortorder[i]]. If the later entry has a smaller Y (i.e. should be earlier in sort), swap it leftwards until it reaches correct spot (stop when comparison shows correct order or at array start).
- To handle changing number of active sprites, set unused sprite Y to 255; they naturally sink to the end of the sorted list.
- Variants:
  - Ocean-style: scans increasing X, compares the Y values via indirection, swaps adjacent pairs and continues bubbling the lower-Y entry left until order restored.
  - SWIV-adapted: sorts bottom-to-top (reversed order), uses zeropage temporaries and keeps a running compare value in the accumulator to reduce loads; requires slight changes to loop direction/indices.

Performance characteristics:
- Per-frame cost roughly proportional to number of pairwise inversions introduced since last frame.
- Best for games where sprites mostly keep relative Y order between frames.

## Source Code
```text
// Pseudocode initialization (one-time)
for (sprite = 0; sprite < maximum_sprites; sprite++) {
  sortorder[sprite] = sprite;
}

// Pseudocode main loop (insertion-like, keeps sortorder between frames)
sprite1 = 0;
while (true) {
  if (spry[sortorder[sprite1+1]] < spry[sortorder[sprite1]]) {
    sprite2 = sprite1;
    while (true) {
      swap(sortorder[sprite2], sortorder[sprite2+1]);
      if (sprite2 == 0) break;
      sprite2--;
      if (spry[sortorder[sprite2+1]] >= spry[sortorder[sprite2]]) break;
    }
  }
  sprite1++;
  if (sprite1 == maximum_sprites - 1) break;
}
```

Ocean-style ASM implementation (as found in Ocean titles):
```asm
        ldx #$00
sortloop:
        ldy sortorder+1,x       ; Y = sortorder[x+1]
        lda spry,y              ; A = spry[sortorder[x+1]]
        ldy sortorder,x         ; Y = sortorder[x]
        cmp spry,y              ; compare spry[sortorder[x+1]] vs spry[sortorder[x]]
        bcs sortskip            ; if >= then in order, skip
        stx sortreload+1
sortswap:
        lda sortorder+1,x
        sta sortorder,x
        sty sortorder+1,x
        cpx #$00
        beq sortreload
        dex
        ldy sortorder+1,x
        lda spry,y
        ldy sortorder,x
        cmp spry,y
        bcc sortswap
sortreload:
        ldx #$00
sortskip:
        inx
        cpx #MAXSPR-1
        bcc sortloop
```

SWIV-adapted variant (bottom-to-top ordering, uses zeropage temps and accumulator optimizations):
```asm
        ldx #$00
        txa
sortloop:
        ldy sortorder,x
        cmp spry,y
        beq noswap2
        bcc noswap1
        stx temp1
        sty temp2
        lda spry,y
        ldy sortorder-1,x
        sty sortorder,x
        dex
        beq swapdone
swaploop:
        ldy sortorder-1,x
        sty sortorder,x
        cmp spry,y
        bcs swapdone
        dex
        bne swaploop
swapdone:
        ldy temp2
        sty sortorder,x
        ldx temp1
        ldy sortorder,x
noswap1:
        lda spry,y
noswap2:
        inx
        cpx #MAX_SPR
        bne sortloop
```

## References
- "sprite_arrays_and_terms" — expands on using sortorder as an index array
- "mapping_virtual_to_physical_sprites" — expands on mapping sorted order to physical sprites
