# Multidirectional Scrolling Techniques (Cadaver) — Shifting Screen-Memory with Double Buffering

**Summary:** Utilize double buffering to copy the currently visible screen memory into the hidden screen, enabling multidirectional shifts without overwriting source data. Employ the X register as the source index and Y as the target index, adjusting their initial values to achieve all eight shift directions. Implement two copy loops: screen1 to screen2 and screen2 to screen1.

**Shifting the Screen-Memory Data**

Shifting a displayed tile or screen buffer in-place requires careful loop direction to avoid overwriting source bytes. Double buffering eliminates that constraint by always copying from the currently visible screen into the hidden screen, ensuring source bytes remain intact while writing the shifted result.

Implementation outline:

- Maintain two full screen buffers (`screen1`, `screen2`). At any time, one is visible, and the other is hidden.
- To shift the displayed image, copy the visible buffer into the hidden buffer with the required offset applied.
- Use the X register for the source index (reads from the visible buffer) and the Y register for the target index (writes into the hidden buffer). By selecting appropriate initial values for X and Y and increment/decrement directions, you can perform shifts in any of the eight compass directions (N, S, E, W, NE, NW, SE, SW).
- Because the copy is from visible to hidden, the source is never overwritten during the operation—this removes the need for direction-dependent loop ordering that an in-place shift would require.
- After copying, swap the roles (make the hidden buffer visible). To support continuous movement, you must implement both copy routines (`screen1` to `screen2` and `screen2` to `screen1`), or a generic routine that takes source and target buffer addresses.
- After the shift/copy, draw or fetch the new map/tile data that appears at the newly exposed edges into the visible buffer (typically done into the hidden buffer just after copying, before swapping).

## Source Code

Below are assembly examples demonstrating the two copy loops (`screen1` to `screen2` and `screen2` to `screen1`), the explicit initial X/Y index values and increment/decrement directions for each of the eight shift directions, and pseudocode for buffer-address calculations.

```assembly
; Constants
SCREEN_WIDTH = 40
SCREEN_HEIGHT = 25
SCREEN_SIZE = SCREEN_WIDTH * SCREEN_HEIGHT

; Screen buffers
screen1 = $0400
screen2 = $0800

; Copy screen1 to screen2
copy_screen1_to_screen2:
    ldx #0
copy_loop:
    lda screen1, x
    sta screen2, x
    inx
    cpx #SCREEN_SIZE
    bne copy_loop
    rts

; Copy screen2 to screen1
copy_screen2_to_screen1:
    ldx #0
copy_loop:
    lda screen2, x
    sta screen1, x
    inx
    cpx #SCREEN_SIZE
    bne copy_loop
    rts
```

To achieve multidirectional scrolling, set the initial values of the X and Y registers and their increment/decrement directions as follows:

- **North (Up):** Start at the beginning of the buffer; increment X by SCREEN_WIDTH.
- **South (Down):** Start at the end of the buffer; decrement X by SCREEN_WIDTH.
- **East (Right):** Start at the beginning of the buffer; increment X by 1.
- **West (Left):** Start at the end of the buffer; decrement X by 1.
- **Northeast (Up-Right):** Start at the beginning of the buffer; increment X by SCREEN_WIDTH + 1.
- **Northwest (Up-Left):** Start at the end of the buffer; decrement X by SCREEN_WIDTH - 1.
- **Southeast (Down-Right):** Start at the beginning of the buffer; increment X by SCREEN_WIDTH - 1.
- **Southwest (Down-Left):** Start at the end of the buffer; decrement X by SCREEN_WIDTH + 1.

Pseudocode for buffer-address calculations:

```pseudocode
for each row in screen:
    for each column in row:
        source_index = row * SCREEN_WIDTH + column
        target_index = (row + y_offset) * SCREEN_WIDTH + (column + x_offset)
        hidden_screen[target_index] = visible_screen[source_index]
```

Timing considerations:

Perform the shift during the vertical blanking interval (VBI) to avoid visual artifacts. This ensures that the screen update occurs when the display is not actively drawing, preventing flickering or tearing. Implementing the shift within a raster interrupt routine synchronized with the VBI is recommended.

## Key Registers

- **X Register:** Source index for reading from the visible buffer.
- **Y Register:** Target index for writing to the hidden buffer.

## References

- "C64 Soft Scrolling Lessons" — Discusses techniques and trade-offs for smooth scrolling on the Commodore 64. ([theoasisbbs.com](https://theoasisbbs.com/c64-soft-scrolling-lessons/?utm_source=openai))
- "Tutorial 8: Full-screen smooth scrolling. Know your timing & banking!" — Covers full-screen smooth scrolling, including timing and double buffering. ([lemonspawn.com](https://lemonspawn.com/turbo-rascal-syntax-error-expected-but-begin/turbo-rascal-se-tutorials/tutorial-8-full-screen-smooth-scrolling-know-your-timing-banking/?utm_source=openai))
- "Smooth-Scrolling Billboard for Commodore 64" — Explains smooth scrolling implementation and timing considerations. ([atarimagazines.com](https://www.atarimagazines.com/compute/issue86/068_1_Smooth-Scrolling_Billboard.php?utm_source=openai))