# Kick Assembler — Disk Parameters: showInfo, storeFilesInDir, hide (Table 11.3)

**Summary:** This section details the disk and file parameters in Kick Assembler, focusing on `showInfo`, `storeFilesInDir`, and `hide`. These parameters control aspects of disk image creation and file visibility within the directory.

**Disk Parameters**

- **showInfo**
  - **Default:** false
  - **Example:** `showInfo`
  - **Description:** When set to true, prints detailed information about the generated disk after creation, including start track, sector, etc.

- **storeFilesInDir**
  - **Default:** false
  - **Example:** `storeFilesInDir`
  - **Description:** If set to true, files can be stored in the sectors of the directory track not used by the directory itself.

**File Parameters**

- **hide**
  - **Default:** false
  - **Example:** `hide`
  - **Description:** If set to true, the file will not be shown in the directory.

- **interleave**
  - **Default:** The disk's default interleave (typically 10)
  - **Example:** `interleave=10`
  - **Description:** Sets the interleave of the file.

- **name**
  - **Default:** ""
  - **Example:** `name="NOTE"`
  - **Description:** The filename.

- **noStartAddr**
  - **Default:** false
  - **Example:** `noStartAddr`
  - **Description:** If set to true, the two address bytes won't be added as the first two bytes of the file on the disk.

- **type**
  - **Default:** "prg"
  - **Example:** `type="prg<"`
  - **Description:** The type of the file. Available types are: "del", "seq", "prg", "usr", "rel". Appending a "<" to the end of the type marks it as locked.

**Usage Examples**

To create a disk image with specific parameters:


In this example:

- `showInfo` is set to true, so detailed information about the disk creation will be printed.
- `storeFilesInDir` is set to true, allowing files to be stored in unused sectors of the directory track.
- The file named "HIDDEN FILE" is marked with `hide`, so it will not appear in the directory listing.

**Notes on storeFilesInDir**

When `storeFilesInDir` is enabled, files can occupy sectors on the directory track that are not used by the directory itself. This can be useful for optimizing disk space usage. However, it's important to ensure compatibility with disk utilities and loaders, as some may not expect files to reside in these sectors.

## Source Code

```assembly
.disk [filename="MyDisk.d64", name="THE DISK", id="2021!", showInfo, storeFilesInDir]
{
    [name="VISIBLE FILE", type="prg", segments="VISIBLE_SEGMENT"],
    [name="HIDDEN FILE", type="prg", hide, segments="HIDDEN_SEGMENT"]
}
```


## References

- Kick Assembler Manual, Chapter 11: PRG Files and D64 Disks
- Kick Assembler Manual, Section 11.5: Disk Parameters
- Kick Assembler Manual, Section 11.6: File Parameters