# Kick Assembler: LoadBinary / BinaryFile Usage

**Summary:** `LoadBinary` in Kick Assembler returns a `BinaryFile` object with methods `getSize()`, `get(i)` (signed Java byte), and `uget(i)` (unsigned byte). These methods are useful with the `.fill` directive to embed arbitrary files into a label. Examples include `.fill picture.getColorRamSize(), picture.getColorRam(i)`. The `BinaryFile` constants (Table 12.1) and `C64FILE` template usage are also discussed.

**Usage**

`LoadBinary("filename")` (often assigned via `.var`) yields a `BinaryFile`-like object exposing at least:

- `getSize()` — number of bytes in the loaded file
- `get(i)` — returns the i-th byte as a signed Java byte (range -128..127)
- `uget(i)` — returns the i-th byte as an unsigned byte (range 0..255)

Common pattern:

- Assign the loaded file to a variable: `.var data = LoadBinary("myDataFile")`
- Use `.fill` to emit the file contents into the current section: `.fill data.getSize(), data.get(i)`

This pattern is frequently used to import bitmap and color-RAM images:

- `.fill picture.getColorRamSize(), picture.getColorRam(i)`
- `.fill picture.getBitmapSize(), picture.getBitmap(i)`

You can reallocate screen and color RAM by combining the `*=` (origin reassign) directive with `.fill`, making it easy to place the loaded data into mapped areas.

Kick Assembler provides built-in `BinaryFile` format constants (see Table 12.1) and supports templates/`C64FILE` tags for more advanced binary handling.

## Source Code

```asm
; Assign a binary file to a variable (BinaryFile object)
.var data = LoadBinary("myDataFile")

; Emit the binary into the current section/label
myData:
    .fill data.getSize(), data.get(i)    ; get(i) returns signed Java byte

; Use unsigned bytes if needed
; .fill data.getSize(), data.uget(i)  ; uget(i) returns 0..255

; Examples for picture data (bitmap + color-RAM)
.fill picture.getColorRamSize(), picture.getColorRam(i)
.fill picture.getBitmapSize(), picture.getBitmap(i)

; Example: Reallocating screen and color RAM using *= and .fill
*=$0c00
.fill picture.getScreenRamSize(), picture.getScreenRam(i)

*=$1c00
colorRam:
.fill picture.getColorRamSize(), picture.getColorRam(i)

*=$2000
.fill picture.getBitmapSize(), picture.getBitmap(i)
```

## References

- Kick Assembler Manual, Chapter 12: Import and Export
- Kick Assembler Manual, Chapter 3: Basic Assembler Functionality
- Kick Assembler Manual, Chapter 4: Introducing the Script Language
- Kick Assembler Manual, Chapter 7: Functions and Macros
- Kick Assembler Manual, Chapter 11: PRG files and D64 Disks
- Kick Assembler Manual, Chapter 10: Segments
- Kick Assembler Manual, Quick Reference
