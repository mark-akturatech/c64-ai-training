# .disk directive (Kick Assembler)

**Summary:** Describes the Kick Assembler `.disk` directive syntax and key parameters for creating disk image files (e.g., D64). Searchable terms: `.disk`, Kick Assembler, CC1541, writer, D64, format="commodore".

**Description**

Syntax:


- `OPT_WRITERNAME` is optional; if omitted, the assembler selects the default writer, which is based on CC1541. Plugin writers can be provided and looked up by name.
- The directive accepts disk-level parameters (disk image filename, image format, etc.) and a comma-separated list of per-file parameters inside braces.

**Disk Parameters:**

- `filename="MyDisk.d64"`  
  The name of the disk image file to create.

- `format="commodore"`  
  Sets the disk image format. Available options are:
  - `"commodore"`
  - `"speeddos"`
  - `"dolphindos"`

- `name="THE DISK"`  
  Sets the disk name displayed in the directory.

- `id="2021!"`  
  Sets the disk ID displayed in the directory.

- `dontSplitFilesOverDir`  
  If set to `true`, files that would otherwise have sectors on both sides of the directory track will be moved to after the directory track.

**File Parameters:**

- `name="NOTE"`  
  The filename.

- `type="prg"`  
  The type of the file. Available types are:
  - `"del"`
  - `"seq"`
  - `"prg"`
  - `"usr"`
  - `"rel"`
  
  Append a `<` to the end of the type to mark it as locked (e.g., `"prg<"`).

- `hide`  
  If set to `true`, the file will not be shown in the directory.

- `interleave=10`  
  Sets the interleave of the file.

- `noStartAddr`  
  If set to `true`, the two address bytes won't be added as the first two file bytes on the disk.

**OPT_WRITERNAME:**

- If omitted, the default disk writer is used.
- To use a custom disk writer, specify the writer's name, which corresponds to a third-party disk writer imported from a plugin. For example:


  This allows for specialized disk writing, such as creating disks for specific loaders. ([theweb.dk](https://www.theweb.dk/KickAssembler/webhelp/content/cpt_Plugins.html?utm_source=openai))

**Complete Example:**


In this example:

- A disk image named "MyDisk.d64" is created with the name "THE DISK" and ID "2021!".
- The disk format is set to "commodore".
- Two files are added:
  - "PROGRAM1" is a PRG file containing the "Code" segment.
  - "DATAFILE" is a SEQ file containing the contents of "data/music.prg". ([theweb.dk](https://www.theweb.dk/KickAssembler/webhelp/content/ch11s04.html?utm_source=openai))

## Source Code

```
.disk OPT_WRITERNAME [...DISK PARAMETERS...] {
    [...FILE1 PARAMETERS...],
    [...FILE2 PARAMETERS...],
    ...
}
```

  ```
  .plugin "myplugins.MyDiskWriter"
  .disk MyDiskWriter [...DISK PARAMETERS...] {
      [...FILE PARAMETERS...],
      ...
  }
  ```

```asm
.disk [filename="MyDisk.d64", name="THE DISK", id="2021!", format="commodore"] {
    [name="PROGRAM1", type="prg", segments="Code"],
    [name="DATAFILE", type="seq", prgFiles="data/music.prg"]
}
```


```asm
.disk [filename="MyDisk.d64", name="THE DISK", id="2021!", format="commodore"] {
    [name="PROGRAM1", type="prg", segments="Code"],
    [name="DATAFILE", type="seq", prgFiles="data/music.prg"]
}
```

## References

- Kick Assembler Manual: The Disk Directive ([theweb.dk](https://www.theweb.dk/KickAssembler/webhelp/content/ch11s04.html?utm_source=openai))
- Kick Assembler Manual: 3rd Party Java Plugins ([theweb.dk](https://www.theweb.dk/KickAssembler/webhelp/content/cpt_Plugins.html?utm_source=openai))