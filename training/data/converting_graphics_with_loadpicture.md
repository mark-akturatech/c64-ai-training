# Kick Assembler: LoadPicture, Picture API and createFile usage

**Summary:** Describes Kick Assembler's LoadPicture API (LoadPicture, getSinglecolorByte, getMulticolorByte, getPixel, palette List().add()) for converting GIF/JPG to C64 single-color and multi-color formats, and the createFile API (createFile, writeln) with required -afo command-line switch and an example generating VICE breakpoints.

**LoadPicture and picture value functions**
LoadPicture loads an image file and returns a picture value with methods to extract C64-ready bytes.

- **LoadPicture(filename)** — loads an image (GIF/JPG). Overload: **LoadPicture(filename, paletteList)** where paletteList is created with List().add(RGB values) and used for multi-color conversion.
- **picture.getSinglecolorByte(xByte, yPacked)** — used to produce a single-color byte. Example call shown in Source Code.
- **picture.getMulticolorByte(xByte, yPixel)** — converts 4 pixels into one multi-color byte using the provided color table (palette). X is given as a byte number (= pixel position/8) and y is given in pixels. Note: getMulticolorByte ignores every second pixel because C64 multi-color mode has half horizontal resolution compared to single-color.
- **picture.getPixel(x, y)** — returns the RGB value of the specified pixel (for extracting colors).

Additional picture functions include:

- **picture.width** — returns the width of the picture in pixels.
- **picture.height** — returns the height of the picture in pixels.

**Converting examples (single-color and multi-color)**
- Single-color example uses LoadPicture and picture.getSinglecolorByte with shifts/masks to map loop indices into X and Y parameters for the function.
- Multi-color example shows passing a palette (List().add with RGB hex values) to LoadPicture and using getMulticolorByte to create packed multi-color bytes.

(The exact parameter packing shown in the examples is preserved in the Source Code section.)

**Writing user-defined files: createFile**
- **createFile(filename)** — creates or overwrites a file on disk and returns a file handle (value) with write methods such as writeln.
- **file.writeln(text)** — writes the 'text' to the file and inserts a line shift.
- **file.writeln()** — inserts a line shift.

Example usage uses .eval to call the file handle's writeln method from assembler code generation.

**Security:** File creation is blocked by default. You must run Kick Assembler with the -afo switch to allow file output. Example: `java -jar KickAss.jar source.asm -afo`

**Typical use case:** Generate auxiliary files for emulators (e.g., VICE breakpoint files). VICE can be run with the generated breakpoint file using its -moncommands switch so it will run until the breakpoint and then exit to the monitor.

## Source Code
```asm
; Single-color logo placement example
; Set origin and load picture into a variable
*=$2000
.var logo = LoadPicture("CML_32x8.gif")

; Fill memory at $0800 with single-color bytes computed from logo
; (example loop index 'i' assumed)
.fill $800, logo.getSinglecolorByte((i>>3)&$1f, (i&7) | (i>>8)<<3)

; Alternative loops can be used to compute indices as needed
```

```asm
; Multi-color example with palette
.var picture = LoadPicture("Picture_16x16.gif", List().add($444444,$6c6c6c,$959595,$000000))
; Fill memory at $0800 with multi-color bytes computed from picture
.fill $800, picture.getMulticolorByte(i>>7,i&$7f)
; Note: getMulticolorByte converts 4 pixels to a multi-color byte using the color table.
; X is a byte number (= pixel position/8), Y is in pixels. Every second pixel is ignored
; because multi-color is half horizontal resolution.
```

```asm
; Extract an RGB pixel value
; picture.getPixel(x,y) returns the RGB value for pixel at (x,y)
.var c = picture.getPixel(3, 2)
```

```asm
; createFile example: generate a breakpoint file for VICE
.var brkFile = createFile("breakpoints.txt")
.macro break() {
  .eval brkFile.writeln("break " + toHexString(*))
}

*=$0801 "Basic"
BasicUpstart(start)

*=$1000 "Code"
start:
  inc $d020
  break()
  jmp start
```

```text
; Command line: must enable file output
java -jar KickAss.jar source.asm -afo

; Run VICE with the breakpoint file:
x64 -moncommands breakpoints.txt
```

## Key Registers
- $D020 - VIC-II - background/border color register (used in example code with INC $D020)

## References
- [Kick Assembler Manual: Writing to User Defined Files](https://theweb.dk/KickAssembler/webhelp/content/ch12s05.html)
- [Kick Assembler Manual: Data Structures](https://theweb.dk/KickAssembler/webhelp/content/cpt_DataStructures.html)