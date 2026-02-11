# Deleted File (DEL) — file-type byte $80

**Summary:** DEL is an undocumented Commodore directory file type with file-type byte $80, used rarely, often for protection tricks. DEL files cannot be created via standard commands; they are made by changing a file's directory file-type byte to $80. PRG-structured DELs load with LOAD, sequential-structured DELs open with OPEN; missing track/sector links are reclaimed in the BAM on disk validation.

**Deleted File Storage (DEL)**

A deleted file (DEL) is represented in the directory by a file-type byte of $80 (contrast: scratched files use $00). DEL is undocumented and very rare—historically used at least once as part of a low-level protection/obfuscation scheme (the entry was non-functional and intended to intimidate).

**Behavior and creation:**

- You cannot create a DEL file using BASIC OPEN. The only supported method is to change the file-type byte of an existing directory entry to $80. This can be accomplished using a disk editor to modify the directory entry directly:
  1. **Locate the directory entry:** Use a disk editor to navigate to the directory track and sector where the file's entry is located.
  2. **Modify the file-type byte:** Change the file-type byte (typically at offset 2 in the directory entry) to $80.
  3. **Save the changes:** Write the modified sector back to the disk.

**Loading/opening DEL files:**

- If the DEL entry has PRG structure, it can be loaded like a normal program:
  - `LOAD "FILE NAME, DEL, R",8`  (relocated)
  - `LOAD "FILE NAME, DEL, R",8,1`  (not relocated)
- If the DEL entry has sequential structure, it may be opened for read:
  - `OPEN 2,8,2,"FILE NAME, DEL, R"`

**Disk validation and BAM interaction:**

- DOS expects directory track/sector link chains in their normal directory positions. If a DEL file's blocks lack the expected links (i.e., the block-link pointers are not where DOS expects them), DOS/disk utilities that validate the disk (and rebuild the BAM) will mark those blocks as free in the BAM. In short: improper or missing track/sector link structures cause the file's blocks to be reclaimed during disk validation.

**Caveats:**

- The DEL entry itself is a directory-level alteration; the actual on-disk data layout may be arbitrary. Because DEL is undocumented, behavior across disk utilities and drives can vary.
- The source notes one commercial usage but does not provide vendor/product details in this chunk.

## Source Code

```basic
LOAD "FILE NAME, DEL, R",8      (RELOCATED)
LOAD "FILE NAME, DEL, R",8,1    (NOT RELOCATED)

OPEN 2,8,2,"FILE NAME, DEL, R"
```

## References

- "user_file_usr" — expands on other uncommon file types and their directory byte codes