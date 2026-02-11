# ********* - Section 3.5: SAVE command format (SAVE name$, device#, command#), how DOS chooses directory entries and blocks when saving, checks performed (directory existence, BAM availability), and error light behavior when save fails.

**Summary:** The `SAVE` command uses the format `SAVE name$, device#, command#`. DOS checks the disk directory and the BAM (Block Availability Map) before writing. If the save fails, the disk drive's error light flashes. See `LOAD` (section 3.3) for details on `device#` and `command#`.

**Operation**

**FORMAT:**

- **name$**: Filename to save.
- **device#**: Disk device number (see `LOAD`, section 3.3).
- **command#**: Optional secondary address (see `LOAD`, section 3.3).

When a `SAVE` is executed, DOS performs these steps in order:

1. **Check for Existing Filename**: DOS searches the directory to see if a file with the same name already exists. If it does, the save operation will not proceed, and no error is indicated on screen. To overwrite an existing file, prefix the filename with `@0:` (e.g., `SAVE "@0:FILENAME",8`). However, this "save-with-replace" feature has a known bug in the 1541 drive that can lead to data loss. To mitigate this, always specify the drive number in all disk commands (e.g., `LOAD "0:FILENAME",8`). ([atarimagazines.com](https://www.atarimagazines.com/compute/issue65/save_with_replace.php?utm_source=openai))

2. **Verify Free Directory Entry**: DOS checks for an available directory entry to store the new file's metadata. If no free entry is found, the save operation fails.

3. **Check BAM for Free Blocks**: DOS examines the BAM to ensure there are enough free blocks to store the program. If insufficient free blocks are available, the save operation fails.

4. **Allocate Blocks and Write Data**: If all checks pass, DOS allocates the necessary blocks in the BAM and writes the program data to disk.

5. **Handle Save Failure**: If any check fails, the drive's error light flashes to indicate the save failed. Specific error codes can be retrieved by reading the disk drive's error channel.

**Notes:**

- **Directory Structure and Entry Selection**: The directory is stored in track 18 of the disk. Each directory sector contains up to eight entries. DOS scans these sectors sequentially to find a free entry for the new file. ([s3.amazonaws.com](https://s3.amazonaws.com/com.c64os.resources/weblog/sd2iecdocumentation/manuals/1541-II_Users_Guide.pdf?utm_source=openai))

- **BAM Allocation Algorithm**: The BAM is located in track 18, sector 0. It tracks the availability of blocks across the disk. When saving a file, DOS attempts to allocate contiguous blocks to minimize fragmentation. If contiguous blocks are not available, DOS allocates non-contiguous blocks, updating the BAM accordingly. ([s3.amazonaws.com](https://s3.amazonaws.com/com.c64os.resources/weblog/sd2iecdocumentation/manuals/1541-II_Users_Guide.pdf?utm_source=openai))

- **Error Codes and LED Flash Patterns**: The disk drive's error channel provides specific error codes corresponding to various failure causes. For example, error code 63 indicates "FILE EXISTS," and error code 72 indicates "DISK FULL." The error light flashes in patterns corresponding to these error codes. ([s3.amazonaws.com](https://s3.amazonaws.com/com.c64os.resources/weblog/sd2iecdocumentation/manuals/1541-II_Users_Guide.pdf?utm_source=openai))

## References

- "LOAD (section 3.3)" — explanation of `device#` and `command#` parameters
- "save_with_replace_@0_syntax" — expands on replacing an existing file using the `@0:` prefix
- Commodore 1541 User's Guide — details on directory structure, BAM, and error codes
