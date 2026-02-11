# Kick Assembler — Import/Export: command-line args, LoadBinary, and custom disk writer calls

**Summary:** Covers Kick Assembler command-line variable passing (cmdLineVars, :name=value), the LoadBinary API with get/uget, templates and the special C64FILE tag (ignores two-byte start address), plus syntax to invoke a custom disk writer plugin (.plugin / .disk and file params like segments, prgFiles).

**Command-line arguments (cmdLineVars)**
Kick Assembler accepts command-line assignments using the ":" notation (java -jar KickAss.jar mySource.asm :x=27 :sound=true ...). These populate a hashtable available as the global variable cmdLineVars. Values are strings and must be converted in the script:

- Access raw string: cmdLineVars.get("name")
- Convert to number: .var v = cmdLineVars.get("x").asNumber()
- Convert to boolean: .var flag = cmdLineVars.get("sound").asBoolean()

Use converted values directly in expressions and control flow (example: .if (sound) jsr $1000). The hashtable holds only strings until converted.

**LoadBinary — importing binary files and templates**
LoadBinary loads an entire file into a variable. Use .get(i) to read bytes (signed per Java: $FF → -1). Use .uget(i) for unsigned bytes ($FF → 255). Use .getSize() to obtain the file length.

Template strings let you name blocks and give start offsets (relative to file start). When a template is provided, the returned object exposes get<BlockName> and get<BlockName>Size functions for each block. Example usage fills memory labels from the file blocks.

Special tag C64FILE in a template treats the input as a native C64 file and ignores the first two bytes (the two-byte start address present in C64 PRG files).

**Custom disk writers (plugin invocation)**
A custom disk writer is implemented as a Java plugin and invoked from the script. The syntax shown:

- Load plugin: .plugin "myplugins.Mydiskwriter"
- Call disk writer: .disk MyDiskWriter [.. disk params ...] { [..file params.., segments="Code,Data"], [..file params.., prgFiles="data/music.prg"], }

File parameters referenced (from Table 11.3):

- **hide**: If set to true, the file will not be shown in the directory.
- **interleave**: Sets the interleave of the file.
- **name**: The filename.
- **noStartAddr**: If set to true, the two address bytes won't be added as the first two bytes on the disk.
- **type**: The type of the file. Available types are: "del", "seq", "prg", "usr", "rel". Append '<' to the end of the type to mark it as locked.

## Source Code
```text
// Command-line example
java -jar KickAss.jar mySource.asm :x=27 :sound=true :title="Beta 2"
```

```asm
// Accessing cmdLineVars in script
.print "version =" + cmdLineVars.get("version")
.var x = cmdLineVars.get("x").asNumber()
.var y = 2*x
.var sound = cmdLineVars.get("sound").asBoolean()
.if (sound) jsr $1000
```

```asm
// Load a binary file and dump to memory
// Load the file into the variable 'data'
.var data = LoadBinary("myDataFile")
// Dump the data to the memory
myData: .fill data.getSize(), data.get(i)
```

```asm
// Unsigned read example via uget (use when processing values)
; data.uget(i) returns 0..255 instead of -128..127
```

```asm
// Template example: named blocks with offsets (relative to file start)
.var dataTemplate = "Xcoord=0,Ycoord=$100, BounceData=$200"
.var file = LoadBinary("moveData", dataTemplate)
Xcoord:
    .fill file.getXCoordSize(), file.getXCoord(i)
Ycoord:
    .fill file.getYCoordSize(), file.getYCoord(i)
BounceData:
    .fill file.getBounceDataSize(), file.getBounceData(i)

// Use file.ugetXCoord(i) etc. for unsigned bytes
```

```asm
// Loading a Koala Paint file using the C64FILE tag (ignores first two bytes)
.const KOALA_TEMPLATE = "C64FILE, Bitmap=$0000, ScreenRam=$1f40, ColorRam=$2328, BackgroundColor=$2710"
.var picture = LoadBinary("picture.prg", KOALA_TEMPLATE)
```

```text
// Custom disk writer plugin invocation (example)
.plugin "myplugins.Mydiskwriter"
.disk MyDiskWriter [.. disk params...]
{
  [ ..file params.., segments="Code,Data"],
  [ ..file params.., prgFiles="data/music.prg"],
}
```

## References
- "3rd Party Java plugins" — describes plugin implementation (referenced but full text not included here)