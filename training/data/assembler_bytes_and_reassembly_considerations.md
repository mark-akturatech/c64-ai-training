# Assembler .BYTE graphics entry — reassembly caveat

**Summary:** Using the assembler's .BYTE directive stores graphics/data in the assembled program and lets you assign labels and place the data at arbitrary memory addresses; the main caveat is that any change to the assembler source requires reassembly, which costs rebuild time.

## Using .BYTE to store graphics
Enter graphic data into your assembler with .BYTE directives. This allows:
- assigning names/labels to different graphic areas for easy reference,
- directing the assembler to place those data blocks anywhere in memory (absolute placement by origin/labels),
- keeping the graphics embedded directly in the assembled program image.

## Tradeoff: editing convenience vs. rebuild time
The main disadvantage is that the graphics data are part of the assembler source and therefore must be reassembled whenever you change the source. Consider the workflow tradeoff between:
- ease of editing and named, relocatable data inside the assembler, and
- the added rebuild time whenever you modify the assembler source.

(Alternative: enter data with a memory monitor for interactive edits without full reassembly.)

## References
- "entering_graphics_into_memory_monitor_vs_assembler" — compares the monitor vs assembler methods for entering graphics into memory