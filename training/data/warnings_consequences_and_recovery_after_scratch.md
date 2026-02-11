# Never scratch an unclosed file (BAM inconsistency, use VALIDATE)

**Summary:** Aborted writes leave the disk's BAM inconsistent with on-disk file data, so do not SCRATCH an unclosed file; use the DOS VALIDATE command and avoid further writes to the disk to preserve recoverability. Searchable terms: BAM, VALIDATE, SCRATCH, directory file-type byte, sectors, poisoned disk, aborted write, CBM DOS.

## Explanation
An unclosed (aborted) write leaves the disk's internal allocation map (BAM) out of sync with the actual sectors used by files. The BAM no longer reflects the real file allocation on the media, so subsequent write operations that allocate sectors based on the corrupted BAM may overwrite sectors still in use by existing files. This can produce overlapping files and a "poisoned" disk where multiple directory entries reference the same physical blocks.

The SCRATCH command does not physically erase file contents. Instead it:
- Traverses the file's chain and marks its sectors free in the BAM.
- Sets the directory file-type byte to zero (marking the directory entry inactive).
Because the raw data remains on disk, a scratched file can often be recovered — but only if no further writes occur.

## Consequences
- If you SCRATCH an unclosed file (or otherwise cause BAM<>data mismatch), immediately stop using the disk. Any write will likely allocate the sectors just freed and make recovery impossible.
- Files may overlap after an aborted write; subsequent writes will corrupt one or more active files.
- The disk can become "poisoned" (widespread allocation corruption) and require DOS repair utilities.

## Recovery
- Do not perform any further writes to the disk after an accidental SCRATCH or aborted write.
- Run the DOS VALIDATE command (CBM DOS) to attempt to repair BAM/directory inconsistencies.
- Detailed recovery procedures are referenced in Chapter 8 ("Getting Out of Trouble") of the original source.

## References
- "unclosed_file_definition_and_common_causes" — expands on causes of unclosed files referenced here  
- "scratch_command_overview_and_basic_syntax" — contains SCRATCH syntax and examples