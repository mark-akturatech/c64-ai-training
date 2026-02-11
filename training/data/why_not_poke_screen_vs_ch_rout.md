# Why Use CHROUT ($FFD2) Instead of POKE?

**Summary:** CHROUT ($FFD2) — KERNAL character output — accepts ASCII, honors control codes ($0D RETURN), auto-positions the cursor, scrolls, and handles color/character translation; direct POKEs to screen memory (e.g., $0400, $8000, $0C00, $1E00) require manual cursor, scroll, and color management and use screen codes, not ASCII.

**Reasons and Behavior**

- **Automatic Cursor Placement:** CHROUT writes the character at the current cursor position and advances the cursor automatically; a direct POKE requires you to compute and update the cursor position yourself.

- **Automatic Scrolling:** When output reaches the bottom of the screen, CHROUT triggers scrolling as required. A manual POKE won't cause automatic scrolling.

- **ASCII vs. Screen Codes:** CHROUT expects ASCII codes (e.g., character 'X' = $58) and performs any necessary translation into the screen character code used by screen memory (e.g., screen code $18 for 'X' on many systems). Direct POKEs must store the screen-code values, not ASCII.

- **Screen Memory Location Varies by Machine and Program:** Typical default start addresses are shown below, but these can move (VIC-20 notably relocates screen RAM depending on added RAM/assignments). Using CHROUT avoids hardcoding a POKE address that might change.

- **Control Characters Honored:** CHROUT interprets control codes such as $0D (RETURN/new line), cursor movement, color-change control sequences, and other KERNAL-handled controls. A direct POKE only places a byte in RAM; it does not trigger these behaviors.

- **Color Handling on VIC / C64:** The VIC and C64 store color nybbles in separate color RAM. If you POKE screen memory directly, you must also update the color nybble memory. CHROUT will update/display colors via the KERNAL routines, so color is handled automatically.

- **Clearing the Screen via CHROUT:** The KERNAL screen-clear character ($93) can be placed in the accumulator and output via CHROUT to clear the screen (i.e., load $93 and JSR $FFD2).

- **When Direct POKEs Are Appropriate:** There are occasions when direct screen POKEs are the best approach (e.g., highly optimized routines or custom layouts), but for general character output and portability, CHROUT is preferred.

## Source Code

```text
Commodore 64 Screen Memory and Color RAM Layout:

Screen Memory:
Start Address: $0400 (1024 decimal)
End Address: $07E7 (2023 decimal)
Size: 1000 bytes

Color RAM:
Start Address: $D800 (55296 decimal)
End Address: $DBE7 (56295 decimal)
Size: 1000 bytes

Each screen memory location corresponds to a character position on the 40x25 display grid. The color for each character is stored in the corresponding location in color RAM.
```

## Key Registers

- **$FFD2** - KERNAL ROM - CHROUT character output subroutine (accepts ASCII, honors control codes)
- **$0400** - Commodore 64 - Default screen memory start address
- **$D800** - Commodore 64 - Default color RAM start address

## References

- "printing_single_character_steps" — expands on alternatives to direct POKE to display characters
- "print_project_building_H_program" — practical printing example using CHROUT

## Labels
- CHROUT
