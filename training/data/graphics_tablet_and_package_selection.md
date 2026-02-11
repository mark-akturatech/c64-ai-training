# Graphics tablets & commercial graphics packages — Koala Pad example; selection criteria, zoom, OOPS, palette mixing

**Summary:** Guidance for using graphics tablets (Koala Pad) and selecting Commodore 64 graphics packages: check the package's graphics mode (commonly multicolor bitmapped mode), how pictures are retrieved from disk (file format/protection), and look for features such as zoom (pixel editing), OOPS (undo), full 16-color support, and palette-mixing capabilities to extend apparent colors.

**Using a graphics tablet**
The Koala Pad is a common touch-pad + software package used to generate background screens and speed production of graphics on the C64. Most commercial drawing packages for the C64 target the multicolor bitmapped mode; if a package uses a different graphics mode than your program expects, the saved data may be unusable without conversion. Even when the package's file format is incompatible with your program, the tool can still be useful for testing color choices and visual composition.

**Selecting a graphics package**
Before purchasing, verify two essential technical details:
- What graphics mode does the package use? (e.g., multicolor bitmap, hi-res, character/multicolor character modes)
- How can the picture be retrieved from disk? (file format, export or raw data access)

Be cautious of software that stores pictures in protected or undocumented formats that require the original program to reload them. If documentation does not describe how to load or export the picture data and the vendor refuses to provide that information, do not purchase the package for production use.

**Useful features to prefer**
- Zoom mode: enables direct pixel-level editing (useful for cleaning freehand work or creating intricate shapes).
- OOPS (undo): an undo command to revert the last change; valuable when experimenting with colors or edits.
- Full color and resolution support: avoid software that restricts the C64's 16-color palette or reduces screen resolution without clear reason.
- Palette mixing / dithering: many good programs provide patterns or dithering options to mix base colors, producing additional apparent shades beyond the 16 hardware colors.

**Koala Pad file format**
The Commodore 64 version of KoalaPainter uses a straightforward file format that corresponds directly to the C64's bitmap graphics memory layout. Each Koala file is 10,003 bytes in size and consists of the following components:

- **Load address:** 2 bytes, typically `$6000` (24576 in decimal), indicating where the file should be loaded into memory.
- **Bitmap data:** 8,000 bytes starting at `$6002`, representing the pixel data for the image.
- **Screen (Video Matrix) data:** 1,000 bytes starting at `$7F42`, containing the screen RAM data that defines which character is displayed at each position.
- **Color RAM data:** 1,000 bytes starting at `$832A`, specifying the color attributes for each character position.
- **Background color:** 1 byte at `$8712`, indicating the background color of the image.

This structure allows the image to be loaded directly into the C64's memory, aligning with the hardware's graphics architecture. ([c64os.com](https://www.c64os.com/post/imageformats?utm_source=openai))

## References
- "koala_pad_overview_and_file_format" — expands on detailed Koala Pad information and file format  
- "sprite_maker_utility" — expands on creating sprites with supplied utilities