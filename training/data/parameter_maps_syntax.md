# Kick Assembler: .file / .disk Parameter Maps (Square-Bracket Maps)

**Summary:** Describes Kick Assembler parameter maps used by .file and .disk directives: square-bracket, comma-separated key=value pairs and unassigned trailing keys as boolean true. Covers syntax, value types, and example parameters (mbfiles, name, type, segments, hide, interleave, noStartAddr, prgFiles, sidFiles).

**Syntax and Semantics**

Parameter maps are attached to directives using square brackets with comma-separated entries:

- Format: `.directive [key=value, key2="string", flagKey]`
- Keys are identifiers. Values may be string literals (double quotes), numeric literals (e.g., 27), or boolean literals (true/false).
- An unassigned trailing parameter (an identifier with no `=`) is shorthand for boolean true. Example: `wearsTshirt` is equivalent to `wearsTshirt=true`.
- Whitespace around commas, equals, and values is permitted.
- These maps are used by `.file` and `.disk` to pass named options to the directive processor.

Short example (combined forms):

- `[name="Bob", age=27, useGlasses=false, wearsTshirt]` — here `wearsTshirt` is treated as `wearsTshirt=true`.

**Supported Parameters for .file and .disk Directives**

### .file Directive Parameters

- **name**: File name string, e.g., `name="MyFile.prg"`. The `%o` placeholder in the filename will be replaced with the root source file name without the extension. This parameter is mandatory.
- **type**: Sets the file type. Valid types are `"prg"` and `"bin"`. Default is `"prg"`. Example: `type="bin"`.
- **segments**: Specifies which segments to include in the file. Example: `segments="Code,Data"`.
- **mbfiles**: If set to true, a separate file is created for each memory block. Example: `mbfiles=true`.
- **prgFiles**: Includes program files as memory blocks. Example: `prgFiles="data/music.prg"`.
- **sidFiles**: Includes the data of a SID file as a memory block. Example: `sidFiles="music.sid"`.

### .disk Directive Parameters

- **filename**: The name of the disk image. Example: `filename="MyDisk.d64"`.
- **name**: The disk name. Example: `name="THE DISK"`.
- **id**: The disk ID. Example: `id="2021!"`.
- **format**: Sets the format of the disk. Options are `"commodore"`, `"speeddos"`, and `"dolphindos"`. Default is `"commodore"`. Example: `format="speeddos"`.
- **interleave**: Sets the default interleave value for the disk. Example: `interleave=10`.
- **showInfo**: If set to true, prints info about the generated disk after creation (start track, sector, etc.). Example: `showInfo=true`.
- **storeFilesInDir**: If set to true, files can be stored in the sectors of the directory track not used by the directory itself. Example: `storeFilesInDir=true`.
- **dontSplitFilesOverDir**: If set to true, files that would otherwise have sectors on both sides of the directory track will be moved to after the directory track. Example: `dontSplitFilesOverDir=true`.

### File Parameters within .disk Directive

- **name**: The filename. Example: `name="NOTE"`.
- **type**: The type of the file. Available types are: `"del"`, `"seq"`, `"prg"`, `"usr"`, `"rel"`. You can append a `<` to the end of the type to mark it as locked. Example: `type="prg<"`.
- **hide**: If set to true, the file will not be shown in the directory. Example: `hide=true`.
- **interleave**: Sets the interleave of the file. Example: `interleave=10`.
- **noStartAddr**: If set to true, the two address bytes won't be added as the first two bytes on the disk. Example: `noStartAddr=true`.
- **segments**: Specifies which segments to include in the file. Example: `segments="Code,Data"`.
- **prgFiles**: Includes program files as memory blocks. Example: `prgFiles="data/music.prg"`.
- **sidFiles**: Includes the data of a SID file as a memory block. Example: `sidFiles="music.sid"`.

**Numeric Literal Formats**

Numeric literals in Kick Assembler can be specified in various formats:

- **Decimal**: Standard numbers without any prefix. Example: `27`.
- **Hexadecimal**: Prefixed with `$`. Example: `$1B` (equivalent to decimal 27).
- **Binary**: Prefixed with `%`. Example: `%11011` (equivalent to decimal 27).

These formats can be used interchangeably in parameter maps. For example:

- `[name="Example", size=$1B]` — here, `size` is set to 27 in hexadecimal.
- `[name="Example", size=%11011]` — here, `size` is set to 27 in binary.

## Source Code

```asm
; Examples of .file / .disk parameter maps in Kick Assembler syntax:

.file [name="MyFile.prg"]
.file [mbfiles=true]
.file [name="Bob", age=27, useGlasses=false, wearsTshirt]

.disk [filename="MyDisk.d64", name="THE DISK", id="2021!"]
{
    [name="BORDER COLORS", type="prg", segments="BORDER_COLORS"],
    [name="BACK COLORS", type="prg<", segments="BACK_COLORS"],
    [name="HIDDEN", type="prg", hide, segments="HIDDEN"],
    [name="MUSIC FROM PRG", type="prg", prgFiles="data/music.prg"],
    [name="MUSIC FROM SID", type="prg", sidFiles="data/music.sid"]
}

; Trailing-key shorthand:
.file [mbfiles, name="Split.prg"]  ; mbfiles is treated as mbfiles=true
```

## References

- "file_directive_examples" — expands on file directive uses and parameter maps
- Kick Assembler Manual: [The File Directive](https://theweb.dk/KickAssembler/webhelp/content/ch11s03.html)
- Kick Assembler Manual: [The Disk Directive](https://theweb.dk/KickAssembler/webhelp/content/ch11s04.html)
- Kick Assembler Manual: [File Parameters](https://www.theweb.dk/KickAssembler/webhelp/content/ch11s06.html)
- Kick Assembler Manual: [Numeric Values](https://www.theweb.dk/KickAssembler/webhelp/content/ch04s04.html)