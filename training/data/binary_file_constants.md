# Kick Assembler: Built-in BinaryFile Constants and SID Header Fields

**Summary:** This document details Kick Assembler's built-in `BinaryFile` constants (`BF_C64FILE`, `BF_BITMAP_SINGLECOLOR`, `BF_KOALA`, `BF_FLI`, `BF_DOODLE`) along with their numeric values and data layouts. It also outlines the structure of SID module headers (`PSID`/`RSID`), including field offsets, lengths, and endianness. Examples of `LoadBinary` usage and screen allocation for Koala pictures are provided.

**BinaryFile Constants**

Kick Assembler provides several `BF_*` constants to guide `LoadBinary` in interpreting common C64 file formats. Below is a comprehensive list of these constants, their numeric values, and descriptions:

- **BF_C64FILE**: `0`
  - Interprets the file as a standard C64 file, skipping the first two bytes (typically the load address) and returning the data payload.

- **BF_BITMAP_SINGLECOLOR**: `1`
  - Handles bitmap data stored without per-cell color RAM, assuming a single color mapping.

- **BF_KOALA**: `2`
  - Processes Koala Paint format files, which contain data in the following order: Bitmap, Screen RAM, Color RAM, and Background Color.

- **BF_FLI**: `3`
  - Supports FLI-format pictures used by certain picture tools and converters.

- **BF_DOODLE**: `4`
  - Manages Doodle-format pictures.

These constants instruct `LoadBinary` on how to map file bytes into screen, bitmap, and color planes. The exact sizes and byte counts per plane are determined by the specific format.

### BF_KOALA Format Details

The Koala Paint format (`BF_KOALA`) consists of the following components:

- **Bitmap Data**: 8,000 bytes
- **Screen RAM**: 1,000 bytes
- **Color RAM**: 1,000 bytes
- **Background Color**: 1 byte

These components are stored sequentially in the file.

**SID Header Fields**

SID module headers (`PSID`/`RSID`) contain metadata about the SID file. Below is a breakdown of the header fields, including their offsets, lengths, and descriptions:

- **magicID**: Offset `0x00`, Length `4 bytes`
  - Contains the ASCII string "PSID" or "RSID".

- **version**: Offset `0x04`, Length `2 bytes`
  - Specifies the header version number.

- **dataOffset**: Offset `0x06`, Length `2 bytes`
  - Indicates the offset to the start of the C64 binary data.

- **loadAddress**: Offset `0x08`, Length `2 bytes`
  - Specifies the load address of the C64 binary data.

- **initAddress**: Offset `0x0A`, Length `2 bytes`
  - Address of the initialization routine.

- **playAddress**: Offset `0x0C`, Length `2 bytes`
  - Address of the play routine.

- **songs**: Offset `0x0E`, Length `2 bytes`
  - Number of songs in the file.

- **startSong**: Offset `0x10`, Length `2 bytes`
  - Default song to start with.

- **speed**: Offset `0x12`, Length `4 bytes`
  - Speed flags indicating the timing of the play routine.

- **name**: Offset `0x16`, Length `32 bytes`
  - Null-terminated string containing the name of the module.

- **author**: Offset `0x36`, Length `32 bytes`
  - Null-terminated string containing the author's name.

- **copyright**: Offset `0x56`, Length `32 bytes`
  - Null-terminated string containing copyright information.

All multi-byte values are stored in big-endian format.

## Source Code

```asm
; Example Kick Assembler usage (KickASM directives)
.var fliPicture = LoadBinary("GreatPicture", BF_FLI)

; Print a constant value (for debugging)
.print "Koala format=" + BF_KOALA

; BF constants mentioned in source
; BF_C64FILE       ; C64 file: skips first two bytes (load address)
; BF_BITMAP_SINGLECOLOR
; BF_KOALA         ; Bitmap, Screen RAM, Color RAM, Background Color
; BF_FLI
; BF_DOODLE
; (other BF_* constants exist in Kick Assembler but are not listed here)
```

```text
; Koala picture example and screen allocation code
.var koalaPicture = LoadBinary("Picture.koa", BF_KOALA)
.var bitmap = koalaPicture.get(0, 8000)
.var screenRam = koalaPicture.get(8000, 1000)
.var colorRam = koalaPicture.get(9000, 1000)
.var backgroundColor = koalaPicture.get(10000, 1)

* = $2000
.bitmapData
    .fill bitmap.size(), bitmap.get(i)

* = $0400
.screenRamData
    .fill screenRam.size(), screenRam.get(i)

* = $D800
.colorRamData
    .fill colorRam.size(), colorRam.get(i)

* = $D020
    .byte backgroundColor.get(0)
```