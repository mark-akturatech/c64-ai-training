# FINDLN ($A613) — search for BASIC line number

**Summary:** FINDLN (at $A613) searches the tokenized BASIC program text for the two-byte integer line number stored in $0014-$0015; if found it sets the zero-page pointer $005F-$0060 to the address of that line's link field and sets the processor Carry flag, otherwise it clears Carry.

## Description
This routine scans the tokenized BASIC program in RAM to locate a line whose line-number equals the two-byte value found in zero page $14-$15 ($0014-$0015). When a match is found, FINDLN stores the address of the matching line's link field into zero page bytes $5F-$60 ($005F-$0060) and returns with the Carry flag set. If no matching line number exists in the program, the routine returns with the Carry flag cleared.

Notes:
- The "link field" refers to the two‑byte forward pointer used in C64 tokenized BASIC lines (pointer to the next line).
- Inputs: zero page $0014-$0015 = target line number (two-byte little-endian).
- Outputs: zero page $005F-$0060 = pointer to the matched line's link field (if found); CPU Carry = 1 if found, 0 if not found.
- Typical use: MAIN1 uses FINDLN to detect and locate an existing line for deletion or replacement; other routines (e.g., after insertion/deletion) may relink tokenized lines.

## Key Registers
- $0014-$0015 - Zero Page - two-byte target line number (little-endian)
- $005F-$0060 - Zero Page - pointer to the link field address of the matched BASIC line

## References
- "main1_add_replace_line" — expands on MAIN1 using FINDLN to detect and locate an existing line to delete/replace
- "linkprg_relink_tokenized_lines" — expands on relinking pointers after deletion/insertion of tokenized lines

## Labels
- FINDLN
