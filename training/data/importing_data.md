# .import directive (Kick Assembler)

**Summary:** The .import directive pulls external file data into your assembly: supports .import binary, .import c64 (skips the two C64 load-address bytes), and .import text (converts bytes according to active encoding). Optional offset and length parameters accept decimal or $hex and .import searches directories given by the -libdir option.

## Description
.import loads raw bytes from external files into the assembled output. There are three forms:
- .import binary "file" — import the raw file bytes.
- .import c64 "file" — same as binary but skips the first two address bytes found in standard .c64 files.
- .import text "file" — reads the file and converts characters the same way a .text directive would, using the current encoding (see encoding_and_charset_options).

Offset and length are optional numeric parameters:
- Syntax: .import <type> "filename", <offset>, <length>
- offset and length may be decimal or hex (hex uses $ prefix in examples).
- When present, offset defines the start position within the file and length limits how many bytes to import.
- Example text shows that for .c64 imports you must account for the two address bytes (see Source Code examples).

File lookup: as with source includes, .import will search folders specified by the -libdir option when resolving filenames.

## Source Code
```asm
// import the bytes from the file 'music.bin'
.import binary "Music.bin"

// Import the bytes from the c64 file 'charset.c64'
// (Same as binary but skips the first two address bytes)
.import c64 "charset.c64"

// Import the chars from the text file
// (Converts the bytes as a .text directive would do)
.import text "scroll.txt"

// import the bytes from the file 'music.bin', but skip the first 100 bytes
.import binary "Music.bin", 100

// Imports $200 bytes starting from position $402 (the two extra bytes is because
// its a c64 file)
.import c64 "charset.c64", $400, $200
```

## References
- "encoding_and_charset_options" — text import conversion depends on current encoding
- "data_directives_and_fill" — imported bytes used as data in .byte/.text contexts
