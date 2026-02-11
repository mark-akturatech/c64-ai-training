# VALIDATE (DOS) — BAM rebuilding and risks with unclosed files

**Summary:** Describes the C64 DOS VALIDATE operation: it rebuilds the Block Availability Map (BAM) on track 18, sector 0 by freeing all blocks then retracing each directory file to reallocate blocks; explains how VALIDATE handles unclosed files (directory file-type byte set to 0) and why using SCRATCH on an unclosed file can poison a disk.

## How VALIDATE works
VALIDATE rebuilds the disk's Block Availability Map (BAM — track 18, sector 0). The routine:
- Frees all blocks in the BAM (as if the disk were newly formatted).
- Walks the directory file by file. For each directory entry it chains through the file's sector list and marks those sectors in the BAM as "in use".
- When every file has been successfully traced, the new BAM is written back to disk so the internal free/used counts match the directory.

The new BAM is not written to disk until the entire validate process completes successfully.

## Behavior with unclosed files
If VALIDATE encounters an unclosed file (a file whose last sector was never written), it does not attempt to trace the file's sector chain. Instead, it simply sets the file-type byte in the directory entry to 0 (marking it scratched). After VALIDATE completes, the unclosed file will no longer appear in directory listings and any sectors that had belonged to it become free in the rebuilt BAM.

## Why SCRATCHing an unclosed file is dangerous
When you use the SCRATCH command on a file, DOS:
- Sets the directory file-type byte to 0 (scratched), and
- Traces the file's sector chain, marking each encountered sector free in the BAM.

For a normal, closed file this is correct. For an unclosed file the last sector was never written; the previous sector's pointer may therefore point to a random or unrelated track/sector. Two outcomes are possible:
- If the pointer refers to a non-existent track/sector (example given: track 75, sector 1), DOS will stop tracing.
- If the pointer happens to point into a sector that belongs to another (active) file, DOS will continue tracing and will deallocate those subsequent sectors — effectively stealing space from an otherwise good file.

If those deallocated sectors are later reused, new data will overwrite parts of the active file, producing a "poisoned" disk. The only practical recovery in that case is to inspect each file on the disk to detect corruption and copy intact files to another disk.

## Abort behavior and recovery
- VALIDATE aborts immediately if it encounters an unreadable sector. In that case the new BAM is not written; DOS will reload the original BAM (so the blank BAM does not take effect) and will not permit writes under the incomplete state.
- Despite reloading the old BAM, the disk may remain corrupted; recovery procedures are required (see Chapter 8). The recommended immediate action for potentially poisoned disks is to inspect each file before relying on it and copy safe files to another disk.

## References
- "scratch_command_wildcards_unclosed_files_and_consequences" — contrasts VALIDATE vs SCRATCH on unclosed files  
- "getting_out_of_trouble_recovery_methods" — recovery procedures for aborted VALIDATE and corrupted disks