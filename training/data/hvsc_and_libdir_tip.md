# Kick Assembler: -libdir Tip and PictureValue Functions (getPixel, getSinglecolorByte, getMulticolorByte)

**Summary:** Kick Assembler's `-libdir` option simplifies SID file path references by setting a base directory, allowing shorter relative paths. The `PictureValue` functions—`width`, `height`, `getPixel(x, y)`, `getSinglecolorByte(x, y)`, and `getMulticolorByte(x, y)`—facilitate image manipulation by providing dimensions and pixel data in various formats.

**-libdir Tip (Kick Assembler / HVSC)**

Utilize Kick Assembler's `-libdir` option to specify the High Voltage SID Collection (HVSC) main directory. This configuration enables referencing SID files using shorter relative paths instead of lengthy absolute filenames. For example, with `-libdir` set to the HVSC main directory, you can load a SID file as follows:


This approach streamlines code and enhances readability.

**PictureValue Functions**

The `PictureValue` class in Kick Assembler provides several attributes and functions for image processing:

- **width**: Returns the width of the picture in pixels.
- **height**: Returns the height of the picture in pixels.
- **getPixel(x, y)**: Returns the RGB value of the pixel at position `(x, y)`. Both `x` and `y` are specified in pixels.
- **getSinglecolorByte(x, y)**: Converts 8 pixels to a single-color byte using the color table. `x` is specified as a byte number (`pixel position / 8`), and `y` is specified in pixels.
- **getMulticolorByte(x, y)**: Converts 4 pixels to a multicolor byte using the color table. `x` is specified as a byte number (`pixel position / 8`), and `y` is specified in pixels. Note: This function ignores every second pixel since the C64 multicolor format has half the resolution of the single-color format.

These functions are essential for converting and manipulating images within Kick Assembler, especially when working with C64 graphics formats.

## Source Code

```assembly
.var music = LoadSid("Tel_Jeroen/Closing_In.sid")
```


```text
Kick Assembler - Tip: use -libdir option to point to HVSC main directory to avoid long filenames. Example: .var music = LoadSid("Tel_Jeroen/Closing_In.sid") when libdir is set.

Table 12.3. PictureValue Functions
Attribute/Function        Description

width                     Returns the width of the picture in pixels.

height                    Returns the height of the picture in pixels.

getPixel(x, y)            Returns the RGB value of the pixel at position (x, y). Both
                          x and y are given in pixels.

getSinglecolorByte(x, y)  Converts 8 pixels to a single-color byte using the color
                          table. x is given as a byte number (= pixel position / 8)
                          and y is given in pixels.

getMulticolorByte(x, y)   Converts 4 pixels to a multicolor byte using the color
                          table. x is given as a byte number (= pixel position / 8)
                          and y is given in pixels. (NB. This function ignores every
                          second pixel since the C64 multicolor format is half the
                          resolution of the single-color format.)
```

## References

- Kick Assembler Manual: [https://www.theweb.dk/KickAssembler/webhelp/content/index.html](https://www.theweb.dk/KickAssembler/webhelp/content/index.html)