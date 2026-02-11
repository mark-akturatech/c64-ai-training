# Multidirectional Scrolling Techniques (Cadaver)

**Summary:** Overview of multidirectional/hardware character-scroll on the C64 using the VIC-II, explaining that hardware character-scroll requires shifting screen memory and color memory (~1000 bytes) which can consume >half a frame; recommends splitting the memory-copy work across frames according to max scroll speed and hiding intermediate states with doublebuffering (two screens).

## Overview
Hardware character-scroll (VIC-II fine/char scroll registers) avoids per-pixel redraws but leaves screen RAM and color RAM contents misaligned after a character-length scroll. To restore a consistent tile map you must shift the visible screen memory (and usually color memory) in the direction of motion so the logical tile map matches the scrolled display.

A full-screen shift involves roughly the entire screen RAM (~1000 bytes for a standard 40×25 character screen) plus corresponding color RAM, and that copy/shift operation is expensive in CPU time — commonly taking more than half of the raster time available in a frame on a stock 6510/6502.

VIC-II trick methods exist to manipulate the hardware scroll registers and sprite/display timing for partial or cheap scrolling, but they are often too limiting for full, free multidirectional scrolling used in games.

## Splitting screen shifts across frames
Because scrolling games have a maximum visible scroll speed (e.g., X pixels/frame), the expensive RAM-shift can be split across multiple frames. Example given: if you scroll 4 pixels per frame and a character cell is 8 pixels wide, the memory copy needed to catch up after a full-character hardware scroll can be split over two frames (or more), so each frame performs only a fraction of the total byte moves. Splitting must be planned to ensure the copy workload per frame fits into the available CPU time (raster time minus game logic/sprite handling).

Key points when splitting:
- Split amount depends on scroll speed (pixels/frame) and character width/height.
- You must keep the on-screen state visually acceptable while the logical screen memory is only partially shifted; intermediate states must not be shown directly (see doublebuffering below).
- Synchronize the completion of the memory shifts with when you swap the displayed buffer to present a finished frame.

## Doublebuffering to hide intermediate shifts
To hide the intermediate, partially-completed memory shifts, use doublebuffering: maintain two screen buffers (two character screen areas and matching color RAM buffers), prepare the next visible buffer off-screen by performing the required partial/full shifts over multiple frames, and swap the VIC-II base address (or the pointer to the displayed screen memory) only when the target buffer is fully ready. This prevents visible tearing or partial copies.

Practical considerations:
- Maintain two complete screen RAM areas and color RAM image(s), and alternate which one the VIC displays.
- While one buffer is visible, perform incremental shift work on the hidden buffer across frames commensurate with available CPU time.
- Swap buffers at a safe raster point to avoid visual glitches (commonly at frame start/rasterline where display list changes are safe).

## Notes on VIC-II tricks
The overview explicitly excludes detailed VIC-II-only trick methods; they exist (manipulating fine-scroll registers, manipulating display pointers mid-frame, sprite reuse timing, etc.) but are noted here as usually too limiting for fully multidirectional/free scrolling in action games.

## References
- "eight_directional_scrolling_centered_scroll_registers" — expands on how splitting affects scroll-register-centered methods
- "freedirectional_scrolling_two_frame_method" — expands on an alternative freedirectional approach
- "screen_memory_shifting_doublebuffered_copying_direction_handling" — expands on practical implications of doublebuffered shifting