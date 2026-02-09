# Conclusion — Chapter 4: Directory Editing and File Recovery

**Summary:** Warns against attempting file recovery or manual directory editing without full knowledge of directory layout and on-disk file storage (block allocation, directory entries). Emphasizes risk of further damage when tampering with directory structure.

## Conclusion
Do not attempt to recover a damaged or "blown" file, or to tamper with the directory structure, unless you thoroughly understand:
- the layout of the directory (how directory entries are organized on disk),
- how files are stored and linked across blocks/sectors (on-disk allocation and chaining),
- the side effects of changing directory entries or block allocation tables.

Improper edits can make recovery impossible or corrupt additional files. Proceed only with tools and procedures designed for the specific filesystem and disk format, and with backups where possible.

## References
- "locked_files" — expands on directory editing and risks