# Why BASIC is unsuitable for smooth arcade-style animation

**Summary:** BASIC is too slow for smooth arcade-style animation due to interpreter overhead and repeated parsing/translation of program lines, and because hardware access via PEEK/POKE is slow—making it difficult to achieve consistent 30+ fps updates or timely sound-register updates.

## Interpreter overhead and line parsing
The BASIC interpreter, not the program, controls execution: every BASIC line must be analyzed, decoded and translated into machine instructions each time it is encountered. Because BASIC is a very general language (similar lines can have different functions), the per-line translation yields inefficient machine code. This repeated runtime parsing and translation produces significant overhead and makes BASIC programs inherently slow for continuous-motion tasks.

## Hardware access, timing, and animation frame rate
Smooth animation requires updating the screen at least 30 times per second (≈1/30 second per frame). BASIC has no direct register access, so hardware updates must be done with PEEK and POKE, which are comparatively slow. Calculating new positions and performing the required PEEK/POKE register updates in BASIC can easily take longer than 1/30 second, causing slow or erratic motion. The same timing limitation applies to updating sound registers—there may not be enough time within a frame to produce consistent audio changes.

## References
- "machine_language_overview" — expands on advantages of machine language over BASIC  
- "assembly_language_definition" — expands on assembly as a practical alternative to machine code