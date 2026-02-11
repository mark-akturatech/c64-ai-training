# VIC-II Smooth (pixel-by-pixel) Scrolling — Horizontal and Vertical

**Summary:** Overview of VIC-II pixel-by-pixel smooth scrolling in X and Y directions; requires the VIC-II scrolling registers and a machine‑language routine to perform per-pixel shifts. Uses 38‑column and 24‑row screen modes to provide covered screen areas for new incoming data.

## Smooth scrolling
The VIC‑II supports smooth (one‑pixel) movement of the entire displayed screen in any cardinal direction (up, down, left, right). The chip provides hardware support by allowing the video display to be offset to any of 8 horizontal positions and 8 vertical positions via its scrolling registers. Actual continuous scrolling (the repeated one‑pixel movements and the final character‑cell shift) must be driven by a machine‑language routine that updates the scrolling registers and moves the character data.

Use the smaller screen modes (38 columns and 24 rows) to create covered areas (offscreen or border-covered regions) where new character or bitmap data can be prepared before being smoothly scrolled into view.

## Six-step process for smooth scrolling
1) Shrink the visible screen (border expands) to create covered area.  
2) Set the VIC‑II scrolling register to its extreme value (maximum or minimum depending on scroll direction).  
3) Place new data in the covered portion of the screen (the region revealed as you scroll).  
4) Increment or decrement the scrolling register one pixel at a time until it reaches the opposite extreme.  
5) When the hardware scroll reaches the extreme, execute a machine‑language routine to shift the entire screen by one character cell in the scroll direction (so pixel offsets can be reset).  
6) Repeat from step 2 for continued scrolling.

## References
- "screen_size_modes_and_pokes" — how to switch 38/40 columns and 24/25 rows