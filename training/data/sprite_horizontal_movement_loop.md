# LINE 50 — FOR X=0 TO 347 STEP 3

**Summary:** FOR X=0 TO 347 STEP 3 — Commodore 64 BASIC loop that advances the sprite X coordinate in increments of 3 for faster horizontal movement; related to sprite pointer/frame updates and VIC-II RX/LX splitting for screen-side handling.

## Loop explanation
This BASIC statement defines a loop variable X that starts at 0 and is incremented by 3 each iteration until the loop passes the end value (347). The intent in the source text is to move a sprite horizontally "3 X positions at a time (to provide fast movement) from position 0 to position 347."

Behavioral details:
- Sequence produced by FOR X = 0 TO 347 STEP 3 is: 0, 3, 6, ..., 342, 345. The next increment (348) would exceed 347, so 347 itself is not reached.
- Practical effect: advancing X by 3 pixels per frame (or per loop iteration) produces visibly faster sprite motion than stepping by 1.
- This loop is shown as the X-side driver for animation; pointer changes inside the loop (sprite frames) and conversion of the X value into the VIC-II high-bit (RX) and low byte (LX) are handled elsewhere (see References).

**[Note: Source may contain an error — the textual claim "to position 347" is inaccurate for STEP 3; the last value is 345.]**

## Source Code
```basic
    FORX=0TO347         Steps the movement of your sprite 3 X positions at
    STEP3               a time (to provide fast movement) from position 0
                        to position 347.

                                                 PROGRAMMING GRAPHICS   171
~
```

## References
- "sprite_pointer_setting_p_equals_192" — expands on Pointer changes within the X loop create the animation frames
- "sprite_screen_side_split_rx_lx_calculation" — expands on Converts the 0–347 X position into the VIC's high-bit (RX) and low-byte (LX) for screen sides
