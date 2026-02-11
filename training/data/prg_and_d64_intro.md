# Kick Assembler: .file and .disk directives (Chapter 11 introduction)

**Summary:** Describes Kick Assembler's `.file` and `.disk` directives for producing PRG files and D64 disk images; details parameters such as `mbfiles`, `name`, and `type`; explains the built-in disk writer based on CC1541 and support for plugin writers.

**Directives**

**.file**

- Writes assembler output to a host file, typically a PRG (Commodore program file).

**.disk**

- Creates disk images (e.g., `.d64`) by assembling directly into a disk image or by selecting existing hard-disk files to include in the image.
- Utilizes a built-in disk writer (based on CC1541) to write images to media or devices supported by that writer.
- Supports plugin writers, allowing the use of third-party or custom writers instead of the built-in writer.

**Parameters**

- **mbfiles** — Default: `false`
  - If set to `true`, a separate file is created for each memory block.
- **name** — Mandatory parameter specifying the filename.
  - Accepts a string; `%o` within the string is replaced with the root source filename without the extension.
  - Example: `name="%o.prg"` will output to `Source27.prg` if the source file is `Source27.asm`.
- **type** — Default: `"prg"`
  - Sets the file type. Valid types are `"prg"` and `"bin"`.

**Behavior Notes**

- `.file` is used to save assembled output directly to a host file, commonly a PRG.
- `.disk` is used to produce D64-style images or to assemble directly into a disk image; it can also select and include files from the host filesystem into the created disk image.
- The built-in disk writer is based on CC1541, a tool by Andreas Larsson, rewritten in Java for integration with Kick Assembler. This writer covers standard disk creation needs. For specialized requirements, plugin writers can be used.

## Source Code

```assembly
// Save a PRG file containing the code segment
.file [name="MyFile.prg", segments="Code"]

// Save a BIN file containing the code and data segments
.file [name="MyFile.bin", type="bin", segments="Code,Data"]

// Save one file for each memory block in the DATA segment
// ('Data_Sinus.prg' and 'Data_Mul3.prg' are created)
.file [name="Data.prg", mbfiles, segments="Data"]

// %o in the filename will be replaced with the root source filename without the extension
// If the assembler is called with a file named Source27.asm, this will output to Source27.prg
.file [name="%o.prg", segments="Code"]

// Define some segments
.segment Code []
BasicUpstart2(start)
start:  inc $d020
        jmp *-3

.segment Data []
*=$0f00 "Mul3"
.fill $40, i*3        

*=$2000 "Sinus"
.fill $100, 127.5 + 127.5*sin(toRadians(i*360/256))
```

```assembly
// Create a disk image with specified name and ID
.disk [filename="MyDisk.d64", name="THE DISK", id="2021!"]
{
    [name="BORDER COLORS   ", type="prg", segments="BORDER_COLORS"],
    [name="BACK COLORS     ", type="prg<", segments="BACK_COLORS"],
    [name="HIDDEN          ", type="prg", hide, segments="HIDDEN"],
    [name="MUSIC FROM PRG  ", type="prg", prgFiles="data/music.prg"],
    [name="MUSIC FROM SID  ", type="prg", sidFiles="data/music.sid"],
}

// Define segments
.segment BORDER_COLORS []
BasicUpstart2(start1) 
start1: inc $d020
        jmp *-3

.segment BACK_COLORS []
BasicUpstart2(start2) 
start2: dec $d021
        jmp *-3

.segment HIDDEN []
.text "THIS IS THE HIDDEN MESSAGE!"
```

## References

- [Kick Assembler Manual: The File Directive](https://theweb.dk/KickAssembler/webhelp/content/ch11s03.html)
- [Kick Assembler Manual: The Disk Directive](https://theweb.dk/KickAssembler/webhelp/content/ch11s04.html)
- [Kick Assembler Manual: File Parameters](https://www.theweb.dk/KickAssembler/webhelp/content/ch11s06.html)
- [Kick Assembler Manual: Segments](https://theweb.dk/KickAssembler/webhelp/content/ch10s03.html)