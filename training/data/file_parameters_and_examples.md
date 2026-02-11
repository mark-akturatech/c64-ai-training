# Kick Assembler: .disk File Maps and .segment-Sourced Files

**Summary:** Describes Kick Assembler's `.disk` directive, detailing file parameter maps and the use of `.segment` definitions as file sources. Searchable terms include `.disk`, `.segment`, `interleave`, `noStartAddr`, `hide`, `type` ("prg", "seq", "del", "usr", "rel", and appended "<"), and PRG/SID file sources.

**Overview**

Kick Assembler's `.disk` directive facilitates the creation of D64 disk images by specifying a list of file parameter maps that control how files are placed on the disk. File contents can originate from:

- Intermediate `.segment` definitions (e.g., `BORDER_COLORS`, `BACK_COLORS`, `HIDDEN`)
- External PRG files already on disk (`prgFile`)
- SID files and other external files
- On-disk file lists provided to the `.disk` directive

The `.disk` directive has the following format:

The writer name is optional; if omitted, the default disk writer is used. Otherwise, the writer name specifies a third-party disk writer imported from a plugin. ([theweb.dk](https://www.theweb.dk/KickAssembler/webhelp/content/ch11s04.html?utm_source=openai))

### File Parameter Map Fields

Each file parameter map within the `.disk` directive can include the following fields:

- **`segment`** (string): Specifies the name of the `.segment` definition to use as the file's content source.
- **`file`** (string): Specifies the path to an external file to include on the disk.
- **`prgFile`** (string): Specifies the path to an external PRG file to include on the disk.
- **`name`** (string): The filename to be placed in the directory (e.g., `name="NOTE"`).
- **`type`** (string): The file type for the directory entry. Valid types are:
  - `"del"`
  - `"seq"`
  - `"prg"`
  - `"usr"`
  - `"rel"`
  
  Appending a `<` character to the type string (e.g., `type="prg<"`) indicates a locked file. A locked file cannot be overwritten or deleted using standard DOS commands.
- **`interleave`** (integer): Sets the track interleave for the file. The default interleave is 10 (e.g., `interleave = 10`).
- **`hide`** (boolean): If `true`, the file will not be shown in the directory.
- **`noStartAddr`** (boolean): If `true`, the two load address bytes normally prepended to a PRG file will not be added as the first two bytes on disk.

Boolean values for `hide` and `noStartAddr` are specified as `true` or `false`.

### Disk Parameters

The `.disk` directive can also include disk parameters to define properties of the disk image:

- **`filename`** (string): The name of the disk image file (e.g., `filename="MyDisk.d64"`).
- **`name`** (string): The disk name displayed in the directory (e.g., `name="THE DISK"`).
- **`id`** (string): The disk ID displayed in the directory (e.g., `id="2021!"`).
- **`dontSplitFilesOverDir`** (boolean): If `true`, files that would otherwise have sectors on both sides of the directory track will be moved to after the directory track.

For example:

In this example:

- `BORDER_COLORS` is included as a PRG file named "NOTE" with an interleave of 10.
- `BACK_COLORS` is included as a locked and hidden PRG file named "BACK".
- An external SID file "theme.sid" is included as a PRG file named "THEME".
- An external PRG file "tool.prg" is included as "TOOL" without the start address bytes.

This setup demonstrates the flexibility of the `.disk` directive in managing various file types and attributes within a disk image.

## Source Code

```asm
.disk [filename="MyDisk.d64", name="DISK NAME", id="ID"] {
    { segment = "SEGMENT_NAME", name = "FILENAME", type = "FILE_TYPE", interleave = INTERLEAVE_VALUE, hide = HIDE_VALUE, noStartAddr = NOSTARTADDR_VALUE },
    { file = "EXTERNAL_FILE", name = "FILENAME", type = "FILE_TYPE" },
    { prgFile = "PRG_FILE", name = "FILENAME", noStartAddr = NOSTARTADDR_VALUE }
}
```

```asm
.disk [filename="MyDisk.d64", name="THE DISK", id="2021!"] {
    { segment = "BORDER_COLORS", name = "NOTE", type = "prg", interleave = 10 },
    { segment = "BACK_COLORS", name = "BACK", type = "prg<", hide = true },
    { file = "theme.sid", name = "THEME", type = "prg" },
    { prgFile = "tool.prg", name = "TOOL", noStartAddr = true }
}
```

```asm
; Representative examples of file parameter maps and .segment usage
; (adapt to Kick Assembler version / syntax used in your project)

; Intermediate segments used as file content sources
.segment "BORDER_COLORS"
    ; ... bytes that become a PRG on disk ...
.segment "BACK_COLORS"
    ; ...
.segment "HIDDEN"
    ; ...

; .disk example with a list of file parameter maps
.disk [filename="MyDisk.d64", name="THE DISK", id="2021!"] {
    { segment = "BORDER_COLORS", name = "NOTE", type = "prg", interleave = 10 },
    { segment = "BACK_COLORS", name = "BACK", type = "prg<", hide = true },   ; Locked + hidden
    { file = "theme.sid", name = "THEME", type = "prg" },                     ; External SID file referenced
    { prgFile = "tool.prg", name = "TOOL", noStartAddr = true }               ; Raw file without 2-byte start addr
}

; (Note: Field names and exact syntax vary by Kick Assembler release — adapt as needed)
```

## References

- Kick Assembler Manual: [The Disk Directive](https://www.theweb.dk/KickAssembler/webhelp/content/ch11s04.html)
- Kick Assembler Manual: [The File Directive](https://www.theweb.dk/KickAssembler/webhelp/content/ch11s03.html)
- Kick Assembler Manual: [Segments](https://www.theweb.dk/KickAssembler/webhelp/content/ch10s03.html)
