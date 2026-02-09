# CBM Header block

**Summary:** CBM Header block for C64 tape format; points to file details at $033C-$0350 and links to loader routine "loader_core_leader_sync_and_header_read" which processes leader, sync and header bytes.

## Details
This chunk identifies the CBM Header block used by the tape loader. The header contains a pointer to the file-details structure stored at memory addresses $033C-$0350. The loader core begins immediately after this header and proceeds to read leader, sync, and header bytes (see referenced routine).

- Header title: "CBM Header block"
- File-details pointer: $033C-$0350 (see CBM File header)
- Related loader routine: loader_core_leader_sync_and_header_read (reads leader/sync/header bytes immediately after this block)

## Source Code
```text
<code>
********************
* CBM Header block *
********************

033C-0350  File details (see CBM File header)
</code>

---
Additional information can be found by searching:
- "loader_core_leader_sync_and_header_read" which expands on Loader's Core starts immediately after this header and reads leader/sync/header bytes
```

## Key Registers
- (none) — this chunk references memory addresses, not hardware registers

## References
- "loader_core_leader_sync_and_header_read" — expands on Loader's Core: starts immediately after this header and reads leader/sync/header bytes