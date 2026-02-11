# Kick Assembler — Segment parameters: start, startAfter, virtual; .file/.disk (PRG & D64)

**Summary:** Covers Kick Assembler segment parameters `start`, `startAfter`, `virtual`, and `sidFiles`, plus the `.file` and `.disk` directives and parameter-map syntax for creating PRG and D64 images. Includes examples for `.file` usage and a segment snippet showing `start` usage.

**Segment parameter semantics**

- `start=$1000`  
  Sets the start of the default memory block to the given expression (example: `start=$1000`).

- `startAfter="Code"`  
  Makes the default memory block start after the named segment.

- `virtual`  
  Marks all memory blocks in the segment as virtual, meaning they are not output to the final binary but can be used for calculations or placeholders during assembly. This is useful for defining data structures or tables that don't need to be present in the final output. ([theweb.dk](https://www.theweb.dk/KickAssembler/webhelp/content/ch10s03.html?utm_source=openai))

- `sidFiles="music.sid"`  
  Includes the data of a SID file as a memory block. This allows embedding SID music data directly into your program. ([theweb.dk](https://www.theweb.dk/KickAssembler/webhelp/content/ch10s17.html?utm_source=openai))

**Parameter maps**

Parameter maps are square-bracketed, comma-separated lists used by `.file` and `.disk` directives. Values may be strings, numbers, booleans, etc. Example form:
`[name="Bob", age=27, useGlasses=false, wearsTshirt]`

A parameter without an assignment is shorthand for the boolean `true` (`wearsTshirt` → `wearsTshirt=true`).

**The .file directive (PRG/BIN/mbfiles)**

- **Purpose:** Create PRG (or BIN) files using segments or explicit files as content; adds more options than the segment `outPrg` parameter.
- **Usage notes:**
  - The `name` parameter is mandatory; other parameters are optional.
  - `segments="Code,Data"` selects which segments to include.
  - `type="bin"` switches output to raw binary instead of PRG.
  - `mbfiles` causes one output file per memory block in a segment (e.g., `Data_Sinus.prg`, `Data_Mul3.prg`).
  - `%o` in the filename is replaced with the root source filename (without extension).
- The `.file` directive uses an intermediate segment for file content, so it accepts the same segment options (`start`, `startAfter`, `virtual`, `fills`, `labels`, etc.).

**File Directive Parameters:**

| Parameter | Default | Example                   | Description                                                                 |
|-----------|---------|---------------------------|-----------------------------------------------------------------------------|
| `mbfiles` | `false` | `mbfiles`                 | If set to true, a file is created for each memory block.                    |
| `name`    |         | `name="MyFile.prg"`       | The name of the file. (%o will be replaced with the root filename.)         |
| `type`    | `"prg"` | `type="bin"`              | Sets the file type. Valid types are "prg" and "bin".                        |
| `segments`|         | `segments="Code,Data"`    | Specifies which segments to include in the file.                            |
| `sidFiles`|         | `sidFiles="music.sid"`    | Includes the data of a SID file as a memory block.                          |

([theweb.dk](https://theweb.dk/KickAssembler/webhelp/content/ch11s03.html?utm_source=openai))

**The .disk directive (D64)**

- **Purpose:** Create D64 disk images by collecting parameters and invoking a disk writer.
- **Behavior:**
  - Can add files from the host filesystem into a disk image, assemble directly to a disk using segments, or mix methods.
  - The directive collects parameters and passes them to a disk writer implementation (built-in or plugin).
  - Built-in writer: a Java port of CC1541 (by Andreas Larsson) used for standard disk creation; plugin writers permit specialized output/loaders.

**General File Parameters:**

| Parameter     | Default | Example               | Description                                                                 |
|---------------|---------|-----------------------|-----------------------------------------------------------------------------|
| `hide`        | `false` | `hide`                | If set to true, the file will not be shown in the directory.                |
| `interleave`  | Disk's default | `interleave=10` | Sets the interleave of the file.                                            |
| `name`        | `""`    | `name="NOTE"`         | The filename.                                                              |
| `noStartAddr` | `false` | `noStartAddr`         | If set to true, the two address bytes won't be added as the first two file bytes on the disk. |
| `type`        | `"prg"` | `type="prg<"`         | The type of the file. Available types are: "del", "seq", "prg", "usr", "rel". You can append a "<" to the end of the type to mark it as locked. |

([theweb.dk](https://www.theweb.dk/KickAssembler/webhelp/content/ch11s06.html?utm_source=openai))

## Source Code
```text
// .file directive examples
// Save a prg file containing the code segment
.file [name="MyFile.prg", segments="Code"]
// Save a bin file containing the code and data segment
.file [name="MyFile.bin", type="bin", segments="Code,Data"]
// Save one file for each memory block in the DATA segment
// ('Data_Sinus.prg' and 'Data_Mul3.prg' are created)
.file [name="Data.prg", mbfiles, segments="Data"]
// %o in the filename will be replaced with the name of the root source
// file without the extension
// If you called the assembler with a file called Source27.asm this will
// output to Source27.prg
.file [name="%o.prg", segments="Code"]
```

```asm
start:

// Define some segments
.segment Code []
BasicUpstart2(start)
inc $d020
jmp *-3
.segment Data []
*=$0f00 "Mul3"
.fill $40, i*3
*=$2000 "Sinus"
.fill $100, 127.5 + 127.5*sin(toRadians(i*360/256))
```

```text
// Parameter map example syntax
[name="Bob", age=27, useGlasses=false, wearsTshirt]
```

## References
- "segment_parameters_part1" — earlier segment parameters and more detailed segment options (referenced as containing expanded parameter descriptions).