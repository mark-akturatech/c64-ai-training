# Kick Assembler — Disk parameters table (part 1)

**Summary:** Disk image parameters for Kick Assembler disk DSL: filename, format ("commodore", "speeddos", "dolphindos"), id (disk id), interleave (default interleave, e.g., 10), name (disk name), dontSplitFilesOverDir (false). Also file-level parameters shown (name, type, lock '<', hide) and use of intermediate segments, prgFiles/sidFiles, storeFilesInDir, and showInfo flags.

**Parameters (overview)**

- **dontSplitFilesOverDir**: false (default). If set to true, files that would otherwise have sectors on both sides of the directory track will be moved to after the directory track.
- **filename**: Disk image file name (e.g., "MyDisk.d64").
- **format**: Disk image format; default "commodore". Options: "commodore", "speeddos", "dolphindos".
- **id**: Disk ID string (e.g., "2021!").
- **interleave**: Numeric default interleave for disk writing (example value: 10).
- **name**: Disk name string (example: "THE DISK!", default "UNNAMED").
- **showInfo**: false by default. If true, prints info about the generated disk after creation (start track, sector, etc.).
- **storeFilesInDir**: false by default. If true, files may be stored in the sectors of the directory track that are not used by the directory itself.

Notes on file entries inside .disk block:

- Files are specified as entries with parameters: name, type, optional flags (hide, lock), and content source (segments, prgFiles, sidFiles).
- Type examples: "prg", "rel" (relative), etc.
- The '<' suffix after a type (e.g., prg<) marks the file as locked.
- Hide flag prevents a file from appearing in the directory; use showInfo to obtain its start track/sector.
- Intermediate "segments" supply file contents; segments can be assembly segments, text, or external file references (see prgFiles/sidFiles).
- prgFiles and sidFiles point to external host files for content (e.g., data/music.prg, data/music.sid).

**Example usage and semantics**

- Setting interleave globally (interleave=10) sets the default interleave value written into the disk creation routine.
- The .disk block demonstrates multiple files: PRG files from segments, an external PRG, a SID file, and REL entries.
- Segments provide a flexible intermediate layer to build PRG contents (assembly code, text, etc.) and can be named and reused by multiple file entries.
- Locked files: add "<" to the type token (prg<) to make a locked PRG.
- Hidden files: add the "hide" flag to omit the file from the directory listing; start track/sector still exists on disk and can be revealed via showInfo.

## Source Code

```text
interleave=10

Sets the default interleave
value for the disk

name

"UNNAMED"

name="THE DISK!"

The disk name

showInfo

false

showInfo

Print info about the generated disk after creation.
(Start track, sector etc.)

storeFilesInDir

false

storeFilesInDir

If set to true, files can be
stored in the sectors of the
directory track not used by
the directory itself.
```

```text
.disk [filename="MyDisk.d64", name="THE DISK", id="2021!" ]
{
[name="----------------", type="rel"
],
[name="BORDER COLORS
", type="prg", segments="BORDER_COLORS" ],
[name="BACK COLORS
", type="prg<", segments="BACK_COLORS"
],
[name="HIDDEN
", type="prg", hide, segments="HIDDEN" ],
[name="----------------", type="rel"
],
[name="MUSIC FROM PRG ", type="prg", prgFiles="data/music.prg" ],
[name="MUSIC FROM SID ", type="prg", sidFiles="data/music.sid" ],
[name="----------------", type="rel"
],
}
```

```asm
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

## Key Registers

- $D020-$D021 - VIC-II - Border ($D020) and background ($D021) color registers

## References

- "disk_parameters_part2" — expands on remaining disk parameters