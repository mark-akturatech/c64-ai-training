# Kick Assembler .disk Directive

**Summary:** Describes Kick Assembler's `.disk` directive for creating `.d64` disk images, detailing its syntax, parameters, default values, constraints, and behavior.

**Usage**

The `.disk` directive in Kick Assembler is used to create disk images (typically `.d64`) directly from the assembler source. Its general syntax is:


- **filename**: Specifies the output disk image filename. Supports `%o` substitution to insert the source filename without extension.
- **name**: Sets the disk's name label (default: "UNNAMED").
- **id**: Sets the disk's identifier (default: " 2A").
- **format**: Defines the disk format; options are "commodore", "speeddos", "dolphindos" (default: "commodore").
- **interleave**: Sets the default interleave value for file storage (default: 10).

Within the curly braces `{}`, individual files can be specified with parameters such as:

- **name**: Filename within the disk image.
- **type**: File type; options include "prg", "seq", "usr", "rel", "del". Appending `<` marks the file as locked.
- **segments**: Specifies the assembler segments to include in the file.

**Parameters**

- **filename**: Required. The name of the output disk image file. Supports `%o` substitution to insert the source filename without extension.
- **name**: Optional. The disk's name label. Default is "UNNAMED".
- **id**: Optional. The disk's identifier. Default is " 2A". Must be exactly two characters long.
- **format**: Optional. The disk format. Options are "commodore", "speeddos", "dolphindos". Default is "commodore".
- **interleave**: Optional. The default interleave value for file storage. Default is 10.

**Behavior**

- **Output File Handling**: If the specified output file already exists, it will be overwritten without prompt.
- **Interleave Application**: The interleave value determines the number of sectors between the start of one file and the start of the next, optimizing disk read performance. A higher interleave can reduce load times for sequential file access.
- **Error Handling**: If parameters are incorrectly specified (e.g., `id` not being exactly two characters), Kick Assembler will generate an error during assembly, halting the process and providing an error message indicating the issue.

**Example**


In this example:

- The disk image will be named after the source file with a `.d64` extension.
- The disk's name label will be "MY DISK".
- The disk ID will be "AB".
- The format is set to "commodore".
- The default interleave is 10.
- Two files are added: "PROGRAM1" from the "CODE" segment and "DATAFILE" from the "DATA" segment.

## Source Code

```assembly
.disk [filename="output.d64", name="DISK NAME", id="ID", format="commodore", interleave=10] {
    [name="FILE1", type="prg", segments="SEGMENT1"],
    [name="FILE2", type="prg", segments="SEGMENT2"],
    ...
}
```

```assembly
.disk [filename="%o.d64", name="MY DISK", id="AB", format="commodore", interleave=10] {
    [name="PROGRAM1", type="prg", segments="CODE"],
    [name="DATAFILE", type="seq", segments="DATA"]
}
```


## References

- [Kick Assembler Manual: The Disk Directive](https://www.theweb.dk/KickAssembler/webhelp/content/ch11s04.html)
- [Kick Assembler Manual: Disk Parameters](https://www.theweb.dk/KickAssembler/webhelp/content/ch11s05.html)
- [Kick Assembler Manual: File Parameters](https://www.theweb.dk/KickAssembler/webhelp/content/ch11s06.html)