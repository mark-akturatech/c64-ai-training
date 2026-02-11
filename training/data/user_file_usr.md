# USR (User) File — file-type $83

**Summary:** USR files are Commodore directory entries with file-type byte $83. They are a legal but uncommon file type; DOS-created USR files will usually follow sequential or program layouts, while direct-access-created USR files may use arbitrary on-disk layouts—take care because DOS and the BAM expect normal track/sector link placements.

**Description and behavior**
- **File-type byte:** $83 in the directory designates a USR (user) file.
- **Rarity:** USR is a legal Commodore file type but is seldom used in practice (primarily for showmanship).
- **Typical structures:**
  - If created by Commodore DOS, a USR file may be structured like a sequential file or like a program file (i.e., follow standard DOS block-link conventions).
  - If created by direct-access techniques (see Chapter 5 in original source), a USR file may use arbitrary on-disk layouts that do not follow DOS conventions.
- **DOS/BAM expectations and risk:**
  - DOS (and disk utilities) expect track/sector link chains and associated metadata in the usual directory/block locations.
  - If a USR file omits or relocates the expected track/sector links (as can happen with arbitrary direct-access layouts), the BAM or validation routine may not find the expected links and will mark the file's blocks free during validation—potentially losing association between directory entry and data blocks.
- **Practical implication:** Use USR files only when you intentionally want a nonstandard on-disk layout and understand DOS/BAM validation behavior; otherwise prefer standard file types.

## References
- "Inside Commodore DOS" — file-type byte manipulation, locking/unlocking, mentions USR file type