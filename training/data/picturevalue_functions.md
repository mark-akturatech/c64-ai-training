# Kick Assembler: PictureValue and FileValue functions; exporting symbols with -symbolfile

**Summary:** Describes Kick Assembler's PictureValue functions (width, height, getPixel, getSinglecolorByte, getMulticolorByte), the FileValue functions (Table 12.4), and the -symbolfile export behavior including example .asm → .sym output. Includes example assembly and generated .sym contents and references. Mentions VIC-II color registers $D020/$D021 used in the example.

**PictureValue functions**

- **width** — Returns the width of the picture in pixels.
- **height** — Returns the height of the picture in pixels.
- **getPixel(x, y)** — Returns the RGB value of the pixel at position (x, y). Both x and y are given in pixels.
- **getSinglecolorByte(x, y)** — Converts 8 pixels to a single-color byte using the color table. X is given as a byte number (pixel position/8), and y is given in pixels.
- **getMulticolorByte(x, y)** — Converts 4 pixels to a multicolor byte using the color table. X is given as a byte number (pixel position/8), and y is given in pixels. (Note: This function ignores every second pixel since the C64 multicolor format is half the resolution of the single color.)

**FileValue functions (Table 12.4)**

- **writeln(text)** — Writes the given text to the file and inserts a line shift.
- **writeln()** — Inserts a line shift.
- **write(text)** — Writes the given text to the file without inserting a line shift.
- **close()** — Closes the file.

**Exporting labels to other source files (-symbolfile)**

- Using the -symbolfile command-line option causes Kick Assembler to export all assembled symbols into a .sym file during assembly.
- Example: Assembling `source1.asm` with the command:


  will generate the file `source1.sym` containing:


- To refer to labels from `source1.asm` in another file, import the generated `.sym` file:


## Source Code

  ```text
  java -jar KickAss.jar source1.asm -symbolfile
  ```

  ```text
  .namespace source1 {
      .label clearColor = $2000
  }
  ```

  ```asm
  .import source "source1.sym"
  jsr source1.clearColor
  ```


```asm
.filenamespace source1
* = $2000
clearColor:
    lda #0
    sta $D020
    sta $D021
    rts
```

```text
.namespace source1 {
    .label clearColor = $2000
}
```

## Key Registers

- **$D020-$D021** — VIC-II registers for border color ($D020) and background color ($D021), used in the example code.

## References

- [Kick Assembler Manual: Converting Graphics](https://theweb.dk/KickAssembler/webhelp/content/ch12s04.html)
- [Kick Assembler Manual: Exporting Labels to other Sourcefiles](https://www.theweb.dk/KickAssembler/webhelp/content/ch12s06.html)
- [Kick Assembler Manual: Colour Constants](https://theweb.dk/KickAssembler/webhelp/content/ch14s04.html)