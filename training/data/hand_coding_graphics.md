# Hand-coding graphics — preliminary advice

**Summary:** Hand-coding graphics: plan the final object shape, chosen graphics mode (bitmap, multicolor, character), and chosen colors before entering pixel/sprite data to speed entry and keep results consistent; note multicolor sprites share common colors.

## Practical advice
- Decide the final object shape first — work from the completed silhouette so individual pixels map consistently to the intended form.
- Choose the graphics mode (e.g., hires bitmap, multicolor bitmap, character/charset, single- or multicolor sprites) before data entry so you enter the correct bit patterns and color constraints.
- Choose colors in advance. Color choices affect bit layouts (multicolor vs. hires) and, for multicolor sprites, several colors are shared among sprites — plan these shared palette entries ahead of time to avoid rework.
- Planning these three elements (shape, mode, colors) ahead of time reduces repetitive edits and improves visual consistency across characters/sprites/tiles.

## References
- "graphics_layout_sheets_and_forms" — expands on using grid sheets to design pixels/characters and workflow forms for planning colors and pixels.
