# Kick Assembler — Chapter 12: Import/Export (header)

**Summary:** Introduces Kick Assembler import/export methods including command-line arguments, binary files, SID handling, graphics conversion, file creation, and symbol export; includes a short assembly snippet that writes to VIC-II color registers $D020 and $D021.

**Chapter overview**
This chapter header lists the Kick Assembler features for moving data to/from the assembler: command-line arguments, raw/binary file I/O, SID data import/export, graphics conversion routines, creating output files, and exporting symbol tables. The provided assembly snippet demonstrates writing to the VIC-II border and background color registers; the call `picture.getBackgroundColor()` is a Kick Assembler function that retrieves the background color from a loaded picture.

**Command-line argument syntax and examples**
Kick Assembler allows passing command-line arguments to the script using the `:` notation. For example:


In the script, these variables can be accessed via the `cmdLineVars` hashtable:


**Importing binary files**
To import binary data, use the `.import` directive:


The `binary`, `c64`, and `text` imports can take an offset and a length as optional parameters:


**SID import workflow**
Kick Assembler can import SID files using the `LoadSid` function:


This function returns a value representing the SID file, from which you can extract data such as the init address, play address, and song data. For example:


**Graphics conversion procedures**
Kick Assembler facilitates graphics conversion from formats like GIF and JPG to C64 formats. Use the `LoadPicture` function to load an image:


To convert a picture to a 16x16 multi-color character matrix charset:


The four colors added to the list are the RGB values for the colors that are mapped to each bit pattern.

**File creation options**
To create or overwrite a file on the disk, use the `createFile` function:


For security reasons, you will have to use the `-afo` switch on the command line; otherwise, file generation will be blocked. For example:


**Symbol export format**
By using the `-symbolfile` option at the command line, it's possible to export all the assembled symbols. For example:


This will generate the file `source1.sym` while assembling. The content of `source1.sym` will be:


It's now possible to refer to the labels of `source1.asm` from another file by importing the `.sym` file:


**Definition of picture.getBackgroundColor()**
In the provided assembly snippet, `picture.getBackgroundColor()` is a function that retrieves the background color from a loaded picture. This function is part of the `LoadBinary` function when used with a template that includes a `BackgroundColor` block. For example:


In this context, `picture.getBackgroundColor()` accesses the background color data from the loaded picture.

## Source Code

```bash
java -jar KickAss.jar mySource.asm :x=27 :sound=true :title="Beta 2"
```

```asm
.print "version =" + cmdLineVars.get("version")
.var x = cmdLineVars.get("x").asNumber()
.var y = 2 * x
.var sound = cmdLineVars.get("sound").asBoolean()
.if (sound) jsr $1000
```

```asm
// Import the bytes from the file 'music.bin'
.import binary "Music.bin"

// Import the bytes from the C64 file 'charset.c64'
// (Same as binary but skips the first two address bytes)
.import c64 "charset.c64"

// Import the chars from the text file
// (Converts the bytes as a .text directive would do)
.import text "scroll.txt"
```

```asm
// Import the bytes from the file 'music.bin', but skip the first 100 bytes
.import binary "Music.bin", 100

// Imports $200 bytes starting from position $402 (the two extra bytes are because it's a C64 file)
.import c64 "charset.c64", $400, $200
```

```asm
.var music = LoadSid("C:/c64/HVSC_44-all-of-them/C64Music/Tel_Jeroen/Closing_In.sid")
```

```asm
// Print the music info while assembling
.print ""
.print "SID Data"
.print "--------"
.print "location=$" + toHexString(music.location)
.print "init=$" + toHexString(music.init)
.print "play=$" + toHexString(music.play)
.print "songs=" + music.songs
.print "startSong=" + music.startSong
.print "size=$" + toHexString(music.size)
.print "name=" + music.name
.print "author=" + music.author
.print "copyright=" + music.copyright
```

```asm
.var logo = LoadPicture("CML_32x8.gif")
```

```asm
*=$2800 "Logo"
.var picture = LoadPicture("Picture_16x16.gif", List().add($444444, $6c6c6c, $959595, $000000))
.fill $800, picture.getMulticolorByte(i >> 7, i & $7f)
```

```asm
.var myFile = createFile("breakpoints.txt")
.eval myFile.writeln("Hello World")
```

```bash
java -jar KickAss.jar source.asm -afo
```

```bash
java -jar KickAss.jar source1.asm -symbolfile
```

```asm
.namespace source1 {
.label clearColor = $2000
}
```

```asm
.import source "source1.sym"
jsr source1.clearColor
```

```asm
.const KOALA_TEMPLATE = "C64FILE, Bitmap=$0000, ScreenRam=$1f40, ColorRam=$2328, BackgroundColor=$2710"
.var picture = LoadBinary("picture.prg", KOALA_TEMPLATE)
```

```asm
lda #0
sta $d020
lda #picture.getBackgroundColor()
sta $d021
```

## Key Registers
- $D020-$D021 - VIC-II - Border color ($D020) and Background color ($D021)

## References
- "chapter_11" — previous chapter (contextual reference)