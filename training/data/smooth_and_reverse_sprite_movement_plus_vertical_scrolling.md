# Moving a sprite — horizontal sweep, wrap-around, back-and-forth, vertical scrolling (BASIC POKE examples)

**Summary:** BASIC examples showing sprite movement using VIC-II sprite registers referenced as V+4 (X), V+5 (Y) and V+16 (right-X/high X bits). Demonstrates a smooth horizontal sweep (X loops 24→255 and 0→65), wrap-around via POKE V+16, reversing motion with FOR ... STEP -1, single-line vertical scrolling (POKE V+5), and erasing prior BASIC lines.

## Horizontal sweep and wrap-around
The example moves a sprite smoothly across the screen by:
- Setting the sprite Y position with POKE V+5,Y (sample uses 100 — try 50 or 229).
- Iterating X across the full low-byte range with FOR X=24 TO 255: POKE V+4,X: NEXT.
- After reaching the right edge, POKE V+16,4 is used to set the RIGHT X position (high/extension bits) so the sprite can wrap/cross onto the right side of the screen.
- A second loop (FOR X=0 TO 65) continues movement across the remaining visible X positions, then POKE V+16,0 resets the right-X setting and the sequence repeats via GOTO 50.

Note: the source text contains an inconsistency — one place shows POKE V+16,4 in the code and another refers to POKE V+16,2 in the explanation. **[Note: Source may contain an error — inconsistent POKE V+16 value (2 vs 4).]**

Removing the GOTO 50 makes the routine run only once (one pass across the screen) and then stop.

## Back-and-forth (reverse) motion
A combined pair of loops shows how to reverse direction:
- Forward sweep uses ascending FOR loops (24 TO 255, then 0 TO 65) with POKE V+4,X.
- Reverse sweep uses FOR X=65 TO 0 STEP -1 and FOR X=255 TO 24 STEP -1 to decrement X and move the sprite back across the screen.
- POKE V+16 is toggled appropriately (e.g. 4 then 0) to ensure correct wrap/start positions when changing sides.

STEP -1 causes the FOR loop to decrement X by 1 each iteration so the sprite moves backward.

## Vertical scrolling (single-line)
A single-line routine scrolls the sprite vertically:
- Set the X (horizontal) base with POKE V+4,24 (place sprite at X=24).
- Loop Y from 0 to 255, POKE V+5,Y to animate vertical movement.

To replace the previous horizontal code, erase the existing BASIC lines by entering their line numbers alone (e.g. type "50" and RETURN to delete line 50).

## Source Code
```basic
50 POKE V+5,100:FOR X=24TO255:POKE V+4,X:NEXT:POKE V+16,4
55 FOR X=0TO65:POKE V+4,X:NEXT X:POKE V+16,0:GOTO 50

' Back-and-forth example
50 POKE V+5,100:FOR X=24TO255:POKE V+4,X:NEXT:POKE V+16,4:
   FOR X=0TO65: POKE V+4,X: NEXT X
55 FOR X=65TO0 STEP-1:POKE V+4,X:NEXT:POKE V+16,0: FOR
   X=255TO24 STEP-1: POKE V+4,X:NEXT
60 GOTO 50

' Vertical scrolling (single line). Erase lines 50 and 60 by typing the numbers and RETURN:
50 <RETURN>
60 <RETURN>

50 POKE V+4,24:FOR Y=0TO255:POKE V+5,Y:NEXT
```

## References
- "crunched_data_statements_and_sample_basic_program" — expands on the DATA program that provides the sprite bitmap used by these movement routines.
- "michael_s_dancing_mouse_example_program" — applies these movement patterns (horizontal, reverse, vertical) in a multi-sprite animation.
