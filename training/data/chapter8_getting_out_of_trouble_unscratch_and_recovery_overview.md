# Chapter 8 — Practical recovery procedures (unscratching files, sector recovery)

**Summary:** Describes how scratching a file on a 1541 sets the directory file-type byte to $00 and frees sectors in the BAM, and gives step-by-step unscratching using VIRTUAL DIRECTORY and EDIT TRACK & SECTOR (track 18 directory sectors), plus validation (OPEN 15,8,15,"V0":CLOSE15). Covers file-type byte hex values (DEL/SEQ/PRG/USR/REL), brief overview of soft vs hard read/write errors, pointers to sector-recovery utilities (RECOVER TRACK & SECTOR, LAZARUS), and advice to use 1541 BACKUP for non-initializable disks.

**What scratching changes**
- Scratching a file on a CBM DOS/1541 disk does two things that make the file invisible and its blocks reusable:
  - The file-type byte in the directory entry is set to $00 (DEL).
  - The file’s occupied sectors are marked free in the BAM (Block Availability Map).
- To recover an “unscratched” file, you must restore the directory entry’s file-type byte to the correct value and, if necessary, restore the BAM entries that were cleared.

**Unscratching a file — step-by-step (VIRTUAL DIRECTORY + EDIT TRACK & SECTOR)**
1. Use the VIRTUAL DIRECTORY tool to locate the directory entry (disk/dir view). VIRTUAL DIRECTORY shows directory group and the offset/slot for the filename (see appendix/tool doc "virtual_directory_and_edit_track_sector_tools").
2. Identify which directory sector (on track 18) contains the target directory entry:
   - The C64/1541 directory resides on track 18; directory sectors contain multiple 32-byte entries.
   - Use the group-to-sector mapping (tool or table) to find the exact sector and entry index inside that sector.
3. Use EDIT TRACK & SECTOR to load the directory sector (track 18, the sector determined above) into an editor.
   - Locate the 32‑byte directory entry for the file (filename, size, and file-type byte).
   - The file-type byte will be $00 for a scratched file.
4. Edit the file-type byte back to the correct file-type hex value (see file-type table in Source Code).
5. Write the edited sector back to disk (save/REWRITE sector in the editing tool).
6. Validate the directory and disk with the drive’s validate command to have DOS rebuild its in-memory directory state:
   - OPEN 15,8,15,"V0":CLOSE15
   - This forces the 1541 to re-read/rebuild the directory and BAM view so the restored file becomes visible and accessible.
7. If the sectors were freed and overwritten, you will need to restore the BAM entries to mark those sectors allocated again; some tools (VIRTUAL DIRECTORY variants or sector editors) can toggle BAM bits — otherwise use a dedicated recovery utility that also rewrites BAM entries.

**Soft vs hard read/write errors (overview)**
- **Soft errors:** Transient read/write failures (noise, dust, marginal media, weak head contact). Often recoverable by retries, head cleaning, slowing the drive, using tools that repeatedly read and reassemble data (RECOVER TRACK & SECTOR, LAZARUS).
- **Hard errors:** Physical damage to media (severe scratches, magnetic degradation) or permanently failed sectors. May require sector-copy utilities that skip bad sectors, specialized hardware, or manual reconstruction from partial sectors.
- Use dedicated recovery utilities before attempting low-level manual edits: they attempt multiple strategies (retries, variable timing, bit-level analysis) and can reconstitute sectors without risking further damage.

**Hard-error recovery & relative-file recovery (summary)**
- **For hard errors:**
  - Attempt multiple reads with different offsets/timings (utilities like LAZARUS do this).
  - If sectors are unreachable, try to copy the disk and then work on the copy (never continue destructive operations on the only original).
  - Manually reconstruct directory entries if data blocks are recovered but directory entries are corrupted.
- **Relative-file (REL) specifics:**
  - REL files use a record/relative structure and a side-indexing scheme; recovery must preserve the record map.
  - If REL index blocks are damaged, reconstructing the file requires recovery of index blocks first, then reconstructing data records into the proper logical order.
- See appendix utilities for tool-specific workflows ("recover_soft_vs_hard_errors_overview").

**Rescuing a non-initializable disk**
- If a disk will not initialize (drive refuses to format or catalog), perform a sector-level backup of the entire disk with 1541 BACKUP (or equivalent imaging utility) to capture as many readable sectors as possible.
- Work from the image/copy to avoid further damage to the original. Attempt sector recovery and directory fixes on the copy.

## Source Code
```text
-- Group-to-sector mapping for directory groups on track 18
-- Each directory sector contains 8 entries (32 bytes each)
-- Track 18 sectors 1–18 are used for directory entries

Group 0: Track 18, Sector 1
Group 1: Track 18, Sector 2
Group 2: Track 18, Sector 3
Group 3: Track 18, Sector 4
Group 4: Track 18, Sector 5
Group 5: Track 18, Sector 6
Group 6: Track 18, Sector 7
Group 7: Track 18, Sector 8
Group 8: Track 18, Sector 9
Group 9: Track 18, Sector 10
Group 10: Track 18, Sector 11
Group 11: Track 18, Sector 12
Group 12: Track 18, Sector 13
Group 13: Track 18, Sector 14
Group 14: Track 18, Sector 15
Group 15: Track 18, Sector 16
Group 16: Track 18, Sector 17
Group 17: Track 18, Sector 18
```

```basic
REM Validate disk (forces drive to rebuild directory/BAM)
OPEN 15,8,15,"V0":CLOSE 15
```

```text
-- Common directory file-type base codes (directory byte values)
$00 = DEL    (deleted / scratched)
$01 = SEQ    (sequential)
$02 = PRG    (program)
$03 = USR    (user)
$04 = REL    (relative)

-- Closed/normal directory entries on most disks = base + $80
$81 = SEQ (closed)
$82 = PRG (closed)
$83 = USR (closed)
$84 = REL (closed)
```

## Key Registers
(omitted — this chunk does not document CPU/memory-mapped hardware registers)

## References
- "virtual_directory_and_edit_track_sector_tools" — expands on the VIRTUAL DIRECTORY and EDIT TRACK & SECTOR tools
- "recover_soft_vs_hard_errors_overview" — expands on classification of read/write errors and recovery suggestions