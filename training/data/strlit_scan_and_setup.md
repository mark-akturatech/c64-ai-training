# STRLIT ($B487) — Scan and Set Up Pointers to a String in Memory

**Summary:** STRLIT at $B487 scans a string literal to determine its length, calls the memory allocation routine (getspa / "allocate string space"), and then either saves the string into string storage or creates a pointer to the string in the BASIC input text buffer at $0200 (decimal 512).

**Description**
STRLIT is a KERNAL/BASIC ROM routine that:
- Scans a string literal to compute its length.
- Calls the allocator routine that reserves space for the string (see getspa_allocate_string_space).
- After allocation, either copies/saves the string into string storage or, if appropriate, creates a pointer to the string held in the BASIC input text buffer at $0200 (512).
- Allocation invoked by STRLIT may trigger the BASIC garbage-collection/string-compaction routine if free space is insufficient (see garbag_string_garbage_collection_overview).

This chunk documents the high-level behavior and purpose of STRLIT; the detailed assembly listing, calling conventions, parameter/return values, and internal pointer/flag usage are not present here.

## Source Code

## Labels
- STRLIT
