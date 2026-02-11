# Koala filename utilities and Koala picture memory map

**Summary:** BASIC utilities (COM-KO and KO-COM) convert file names between Koala Pad and Commodore formats; Koala picture memory map: $6000-$7F3F graphics image, $7F40-$8327 colour memory image, $8328-$870F colour RAM image, $8710 background colour. Note about cartridge monitors replacing RAM and preventing file reads.

**Utilities (COM-KO / KO-COM)**

Two BASIC programs (listed in Appendix C as C-12 and C-13) provide filename conversion between Koala Pad and Commodore formats:

- **KO-COM**: Converts a filename from Koala format to Commodore format.
- **COM-KO**: Converts a filename from Commodore format to Koala format; the program will insert the required "special character" at the start of the name automatically.

Both programs prompt for the current filename and the desired new filename. After renaming, use a machine-language monitor to examine and reconfigure the loaded data if needed.

The "special character" inserted by COM-KO is `CHR$(129)`.

**Koala memory map**

Koala-format pictures saved to disk use a fixed memory layout when loaded into RAM:

- **$6000-$7F3F** — Graphics image (binary bitmap)
  - Size: $1F40 bytes (8000 decimal)
- **$7F40-$8327** — Colour memory image (screen-colour bytes)
  - Size: $03E8 bytes (1000 decimal)
- **$8328-$870F** — Colour RAM image (per-character colour nibble RAM)
  - Size: $03E8 bytes (1000 decimal)
- **$8710** — Background colour
  - Size: 1 byte

After loading, the graphics and colour data can be relocated in memory as needed for display or editing.

**Relocation and Save Steps:**

1. **Relocate Graphics Data:**
   - Move the graphics image from $6000-$7F3F to the desired location in memory.
   - Update pointers accordingly to reflect the new location.

2. **Relocate Colour Data:**
   - Move the colour memory image from $7F40-$8327 and the colour RAM image from $8328-$870F to their new locations.
   - Ensure that the VIC-II chip's registers are updated to point to the new locations of the colour data.

3. **Save the Relocated Data:**
   - Use appropriate commands to save the relocated graphics and colour data back to disk.
   - Ensure that the saved file maintains the correct format for future loading and display.

**Notes on loading**

- If you use a cartridge-based machine-language monitor, the cartridge may overlay the RAM area where the Koala file would be loaded, preventing you from reading the file. In that case, remove/disable the cartridge or use a monitor that does not occupy that RAM.
- **Workflow summary:** Rename the file with COM-KO/KO-COM as required, load the file into RAM, inspect and reconfigure using a machine-language monitor, relocate the graphics/colour blocks as desired for display or saving.

## Source Code

```basic
10 INPUT "WHAT IS THE KOALA FILE NAME"; KN$
20 INPUT "WHAT IS THE COMMODORE FILE NAME"; CN$
30 A$ = CHR$(129) + LEFT$(KN$ + " ", 14)
40 CN$ = CN$ + "="
50 OPEN 15, 8, 15, "R0:" + A$ + CN$
60 CLOSE 15
70 END
```

```basic
10 INPUT "WHAT IS THE COMMODORE FILE NAME"; CN$
20 INPUT "WHAT IS THE KOALA FILE NAME"; KN$
30 A$ = CHR$(129) + LEFT$(KN$ + " ", 14)
40 CN$ = "=" + CN$
50 OPEN 15, 8, 15, "R0:" + CN$ + A$
60 CLOSE 15
70 END
```

## References

- "koala_pad_overview_and_file_format" — expands on Koala save format and filename conversion rationale
- "display_pic_usage_and_relocation" — expands on relocating and saving Koala data for display