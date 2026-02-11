# Directory file-type byte (first byte of a directory entry)

**Summary:** Documents Commodore directory entry file-type byte values (hex/decimal) and corresponding file types/status (scratched, deleted, sequential/SEQ, program/PRG, user/USR, relative/REL), including deleted/replacement ($A0–$A4) and locked variants ($C0–$C4). Examples mention $82 as PRG.

**File-type byte overview**

The first byte of a directory file entry encodes file status and type. This chunk lists the documented codes and short labels for common file types (SEQ, PRG, USR, REL), special states (scratched, deleted, locked), and mentions unclosed variants ($01–$04). The chunk as provided is a partial table: it shows base codes around $00, $80–$84, $A0–$A4, and $C0–$C4, with decimal equivalents and brief notes. Example usage found in other material: $82 denotes a program (PRG).

Notes:

- "Unclosed" entries ($01–$04) are mentioned but not fully expanded here.
- The chunk contains annotation tokens (e.g., "@ replacement" and "<") used in the source table; their precise meanings (replacement marker, display glyphs, or notation for directory display) are not fully explained in the source material.

## Source Code

```text
$00   0   Scratched (deleted)   DEL
$01   1   Unclosed sequential   SEQ *
$02   2   Unclosed program      PRG *
$03   3   Unclosed user         USR *
$04   4   Unclosed relative     REL *
$80  128  Closed deleted        DEL
$81  129  Closed sequential     SEQ
$82  130  Closed program        PRG
$83  131  Closed user           USR
$84  132  Closed relative       REL
$A0  160  Deleted @ replacement DEL
$A1  161  Sequential @ replacement SEQ
$A2  162  Program @ replacement PRG
$A3  163  User @ replacement    USR
$A4  164  Relative @ replacement REL
$C0  192  Locked deleted        DEL <
$C1  193  Locked sequential     SEQ <
$C2  194  Locked program        PRG <
$C3  195  Locked user           USR <
$C4  196  Locked relative       REL <
```

## References

- "file_types_table_part2" — continuation and expansion of the file type table
- "single_directory_file_entry_example" — example showing $82 as a program file (PRG)
