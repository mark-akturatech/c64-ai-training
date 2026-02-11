# LoadBinary Template Tags and BF_* Flags (Kick Assembler)

**Summary:** Describes Kick Assembler's LoadBinary template string syntax for naming memory blocks (e.g., "Xcoord=0,Ycoord=$100,BounceData=$200") so the returned object exposes getXSize/getX functions per block; documents special template tag C64FILE (skip first two bytes of native C64 file) and BF_* flags (BF_C64FILE, BF_BITMAP_SINGLECOLOR, BF_KOALA).

**Template Format**

A LoadBinary template is a comma-separated list of block assignments in the form:

- Name=Address

Names become blocks in the returned structure; the loader returns an object which exposes getXSize/getX functions per block (one pair per Name). Addresses may be decimal or hexadecimal using Kick Assembler hex notation ($hex). Example: "Xcoord=0,Ycoord=$100,BounceData=$200".

Special template tag:

- C64FILE — when present in the template, tells LoadBinary to treat the input as a native C64 file and to ignore the first two address bytes (skip the two-byte load address header).

Behavior summary:

- Each Name becomes a memory block accessible via generated accessor functions on the returned value (getXSize/getX per block).
- Template parsing is comma-separated; spaces are allowed but not significant.

**Flags / BF_* Tokens**

- BF_C64FILE
  - Meaning: A C64 file (the first two bytes are skipped). Equivalent in effect to using the C64FILE tag in a template.
- BF_BITMAP_SINGLECOLOR
  - Meaning: Indicates a ScreenRam, Bitmap pair in the "Bitmap single color" format (the format output by Timanthes).
- BF_KOALA
  - Meaning: Represents files from Koala Paint, consisting of Bitmap, ScreenRam, ColorRam, and BackgroundColor blocks.

## References

- "import_of_binary_files_loadbinary" — expands on LoadBinary usage and templates (search this for extended examples and API details)
