# VIC-II sprite Y alignment and start timing (Rule 3)

**Summary:** Explains VIC-II sprite Y coordinate alignment and start timing: because the Rule‑3 DMA enable test runs at the end of a raster line, sprite Y registers must contain a value one less than the desired onscreen Y; sprite display begins on the following raster line after the first sprite data read. Exception: sprites positioned to the right of sprite X coordinate $164 (cycle 58, see Rule 4) are handled differently.

## Explanation
- Rule 3 (the DMA‑enable test) is evaluated at the end of a raster line. The VIC‑II checks sprite Y registers there to decide whether to enable DMA for sprite data.
- Because that check happens at line end, the first sprite data read triggered by the test cannot affect the current raster line's rendering — sprite display will start on the next raster line.
- Consequently, to have a sprite’s first visible line appear on raster line N, the sprite Y register must hold the value N−1 (one less than the desired onscreen Y).
- This timing relationship holds provided the sprite is not subject to the special-case timing described in Rule 4: if the sprite’s X position is to the right of X coordinate $164 (cycle 58), the DMA/read/display ordering differs (see Rule 4 for the exact behavior).
- Summary rule: set sprite Y = desired_on_screen_Y − 1 (except when Rule 4's X‑position condition at $164 applies).

## References
- "sprite_display_timing_and_rules_1_to_6" — expands on Rule 3 and Rule 4 interactions determining DMA and display start
- "sprite_reuse_and_horizontal_limitations" — expands on consequences for vertical reuse and horizontal restrictions
