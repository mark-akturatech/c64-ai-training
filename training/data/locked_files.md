# Locked Files (undocumented) — DOS file-type lock bit

**Summary:** Commodore DOS uses bit 6 of the directory file-type byte to mark a file as locked (mask $40); locking is undocumented and must be done by editing the directory entry’s file-type byte. Locked files cannot be scratched (deleted) until unlocked, but they can still be renamed or copied.

## Description
- Locking is not supported by DOS commands; you must edit the file-type byte in the directory entry (direct track/sector editing). The supplied disk utility "EDIT TRACK & SECTOR" (referenced in Appendix C of the original source) can be used to change this byte.
- DOS determines locked state by testing bit 6 of the file-type byte. If bit 6 is set (1) the file is considered locked and cannot be scratched.
- Locking only affects scratching (deletion). Normal disk operations such as rename or copy still work on locked files.
- The locked file-type byte is the normal file-type value with bit 6 set (add $40). Unlocking clears bit 6 (subtract $40 or mask it out).

## Source Code
```text
File Type   Normal   Locked
Deleted     DEL      $80      -> DEL <   $C0
Sequential  SEQ      $81      -> SEQ <   $C1
Program     PRG      $82      -> PRG <   $C2
User        USR      $83      -> USR <   $C3
Relative    REL      $84      -> REL <   $C4

Notes:
- Lock bit = bit 6 (mask $40). Locked_value = Normal_value | $40.
  Example: $82 (PRG) locked -> $82 | $40 = $C2.
- To unlock: clear bit 6 (value & ~$40). Example: $C2 & ~$40 = $82.
- The "<" in the locked names (e.g. "PRG <") is the notation used in the source to indicate the locked variant.
```

## References
- "deleted_file_del" — expands on DEL file type specifics
- "chapter5_intro" — tools for editing track/sector or directory entries (direct-access programming)