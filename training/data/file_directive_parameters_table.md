# Kick Assembler — File Directive Parameters & Disk Parameters (Table 11.1 / 11.2)

**Summary:** This document details the parameters for the `.file` and `.disk` directives in Kick Assembler, including their options, defaults, and usage examples. Key terms include: `mbfiles`, `name`, `type`, `%o`, `prg`, `bin`, `dontSplitFilesOverDir`, `D64`.

**File Directive Parameters (Table 11.1)**

The `.file` directive is used to create output files from specified segments. The parameters for this directive are:

- **mbfiles**: Boolean. If set to `true`, a separate output file is created for each memory block. Default is `false`.
- **name**: String. Specifies the filename template. Supports `%o` substitution, which is replaced with the root source filename without its extension.
- **type**: String. Sets the file type. Valid options are `"prg"` (default) and `"bin"`.
- **segments**: String. Specifies which segments to include in the output file.

**Example Usage:**


In these examples, the `.file` directive is used to create output files with specified names, types, and segments. The `%o` substitution allows for dynamic filename generation based on the source file's name. ([theweb.dk](https://theweb.dk/KickAssembler/webhelp/content/ch11s03.html?utm_source=openai))

**Disk Parameters (Table 11.2)**

The `.disk` directive is used to create D64 disk images. The parameters for this directive include:

- **filename**: String. The name of the disk image file.
- **name**: String. The disk name displayed in the directory. Default is `"UNNAMED"`.
- **id**: String. The disk ID. Default is `" 2A"`.
- **format**: String. Sets the disk format. Options are `"commodore"` (default), `"speeddos"`, and `"dolphindos"`.
- **interleave**: Integer. Sets the default interleave value for the disk. Default is `10`.
- **showInfo**: Boolean. If set to `true`, prints information about the generated disk after creation (e.g., start track, sector). Default is `false`.
- **storeFilesInDir**: Boolean. If set to `true`, files can be stored in the sectors of the directory track not used by the directory itself. Default is `false`.
- **dontSplitFilesOverDir**: Boolean. If set to `true`, any file that would otherwise have sectors located both before and after the directory track will be moved to a location after the directory track to prevent straddling. Default is `false`.

**Example Usage:**


In this example, a disk image named `MyDisk.d64` is created with the disk name `"THE DISK"` and ID `"2021!"`. Several files are added to the disk, each with specific parameters. The `hide` parameter is used to prevent the `"HIDDEN"` file from appearing in the directory listing. ([theweb.dk](https://theweb.dk/KickAssembler/webhelp/content/ch11s05.html?utm_source=openai))

## Source Code

```assembly
// Save a PRG file containing the Code segment
.file [name="MyFile.prg", segments="Code"]

// Save a BIN file containing the Code and Data segments
.file [name="MyFile.bin", type="bin", segments="Code,Data"]

// Save one file for each memory block in the Data segment
// ('Data_Sinus.prg' and 'Data_Mul3.prg' are created)
.file [name="Data.prg", mbfiles, segments="Data"]

// %o in the filename will be replaced with the root source filename without the extension
// If the assembler is called with a file named Source27.asm, this will output to Source27.prg
.file [name="%o.prg", segments="Code"]
```

```assembly
// Create a disk image with specified name and ID
.disk [filename="MyDisk.d64", name="THE DISK", id="2021!"]
{
    [name="BORDER COLORS", type="prg", segments="BORDER_COLORS"],
    [name="BACK COLORS", type="prg<", segments="BACK_COLORS"],
    [name="HIDDEN", type="prg", hide, segments="HIDDEN"],
    [name="MUSIC FROM PRG", type="prg", prgFiles="data/music.prg"],
    [name="MUSIC FROM SID", type="prg", sidFiles="data/music.sid"]
}
```


## References

- ([theweb.dk](https://theweb.dk/KickAssembler/webhelp/content/ch11s03.html?utm_source=openai))
- ([theweb.dk](https://theweb.dk/KickAssembler/webhelp/content/ch11s05.html?utm_source=openai))
- ([theweb.dk](https://www.theweb.dk/KickAssembler/webhelp/content/ch11s06.html?utm_source=openai))