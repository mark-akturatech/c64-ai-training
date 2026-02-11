# Timing 6510 CPU writes within a raster line using VIC g-accesses

**Summary:** Use VIC-II g-accesses (VIC graphics memory fetches) as a timing reference: have the 6510 write a byte in graphics memory and observe which on‑screen character changes first; the CPU write occurred in the clock phase immediately before that visible change, which you then map to a timing diagram to determine the exact clock cycle and to count other accesses relative to it.

## Method
- Choose a byte in VIC-addressed graphics memory whose change produces an immediate visible difference on the screen (screen RAM, character RAM/bitmap area, or a single bitmap byte).  
- Trigger a single 6510 write to that byte while the raster is active (e.g. via a short test loop or a controlled POKE).  
- Observe the raster line visually (or via a frame-grab) and note which character cell (or pixel group) shows the change first along the scan direction. That first-visible character corresponds to the VIC g-access that fetched the data which produced the visible pixels.  
- The CPU write must have completed in the clock phase immediately preceding that visible change (i.e., the write happened in the clock phase immediately before the VIC fetch whose result becomes visible). Use this relation as a temporal anchor inside the raster line.  
- Open the appropriate VIC timing diagram for your VIC model/setting and find the shown g-access that maps to the changed screen position. The diagram gives cycle numbers and phases — align the observed character to its g-access entry. The CPU write’s clock phase is the phase immediately before that g-access entry in the diagram.  
- Once you have that anchored clock cycle, count earlier and later cycles in the diagram to locate other CPU or VIC accesses you care about (e.g., other g-accesses, badline fetches, or cycle windows available for CPU memory accesses).

Notes:
- “g-access” here means a VIC graphics memory fetch (character/ bitmap/screen data).  
- This technique provides an empirical, visual anchor inside a raster line so you can translate an observed screen change into an exact VIC/CPU clock cycle using the timing diagram for the VIC variant and configuration in use.  
- The same technique applies across VIC-II variants — you must use the diagram that matches your VIC model and sprite/badline conditions.

## References
- "raster_line_signals_and_access_types_explained" — expands on Legend and cycle counts needed to interpret where the write happened  
- "timing_diagram_6569_nobadline_no_sprites" — example timing diagram to use when mapping the observed visual change to a cycle (6569, no badline, no sprites)  
- "timing_diagram_6567r8_nobadline_sprites2_7" — example timing diagram for a different VIC variant where the same timing technique applies
