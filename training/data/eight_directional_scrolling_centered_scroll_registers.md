# Scroll registers centered when idle — split-frame multidirectional scrolling

**Summary:** Describes the "scroll registers centered when idle" technique (scroll register set to center of a character when not scrolling), how splitting the screen-shift work across frames requires doublebuffering and imposes timing/direction restrictions, and shows the scroll-register value sequences for right-to-left and left-to-right 2-pixel-per-frame scrolling; enables 8-directional but not freedirectional scrolling.

## Splitting & "centered when idle" technique

When the hardware fine-scroll register is left centered on a character while idle (two possible centered values), scrolling work is split across frames. Instead of performing a full character shift in one frame when the hardware scroll wraps, the code divides the required memory shifts and buffer swaps over multiple frames. This reduces per-frame work but enforces constraints on allowable scroll speeds and directions.

Practical consequences and behavior:
- Many commercial C64 games (example: Turrican, Navy Seals) that move exactly one character per step likely use this centered-when-idle approach; they therefore never scroll by sub-character distances without following the split-frame schedule.
- With splitting you must coordinate: (a) when to shift character/bitmap memory, (b) when to shift color-memory, and (c) when to swap doublebuffer screens — these operations are scheduled on specific frames relative to the fine-scroll register values.
- Because the split sequence depends on the current centered value, left-to-right and right-to-left scrolling require different starting register values to avoid hitting the hardware wrap point before the code has completed its memory updates. Resetting the centered value between directions (a barely noticeable one-frame adjustment) is necessary.
- This technique supports 8-directional movement (diagonals by combining horizontal and vertical steps that follow the split timing), but it does not permit freedirectional scrolling (arbitrary per-frame pixel offsets independent of this schedule) because the split imposes a discrete phase/timing relationship between scroll position and memory updates.

Frame-role summary (terms used below: "first half", "second half", "color-memory shift", "swap screens" refer to the split tasks scheduled across frames).

## Source Code
```text
Example: right-to-left scrolling at 2 pixels/frame, starting from centered value 4
Frame sequence (register values):
4  - initial state: perform first half of screen-memory shifting
2  - perform second half of screen shifting, possibly draw new column into buffer
0  - shifted screen must appear next frame: shift color-memory now and swap doublebuffer screens
6  - scrolling one character finished; this frame requires no shift work (idle)
4  - (if continuing) loop repeats; otherwise stop here

Example: left-to-right scrolling at 2 pixels/frame, after resetting centered value to 3
Frame sequence (register values):
3  - initial state: perform first half of screen-memory shifting
5  - perform second half of screen shifting, possibly draw new column into buffer
7  - shift color-memory and swap doublebuffer screens
1  - idle frame (no shift work)
3  - (if continuing) loop repeats

Notes:
- The numbered register values above are the per-frame fine-scroll register settings (centered when idle = 4 or 3).
- The sequences show that the per-frame duties (first-half shift, second-half shift, color shift+swap, idle) map to distinct scroll-register phases.
- A direction change requires resetting the centered register (e.g., to 3 for left-to-right) to avoid hitting the hardware wrap at an inopportune phase.
- Result: supports 8-directional scrolling (horizontal, vertical, and the four diagonals), but not freedirectional (arbitrary pixel offsets independent of the split schedule).
```

## References
- "scrolling_overview_doublebuffering" — expands on why splitting frames requires doublebuffering and how buffer swaps are scheduled
- "freedirectional_scrolling_two_frame_method" — contrasts this split-frame method with the freedirectional two-frame approach (allows arbitrary pixel offsets)